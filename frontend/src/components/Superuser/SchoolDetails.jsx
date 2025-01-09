import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SchoolDetails = () => {
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalBuses: 0,
    attendanceToday: {
      present: 0,
      absent: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchoolDetails();
  }, [id]);

  const fetchSchoolDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const [schoolRes, statsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/superuser/schools/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/superuser/schools/${id}/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setSchool(schoolRes.data);
      setStats(statsRes.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching school details');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/superuser/schools/${id}/reset-password`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert(`New password: ${response.data.newPassword}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Error resetting password');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!school) return <div>School not found</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{school.schoolName}</h2>
        <div className="space-x-4">
          <button
            onClick={handleResetPassword}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Reset Password
          </button>
          <Link
            to={`/schools/${id}/edit`}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit School
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Students</h3>
          <p className="text-3xl font-bold">{stats.totalStudents}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Buses</h3>
          <p className="text-3xl font-bold">{stats.totalBuses}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Today's Attendance</h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.attendanceToday.present}/{stats.totalStudents}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4">School Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {school.email}</p>
            <p><span className="font-medium">Contact:</span> {school.contactNumber}</p>
            <p><span className="font-medium">Address:</span> {school.address}</p>
            <p>
              <span className="font-medium">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded ${
                school.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {school.active ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              to={`/schools/${id}/students`}
              className="block bg-gray-50 p-3 rounded hover:bg-gray-100"
            >
              View Students
            </Link>
            <Link
              to={`/schools/${id}/buses`}
              className="block bg-gray-50 p-3 rounded hover:bg-gray-100"
            >
              View Buses
            </Link>
            <Link
              to={`/schools/${id}/attendance`}
              className="block bg-gray-50 p-3 rounded hover:bg-gray-100"
            >
              View Attendance Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetails; 