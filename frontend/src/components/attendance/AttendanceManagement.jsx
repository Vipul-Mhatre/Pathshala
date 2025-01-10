import { useState, useEffect } from 'react';
import { getStudents, markAttendance, getAttendanceReport } from '../../api/api';

const AttendanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    standard: '',
    division: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        getStudents(filters),
        getAttendanceReport({ ...filters })
      ]);

      const studentsWithAttendance = studentsRes.data.map(student => {
        const attendance = attendanceRes.data.find(a => a.studentId === student._id);
        return {
          ...student,
          attendance: attendance?.status || 'Absent'
        };
      });

      setStudents(studentsWithAttendance);
    } catch (err) {
      setError('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (studentId, status) => {
    try {
      await markAttendance(studentId, {
        date: filters.date,
        status
      });
      
      // Update local state
      setStudents(students.map(student => 
        student._id === studentId 
          ? { ...student, attendance: status }
          : student
      ));
    } catch (err) {
      setError('Failed to update attendance');
    }
  };

  const exportAttendance = () => {
    const csv = [
      ['Roll No', 'Name', 'Class', 'Division', 'Status'],
      ...students.map(student => [
        student.rollNo,
        student.name,
        student.standard,
        student.division,
        student.attendance
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${filters.date}.csv`;
    a.click();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Management</h1>
        <button
          onClick={exportAttendance}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border rounded p-2"
        />
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

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Division
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student._id}>
                <td className="px-6 py-4 whitespace-nowrap">{student.rollNo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.standard}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.division}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded ${
                    student.attendance === 'Present' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.attendance}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleAttendanceChange(
                      student._id, 
                      student.attendance === 'Present' ? 'Absent' : 'Present'
                    )}
                    className={`px-3 py-1 rounded ${
                      student.attendance === 'Present'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Mark {student.attendance === 'Present' ? 'Absent' : 'Present'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceManagement; 