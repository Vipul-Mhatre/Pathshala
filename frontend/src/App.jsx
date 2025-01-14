import { Routes, Route, Navigate } from 'react-router-dom';
// import { useState } from 'react';
import Login from './components/auth/Login';
import SuperuserDashboard from './components/dashboard/SuperuserDashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<SuperuserDashboard />} />
      {/* Add more routes for schools and students here */}
    </Routes>
  );
};

export default App;