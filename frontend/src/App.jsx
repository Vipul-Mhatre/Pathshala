import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Components
import Login from './components/auth/Login';

// School Components
import SchoolDashboardHome from './components/dashboard/SchoolDashboardHome';
import StudentList from './components/students/StudentList';
import AddStudent from './components/students/AddStudent';
import StudentDetails from './components/students/StudentDetails';
import BulkStudentImport from './components/students/BulkStudentImport';
import BusList from './components/buses/BusList';
import AddBus from './components/buses/AddBus';
import BusTracking from './components/buses/BusTracking';
import AttendanceTracking from './components/attendance/AttendanceTracking';
import AttendanceExport from './components/attendance/AttendanceExport';
import SchoolProfile from './components/profile/SchoolProfile';
import ChangePassword from './components/profile/ChangePassword';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('userType');
    if (token && type) {
      setIsAuthenticated(true);
      setUserType(type);
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setIsAuthenticated={setIsAuthenticated} setUserType={setUserType} />
      } />

      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<SchoolDashboardHome />} />
        
        {/* Student Routes */}
        <Route path="students" element={<StudentList />} />
        <Route path="students/add" element={<AddStudent />} />
        <Route path="students/:id" element={<StudentDetails />} />
        <Route path="students/import" element={<BulkStudentImport />} />
        
        {/* Bus Routes */}
        <Route path="buses" element={<BusList />} />
        <Route path="buses/add" element={<AddBus />} />
        <Route path="buses/tracking" element={<BusTracking />} />
        
        {/* Attendance Routes */}
        <Route path="attendance" element={<AttendanceTracking />} />
        <Route path="attendance/export" element={<AttendanceExport />} />
        
        {/* Profile Routes */}
        <Route path="profile" element={<SchoolProfile />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;