from fastapi import APIRouter, Header, Query
from typing import Optional, List
from models.schemas import Progress, ProgressCreate
from services.logic import list_progress, upsert_progress

router = APIRouter(prefix="/progress", tags=["progress"])

# PUBLIC_INTERFACE
@router.get("", response_model=List[Progress], summary="List progress", description="List progress. Employees must pass their identifier to view own items.")
def get_progress(
    x_role: Optional[str] = Header(default=None, alias="X-Role"),
    assignee: Optional[str] = Query(default=None, description="Assignee identifier for filtering"),
):
    """List progress entries. Employees can only view their own progress."""
    return list_progress(x_role, assignee)

# PUBLIC_INTERFACE
@router.post("", response_model=Progress, summary="Create/update progress", description="Create or update progress entry. Employee can only update own progress.")
def post_progress(
    payload: ProgressCreate,
    x_role: Optional[str] = Header(default=None, alias="X-Role"),
    x_assignee: Optional[str] = Header(default=None, alias="X-Assignee-Identifier"),
):
    """Create/update progress entry. Employee updates are restricted to their own identifier."""
    return upsert_progress(x_role, payload.dict(), x_assignee)
