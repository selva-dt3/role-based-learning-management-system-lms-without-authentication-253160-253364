# Supabase SQL Migrations (Suggested)

Run the following SQL in your Supabase SQL editor to set up required tables.

```sql
-- Lessons
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  storage_path text,
  created_at timestamptz not null default now()
);

-- Assignments
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  assignee_role text, -- 'Employee' | 'HR' | 'Admin'
  assignee_identifier text, -- for individual employee
  created_at timestamptz not null default now()
);

-- Progress
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  assignee_identifier text not null,
  status text not null check (status in ('assigned', 'in_progress', 'completed')),
  updated_at timestamptz not null default now()
);

-- Basic index suggestions
create index if not exists idx_assignments_lesson on public.assignments(lesson_id);
create index if not exists idx_progress_lesson on public.progress(lesson_id);
create index if not exists idx_progress_assignee on public.progress(assignee_identifier);
```

Storage:
- Create a storage bucket named `lessons` (private).
