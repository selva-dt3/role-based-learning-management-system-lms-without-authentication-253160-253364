import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleSelector } from '../components/RoleSelector.jsx';
import { useRole } from '../context/RoleContext.jsx';

// PUBLIC_INTERFACE
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useRole();

  const forward = () => {
    if (role === 'Admin') navigate('/admin');
    else if (role === 'HR') navigate('/hr');
    else navigate('/employee');
  };

  return (
    <div className="container" style={{ padding: 24 }}>
      <h1>Role-Based LMS</h1>
      <p>Select your role to continue.</p>
      <RoleSelector onContinue={forward} />
    </div>
  );
};
