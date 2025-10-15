'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { User, Calendar, FileText, Award } from 'lucide-react'

export default function StudentDetailPage() {
  const params = useParams()
  const studentId = params.id as string
  const supabase = getSupabase()
  
  const { data: student, isLoading }: { data: any, isLoading: boolean } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single()
      
      if (error) throw error
      return data
    },
  })
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>جاري التحميل...</p>
      </div>
    )
  }
  
  if (!student) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>لم يتم العثور على الطالب</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{student.full_name}</h1>
        <p className="text-gray-600">تفاصيل الطالب</p>
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
          <div>
            <p className="text-sm text-gray-600">تاريخ التسجيل</p>
            <p className="font-semibold">{new Date(student.created_at).toLocaleDateString('ar-EG')}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              الحضور
            </CardTitle>
            <Calendar className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-gray-500 mt-1">يوم دراسي</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              المهام
            </CardTitle>
            <FileText className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-gray-500 mt-1">مهمة مكتملة</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              متوسط الدرجات
            </CardTitle>
            <Award className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-gray-500 mt-1">من 100</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>الميزات قيد التطوير</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>عرض سجل الحضور التفصيلي</li>
            <li>إدارة حالة المهام</li>
            <li>إدخال وعرض درجات الامتحانات</li>
            <li>طباعة تقرير PDF للطالب</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
