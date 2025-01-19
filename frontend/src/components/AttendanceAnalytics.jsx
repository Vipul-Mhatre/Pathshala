import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import SchoolNavbar from './SchoolNavbar';
import { format } from 'date-fns';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const AttendanceAnalytics = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState('');
  const [weeklyAttendanceData, setWeeklyAttendanceData] = useState([]);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const navigate = useNavigate();

  const standards = [
    'Nursery', 'Jr KG', 'Sr KG', 
    '1st', '2nd', '3rd', '4th', '5th', 
    '6th', '7th', '8th', '9th', '10th'
  ];

  const divisions = ['A', 'B', 'C', 'D'];

  // Custom colors for charts
  const chartColors = {
    present: '#4CAF50',  // Green
    absent: '#FF5252',   // Red
    unmarked: '#FFA726'  // Orange
  };

  useEffect(() => {
    if (selectedDate && selectedStandard && selectedDivision) {
      fetchAttendanceData();
      fetchWeeklyAttendanceData();
    }
  }, [selectedDate, selectedStandard, selectedDivision]);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get('/attendance/analytics', {
        params: {
          date: selectedDate,
          standard: selectedStandard,
          division: selectedDivision
        }
      });

      setAttendanceData(response.data);
    } catch (error) {
      setError('Failed to fetch attendance data');
    }
  };

  const fetchWeeklyAttendanceData = async () => {
    try {
      const response = await axios.get('/attendance/weekly', {
        params: {
          standard: selectedStandard,
          division: selectedDivision
        }
      });

      // Format dates for display
      const formattedData = response.data.map(item => ({
        ...item,
        date: format(new Date(item.date), 'MMM dd') // Format date as "Jan 01"
      }));

      setWeeklyAttendanceData(formattedData);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
      setError('Failed to fetch weekly attendance data');
    }
  };

  const handleUpdateAttendance = () => {
    setShowUpdateModal(true);
    // Navigate to MarkAttendance component with pre-filled data
    navigate('/mark-attendance', {
      state: {
        date: selectedDate,
        standard: selectedStandard,
        division: selectedDivision,
        isUpdate: true
      }
    });
  };

  const handleExportCSV = async () => {
    try {
      // Get the end date (selected date)
      const endDate = selectedDate;
      
      // Calculate start date (7 days before)
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 6);
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');

      // Make API call to get CSV
      const response = await axios.get('/attendance/export', {
        params: {
          startDate: formattedStartDate,
          endDate,
          standard: selectedStandard,
          division: selectedDivision
        },
        responseType: 'blob' // Important for handling file download
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${selectedStandard}_${selectedDivision}_${formattedStartDate}_to_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      setError('Failed to export attendance data');
      console.error('Export error:', error);
    }
  };

  return (
    <div>
      <SchoolNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Attendance Analytics</h1>

        {/* Filters */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Standard</label>
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Standard</option>
              {standards.map(std => (
                <option key={std} value={std}>{std}</option>
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
              {divisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Export Button */}
        {selectedStandard && selectedDivision && (
          <button
            onClick={handleExportCSV}
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export Attendance (CSV)
          </button>
        )}

        {/* Attendance Marked Alert */}
        {isAttendanceMarked && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
            <div className="flex justify-between items-center">
              <p>
                Attendance for {selectedStandard} - {selectedDivision} on {selectedDate} has already been marked.
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAttendance}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update Attendance
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Data Display */}
        {attendanceData && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Attendance Overview</h2>
            <PieChart width={400} height={400}>
              <Pie
                data={[
                  { 
                    name: 'Present', 
                    count: attendanceData.presentCount, 
                    fill: chartColors.present 
                  },
                  { 
                    name: 'Absent', 
                    count: attendanceData.absentCount, 
                    fill: chartColors.absent 
                  }
                ]}
                cx={200}
                cy={200}
                outerRadius={80}
                dataKey="count"
                nameKey="name"
                label={({ name, count }) => `${name}: ${count}`}
              />
              <Tooltip />
              <Legend />
            </PieChart>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Weekly Attendance</h2>
              <BarChart width={600} height={300} data={weeklyAttendanceData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`${value} students`, name]}
                />
                <Legend />
                <Bar 
                  dataKey="present" 
                  name="Present" 
                  fill={chartColors.present}
                  stackId="a"
                />
                <Bar 
                  dataKey="absent" 
                  name="Absent" 
                  fill={chartColors.absent}
                  stackId="a"
                />
              </BarChart>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <p>Total Students: {attendanceData.totalStudents}</p>
                <p>Present: {attendanceData.presentCount}</p>
                <p>Absent: {attendanceData.absentCount}</p>
                <p>Attendance Rate: {attendanceData.attendanceRate}%</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Student Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Present Students</h3>
                    <ul className="list-disc pl-4">
                      {attendanceData.presentStudents.map(student => (
                        <li key={student._id}>{student.name} (Roll: {student.rollNo})</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Absent Students</h3>
                    <ul className="list-disc pl-4">
                      {attendanceData.absentStudents.map(student => (
                        <li key={student._id}>{student.name} (Roll: {student.rollNo})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceAnalytics; 