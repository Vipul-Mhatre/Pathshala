import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await API.get('/students/dashboard');
        setStudentData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load student data');
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Info Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">My Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {studentData?.name}</p>
            <p><span className="font-medium">Roll No:</span> {studentData?.rollNo}</p>
            <p><span className="font-medium">Class:</span> {studentData?.standard}</p>
            <p><span className="font-medium">Division:</span> {studentData?.division}</p>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="space-y-2">
            <Link 
              to="/attendance" 
              className="block bg-blue-50 p-3 rounded hover:bg-blue-100"
            >
              View My Attendance
            </Link>
            <Link 
              to="/bus-tracking" 
              className="block bg-blue-50 p-3 rounded hover:bg-blue-100"
            >
              Track My Bus
            </Link>
            <Link 
              to="/profile" 
              className="block bg-blue-50 p-3 rounded hover:bg-blue-100"
            >
              My Profile
            </Link>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Attendance Summary</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Present Days:</span> {studentData?.attendance?.presentDays || 0}</p>
            <p><span className="font-medium">Total Days:</span> {studentData?.attendance?.totalDays || 0}</p>
            <p><span className="font-medium">Attendance Percentage:</span> {studentData?.attendance?.percentage || 0}%</p>
          </div>
        </div>

        {/* Bus Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Bus Information</h2>
          {studentData?.bus ? (
            <div className="space-y-2">
              <p><span className="font-medium">Bus Number:</span> {studentData.bus.busNumber}</p>
              <p><span className="font-medium">Driver:</span> {studentData.bus.driverName}</p>
              <p><span className="font-medium">Driver Contact:</span> {studentData.bus.driverContactNumber}</p>
            </div>
          ) : (
            <p className="text-gray-500">No bus assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 