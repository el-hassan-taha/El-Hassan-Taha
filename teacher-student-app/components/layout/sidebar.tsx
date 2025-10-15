'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Users, 
  ClipboardCheck, 
  FileText, 
  GraduationCap,
  Settings,
  LogOut,
  LayoutDashboard
} from 'lucide-react'

interface SidebarProps {
  role: 'teacher' | 'student'
  onLogout?: () => void
}

export function Sidebar({ role, onLogout }: SidebarProps) {
  const pathname = usePathname()
  
  const teacherLinks = [
    { href: '/teacher/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { href: '/teacher/students', label: 'الطلاب', icon: Users },
    { href: '/teacher/attendance', label: 'الحضور', icon: ClipboardCheck },
    { href: '/teacher/tasks', label: 'المهام', icon: FileText },
    { href: '/teacher/exams', label: 'الامتحانات', icon: GraduationCap },
    { href: '/teacher/settings', label: 'الإعدادات', icon: Settings },
  ]
  
  const studentLinks = [
    { href: '/student/home', label: 'الصفحة الرئيسية', icon: Home },
    { href: '/student/attendance', label: 'الحضور', icon: ClipboardCheck },
    { href: '/student/tasks', label: 'المهام', icon: FileText },
    { href: '/student/exams', label: 'الامتحانات', icon: GraduationCap },
  ]
  
  const links = role === 'teacher' ? teacherLinks : studentLinks
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-900 to-blue-700 text-white">
      <div className="p-6 border-b border-blue-600">
        <h2 className="text-2xl font-bold text-center">
          {role === 'teacher' ? 'نظام المعلم' : 'نظام الطالب'}
        </h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive 
                  ? 'bg-white text-blue-900 font-semibold' 
                  : 'hover:bg-blue-800'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-blue-600">
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-white hover:bg-blue-800"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  )
}
