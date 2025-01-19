import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import SchoolNavbar from './SchoolNavbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [isAddingBus, setIsAddingBus] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newBus, setNewBus] = useState({
    busNumber: '',
    deviceID: '',
    driverName: '',
    driverContactNumber: '',
    status: 'Active',
    route: {
      name: '',
      stops: []
    }
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await axios.get('/buses');
      setBuses(response.data);
    } catch (error) {
      setError('Failed to fetch buses');
    }
  };

  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/buses', newBus);
      setBuses([...buses, response.data.bus]);
      setIsAddingBus(false);
      setNewBus({
        busNumber: '',
        deviceID: '',
        driverName: '',
        driverContactNumber: '',
        status: 'Active',
        route: {
          name: '',
          stops: []
        }
      });
      setSuccess('Bus added successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add bus');
    }
  };

  const handleUpdateBus = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/buses/${editingBus._id}`, newBus);
      setBuses(buses.map(bus => 
        bus._id === editingBus._id ? response.data.bus : bus
      ));
      setEditingBus(null);
      setSuccess('Bus updated successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update bus');
    }
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await axios.delete(`/buses/${busId}`);
        setBuses(buses.filter(bus => bus._id !== busId));
        setSuccess('Bus deleted successfully');
      } catch (error) {
        setError('Failed to delete bus');
      }
    }
  };

  return (
    <div>
      <SchoolNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Buses</h1>

        {/* Success and Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add Bus Button */}
        <button
          onClick={() => setIsAddingBus(true)}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add New Bus
        </button>

        {/* Buses Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border p-2">Bus Number</th>
                <th className="border p-2">Driver Name</th>
                <th className="border p-2">Contact Number</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus._id}>
                  <td className="border p-2">{bus.busNumber}</td>
                  <td className="border p-2">{bus.driverName}</td>
                  <td className="border p-2">{bus.driverContactNumber}</td>
                  <td className="border p-2">{bus.status}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => {
                        setEditingBus(bus);
                        setNewBus(bus);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBus(bus._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Bus Modal */}
        {(isAddingBus || editingBus) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">
                {editingBus ? 'Edit Bus' : 'Add New Bus'}
              </h2>
              <form onSubmit={editingBus ? handleUpdateBus : handleAddBus}>
                <div className="mb-4">
                  <label className="block mb-2">Bus Number</label>
                  <input
                    type="text"
                    value={newBus.busNumber}
                    onChange={(e) => setNewBus({...newBus, busNumber: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Device ID</label>
                  <input
                    type="text"
                    value={newBus.deviceID}
                    onChange={(e) => setNewBus({...newBus, deviceID: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Driver Name</label>
                  <input
                    type="text"
                    value={newBus.driverName}
                    onChange={(e) => setNewBus({...newBus, driverName: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Driver Contact Number</label>
                  <input
                    type="text"
                    value={newBus.driverContactNumber}
                    onChange={(e) => setNewBus({...newBus, driverContactNumber: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Status</label>
                  <select
                    value={newBus.status}
                    onChange={(e) => setNewBus({...newBus, status: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingBus(false);
                      setEditingBus(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    {editingBus ? 'Update Bus' : 'Add Bus'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBuses;