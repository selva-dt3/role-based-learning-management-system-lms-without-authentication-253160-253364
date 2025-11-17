# Frontend - Role-Based LMS

This React app provides a no-auth role selection and dashboards for Admin, HR, and Employees.

## Environment Variables
- REACT_APP_API_BASE or REACT_APP_BACKEND_URL: Backend URL (e.g., http://localhost:8000)

## Run
```
npm install
npm start
```

The app sends role to backend via `X-Role` and, when applicable, `X-Assignee-Identifier`.
