'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">سجل الحضور</h1>
      <Card>
        <CardHeader>
          <CardTitle>قريباً</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            صفحة الحضور قيد التطوير. سيتم إضافة عرض سجل الحضور قريباً.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
