import React from 'react';
import { LessonList } from '../components/LessonList.jsx';
import { AssignmentList } from '../components/AssignmentList.jsx';
import { ProgressTable } from '../components/ProgressTable.jsx';

// PUBLIC_INTERFACE
export const HRPage: React.FC = () => {
  return (
    <div className="container" style={{ padding: 24 }}>
      <h2>HR Dashboard</h2>
      <AssignmentList allowCreate />
      <div style={{ marginTop: 24 }}>
        <LessonList />
      </div>
      <div style={{ marginTop: 24 }}>
        <ProgressTable />
      </div>
    </div>
  );
};
