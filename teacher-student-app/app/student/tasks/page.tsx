'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StudentTasksPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">مهامي</h1>
      <Card>
        <CardHeader>
          <CardTitle>قريباً</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            صفحة المهام قيد التطوير. سيتم إضافة عرض المهام المكلفة قريباً.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
