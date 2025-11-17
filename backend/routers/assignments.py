from fastapi import APIRouter, Header, Query
from typing import Optional, List
from models.schemas import Assignment, AssignmentCreate
from services.logic import list_assignments, create_assignment

router = APIRouter(prefix="/assignments", tags=["assignments"])

# PUBLIC_INTERFACE
@router.get("", response_model=List[Assignment], summary="List assignments", description="List assignments, optionally filtered by assignee role")
def get_assignments(
    x_role: Optional[str] = Header(default=None, alias="X-Role"),
    role: Optional[str] = Query(default=None, description="Filter by assignee role"),
):
    """Get assignments with optional role filter."""
    return list_assignments(x_role, role)

# PUBLIC_INTERFACE
@router.post("", response_model=Assignment, summary="Create assignment", description="Create assignment (HR or Admin)")
def post_assignment(payload: AssignmentCreate, x_role: Optional[str] = Header(default=None, alias="X-Role")):
    """Create assignment (HR or Admin)."""
    return create_assignment(x_role, payload.dict())
