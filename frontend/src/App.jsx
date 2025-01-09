import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SchoolDashboard from './components/SchoolDashboard';
import SuperuserDashboard from './components/SuperuserDashboard';

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  // Create a stable callback function for setUserRole
  const handleSetUserRole = useCallback((role) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    return userRole ? children : <Navigate to="/" />;
  };

  const DashboardComponent = () => {
    switch (userRole) {
      case 'school':
        return <SchoolDashboard setUserRole={handleSetUserRole} />;
      case 'superuser':
        return <SuperuserDashboard setUserRole={handleSetUserRole} />;
      default:
        return <Navigate to="/" />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            userRole ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setUserRole={handleSetUserRole} />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardComponent />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 