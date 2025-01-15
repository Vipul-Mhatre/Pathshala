import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';

// Layouts
import SuperuserLayout from './layouts/SuperuserLayout';
import SchoolLayout from './layouts/SchoolLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';

// Superuser Pages
import SuperuserDashboard from './pages/superuser/DashboardPage';
import SchoolsListPage from './pages/superuser/SchoolsListPage';
import SchoolDetailsPage from './pages/superuser/SchoolDetailsPage';

// School Pages
import SchoolDashboard from './pages/school/DashboardPage';
import StudentsPage from './pages/school/StudentsPage';
import StudentDetailsPage from './pages/school/StudentDetailsPage';
import BusesPage from './pages/school/BusesPage';
import BusDetailsPage from './pages/school/BusDetailsPage';
import AttendancePage from './pages/school/AttendancePage';
import BusTrackingPage from './pages/school/BusTrackingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children, role }) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Superuser Routes */}
        <Route
          element={
            <ProtectedRoute role="superuser">
              <SuperuserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/superuser" element={<SuperuserDashboard />} />
          <Route path="/superuser/schools" element={<SchoolsListPage />} />
          <Route path="/superuser/schools/:id" element={<SchoolDetailsPage />} />
        </Route>

        {/* School Routes */}
        <Route
          element={
            <ProtectedRoute role="school">
              <SchoolLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/school" element={<SchoolDashboard />} />
          <Route path="/school/students" element={<StudentsPage />} />
          <Route path="/school/students/:id" element={<StudentDetailsPage />} />
          <Route path="/school/buses" element={<BusesPage />} />
          <Route path="/school/buses/:id" element={<BusDetailsPage />} />
          <Route path="/school/attendance" element={<AttendancePage />} />
          <Route path="/school/bus-tracking" element={<BusTrackingPage />} />
        </Route>

        {/* Default Route */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                user?.role === 'superuser'
                  ? '/superuser'
                  : user?.role === 'school'
                  ? '/school'
                  : '/login'
              }
              replace
            />
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;