import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext.jsx';
import { api } from '../api/api.js';

// PUBLIC_INTERFACE
export const AssignmentList = ({ allowCreate }) => {
  const { role, assigneeIdentifier } = useRole();
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [lessonId, setLessonId] = useState('');
  const [assigneeRole, setAssigneeRole] = useState('Employee');
  const [employeeId, setEmployeeId] = useState('');

  const load = async () => {
    if (!role) return;
    const ls = await api.getLessons(role);
    setLessons(ls);
    const as = await api.getAssignments(role, role === 'HR' ? undefined : role);
    setAssignments(as);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const create = async () => {
    if (!role || !lessonId) return;
    const payload = { lesson_id: lessonId };
    if (assigneeRole === 'Employee') {
      payload.assignee_identifier = employeeId;
    } else {
      payload.assignee_role = assigneeRole;
    }
    await api.createAssignment(role, payload);
    setLessonId('');
    setEmployeeId('');
    load();
  };

  const effectiveAssignee = role === 'Employee' ? assigneeIdentifier : undefined;

  return (
    <div>
      {allowCreate && (
        <div style={{ border: '1px solid #eee', padding: 12, marginBottom: 12 }}>
          <h3>Create Assignment</h3>
          <label>Lesson</label>
          <select value={lessonId} onChange={(e) => setLessonId(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}>
            <option value="">Select lesson</option>
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>

          <label>Assign To</label>
          <select
            value={assigneeRole}
            onChange={(e) => setAssigneeRole(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
          >
            <option>Employee</option>
            <option>HR</option>
            <option>Admin</option>
          </select>

          {assigneeRole === 'Employee' && (
            <>
              <label>Employee Identifier</label>
              <input
                placeholder="e.g., jane.doe"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
              />
            </>
          )}

          <button onClick={create} disabled={!lessonId}>
            Create Assignment
          </button>
        </div>
      )}

      <h3>Assignments {effectiveAssignee ? `(for ${effectiveAssignee})` : ''}</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {assignments.map((a) => (
          <li key={a.id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 10 }}>
            <div>Lesson ID: <code>{a.lesson_id}</code></div>
            {a.assignee_role && <div>Role: {a.assignee_role}</div>}
            {a.assignee_identifier && <div>Assignee: {a.assignee_identifier}</div>}
            {a.created_at && <div>Created: {new Date(a.created_at).toLocaleString()}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};
