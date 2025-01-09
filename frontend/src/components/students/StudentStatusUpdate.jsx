import { useState, useEffect } from 'react';
import axios from 'axios';

const StudentStatusUpdate = ({ studentId, currentStatus, onUpdate }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusOptions = [
    'At Home',
    'Boarded Bus',
    'In School',
    'Departed Bus'
  ];

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/students/${studentId}/status`,
        {
          status: newStatus
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStatus(newStatus);
      if (onUpdate) onUpdate(newStatus);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case 'In School':
        return 'bg-green-100 text-green-800';
      case 'Boarded Bus':
        return 'bg-blue-100 text-blue-800';
      case 'Departed Bus':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Current Status:</span>
        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleStatusChange(option)}
            disabled={loading || status === option}
            className={`px-3 py-1 rounded text-sm ${
              status === option
                ? getStatusColor(option)
                : 'bg-gray-200 hover:bg-gray-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-sm text-gray-500">
          Updating status...
        </div>
      )}
    </div>
  );
};

export default StudentStatusUpdate; 