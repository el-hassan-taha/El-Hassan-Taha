'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">الإعدادات</h1>
      <Card>
        <CardHeader>
          <CardTitle>قريباً</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            صفحة الإعدادات قيد التطوير. سيتم إضافة ميزات الحذف الجماعي للطلاب قريباً.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
