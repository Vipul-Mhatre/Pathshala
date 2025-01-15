import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SuperuserDashboard from './components/SuperuserDashboard';
import ManageStudents from './components/ManageStudents';
import ManageBuses from './components/ManageBuses';
import AttendanceTracking from './components/AttendanceTracking';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/superuser-dashboard" element={<ProtectedRoute><SuperuserDashboard /></ProtectedRoute>} />
      <Route path="/manage-students" element={<ProtectedRoute><ManageStudents /></ProtectedRoute>} />
      <Route path="/manage-buses" element={<ProtectedRoute><ManageBuses /></ProtectedRoute>} />
      <Route path="/attendance-tracking" element={<ProtectedRoute><AttendanceTracking /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;