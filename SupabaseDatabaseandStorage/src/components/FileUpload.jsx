import React, { useState } from 'react';
import { useRole } from '../context/RoleContext.jsx';
import { api } from '../api/api.js';

// PUBLIC_INTERFACE
export const FileUpload = ({ lessonId, onAttached }) => {
  const { role } = useRole();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!file || !role) return;
    try {
      setStatus('Uploading...');
      const res = await api.upload(role, file);
      setStatus('Attaching...');
      await api.attachLessonFile(role, lessonId, res.storage_path);
      setStatus('Attached');
      if (typeof onAttached === 'function') onAttached(res.storage_path);
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={!file} style={{ marginLeft: 8 }}>
        Upload & Attach
      </button>
      {status && <div style={{ fontSize: 12, marginTop: 6 }}>{status}</div>}
    </div>
  );
};
