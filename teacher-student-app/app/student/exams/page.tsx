'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StudentExamsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">الامتحانات والدرجات</h1>
      <Card>
        <CardHeader>
          <CardTitle>قريباً</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            صفحة الامتحانات قيد التطوير. سيتم إضافة عرض نتائج الامتحانات قريباً.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
