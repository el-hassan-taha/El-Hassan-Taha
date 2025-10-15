# Architecture Documentation

## Project Structure

```
teacher-student-app/
├── app/                          # Next.js 14 App Router
│   ├── teacher/                 # Teacher portal
│   │   ├── dashboard/          # Dashboard with statistics
│   │   ├── students/           # Student management
│   │   │   └── [id]/          # Individual student detail
│   │   ├── tasks/             # Task management
│   │   ├── attendance/        # Attendance tracking (WIP)
│   │   ├── exams/             # Exam management (WIP)
│   │   ├── settings/          # Settings (WIP)
│   │   └── layout.tsx         # Teacher layout with sidebar
│   ├── student/                # Student portal
│   │   ├── home/              # Student dashboard
│   │   ├── attendance/        # View attendance (WIP)
│   │   ├── tasks/             # View tasks (WIP)
│   │   ├── exams/             # View exam results (WIP)
│   │   └── layout.tsx         # Student layout with sidebar
│   ├── layout.tsx              # Root layout (RTL, Arabic, Query Provider)
│   ├── page.tsx                # Login page (teacher/student)
│   └── globals.css             # Global styles with RTL support
├── components/
│   ├── layout/
│   │   └── sidebar.tsx         # Reusable sidebar component
│   ├── providers/
│   │   └── query-provider.tsx  # TanStack Query provider
│   └── ui/                      # Shadcn/UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── select.tsx
├── lib/
│   ├── auth.ts                  # Authentication functions
│   ├── supabase.ts              # Supabase client
│   └── utils.ts                 # Utility functions (cn, etc.)
├── types/
│   └── database.ts              # TypeScript database types
├── supabase-schema.sql          # Database schema SQL
├── .env.example                 # Environment variables template
├── README.md                    # Project overview
├── SETUP.md                     # Setup instructions
└── ARCHITECTURE.md              # This file
```

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
  - Server components for better performance
  - Client components for interactivity
  - File-based routing
  
- **TypeScript**: Type safety and better developer experience

- **Tailwind CSS**: Utility-first CSS framework
  - Custom RTL support
  - Responsive design
  - Custom color scheme

### UI Components
- **Shadcn/UI**: Accessible, customizable components
  - Button, Card, Input, Label, Select
  - Built on Radix UI primitives
  
- **Lucide React**: Icon library

### State Management
- **TanStack Query (React Query)**: Server state management
  - Automatic caching
  - Background refetching
  - Optimistic updates
  
- **React Hooks**: Local state management
  - useState for form state
  - useEffect for side effects

### Forms & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation (planned for future use)

### Backend & Database
- **Supabase**: 
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions (future enhancement)

### PDF Generation
- **jsPDF**: Arabic PDF reports (planned)

## Data Flow

### Authentication Flow

#### Teacher Login
```
1. User enters email & password
2. signInTeacher() calls Supabase Auth
3. On success, redirect to /teacher/dashboard
4. Session stored in Supabase (httpOnly cookie)
```

#### Student Login
```
1. Student enters national_id
2. signInStudent() queries students table
3. On success, store student data in sessionStorage
4. Redirect to /student/home
```

### Data Fetching Pattern
```typescript
// Using TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['students', filters],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('full_name')
    
    if (error) throw error
    return data
  }
})
```

### Data Mutation Pattern
```typescript
const mutation = useMutation({
  mutationFn: async (newStudent) => {
    const { data, error } = await supabase
      .from('students')
      .insert([newStudent])
      .select()
    
    if (error) throw error
    return data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['students'] })
  }
})
```

## Database Schema

### Core Tables

**students**
- Primary entity for student records
- Unique constraint on national_id
- Linked to attendance, tasks, and exams

**weeks**
- Represents academic weeks (1-19)
- Unique per year/grade/class combination

**attendance**
- Daily attendance records
- 7 periods per day (Sunday-Thursday)
- Linked to student and week

**tasks**
- Teacher-created assignments
- Filtered by year/grade/class
- Auto-assigned to matching students

**student_tasks**
- Junction table linking students to tasks
- Status: pending/completed/not_completed

**exams**
- Exam definitions
- Filtered by year/grade/class

**student_exams**
- Exam results
- Scores, pass/fail, grade ratings

### Security (RLS Policies)

- Teachers: Full CRUD access to all tables
- Students: Read-only access to own records
- Authentication required for all operations

## Features Implementation

### Completed Features

#### Login System
- Dual login (teacher/student)
- Different authentication methods
- Session management

#### Teacher Dashboard
- Statistics cards (students, tasks, exams)
- Real-time data with React Query

#### Student Management
- Add new students with form validation
- Search and filter functionality
- List view with pagination support
- Individual student detail pages

#### Task Management
- Create tasks with due dates
- Auto-assign to students by filters
- List view of all tasks

#### Student Portal
- Personal information display
- Performance metrics
- Statistics cards

### In Progress / Planned

#### Attendance Management
- Weekly grid interface
- 7 periods × 5 days
- Auto-save on check/uncheck
- Attendance percentage calculation

#### Exam Management
- Create exams with metadata
- Enter scores for students
- Calculate pass/fail
- Grade rating system

#### PDF Reports
- Student performance reports
- Arabic text support with jsPDF
- Include all data (attendance, tasks, exams)

#### Advanced Features
- Bulk student deletion
- Data import/export
- Real-time notifications
- Mobile responsive improvements

## RTL (Right-to-Left) Support

### Implementation
```css
/* In globals.css */
[dir="rtl"] {
  direction: rtl;
}

[dir="rtl"] .flex-row {
  flex-direction: row-reverse;
}
```

### HTML Setup
```html
<html lang="ar" dir="rtl">
```

### Component Considerations
- Text inputs have `dir="ltr"` for IDs and phone numbers
- Flexbox items automatically reverse
- Icons remain in logical positions

## Performance Optimizations

### React Query Caching
- 60-second stale time
- Background refetching disabled
- Manual invalidation on mutations

### Next.js Optimizations
- Static generation where possible
- Automatic code splitting
- Image optimization (future)

### Future Enhancements
- Implement React.memo for expensive components
- Add loading skeletons
- Optimize large lists with virtualization
- Implement incremental static regeneration (ISR)

## Error Handling

### Current Approach
```typescript
try {
  await operation()
} catch (err) {
  setError((err as Error).message)
}
```

### Future Improvements
- Global error boundary
- Toast notifications
- Retry mechanisms
- Better error messages in Arabic

## Testing Strategy (Future)

### Unit Tests
- Utility functions
- Custom hooks
- Component logic

### Integration Tests
- API calls
- Form submissions
- Navigation flows

### E2E Tests
- Complete user journeys
- Teacher workflow
- Student workflow

## Deployment

### Recommended Platforms
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Self-hosted with Docker

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

## Contributing Guidelines

1. Follow existing code style
2. Use TypeScript for type safety
3. Keep components small and focused
4. Use React Query for data fetching
5. Maintain RTL support
6. Write Arabic UI text
7. Document complex logic
8. Test before committing

## Future Roadmap

### Phase 1 (Current)
- ✅ Authentication
- ✅ Student management
- ✅ Task management
- ✅ Basic dashboards

### Phase 2
- ⬜ Attendance tracking
- ⬜ Exam management
- ⬜ PDF generation

### Phase 3
- ⬜ Advanced analytics
- ⬜ Parent portal
- ⬜ Mobile app (React Native)
- ⬜ WhatsApp integration

### Phase 4
- ⬜ AI-powered insights
- ⬜ Automated report cards
- ⬜ Integration with LMS
