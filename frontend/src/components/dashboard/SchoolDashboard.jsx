import { useState, useEffect } from 'react';
import { getStudents, getBuses, getAttendanceReport } from '../../api/api';

const SchoolDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    totalBuses: 0,
    busesInOperation: 0
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, busesRes, attendanceRes] = await Promise.all([
        getStudents(),
        getBuses(),
        getAttendanceReport({ date: new Date().toISOString().split('T')[0] })
      ]);

      const presentCount = attendanceRes.data.filter(a => a.status === 'Present').length;
      
      setStats({
        totalStudents: studentsRes.data.length,
        presentToday: presentCount,
        totalBuses: busesRes.data.length,
        busesInOperation: busesRes.data.filter(b => b.currentLocation).length
      });

      setRecentAttendance(attendanceRes.data.slice(0, 5));
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">School Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold">{stats.totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Present Today</h3>
          <p className="text-2xl font-bold">{stats.presentToday}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Buses</h3>
          <p className="text-2xl font-bold">{stats.totalBuses}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Buses in Operation</h3>
          <p className="text-2xl font-bold">{stats.busesInOperation}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => window.location.href = '/students/manage'}
          className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Manage Students
        </button>
        <button
          onClick={() => window.location.href = '/buses/manage'}
          className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Manage Buses
        </button>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Recent Attendance</h2>
        </div>
        <div className="p-4">
          {recentAttendance.map((record) => (
            <div key={record._id} className="flex justify-between items-center py-2">
              <span>{record.studentName}</span>
              <span className={`px-2 py-1 rounded ${
                record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {record.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard; 