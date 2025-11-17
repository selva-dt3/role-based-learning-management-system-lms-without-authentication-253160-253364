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

## Apply Supabase schema

This project includes a helper script to apply the SQL from `../docs/migrations.md` to your Supabase project and to ensure the private `lessons` storage bucket exists.

```
# Ensure environment is set
export SUPABASE_URL=https://<project-ref>.supabase.co
export SUPABASE_KEY=<service-role-key>

# Run migration
python backend/tools/apply_supabase_migrations.py
```

The script:
- Parses SQL blocks from `docs/migrations.md`
- Executes statements individually via the Supabase SQL HTTP endpoint
- Ensures a private storage bucket named `lessons`
- Verifies tables and indexes and prints a summary

## Environment

- SUPABASE_URL: Your Supabase project URL
- SUPABASE_KEY: Your Supabase service role (or anon) key, depending on policies
- REACT_APP_FRONTEND_URL: CORS origin for the React app

See `.env.example` for an example.

## Endpoints

See OpenAPI at `/docs` when running locally.

Authentication is not used; role is provided via `X-Role` header. Employees should send `X-Assignee-Identifier` for progress operations.
