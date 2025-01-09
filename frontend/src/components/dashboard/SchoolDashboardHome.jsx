import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SchoolDashboardHome = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalBuses: 0,
    presentToday: 0,
    absentToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/schools/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Students</h3>
          <p className="text-3xl font-bold">{stats.totalStudents}</p>
          <Link to="/students" className="text-blue-500 text-sm">View all →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Buses</h3>
          <p className="text-3xl font-bold">{stats.totalBuses}</p>
          <Link to="/buses" className="text-blue-500 text-sm">View all →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Present Today</h3>
          <p className="text-3xl font-bold text-green-600">{stats.presentToday}</p>
          <Link to="/attendance" className="text-blue-500 text-sm">View details →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Absent Today</h3>
          <p className="text-3xl font-bold text-red-600">{stats.absentToday}</p>
          <Link to="/attendance" className="text-blue-500 text-sm">View details →</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link 
              to="/students/add" 
              className="block bg-blue-50 p-3 rounded hover:bg-blue-100"
            >
              Add New Student
            </Link>
            <Link 
              to="/buses/add" 
              className="block bg-blue-50 p-3 rounded hover:bg-blue-100"
            >
              Add New Bus
            </Link>
            <Link 
              to="/attendance" 
              className="block bg-blue-50 p-3 rounded hover:bg-blue-100"
            >
              View Attendance Report
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4">Recent Updates</h3>
          <div className="space-y-4">
            {stats.recentUpdates?.map((update, index) => (
              <div key={index} className="border-b pb-2">
                <p className="text-sm">{update.message}</p>
                <span className="text-xs text-gray-500">
                  {new Date(update.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboardHome; 