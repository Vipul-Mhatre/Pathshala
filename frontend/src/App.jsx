import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import SuperuserDashboard from './components/dashboard/SuperuserDashboard';
import SchoolDashboard from './components/dashboard/SchoolDashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';
import SchoolManagement from './components/schools/SchoolManagement';
import SchoolDetails from './components/schools/SchoolDetails';
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
import StudentAttendance from './components/attendance/StudentAttendance';
import StudentBusTracking from './components/buses/StudentBusTracking';
import StudentProfile from './components/profile/StudentProfile';

const App = () => {
  const [userType, setUserType] = useState(localStorage.getItem('userType'));

  return (
    <Routes>
      <Route path="/login" element={<Login setUserType={setUserType} />} />
      
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        {/* Default route */}
        <Route index element={
          userType === 'superuser' ? <SuperuserDashboard /> :
          userType === 'school' ? <SchoolDashboard /> :
          <StudentDashboard />
        } />

        {/* Dashboard route */}
        <Route path="dashboard" element={
          userType === 'superuser' ? <SuperuserDashboard /> :
          userType === 'school' ? <SchoolDashboard /> :
          <StudentDashboard />
        } />

        {/* Superuser specific routes */}
        {userType === 'superuser' && (
          <>
            <Route path="schools" element={<SchoolManagement />} />
            <Route path="schools/:id" element={<SchoolDetails />} />
          </>
        )}

        {/* School specific routes */}
        {userType === 'school' && (
          <>
            <Route path="students" element={<StudentList />} />
            <Route path="students/add" element={<AddStudent />} />
            <Route path="students/:id" element={<StudentDetails />} />
            <Route path="students/import" element={<BulkStudentImport />} />
            <Route path="buses" element={<BusList />} />
            <Route path="buses/add" element={<AddBus />} />
            <Route path="buses/:id/tracking" element={<BusTracking />} />
            <Route path="attendance" element={<AttendanceTracking />} />
            <Route path="attendance/export" element={<AttendanceExport />} />
            <Route path="profile" element={<SchoolProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </>
        )}

        {/* Student specific routes */}
        {userType === 'student' && (
          <>
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="bus-tracking" element={<StudentBusTracking />} />
            <Route path="profile" element={<StudentProfile />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

export default App;