import { useState, useEffect } from 'react';
import { getStudents, updateStudentStatus } from '../../api/api';

const StudentStatus = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    standard: '',
    division: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      const response = await getStudents(filters);
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      await updateStudentStatus(studentId, { 
        status: newStatus,
        deviceID: null // This would come from the actual device in production
      });
      
      setStudents(students.map(student => 
        student._id === studentId 
          ? { ...student, studentStatus: { ...student.studentStatus, status: newStatus } }
          : student
      ));
    } catch (err) {
      setError('Failed to update student status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Status Tracking</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">All Statuses</option>
          <option value="At Home">At Home</option>
          <option value="Boarded Bus">Boarded Bus</option>
          <option value="In School">In School</option>
          <option value="Departed Bus">Departed Bus</option>
        </select>
        <select
          value={filters.standard}
          onChange={(e) => setFilters({ ...filters, standard: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">All Classes</option>
          {['Nursery', 'Jr KG', 'Sr KG', '1st', '2nd', '3rd', '4th', '5th', 
            '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(std => (
            <option key={std} value={std}>{std}</option>
          ))}
        </select>
        <select
          value={filters.division}
          onChange={(e) => setFilters({ ...filters, division: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">All Divisions</option>
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(div => (
            <option key={div} value={div}>{div}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {/* Students Status Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student._id}>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.standard} - {student.division}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded ${
                    {
                      'At Home': 'bg-gray-100 text-gray-800',
                      'Boarded Bus': 'bg-yellow-100 text-yellow-800',
                      'In School': 'bg-green-100 text-green-800',
                      'Departed Bus': 'bg-blue-100 text-blue-800'
                    }[student.studentStatus.status]
                  }`}>
                    {student.studentStatus.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(student.tstampStatusUpdated).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    onChange={(e) => handleStatusChange(student._id, e.target.value)}
                    className="border rounded p-1"
                    value={student.studentStatus.status}
                  >
                    <option value="At Home">At Home</option>
                    <option value="Boarded Bus">Boarded Bus</option>
                    <option value="In School">In School</option>
                    <option value="Departed Bus">Departed Bus</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentStatus; 