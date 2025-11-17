import React, { useState } from 'react';
import { useRole } from '../context/RoleContext.jsx';

// PUBLIC_INTERFACE
export const RoleSelector = ({ onContinue }) => {
  const { role, setRole, assigneeIdentifier, setAssigneeIdentifier } = useRole();
  const [localRole, setLocalRole] = useState(role ?? 'Employee');
  const [localAssignee, setLocalAssignee] = useState(assigneeIdentifier);

  const handleContinue = () => {
    setRole(localRole);
    if (localRole === 'Employee') {
      setAssigneeIdentifier(localAssignee || 'employee-guest');
    } else {
      setAssigneeIdentifier(localAssignee || '');
    }
    if (typeof onContinue === 'function') onContinue();
  };

  return (
    <div style={{ maxWidth: 480, margin: '1rem auto', textAlign: 'left' }}>
      <label htmlFor="role">Select Role</label>
      <select
        id="role"
        value={localRole}
        onChange={(e) => setLocalRole(e.target.value)}
        style={{ width: '100%', padding: 8, marginTop: 8 }}
      >
        <option>Admin</option>
        <option>HR</option>
        <option>Employee</option>
      </select>

      {localRole === 'Employee' && (
        <div style={{ marginTop: 12 }}>
          <label htmlFor="assignee">Your Name or ID</label>
          <input
            id="assignee"
            placeholder="e.g., jane.doe"
            value={localAssignee}
            onChange={(e) => setLocalAssignee(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 8 }}
          />
        </div>
      )}

      <button style={{ marginTop: 16, padding: '10px 16px' }} onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};
