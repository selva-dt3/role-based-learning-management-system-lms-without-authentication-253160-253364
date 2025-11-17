const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  'http://localhost:8000';

async function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// PUBLIC_INTERFACE
export async function apiRequest({
  method = 'GET',
  path,
  body,
  role,
  assigneeIdentifier,
  signal,
  headers = {},
}) {
  const url = `${API_BASE}${path}`;
  const controller = new AbortController();
  const combinedSignal = signal ?? controller.signal;

  const finalHeaders = {
    ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    'X-Role': role || '',
    ...(assigneeIdentifier ? { 'X-Assignee-Identifier': assigneeIdentifier } : {}),
    ...headers,
  };

  const requestInit = {
    method,
    headers: finalHeaders,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    signal: combinedSignal,
  };

  // basic retry up to 2 times on 5xx
  let attempts = 0;
  while (true) {
    const resp = await fetch(url, requestInit);
    if (resp.status >= 500 && resp.status < 600 && attempts < 2) {
      attempts += 1;
      await delay(300 * attempts);
      continue;
    }
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // not json
      }
      const msg = (data && (data.detail || data.error)) || resp.statusText || 'Request failed';
      throw new Error(`${resp.status}: ${msg}`);
    }
    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await resp.json();
    }
    // fallback text
    return await resp.text();
  }
}

// PUBLIC_INTERFACE
export const api = {
  health: (role) => apiRequest({ method: 'GET', path: '/health', role }),
  getLessons: (role) => apiRequest({ method: 'GET', path: '/lessons', role }),
  createLesson: (role, payload) =>
    apiRequest({ method: 'POST', path: '/lessons', role, body: payload }),
  updateLesson: (role, id, payload) =>
    apiRequest({ method: 'PUT', path: `/lessons/${id}`, role, body: payload }),
  deleteLesson: (role, id) =>
    apiRequest({ method: 'DELETE', path: `/lessons/${id}`, role }),
  attachLessonFile: (role, id, storage_path) =>
    apiRequest({ method: 'PUT', path: `/lessons/${id}/attach`, role, body: { storage_path } }),
  getAssignments: (role, roleFilter) =>
    apiRequest({ method: 'GET', path: `/assignments${roleFilter ? `?role=${roleFilter}` : ''}`, role }),
  createAssignment: (role, payload) =>
    apiRequest({ method: 'POST', path: '/assignments', role, body: payload }),
  getProgress: (role, assignee) =>
    apiRequest({ method: 'GET', path: `/progress${assignee ? `?assignee=${encodeURIComponent(assignee)}` : ''}`, role }),
  upsertProgress: (role, payload) =>
    apiRequest({ method: 'POST', path: '/progress', role, body: payload }),
  upload: (role, file) => {
    const form = new FormData();
    form.append('file', file);
    return apiRequest({
      method: 'POST',
      path: '/upload',
      role,
      body: form,
      headers: {}, // FormData sets own headers
    });
  },
};
