import React from 'react';
import { AssignmentList } from '../components/AssignmentList.jsx';
import { ProgressTable } from '../components/ProgressTable.jsx';

// PUBLIC_INTERFACE
export const EmployeePage: React.FC = () => {
  return (
    <div className="container" style={{ padding: 24 }}>
      <h2>Employee Dashboard</h2>
      <AssignmentList />
      <div style={{ marginTop: 24 }}>
        <ProgressTable showActions />
      </div>
    </div>
  );
};
