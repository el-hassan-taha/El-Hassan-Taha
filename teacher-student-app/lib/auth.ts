'use client'

import { getSupabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email?: string
  national_id?: string
  role: 'teacher' | 'student'
}

export async function signInTeacher(email: string, password: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export async function signInStudent(nationalId: string) {
  const supabase = getSupabase()
  // For student login, we'll use a custom approach
  // Check if student exists in database
  const { data: student, error } = await supabase
    .from('students')
    .select('*')
    .eq('national_id', nationalId)
    .single()
  
  if (error || !student) {
    throw new Error('الرقم القومي غير صحيح')
  }
  
  return student
}

export async function signOut() {
  const supabase = getSupabase()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
