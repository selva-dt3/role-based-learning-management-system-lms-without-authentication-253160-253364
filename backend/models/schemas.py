from typing import Optional, Literal
from pydantic import BaseModel, Field

class LessonBase(BaseModel):
    title: str = Field(..., description="Lesson title")
    description: str = Field(..., description="Lesson description")

class LessonCreate(LessonBase):
    pass

class LessonUpdate(BaseModel):
    title: Optional[str] = Field(None, description="Updated title")
    description: Optional[str] = Field(None, description="Updated description")
    storage_path: Optional[str] = Field(None, description="Supabase storage path for lesson asset")

class Lesson(LessonBase):
    id: str = Field(..., description="Lesson ID (uuid)")
    storage_path: Optional[str] = Field(None, description="Supabase storage path (if attached)")
    created_at: Optional[str] = Field(None, description="Creation timestamp")

class AssignmentCreate(BaseModel):
    lesson_id: str = Field(..., description="Lesson ID to assign")
    assignee_role: Optional[Literal['Employee', 'HR', 'Admin']] = Field(None, description="Assignee role")
    assignee_identifier: Optional[str] = Field(None, description="Assignee identifier for Employee")

class Assignment(BaseModel):
    id: str = Field(..., description="Assignment ID")
    lesson_id: str = Field(..., description="Assigned lesson ID")
    assignee_role: Optional[str] = Field(None, description="Assignee role")
    assignee_identifier: Optional[str] = Field(None, description="Assigned user identifier")
    created_at: Optional[str] = Field(None, description="Creation timestamp")

class ProgressCreate(BaseModel):
    lesson_id: str = Field(..., description="Lesson ID")
    assignee_identifier: str = Field(..., description="Identifier of the assignee (employee)")
    status: Literal['assigned', 'in_progress', 'completed'] = Field(..., description="Progress status")

class Progress(BaseModel):
    id: str = Field(..., description="Progress row id")
    lesson_id: str = Field(..., description="Lesson ID")
    assignee_identifier: str = Field(..., description="Assignee identifier")
    status: str = Field(..., description="Status")
    updated_at: Optional[str] = Field(None, description="Last updated timestamp")
