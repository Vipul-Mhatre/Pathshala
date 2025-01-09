import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import LogoutButton from './LogoutButton';

const SuperuserDashboard = ({ setUserRole }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/superuser/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Superuser Dashboard</h1>
            </div>
            <div className="flex items-center">
              <LogoutButton setUserRole={setUserRole} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {dashboardData && (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 mb-6">
              <h2 className="text-lg font-medium mb-4">System Statistics</h2>
              <p>Total Schools: {dashboardData.stats.schoolsCount}</p>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4">Registered Schools</h2>
              <div className="grid gap-4">
                {dashboardData.schools.map((school) => (
                  <div key={school._id} className="border p-4 rounded">
                    <h3 className="font-medium">{school.name}</h3>
                    <p className="text-gray-600">{school.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

SuperuserDashboard.propTypes = {
  setUserRole: PropTypes.func.isRequired
};

export default SuperuserDashboard; 