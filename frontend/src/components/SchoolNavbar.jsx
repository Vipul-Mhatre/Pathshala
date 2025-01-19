import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SchoolNavbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-indigo-700' : 'hover:bg-indigo-600';
  };

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link 
            to="/attendance-analytics" 
            className={`px-3 py-2 rounded-md transition-colors ${isActive('/attendance-analytics')}`}
          >
            Attendance Analytics
          </Link>
          <Link 
            to="/manage-students" 
            className={`px-3 py-2 rounded-md transition-colors ${isActive('/manage-students')}`}
          >
            Manage Students
          </Link>
          <Link 
            to="/mark-attendance" 
            className={`px-3 py-2 rounded-md transition-colors ${isActive('/mark-attendance')}`}
          >
            Mark Attendance
          </Link>
          <Link 
            to="/manage-buses" 
            className={`px-3 py-2 rounded-md transition-colors ${isActive('/manage-buses')}`}
          >
            Manage Buses
          </Link>
          <Link 
            to="/bus-tracking" 
            className={`px-3 py-2 rounded-md transition-colors ${isActive('/bus-tracking')}`}
          >
            Track Buses
          </Link>
        </div>
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default SchoolNavbar; 