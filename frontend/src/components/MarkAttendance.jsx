import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import SchoolNavbar from './SchoolNavbar';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const MarkAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const CLASS_OPTIONS = [
    'Nursery', 'Jr KG', 'Sr KG', 
    '1st', '2nd', '3rd', '4th', '5th', 
    '6th', '7th', '8th', '9th', '10th'
  ];

  const DIVISION_OPTIONS = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    if (selectedClass && selectedDivision) {
      fetchStudents();
    }
  }, [selectedClass, selectedDivision]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/students/class', {
        params: {
          standard: selectedClass,
          division: selectedDivision
        }
      });
      setStudents(response.data.map(student => ({
        ...student,
        isPresent: false
      })));
    } catch (error) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Get array of present student IDs
      const presentStudents = students
        .filter(student => student.isPresent)
        .map(student => student._id);

      const response = await axios.post('/attendance', {
        date: selectedDate,
        standard: selectedClass,
        division: selectedDivision,
        presentStudents,
        status: 'Present'  // Ensure consistent case
      });

      if (response.data && response.data.message) {
        setSuccess(response.data.message);
        
        setTimeout(() => {
          navigate('/attendance-analytics', {
            state: {
              date: selectedDate,
              standard: selectedClass,
              division: selectedDivision
            }
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to mark attendance'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (studentId) => {
    setStudents(students.map(student => 
      student._id === studentId 
        ? { ...student, isPresent: !student.isPresent }
        : student
    ));
  };

  return (
    <div>
      <SchoolNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Class</option>
              {CLASS_OPTIONS.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Division</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Division</option>
              {DIVISION_OPTIONS.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {students.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {students.map(student => (
                <div key={student._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`student-${student._id}`}
                    checked={student.isPresent}
                    onChange={() => toggleAttendance(student._id)}
                    className="h-4 w-4"
                  />
                  <label htmlFor={`student-${student._id}`}>
                    {student.name} (Roll: {student.rollNo})
                  </label>
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 text-white px-4 py-2 rounded ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              {loading ? 'Marking...' : 'Mark Attendance'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance; 