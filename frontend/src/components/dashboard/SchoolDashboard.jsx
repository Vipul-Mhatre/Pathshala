import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const SchoolDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalBuses: 0,
    presentToday: 0,
    absentToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchoolStats = async () => {
      try {
        const response = await API.get('/schools/stats');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        setLoading(false);
      }
    };

    fetchSchoolStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">School Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Total Students</h2>
          <p className="text-3xl font-bold">{stats.totalStudents}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Total Buses</h2>
          <p className="text-3xl font-bold">{stats.totalBuses}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Present Today</h2>
          <p className="text-3xl font-bold text-green-600">{stats.presentToday}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Absent Today</h2>
          <p className="text-3xl font-bold text-red-600">{stats.absentToday}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
              Add New Student
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
              Mark Attendance
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
              View Bus Locations
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            <p className="text-gray-500">No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard; 