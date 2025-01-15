import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import axios from '../utils/axiosConfig';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceAnalytics, setAttendanceAnalytics] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState(null);
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Predefined class options
  const CLASS_OPTIONS = [
    'Nursery', 'Jr KG', 'Sr KG', 
    '1st', '2nd', '3rd', '4th', '5th', 
    '6th', '7th', '8th', '9th', '10th', 
    '11th', '12th'
  ];

  // Fetch students and attendance data
  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType === 'superuser') {
      navigate('/superuser-dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch students with authentication
        const studentsResponse = await axios.get('/students', {
          headers: { 
            Authorization: token 
          }
        });
        setStudents(studentsResponse.data);

        // If class and date are selected, check attendance
        if (selectedClass && selectedDate) {
          await checkAttendance();
          await fetchAttendanceHistory();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle authentication errors
        if (error.response && error.response.status === 401) {
          // Redirect to login or clear token
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };

    // Only fetch if user is logged in and is a school user
    if (userType === 'school' && token) {
      fetchData();
    }
  }, [selectedClass, selectedDate, userType, token, navigate]);

  // Check if attendance is already recorded
  const checkAttendance = async () => {
    try {
      const response = await axios.get('/attendance', {
        params: { 
          class: selectedClass, 
          date: selectedDate 
        }
      });

      if (response.data.attendanceRecorded) {
        // Attendance already recorded, show analytics
        setAttendanceAnalytics(response.data.analytics);
        setAttendanceData(null);
      } else {
        // No attendance recorded, prepare for manual entry
        setAttendanceData(response.data.students);
        setAttendanceAnalytics(null);
      }
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
  };

  // Fetch attendance history
  const fetchAttendanceHistory = async () => {
    try {
      // Get last 30 days of history
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      const response = await axios.get('/attendance/history', {
        params: {
          class: selectedClass,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }
      });

      setAttendanceHistory(response.data);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
    }
  };

  // Handle attendance submission
  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare attendance data
    const presentStudents = attendanceData
      .filter(student => 
        document.getElementById(`student-${student._id}`).checked
      )
      .map(student => ({
        studentId: student._id,
        rollNo: student.rollNo
      }));

    try {
      const response = await axios.post('/attendance', {
        date: selectedDate,
        class: selectedClass,
        presentStudents: presentStudents
      });

      // Refresh attendance data
      await checkAttendance();
      await fetchAttendanceHistory();
      
      alert('Attendance submitted successfully');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to submit attendance');
    }
  };

  // Render attendance form or analytics
  const renderAttendanceContent = () => {
    // If attendance is already recorded, show analytics
    if (attendanceAnalytics) {
      return (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Attendance Analytics - {selectedClass}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>Total Students: {attendanceAnalytics.totalStudents}</p>
              <p>Present Students: {attendanceAnalytics.presentStudents}</p>
              <p>Absent Students: {attendanceAnalytics.absentStudents}</p>
            </div>
            <div>
              <div>
                <h3 className="font-semibold">Present Students:</h3>
                <ul>
                  {attendanceAnalytics.presentStudentDetails.map(student => (
                    <li key={student.rollNo}>
                      {student.name} (Roll: {student.rollNo})
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">Absent Students:</h3>
                <ul>
                  {attendanceAnalytics.absentStudentDetails.map(student => (
                    <li key={student.rollNo}>
                      {student.name} (Roll: {student.rollNo})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If no attendance recorded, show attendance form
    return (
      <form onSubmit={handleAttendanceSubmit} className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Mark Attendance - {selectedClass}</h2>
        <div className="grid grid-cols-5 gap-4">
          {attendanceData.map(student => (
            <div key={student._id} className="flex items-center">
              <input
                type="checkbox"
                id={`student-${student._id}`}
                className="mr-2"
              />
              <label htmlFor={`student-${student._id}`}>
                {student.name} (Roll: {student.rollNo})
              </label>
            </div>
          ))}
        </div>
        <button 
          type="submit" 
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Attendance
        </button>
      </form>
    );
  };

  // Render attendance history
  const renderAttendanceHistory = () => {
    if (!attendanceHistory) return null;

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Attendance History - {selectedClass}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Total Students</th>
                <th className="px-6 py-3 text-left">Present Students</th>
                <th className="px-6 py-3 text-left">Present Student Names</th>
              </tr>
            </thead>
            <tbody>
              {attendanceHistory.map(record => (
                <tr key={record._id.toISOString()} className="border-t">
                  <td className="px-6 py-4">{format(parseISO(record._id), 'dd MMM yyyy')}</td>
                  <td className="px-6 py-4">{record.totalStudents}</td>
                  <td className="px-6 py-4">{record.presentStudents}</td>
                  <td className="px-6 py-4">
                    <ul>
                      {record.presentStudentNames.map(name => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const SchoolDashboard = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">School Attendance Management</h1>
      
      {/* Logout Button */}
      <button 
        onClick={handleLogout} 
        className="mb-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        {/* Class Dropdown */}
        <select 
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border rounded p-2 flex-1"
        >
          <option value="">Select Class</option>
          {CLASS_OPTIONS.map(className => (
            <option key={className} value={className}>{className}</option>
          ))}
        </select>

        {/* Date Picker */}
        <input 
          type="date"
          value={selectedDate}
          max={format(new Date(), 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded p-2 flex-1"
        />
      </div>

      {/* Attendance Content */}
      {selectedClass && attendanceData && (
        renderAttendanceContent()
      )}

      {/* Attendance History */}
      {selectedClass && attendanceHistory && (
        renderAttendanceHistory()
      )}
    </div>
  );

  return userType === 'school' ? <SchoolDashboard /> : null;
};

export default Dashboard;