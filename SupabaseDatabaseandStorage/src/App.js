import React from 'react';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { HRPage } from './pages/HRPage.jsx';
import { EmployeePage } from './pages/EmployeePage.jsx';

// PUBLIC_INTERFACE
function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <div className="App">
          <nav className="navbar" style={{ padding: 16, display: 'flex', gap: 16 }}>
            <Link to="/">Home</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/hr">HR</Link>
            <Link to="/employee">Employee</Link>
          </nav>
          <div style={{ padding: 16 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/hr" element={<HRPage />} />
              <Route path="/employee" element={<EmployeePage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </RoleProvider>
  );
}

export default App;
