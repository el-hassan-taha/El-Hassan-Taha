'use client'

import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  
  const handleLogout = () => {
    sessionStorage.removeItem('student')
    router.push('/')
  }
  
  return (
    <div className="flex h-screen">
      <aside className="w-64 flex-shrink-0">
        <Sidebar role="student" onLogout={handleLogout} />
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
