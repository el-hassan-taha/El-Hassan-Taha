'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSupabase } from '@/lib/supabase'
import { Student } from '@/types/database'
import type { Database } from '@/types/database'
import { Plus, Search, Eye } from 'lucide-react'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type StudentInsert = Database['public']['Tables']['students']['Insert']

export default function StudentsPage() {
  const supabase = getSupabase()
  const queryClient = useQueryClient()
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterYear, setFilterYear] = useState<string>('')
  const [filterGrade, setFilterGrade] = useState<string>('')
  const [filterClass, setFilterClass] = useState<string>('')
  
  const [formData, setFormData] = useState<StudentInsert>({
    full_name: '',
    national_id: '',
    academic_year: '',
    grade: '',
    class_section: '',
    guardian_phone: '',
  })
  
  const { data: students, isLoading } = useQuery({
    queryKey: ['students', filterYear, filterGrade, filterClass],
    queryFn: async () => {
      let query = supabase.from('students').select('*').order('full_name')
      
      if (filterYear) query = query.eq('academic_year', filterYear)
      if (filterGrade) query = query.eq('grade', filterGrade)
      if (filterClass) query = query.eq('class_section', filterClass)
      
      const { data, error } = await query
      if (error) throw error
      return data as Student[]
    },
  })
  
  const addStudentMutation = useMutation({
    mutationFn: async (newStudent: StudentInsert) => {
      const { data, error } = await supabase
        .from('students')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert([newStudent] as any)
        .select()
      
      if (error) throw error
      return data









    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setShowAddForm(false)
      setFormData({
        full_name: '',
        national_id: '',
        academic_year: '',
        grade: '',
        class_section: '',
        guardian_phone: '',
      })
    },
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addStudentMutation.mutate(formData)
  }
  
  const filteredStudents = students?.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.national_id.includes(searchTerm)
  )
  
  const academicYears = ['2023-2024', '2024-2025', '2025-2026']
  const grades = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس']
  const classes = ['أ', 'ب', 'ج', 'د']
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة الطلاب</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة طالب جديد
        </Button>
      </div>
      
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة طالب جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">الاسم الكامل</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="national_id">الرقم القومي</Label>
                <Input
                  id="national_id"
                  value={formData.national_id}
                  onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                  required
                  dir="ltr"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="academic_year">السنة الدراسية</Label>
                <Select
                  value={formData.academic_year}
                  onValueChange={(value) => setFormData({ ...formData, academic_year: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر السنة الدراسية" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grade">الصف</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => setFormData({ ...formData, grade: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الصف" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="class_section">الفصل</Label>
                <Select
                  value={formData.class_section}
                  onValueChange={(value) => setFormData({ ...formData, class_section: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفصل" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guardian_phone">رقم هاتف ولي الأمر</Label>
                <Input
                  id="guardian_phone"
                  value={formData.guardian_phone}
                  onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
                  required
                  dir="ltr"
                />
              </div>
              
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" disabled={addStudentMutation.isPending}>
                  {addStudentMutation.isPending ? 'جاري الإضافة...' : 'إضافة الطالب'}
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
          <CardTitle>البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">بحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="اسم أو رقم قومي..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>السنة الدراسية</Label>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>الصف</Label>
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>الفصل</Label>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلاب ({filteredStudents?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">جاري التحميل...</p>
          ) : filteredStudents && filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">الاسم</th>
                    <th className="text-right p-3">الرقم القومي</th>
                    <th className="text-right p-3">السنة الدراسية</th>
                    <th className="text-right p-3">الصف</th>
                    <th className="text-right p-3">الفصل</th>
                    <th className="text-right p-3">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{student.full_name}</td>
                      <td className="p-3" dir="ltr">{student.national_id}</td>
                      <td className="p-3">{student.academic_year}</td>
                      <td className="p-3">{student.grade}</td>
                      <td className="p-3">{student.class_section}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Link href={`/teacher/students/${student.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 ml-1" />
                              عرض
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">لا توجد بيانات</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
