import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import SchoolDashboard from "./components/SchoolDashboard";

const App = () => {
  const [userRole, setUserRole] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Login setUserRole={setUserRole} />} />
      <Route
        path="/dashboard"
        element={
          userRole === "superuser" ? <Dashboard /> : userRole === "school" ? <SchoolDashboard /> : <Navigate to="/" />
        }
      />
    </Routes>
  );
};

export default App;