from fastapi import APIRouter

router = APIRouter(tags=["health"])

# PUBLIC_INTERFACE
@router.get("/health", summary="Health check", description="Returns service health status")
def health():
    """Health check endpoint."""
    return {"status": "ok"}
