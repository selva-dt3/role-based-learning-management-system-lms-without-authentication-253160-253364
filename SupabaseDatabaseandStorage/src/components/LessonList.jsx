import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext.jsx';
import { api } from '../api/api.js';
import { FileUpload } from './FileUpload.jsx';

// PUBLIC_INTERFACE
export const LessonList = ({ allowManage }) => {
  const { role } = useRole();
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const load = async () => {
    if (!role) return;
    const data = await api.getLessons(role);
    setLessons(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const create = async () => {
    if (!role) return;
    await api.createLesson(role, { title, description });
    setTitle('');
    setDescription('');
    load();
  };

  const update = async (id, payload) => {
    if (!role) return;
    await api.updateLesson(role, id, payload);
    load();
  };

  const remove = async (id) => {
    if (!role) return;
    await api.deleteLesson(role, id);
    load();
  };

  return (
    <div>
      {allowManage && (
        <div style={{ border: '1px solid #eee', padding: 12, marginBottom: 12 }}>
          <h3>Create Lesson</h3>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
          />
          <button onClick={create} disabled={!title}>Create</button>
        </div>
      )}

      <h3>Lessons</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {lessons.map((l) => (
          <li key={l.id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 10 }}>
            <div style={{ fontWeight: 600 }}>{l.title}</div>
            <div style={{ color: '#555' }}>{l.description}</div>
            {l.storage_path && (
              <div style={{ marginTop: 6 }}>
                Asset: <code>{l.storage_path}</code>
              </div>
            )}
            {allowManage && (
              <>
                <FileUpload
                  lessonId={l.id}
                  onAttached={() => {
                    load();
                  }}
                />
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => update(l.id, { title: l.title + ' (updated)' })}>Quick Update</button>
                  <button onClick={() => remove(l.id)} style={{ marginLeft: 8 }}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
