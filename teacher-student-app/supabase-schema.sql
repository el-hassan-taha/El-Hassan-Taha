-- Create students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  national_id VARCHAR(50) UNIQUE NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  grade VARCHAR(20) NOT NULL,
  class_section VARCHAR(20) NOT NULL,
  guardian_phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weeks table
CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 19),
  academic_year VARCHAR(20) NOT NULL,
  grade VARCHAR(20) NOT NULL,
  class_section VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(week_number, academic_year, grade, class_section)
);

-- Create attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 4),
  period_1 BOOLEAN DEFAULT FALSE,
  period_2 BOOLEAN DEFAULT FALSE,
  period_3 BOOLEAN DEFAULT FALSE,
  period_4 BOOLEAN DEFAULT FALSE,
  period_5 BOOLEAN DEFAULT FALSE,
  period_6 BOOLEAN DEFAULT FALSE,
  period_7 BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, week_id, day_of_week)
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  grade VARCHAR(20) NOT NULL,
  class_section VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_tasks table
CREATE TABLE student_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'not_completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, task_id)
);

-- Create exams table
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name VARCHAR(255) NOT NULL,
  exam_date DATE NOT NULL,
  duration INTEGER NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  grade VARCHAR(20) NOT NULL,
  class_section VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_exams table
CREATE TABLE student_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  score DECIMAL(5,2) DEFAULT 0,
  passed BOOLEAN DEFAULT FALSE,
  grade_rating VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, exam_id)
);

-- Create indexes for better performance
CREATE INDEX idx_students_academic_year ON students(academic_year);
CREATE INDEX idx_students_grade ON students(grade);
CREATE INDEX idx_students_class_section ON students(class_section);
CREATE INDEX idx_students_national_id ON students(national_id);

CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_week_id ON attendance(week_id);

CREATE INDEX idx_tasks_filters ON tasks(academic_year, grade, class_section);
CREATE INDEX idx_student_tasks_student_id ON student_tasks(student_id);
CREATE INDEX idx_student_tasks_task_id ON student_tasks(task_id);

CREATE INDEX idx_exams_filters ON exams(academic_year, grade, class_section);
CREATE INDEX idx_student_exams_student_id ON student_exams(student_id);
CREATE INDEX idx_student_exams_exam_id ON student_exams(exam_id);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_exams ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users (teachers and students)
-- Teachers have full access, students can only view their own data

-- Students table policies
CREATE POLICY "Teachers can do anything with students" ON students
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Students can view their own record" ON students
  FOR SELECT USING (national_id = (SELECT auth.jwt()->>'national_id'));

-- Weeks table policies
CREATE POLICY "Everyone can view weeks" ON weeks
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Teachers can manage weeks" ON weeks
  FOR ALL USING (auth.role() = 'authenticated');

-- Attendance table policies
CREATE POLICY "Teachers can manage attendance" ON attendance
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Students can view their own attendance" ON attendance
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students WHERE national_id = (SELECT auth.jwt()->>'national_id')
    )
  );

-- Tasks table policies
CREATE POLICY "Everyone can view tasks" ON tasks
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Teachers can manage tasks" ON tasks
  FOR ALL USING (auth.role() = 'authenticated');

-- Student tasks table policies
CREATE POLICY "Teachers can manage student tasks" ON student_tasks
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Students can view their own tasks" ON student_tasks
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students WHERE national_id = (SELECT auth.jwt()->>'national_id')
    )
  );

-- Exams table policies
CREATE POLICY "Everyone can view exams" ON exams
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Teachers can manage exams" ON exams
  FOR ALL USING (auth.role() = 'authenticated');

-- Student exams table policies
CREATE POLICY "Teachers can manage student exams" ON student_exams
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Students can view their own exam results" ON student_exams
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students WHERE national_id = (SELECT auth.jwt()->>'national_id')
    )
  );
