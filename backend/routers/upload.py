import uuid
from fastapi import APIRouter, File, UploadFile, Header, HTTPException, status
from typing import Optional
from supabase_client import get_supabase
from services.logic import require_role

router = APIRouter(tags=["upload"])

BUCKET = "lessons"

# PUBLIC_INTERFACE
@router.post("/upload", summary="Upload lesson asset", description="Uploads a file to Supabase Storage bucket 'lessons'. Returns storage_path.")
async def upload_file(
    file: UploadFile = File(...),
    x_role: Optional[str] = Header(default=None, alias="X-Role"),
):
    """Upload a file to Supabase Storage lessons bucket. Admin/HR/Employee can upload; lesson attachment is restricted to Admin via attach endpoint."""
    require_role(x_role, ["Admin", "HR", "Employee"])
    supabase = get_supabase()
    contents = await file.read()
    ext = ""
    if "." in file.filename:
        ext = "." + file.filename.split(".")[-1]
    object_path = f"{uuid.uuid4()}{ext}"

    # Ensure bucket exists (best effort; if not permitted, assume pre-created)
    try:
      supabase.storage.create_bucket(BUCKET, public=False)
    except Exception:
      pass

    res = supabase.storage.from_(BUCKET).upload(object_path, contents, {"contentType": file.content_type})
    if res is None or getattr(res, "status_code", 200) >= 400:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Upload failed")

    storage_path = f"{BUCKET}/{object_path}"
    return {"storage_path": storage_path}
