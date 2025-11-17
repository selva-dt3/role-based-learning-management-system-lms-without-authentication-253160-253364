from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from supabase_client import get_supabase

# Role checks
def require_role(role_header: Optional[str], allowed: List[str]):
    if role_header not in allowed:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden for this role")

def is_role(role_header: Optional[str], role: str) -> bool:
    return (role_header or '').lower() == role.lower()

# Lessons
def list_lessons(role: Optional[str]) -> List[Dict[str, Any]]:
    supabase = get_supabase()
    # Employees can read, same as others
    res = supabase.table("lessons").select("*").order("created_at", desc=True).execute()
    return res.data or []

def create_lesson(role: Optional[str], payload: Dict[str, Any]) -> Dict[str, Any]:
    require_role(role, ["Admin"])
    supabase = get_supabase()
    res = supabase.table("lessons").insert(payload).execute()
    return (res.data or [])[0]

def update_lesson(role: Optional[str], lesson_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    # HR is not allowed to delete, but can update? Keep strict: only Admin updates
    require_role(role, ["Admin"])
    supabase = get_supabase()
    res = supabase.table("lessons").update(payload).eq("id", lesson_id).execute()
    data = res.data or []
    if not data:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return data[0]

def delete_lesson(role: Optional[str], lesson_id: str) -> Dict[str, Any]:
    require_role(role, ["Admin"])
    supabase = get_supabase()
    res = supabase.table("lessons").delete().eq("id", lesson_id).execute()
    if not (res.data or []):
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"deleted": True}

def attach_storage_path(role: Optional[str], lesson_id: str, storage_path: str) -> Dict[str, Any]:
    require_role(role, ["Admin"])
    return update_lesson(role, lesson_id, {"storage_path": storage_path})

# Assignments
def list_assignments(role: Optional[str], role_filter: Optional[str]) -> List[Dict[str, Any]]:
    supabase = get_supabase()
    query = supabase.table("assignments").select("*").order("created_at", desc=True)
    if role_filter:
        query = query.eq("assignee_role", role_filter)
    res = query.execute()
    return res.data or []

def create_assignment(role: Optional[str], payload: Dict[str, Any]) -> Dict[str, Any]:
    # HR can create assignments; Admin too
    require_role(role, ["HR", "Admin"])
    if not payload.get("assignee_role") and not payload.get("assignee_identifier"):
        raise HTTPException(status_code=400, detail="Either assignee_role or assignee_identifier is required")
    supabase = get_supabase()
    res = supabase.table("assignments").insert(payload).execute()
    return (res.data or [])[0]

# Progress
def list_progress(role: Optional[str], assignee: Optional[str]) -> List[Dict[str, Any]]:
    supabase = get_supabase()
    query = supabase.table("progress").select("*").order("updated_at", desc=True)
    if is_role(role, "Employee"):
        # Employees can only read their own
        if not assignee:
            raise HTTPException(status_code=400, detail="assignee is required for employees")
        query = query.eq("assignee_identifier", assignee)
    elif is_role(role, "HR"):
        # For simplicity HR can view all team progress (no org info here)
        pass
    elif is_role(role, "Admin"):
        pass
    else:
        raise HTTPException(status_code=403, detail="Invalid role")
    res = query.execute()
    return res.data or []

def upsert_progress(role: Optional[str], payload: Dict[str, Any], header_assignee: Optional[str]) -> Dict[str, Any]:
    supabase = get_supabase()
    lesson_id = payload.get("lesson_id")
    assignee_identifier = payload.get("assignee_identifier") or header_assignee
    status_value = payload.get("status")
    if not lesson_id or not assignee_identifier or not status_value:
        raise HTTPException(status_code=400, detail="lesson_id, assignee_identifier, status required")

    if is_role(role, "Employee"):
        # Employee can only update their own
        if header_assignee and assignee_identifier != header_assignee:
            raise HTTPException(status_code=403, detail="Employees can only update their own progress")

    # Upsert by (lesson_id, assignee_identifier)
    existing = supabase.table("progress").select("*").eq("lesson_id", lesson_id).eq("assignee_identifier", assignee_identifier).execute()
    if existing.data:
        res = supabase.table("progress").update({"status": status_value}).eq("id", existing.data[0]["id"]).execute()
        return (res.data or [])[0]
    else:
        res = supabase.table("progress").insert({
            "lesson_id": lesson_id,
            "assignee_identifier": assignee_identifier,
            "status": status_value
        }).execute()
        return (res.data or [])[0]
