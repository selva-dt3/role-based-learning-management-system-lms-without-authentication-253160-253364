from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import lessons, assignments, progress, upload, health

# PUBLIC_INTERFACE
def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application with CORS and routers.

    Returns:
        FastAPI: Configured FastAPI app.
    """
    app = FastAPI(
        title="Role-Based LMS API",
        description="Backend for Role-Based LMS with Supabase integration",
        version="0.1.0",
        openapi_tags=[
            {"name": "health", "description": "Service health checks"},
            {"name": "lessons", "description": "CRUD operations for lessons"},
            {"name": "assignments", "description": "Assign lessons to roles or users"},
            {"name": "progress", "description": "Track lesson progress"},
            {"name": "upload", "description": "Upload lesson assets to Supabase Storage"},
        ],
    )

    frontend_origin = (
        # The orchestrator will inject REACT_APP_FRONTEND_URL if available, else we allow all in dev.
        # Note: Avoid hardcoding and keep permissive for local development.
        # In production, set this environment variable for strict CORS.
        __import__("os").environ.get("REACT_APP_FRONTEND_URL")
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[frontend_origin] if frontend_origin else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(lessons.router)
    app.include_router(assignments.router)
    app.include_router(progress.router)
    app.include_router(upload.router)

    return app


app = create_app()
