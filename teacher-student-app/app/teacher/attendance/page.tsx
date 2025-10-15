'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">إدارة الحضور</h1>
      <Card>
        <CardHeader>
          <CardTitle>قريباً</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            صفحة إدارة الحضور قيد التطوير. سيتم إضافة ميزات تسجيل الحضور الأسبوعي قريباً.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
