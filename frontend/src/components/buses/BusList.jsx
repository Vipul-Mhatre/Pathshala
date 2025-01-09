import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/buses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBuses(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching buses');
    } finally {
      setLoading(false);
    }
  };

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(search.toLowerCase()) ||
    bus.driverName.toLowerCase().includes(search.toLowerCase())
  );
  
// i used random latitude and longitude for demo
  const handleUpdateLocation = async (busId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/buses/${busId}/location`,
        {
          lat: Math.random() * (90 - -90) + -90, // Random latitude for demo
          lon: Math.random() * (180 - -180) + -180 // Random longitude for demo
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchBuses(); // Refresh the bus list
    } catch (error) {
      console.error('Error updating bus location:', error);
      // Optionally add error state and display to user
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by bus number or driver name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <Link
          to="/buses/add"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Bus
        </Link>
      </div>

      <div className="grid gap-4">
        {filteredBuses.map(bus => (
          <div key={bus._id} className="border p-4 rounded shadow bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">Bus Number: {bus.busNumber}</h3>
                <p className="text-gray-600">Driver: {bus.driverName}</p>
                <p className="text-gray-600">Contact: {bus.driverContactNumber}</p>
              </div>
              {bus.currentLocation && (
                <div className="text-sm text-gray-500">
                  Last Location: {bus.currentLocation.lat}, {bus.currentLocation.lon}
                </div>
              )}
              <div className="flex gap-2">
                <Link
                  to={`/buses/${bus._id}/edit`}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleUpdateLocation(bus._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Update Location
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusList; 