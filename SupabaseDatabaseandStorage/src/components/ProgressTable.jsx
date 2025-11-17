import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext.jsx';
import { api } from '../api/api.js';

// PUBLIC_INTERFACE
export const ProgressTable = ({ showActions }) => {
  const { role, assigneeIdentifier } = useRole();
  const [progress, setProgress] = useState([]);

  const load = async () => {
    if (!role) return;
    const list = await api.getProgress(role, role === 'Employee' ? assigneeIdentifier : undefined);
    setProgress(list);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, assigneeIdentifier]);

  const markCompleted = async (lesson_id) => {
    if (!role) return;
    await api.upsertProgress(role, {
      lesson_id,
      assignee_identifier: assigneeIdentifier || 'employee-guest',
      status: 'completed',
    });
    load();
  };

  return (
    <div>
      <h3>Progress</h3>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Lesson</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Assignee</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Status</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Updated</th>
            {showActions && <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {progress.map((p) => (
            <tr key={p.id}>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{p.lesson_id}</td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{p.assignee_identifier}</td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{p.status}</td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>
                {p.updated_at ? new Date(p.updated_at).toLocaleString() : '-'}
              </td>
              {showActions && (
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>
                  <button onClick={() => markCompleted(p.lesson_id)}>Mark Completed</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
