import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    standard: '',
    division: '',
    search: ''
  });
  const fetchStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `http://localhost:5000/api/students?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleStatusUpdate = async (studentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/students/${studentId}/status`,
        {
          status: newStatus,
          deviceID: null // This would come from the actual device in production
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchStudents(); // Refresh the student list
    } catch (error) {
      console.error('Error updating student status:', error);
      // Optionally add error state and display to user
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <select
          name="standard"
          value={filters.standard}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Standards</option>
          {['Nursery', 'Jr KG', 'Sr KG', '1st', '2nd', '3rd', '4th', '5th', 
            '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(std => (
            <option key={std} value={std}>{std}</option>
          ))}
        </select>

        <select
          name="division"
          value={filters.division}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Divisions</option>
          {['A', 'B', 'C', 'D', 'E'].map(div => (
            <option key={div} value={div}>{div}</option>
          ))}
        </select>

        <input
          type="text"
          name="search"
          placeholder="Search by name or roll number"
          value={filters.search}
          onChange={handleFilterChange}
          className="border p-2 rounded flex-grow"
        />
      </div>

      <div className="grid gap-4">
        {students.map(student => (
          <div key={student._id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">{student.name}</h3>
                <p className="text-gray-600">
                  Class: {student.standard} - {student.division} | 
                  Roll No: {student.rollNo}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/students/${student._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleStatusUpdate(student._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Update Status
                </button>
              </div>
            </div>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded text-sm ${
                student.studentStatus.status === 'In School' 
                  ? 'bg-green-100 text-green-800'
                  : student.studentStatus.status === 'Boarded Bus'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {student.studentStatus.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList; 