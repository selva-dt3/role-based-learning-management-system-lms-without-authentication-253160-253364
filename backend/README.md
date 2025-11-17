# Backend - FastAPI for Role-Based LMS

## Run locally

```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

export SUPABASE_URL=...
export SUPABASE_KEY=...
# Optional for CORS:
export REACT_APP_FRONTEND_URL=http://localhost:3000

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Environment

- SUPABASE_URL: Your Supabase project URL
- SUPABASE_KEY: Your Supabase service role (or anon) key, depending on policies
- REACT_APP_FRONTEND_URL: CORS origin for the React app

## Endpoints

See OpenAPI at `/docs` when running locally.

Authentication is not used; role is provided via `X-Role` header. Employees should send `X-Assignee-Identifier` for progress operations.
