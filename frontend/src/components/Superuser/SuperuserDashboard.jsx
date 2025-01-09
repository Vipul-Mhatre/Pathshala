import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SuperuserDashboard = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalBuses: 0,
    activeSchools: 0
  });
  const [recentSchools, setRecentSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/superuser/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
      setRecentSchools(response.data.recentSchools);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Superuser Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Schools</h3>
          <p className="text-3xl font-bold">{stats.totalSchools}</p>
          <Link to="/schools" className="text-blue-500 text-sm">View all →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Schools</h3>
          <p className="text-3xl font-bold">{stats.activeSchools}</p>
          <span className="text-sm text-gray-500">
            {((stats.activeSchools / stats.totalSchools) * 100).toFixed(1)}% active
          </span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Students</h3>
          <p className="text-3xl font-bold">{stats.totalStudents}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Buses</h3>
          <p className="text-3xl font-bold">{stats.totalBuses}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold mb-4">Recently Added Schools</h3>
        <div className="grid gap-4">
          {recentSchools.map(school => (
            <div key={school._id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{school.schoolName}</h4>
                  <p className="text-sm text-gray-600">{school.email}</p>
                  <p className="text-sm text-gray-500">{school.address}</p>
                </div>
                <Link
                  to={`/schools/${school._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperuserDashboard; 