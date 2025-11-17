import React from 'react';
import { LessonList } from '../components/LessonList.jsx';
import { ProgressTable } from '../components/ProgressTable.jsx';

// PUBLIC_INTERFACE
export const AdminPage: React.FC = () => {
  return (
    <div className="container" style={{ padding: 24 }}>
      <h2>Admin Dashboard</h2>
      <LessonList allowManage />
      <div style={{ marginTop: 24 }}>
        <ProgressTable />
      </div>
    </div>
  );
};
