# Role-Based LMS (No-Auth) - React + FastAPI + Supabase

This repository contains a minimal, functional implementation of a role-based Learning Management System (LMS) using:
- Frontend: React (Create React App)
- Backend: FastAPI
- Database/Storage: Supabase (PostgreSQL + Storage)

Users select their role (Admin, HR, Employee) without authentication. The backend enforces role-based access using an `X-Role` header. Employees can optionally provide an identifier via `X-Assignee-Identifier` to personalize progress.

## Quick Start

### Prerequisites
- Node.js 16+
- Python 3.10+
- Supabase project with:
  - Tables: `lessons`, `assignments`, `progress`
  - Storage bucket: `lessons`
- Environment variables (see .env examples below)

### Frontend (React)
From the frontend folder:
```
cd role-based-learning-management-system-lms-without-authentication-253160-253364/SupabaseDatabaseandStorage
npm install
# Ensure `.env` contains:
# REACT_APP_API_BASE=http://localhost:8000
# (or REACT_APP_BACKEND_URL)
npm start
```

### Backend (FastAPI)
Create and activate a virtual environment then:
```
cd role-based-learning-management-system-lms-without-authentication-253160-253364/backend
pip install -r requirements.txt
export SUPABASE_URL=...      # from your Supabase project
export SUPABASE_KEY=...      # service role or appropriate key
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

CORS: If `REACT_APP_FRONTEND_URL` is set in the environment when starting the backend, CORS is restricted to that origin, otherwise `*` is allowed for development.

### Headers and Role Behavior
All frontend API calls add:
- `X-Role`: one of `Admin`, `HR`, `Employee`
- `X-Assignee-Identifier`: for Employee-specific operations (e.g., `jane.doe`)

### Roles
- Admin:
  - Full access to lessons (create/read/update/delete)
  - View all progress
  - Upload and attach assets to lessons
- HR:
  - Create assignments (to roles or specific employee identifiers)
  - View team progress (no deletion of lessons)
- Employee:
  - Read assigned lessons
  - Update own progress only (requires `X-Assignee-Identifier`)

## Project Structure

```
/SupabaseDatabaseandStorage
  src/
    api/api.ts
    context/RoleContext.tsx
    components/
      RoleSelector.tsx
      FileUpload.tsx
      LessonList.tsx
      AssignmentList.tsx
      ProgressTable.tsx
    pages/
      HomePage.tsx
      AdminPage.tsx
      HRPage.tsx
      EmployeePage.tsx
  package.json

/backend
  main.py
  supabase_client.py
  models/schemas.py
  services/logic.py
  routers/
    health.py
    lessons.py
    assignments.py
    progress.py
    upload.py
  requirements.txt

/docs
  migrations.md
```

## Environment Variables

Frontend (.env):
- REACT_APP_API_BASE or REACT_APP_BACKEND_URL: Base URL for the backend (e.g., `http://localhost:8000`)
- REACT_APP_FRONTEND_URL: Used by backend for CORS (optional in dev)

Backend (.env or exported in shell):
- SUPABASE_URL
- SUPABASE_KEY

See `backend/.env.example` for an example.

## Using the App

1. Open the frontend in your browser.
2. On the home page, select a role and continue.
3. Depending on the role:
   - Admin: create lessons, upload files, see progress
   - HR: assign lessons to roles or employee identifiers, view progress
   - Employee: view assignments and mark completion (requires identifier)

## API Summary

- GET `/health`
- Lessons:
  - GET `/lessons`
  - POST `/lessons` (Admin)
  - PUT `/lessons/{id}` (Admin)
  - DELETE `/lessons/{id}` (Admin)
  - PUT `/lessons/{id}/attach` (Admin)
- Assignments:
  - GET `/assignments?role=Employee|HR|Admin`
  - POST `/assignments` (HR/Admin)
- Progress:
  - GET `/progress?assignee=identifier` (Employees must pass their own)
  - POST `/progress` (Employees can update only their own)
- Upload:
  - POST `/upload` (uploads to Supabase Storage `lessons` bucket)

## Notes

- The frontend never calls Supabase directly; all access is mediated via the backend.
- Role is stored in localStorage to persist across refreshes.
- The backend expects Supabase tables to exist; see `docs/migrations.md` for suggested SQL.

