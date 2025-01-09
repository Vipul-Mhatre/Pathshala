import { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const AttendanceTracking = () => {
  const [attendance, setAttendance] = useState([]);
  const [filters, setFilters] = useState({
    standard: '',
    division: '',
    startDate: new Date(),
    endDate: new Date()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendanceReport();
  }, [filters]);

  const fetchAttendanceReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        ...filters,
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString()
      }).toString();

      const response = await axios.get(
        `http://localhost:5000/api/students/attendance-report?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAttendance(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Convert attendance data to CSV
    const headers = ['Name', 'Roll No', 'Standard', 'Division', 'Present Days', 'Total Days', 'Percentage'];
    const csvData = [
      headers.join(','),
      ...attendance.map(record => [
        record.name,
        record.rollNo,
        record.standard,
        record.division,
        record.presentDays,
        record.totalDays,
        record.percentage.toFixed(2)
      ].join(','))
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance-report.csv';
    a.click();
  };

  return (
    <div className="p-4">
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">Date Range</h3>
          <Calendar
            selectRange={true}
            value={[filters.startDate, filters.endDate]}
            onChange={([start, end]) => setFilters(prev => ({
              ...prev,
              startDate: start,
              endDate: end || start
            }))}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Standard</label>
            <select
              value={filters.standard}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                standard: e.target.value
              }))}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            >
              <option value="">All Standards</option>
              {/* Add standard options */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Division</label>
            <select
              value={filters.division}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                division: e.target.value
              }))}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            >
              <option value="">All Divisions</option>
              {/* Add division options */}
            </select>
          </div>

          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Export to CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Roll No</th>
                <th className="px-4 py-2">Standard</th>
                <th className="px-4 py-2">Division</th>
                <th className="px-4 py-2">Present Days</th>
                <th className="px-4 py-2">Total Days</th>
                <th className="px-4 py-2">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr key={index} className={index % 2 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2">{record.name}</td>
                  <td className="px-4 py-2">{record.rollNo}</td>
                  <td className="px-4 py-2">{record.standard}</td>
                  <td className="px-4 py-2">{record.division}</td>
                  <td className="px-4 py-2">{record.presentDays}</td>
                  <td className="px-4 py-2">{record.totalDays}</td>
                  <td className="px-4 py-2">{record.percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracking; 