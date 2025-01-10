import { useState, useEffect } from 'react';
import { getBuses, createBus, updateBusLocation } from '../../api/api';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [newBus, setNewBus] = useState({
    busNumber: '',
    deviceID: '',
    driverName: '',
    driverContactNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await getBuses();
      setBuses(response.data);
    } catch (err) {
      setError('Failed to fetch buses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createBus(newBus);
      setBuses([...buses, response.data]);
      setNewBus({
        busNumber: '',
        deviceID: '',
        driverName: '',
        driverContactNumber: ''
      });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add bus');
    }
  };

  const handleLocationUpdate = async (busId, location) => {
    try {
      await updateBusLocation(busId, location);
      setBuses(buses.map(bus => 
        bus._id === busId 
          ? { ...bus, currentLocation: location }
          : bus
      ));
    } catch (err) {
      setError('Failed to update bus location');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bus Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {showAddForm ? 'Cancel' : 'Add New Bus'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {/* Add Bus Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Bus</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bus Number</label>
              <input
                type="text"
                value={newBus.busNumber}
                onChange={(e) => setNewBus({ ...newBus, busNumber: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Device ID</label>
              <input
                type="text"
                value={newBus.deviceID}
                onChange={(e) => setNewBus({ ...newBus, deviceID: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Driver Name</label>
              <input
                type="text"
                value={newBus.driverName}
                onChange={(e) => setNewBus({ ...newBus, driverName: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Driver Contact</label>
              <input
                type="tel"
                value={newBus.driverContactNumber}
                onChange={(e) => setNewBus({ ...newBus, driverContactNumber: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Bus
            </button>
          </form>
        </div>
      )}

      {/* Buses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bus Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {buses.map((bus) => (
              <tr key={bus._id}>
                <td className="px-6 py-4 whitespace-nowrap">{bus.busNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bus.deviceID}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bus.driverName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bus.driverContactNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {bus.currentLocation ? (
                    `${bus.currentLocation.lat.toFixed(6)}, ${bus.currentLocation.lon.toFixed(6)}`
                  ) : (
                    'No location data'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => window.location.href = `/buses/track/${bus._id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Track
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

export default BusManagement; 