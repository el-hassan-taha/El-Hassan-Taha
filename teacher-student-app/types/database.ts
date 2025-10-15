export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          full_name: string
          national_id: string
          academic_year: string
          grade: string
          class_section: string
          guardian_phone: string
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          national_id: string
          academic_year: string
          grade: string
          class_section: string
          guardian_phone: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          national_id?: string
          academic_year?: string
          grade?: string
          class_section?: string
          guardian_phone?: string
          created_at?: string
        }
      }
      weeks: {
        Row: {
          id: string
          week_number: number
          academic_year: string
          grade: string
          class_section: string
          created_at: string
        }
        Insert: {
          id?: string
          week_number: number
          academic_year: string
          grade: string
          class_section: string
          created_at?: string
        }
        Update: {
          id?: string
          week_number?: number
          academic_year?: string
          grade?: string
          class_section?: string
          created_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          week_id: string
          day_of_week: number
          period_1: boolean
          period_2: boolean
          period_3: boolean
          period_4: boolean
          period_5: boolean
          period_6: boolean
          period_7: boolean
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          week_id: string
          day_of_week: number
          period_1?: boolean
          period_2?: boolean
          period_3?: boolean
          period_4?: boolean
          period_5?: boolean
          period_6?: boolean
          period_7?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          week_id?: string
          day_of_week?: number
          period_1?: boolean
          period_2?: boolean
          period_3?: boolean
          period_4?: boolean
          period_5?: boolean
          period_6?: boolean
          period_7?: boolean
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          due_date: string
          academic_year: string
          grade: string
          class_section: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          due_date: string
          academic_year: string
          grade: string
          class_section: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          due_date?: string
          academic_year?: string
          grade?: string
          class_section?: string
          created_at?: string
        }
      }
      student_tasks: {
        Row: {
          id: string
          student_id: string
          task_id: string
          status: 'pending' | 'completed' | 'not_completed'
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          task_id: string
          status?: 'pending' | 'completed' | 'not_completed'
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          task_id?: string
          status?: 'pending' | 'completed' | 'not_completed'
          created_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          exam_name: string
          exam_date: string
          duration: number
          academic_year: string
          grade: string
          class_section: string
          created_at: string
        }
        Insert: {
          id?: string
          exam_name: string
          exam_date: string
          duration: number
          academic_year: string
          grade: string
          class_section: string
          created_at?: string
        }
        Update: {
          id?: string
          exam_name?: string
          exam_date?: string
          duration?: number
          academic_year?: string
          grade?: string
          class_section?: string
          created_at?: string
        }
      }
      student_exams: {
        Row: {
          id: string
          student_id: string
          exam_id: string
          score: number
          passed: boolean
          grade_rating: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          exam_id: string
          score?: number
          passed?: boolean
          grade_rating?: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          exam_id?: string
          score?: number
          passed?: boolean
          grade_rating?: string
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type Student = Database['public']['Tables']['students']['Row']
export type Week = Database['public']['Tables']['weeks']['Row']
export type Attendance = Database['public']['Tables']['attendance']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type StudentTask = Database['public']['Tables']['student_tasks']['Row']
export type Exam = Database['public']['Tables']['exams']['Row']
export type StudentExam = Database['public']['Tables']['student_exams']['Row']
