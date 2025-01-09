import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBus = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    busNumber: '',
    deviceID: '',
    driverName: '',
    driverContactNumber: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/buses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/buses');
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding bus');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Bus</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bus Number
          </label>
          <input
            type="text"
            name="busNumber"
            value={formData.busNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Device ID
          </label>
          <input
            type="text"
            name="deviceID"
            value={formData.deviceID}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Driver Name
          </label>
          <input
            type="text"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Driver Contact Number
          </label>
          <input
            type="tel"
            name="driverContactNumber"
            value={formData.driverContactNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Bus
        </button>
      </form>
    </div>
  );
};

export default AddBus; 