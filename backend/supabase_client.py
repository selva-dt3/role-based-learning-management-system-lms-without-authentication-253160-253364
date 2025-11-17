import os
from typing import Optional
from supabase import create_client, Client

_client: Optional[Client] = None

# PUBLIC_INTERFACE
def get_supabase() -> Client:
    """Return a cached Supabase client using SUPABASE_URL and SUPABASE_KEY from environment variables."""
    global _client
    if _client is not None:
        return _client

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        raise RuntimeError("Supabase env vars SUPABASE_URL and SUPABASE_KEY must be set")

    _client = create_client(url, key)
    return _client
