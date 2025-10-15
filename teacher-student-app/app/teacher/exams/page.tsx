'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">إدارة الامتحانات</h1>
      <Card>
        <CardHeader>
          <CardTitle>قريباً</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            صفحة إدارة الامتحانات قيد التطوير. سيتم إضافة ميزات إنشاء الامتحانات وإدخال الدرجات قريباً.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
