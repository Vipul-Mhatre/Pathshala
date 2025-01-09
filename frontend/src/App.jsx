import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  const ProtectedRoute = ({ children }) => {
    return userRole ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          userRole ? <Navigate to="/dashboard" /> : <Login setUserRole={setUserRole} />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard setUserRole={setUserRole} />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 