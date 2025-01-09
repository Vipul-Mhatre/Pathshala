import { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AttendanceExport = () => {
  const [filters, setFilters] = useState({
    startDate: new Date(),
    endDate: new Date(),
    standard: '',
    division: '',
    format: 'csv' // or 'excel'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/students/attendance-export',
        {
          params: {
            ...filters,
            startDate: filters.startDate.toISOString(),
            endDate: filters.endDate.toISOString()
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `attendance_report_${filters.startDate.toISOString().split('T')[0]}_${
          filters.endDate.toISOString().split('T')[0]
        }.${filters.format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError(error.response?.data?.message || 'Error exporting attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Export Attendance Report</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <DatePicker
              selected={filters.startDate}
              onChange={date => setFilters(prev => ({ ...prev, startDate: date }))}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <DatePicker
              selected={filters.endDate}
              onChange={date => setFilters(prev => ({ ...prev, endDate: date }))}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Standard
            </label>
            <select
              value={filters.standard}
              onChange={e => setFilters(prev => ({ ...prev, standard: e.target.value }))}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            >
              <option value="">All Standards</option>
              {/* Add standard options */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Division
            </label>
            <select
              value={filters.division}
              onChange={e => setFilters(prev => ({ ...prev, division: e.target.value }))}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            >
              <option value="">All Divisions</option>
              {/* Add division options */}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Export Format
          </label>
          <select
            value={filters.format}
            onChange={e => setFilters(prev => ({ ...prev, format: e.target.value }))}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          >
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {loading ? 'Exporting...' : 'Export Report'}
        </button>
      </div>
    </div>
  );
};

export default AttendanceExport; 