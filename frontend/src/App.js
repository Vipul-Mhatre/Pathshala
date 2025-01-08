import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Don't import Router here anymore
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ManageStudents from './components/ManageStudents';
import ManageBuses from './components/ManageBuses';
import AttendanceTracking from './components/AttendanceTracking';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/manage-students" element={<ManageStudents />} />
      <Route path="/manage-buses" element={<ManageBuses />} />
      <Route path="/attendance-tracking" element={<AttendanceTracking />} />
    </Routes>
  );
};

export default App;