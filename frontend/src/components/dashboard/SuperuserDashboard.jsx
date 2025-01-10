import { useState, useEffect } from 'react';
import { getSchools } from '../../api/api';

const SuperuserDashboard = () => {
  const [schools, setSchools] = useState([]);
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalBuses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await getSchools();
      setSchools(response.data);
      
      // Calculate stats
      const totalStudents = response.data.reduce((acc, school) => acc + (school.studentCount || 0), 0);
      const totalBuses = response.data.reduce((acc, school) => acc + (school.busCount || 0), 0);
      
      setStats({
        totalSchools: response.data.length,
        totalStudents,
        totalBuses
      });
    } catch (err) {
      setError('Failed to fetch schools');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Superuser Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Schools</h3>
          <p className="text-2xl font-bold">{stats.totalSchools}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold">{stats.totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Buses</h3>
          <p className="text-2xl font-bold">{stats.totalBuses}</p>
        </div>
      </div>

      {/* Schools List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Schools</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schools.map((school) => (
                <tr key={school._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {school.schoolName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {school.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {school.contactNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {school.studentCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {school.busCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => window.location.href = `/schools/${school._id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperuserDashboard; 