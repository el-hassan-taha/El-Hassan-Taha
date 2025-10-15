'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSupabase } from '@/lib/supabase'
import { Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function TasksPage() {
  const supabase = getSupabase()
  const queryClient = useQueryClient()
  const [showAddForm, setShowAddForm] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    academic_year: '',
    grade: '',
    class_section: '',
  })
  
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: false })
      if (error) throw error
      return data
    },
  })
  
  const addTaskMutation = useMutation({
    mutationFn: async (newTask: typeof formData) => {
      const { data: taskData, error: taskError }: { data: any, error: any } = await supabase
        .from('tasks')
        .insert([newTask] as any)
        .select()
      
      if (taskError) throw taskError
      
      // Auto-assign to students
      const { data: students }: { data: any } = await supabase
        .from('students')
        .select('id')
        .eq('academic_year', newTask.academic_year)
        .eq('grade', newTask.grade)
        .eq('class_section', newTask.class_section)
      
      if (students && students.length > 0 && taskData) {
        const studentTasks = students.map((student: any) => ({
          student_id: student.id,
          task_id: taskData[0].id,
          status: 'pending' as const,
        }))
        
        await supabase.from('student_tasks').insert(studentTasks as any)
      }
      
      return taskData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setShowAddForm(false)
      setFormData({
        title: '',
        description: '',
        due_date: '',
        academic_year: '',
        grade: '',
        class_section: '',
      })
    },
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTaskMutation.mutate(formData)
  }
  
  const academicYears = ['2023-2024', '2024-2025', '2025-2026']
  const grades = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس']
  const classes = ['أ', 'ب', 'ج', 'د']
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المهام</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة مهمة جديدة
        </Button>
      </div>
      
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة مهمة جديدة</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">عنوان المهمة</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="due_date">تاريخ التسليم</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>السنة الدراسية</Label>
                  <Select
                    value={formData.academic_year}
                    onValueChange={(value) => setFormData({ ...formData, academic_year: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر السنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>الصف</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => setFormData({ ...formData, grade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصف" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>الفصل</Label>
                  <Select
                    value={formData.class_section}
                    onValueChange={(value) => setFormData({ ...formData, class_section: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفصل" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={addTaskMutation.isPending}>
                  {addTaskMutation.isPending ? 'جاري الإضافة...' : 'إضافة المهمة'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>قائمة المهام ({tasks?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">جاري التحميل...</p>
          ) : tasks && tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task: any) => (
                <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <p className="text-gray-600 mt-1">{task.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>الصف: {task.grade} - {task.class_section}</span>
                        <span>السنة: {task.academic_year}</span>
                        <span>التسليم: {task.due_date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">لا توجد مهام</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
