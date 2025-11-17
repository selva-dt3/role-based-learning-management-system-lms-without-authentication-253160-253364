from fastapi import APIRouter, Header
from typing import Optional, List
from models.schemas import Lesson, LessonCreate, LessonUpdate
from services.logic import list_lessons, create_lesson, update_lesson, delete_lesson, attach_storage_path

router = APIRouter(prefix="/lessons", tags=["lessons"])

# PUBLIC_INTERFACE
@router.get("", response_model=List[Lesson], summary="List lessons", description="List all lessons (read-only for Employee)")
def get_lessons(x_role: Optional[str] = Header(default=None, alias="X-Role")):
    """List lessons. Role required in X-Role header."""
    return list_lessons(x_role)

# PUBLIC_INTERFACE
@router.post("", response_model=Lesson, summary="Create a lesson", description="Create a lesson (Admin only)")
def post_lesson(payload: LessonCreate, x_role: Optional[str] = Header(default=None, alias="X-Role")):
    """Create a new lesson (Admin only)."""
    return create_lesson(x_role, payload.dict())

# PUBLIC_INTERFACE
@router.put("/{lesson_id}", response_model=Lesson, summary="Update a lesson", description="Update lesson fields (Admin only)")
def put_lesson(lesson_id: str, payload: LessonUpdate, x_role: Optional[str] = Header(default=None, alias="X-Role")):
    """Update lesson fields by ID (Admin only)."""
    return update_lesson(x_role, lesson_id, {k: v for k, v in payload.dict().items() if v is not None})

# PUBLIC_INTERFACE
@router.delete("/{lesson_id}", summary="Delete a lesson", description="Delete a lesson (Admin only)")
def remove_lesson(lesson_id: str, x_role: Optional[str] = Header(default=None, alias="X-Role")):
    """Delete lesson by ID (Admin only)."""
    return delete_lesson(x_role, lesson_id)

# PUBLIC_INTERFACE
@router.put("/{lesson_id}/attach", response_model=Lesson, summary="Attach storage path", description="Attach Supabase storage_path to a lesson (Admin only)")
def attach_file(lesson_id: str, payload: LessonUpdate, x_role: Optional[str] = Header(default=None, alias="X-Role")):
    """Attach storage_path to lesson (Admin only)."""
    return attach_storage_path(x_role, lesson_id, payload.storage_path or "")
