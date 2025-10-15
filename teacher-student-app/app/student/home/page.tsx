'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabase } from '@/lib/supabase'
import { Student, StudentTask, StudentExam } from '@/types/database'
import { User, Calendar, CheckCircle, Award } from 'lucide-react'

export default function StudentHomePage() {
  const [student, setStudent] = useState<Student | null>(null)
  const supabase = getSupabase()
  
  useEffect(() => {
    const studentData = sessionStorage.getItem('student')
    if (studentData) {
      setStudent(JSON.parse(studentData))
    }
  }, [])
  
  const { data: stats } = useQuery({
    queryKey: ['student-stats', student?.id],
    queryFn: async () => {
      if (!student?.id) return null
      
      const [attendanceRes, tasksRes, examsRes] = await Promise.all([
        supabase.from('attendance').select('*').eq('student_id', student.id),
        supabase.from('student_tasks').select('*').eq('student_id', student.id),
        supabase.from('student_exams').select('*').eq('student_id', student.id),
      ])
      
      const totalAttendance = attendanceRes.data?.length || 0
      const studentTasks = (tasksRes.data || []) as StudentTask[]
      const completedTasks = studentTasks.filter(t => t.status === 'completed').length
      const totalTasks = studentTasks.length
      
      const studentExams = (examsRes.data || []) as StudentExam[]
      const avgScore = studentExams.length > 0
        ? studentExams.reduce((acc, exam) => acc + exam.score, 0) / studentExams.length
        : 0
      
      return {
        attendanceCount: totalAttendance,
        completedTasks,
        totalTasks,
        taskCompletionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        avgExamScore: avgScore,
      }
    },
    enabled: !!student?.id,
  })
  
  if (!student) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>جاري التحميل...</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">مرحباً، {student.full_name}</h1>
        <p className="text-gray-600">إليك ملخص أدائك الأكاديمي</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            المعلومات الشخصية
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">الاسم الكامل</p>
            <p className="font-semibold">{student.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">الرقم القومي</p>
            <p className="font-semibold" dir="ltr">{student.national_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">السنة الدراسية</p>
            <p className="font-semibold">{student.academic_year}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">الصف والفصل</p>
            <p className="font-semibold">{student.grade} - {student.class_section}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">رقم هاتف ولي الأمر</p>
            <p className="font-semibold" dir="ltr">{student.guardian_phone}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              إجمالي الحضور
            </CardTitle>
            <Calendar className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.attendanceCount || 0}</div>
            <p className="text-xs text-gray-500 mt-1">يوم دراسي</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              معدل إتمام المهام
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.taskCompletionRate.toFixed(0) || 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.completedTasks || 0} من {stats?.totalTasks || 0}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              متوسط الامتحانات
            </CardTitle>
            <Award className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.avgExamScore.toFixed(1) || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">من 100</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
