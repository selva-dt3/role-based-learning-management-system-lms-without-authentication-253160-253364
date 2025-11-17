import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const initialContext = {
  role: null,
  assigneeIdentifier: '',
  setRole: () => {},
  setAssigneeIdentifier: () => {},
};

const RoleContext = createContext(initialContext);

// PUBLIC_INTERFACE
export const RoleProvider = ({ children }) => {
  const [role, setRoleState] = useState(null);
  const [assigneeIdentifier, setAssigneeIdentifierState] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('lms_role');
    const storedAssignee = localStorage.getItem('lms_assignee_identifier') || '';
    if (storedRole === 'Admin' || storedRole === 'HR' || storedRole === 'Employee') {
      setRoleState(storedRole);
    }
    if (storedAssignee) setAssigneeIdentifierState(storedAssignee);
  }, []);

  const setRole = (r) => {
    if (r) {
      localStorage.setItem('lms_role', r);
    } else {
      localStorage.removeItem('lms_role');
    }
    setRoleState(r);
  };

  const setAssigneeIdentifier = (id) => {
    localStorage.setItem('lms_assignee_identifier', id);
    setAssigneeIdentifierState(id);
  };

  const value = useMemo(
    () => ({ role, setRole, assigneeIdentifier, setAssigneeIdentifier }),
    [role, assigneeIdentifier]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

// PUBLIC_INTERFACE
export const useRole = () => useContext(RoleContext);
