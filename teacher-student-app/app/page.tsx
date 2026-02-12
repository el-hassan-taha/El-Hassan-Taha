'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { signInTeacher, signInStudent } from '@/lib/auth'

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [teacherForm, setTeacherForm] = useState({
    email: '',
    password: '',
  })

  const [studentForm, setStudentForm] = useState({
    nationalId: '',
  })

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInTeacher(teacherForm.email, teacherForm.password)
      router.push('/teacher/dashboard')
    } catch (err) {
      setError((err as Error).message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const student = await signInStudent(studentForm.nationalId)
      // Store student info in sessionStorage
      sessionStorage.setItem('student', JSON.stringify(student))
      router.push('/student/home')
    } catch (err) {
      setError((err as Error).message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">نظام إدارة الطلاب</CardTitle>
          <CardDescription>سجل الدخول للمتابعة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'teacher' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setActiveTab('teacher')}
            >
              معلم
            </Button>
            <Button
              variant={activeTab === 'student' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setActiveTab('student')}
            >
              طالب
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          {activeTab === 'teacher' ? (
            <form onSubmit={handleTeacherLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, email: e.target.value })
                  }
                  required
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={teacherForm.password}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, password: e.target.value })
                  }
                  required
                  dir="ltr"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nationalId">الرقم القومي</Label>
                <Input
                  id="nationalId"
                  type="text"
                  value={studentForm.nationalId}
                  onChange={(e) =>
                    setStudentForm({ nationalId: e.target.value })
                  }
                  required
                  dir="ltr"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
