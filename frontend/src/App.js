import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AttendanceAnalytics from './components/AttendanceAnalytics';
import ManageStudents from './components/ManageStudents';
import MarkAttendance from './components/MarkAttendance';
import SuperuserDashboard from './components/SuperuserDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ManageBuses from './components/ManageBuses';
import BusTracking from './components/BusTracking';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Navigate to="/attendance-analytics" replace />
        </ProtectedRoute>
      } />
      <Route path="/attendance-analytics" element={
        <ProtectedRoute>
          <AttendanceAnalytics />
        </ProtectedRoute>
      } />
      <Route path="/manage-students" element={
        <ProtectedRoute>
          <ManageStudents />
        </ProtectedRoute>
      } />
      <Route path="/mark-attendance" element={
        <ProtectedRoute>
          <MarkAttendance />
        </ProtectedRoute>
      } />
      <Route path="/superuser-dashboard" element={
        <ProtectedRoute>
          <SuperuserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/manage-buses" element={
        <ProtectedRoute>
          <ManageBuses />
        </ProtectedRoute>
      } />
      <Route path="/bus-tracking" element={
        <ProtectedRoute>
          <BusTracking />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/attendance-analytics" replace />} />
    </Routes>
  );
};

export default App;