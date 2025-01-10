import { useState, useEffect } from 'react';
import { getBuses } from '../../api/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const BusTracking = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Center map on a default location (can be set to school's location)
  const defaultCenter = [20.5937, 78.9629]; // India's center coordinates

  useEffect(() => {
    fetchBuses();
    const interval = setInterval(fetchBuses, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bus Tracking</h1>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Bus List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Active Buses</h2>
          <div className="space-y-2">
            {buses.map((bus) => (
              <div
                key={bus._id}
                className={`p-3 rounded cursor-pointer ${
                  selectedBus?._id === bus._id
                    ? 'bg-indigo-100 border-indigo-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedBus(bus)}
              >
                <div className="font-medium">{bus.busNumber}</div>
                <div className="text-sm text-gray-600">Driver: {bus.driverName}</div>
                <div className="text-sm text-gray-600">Contact: {bus.driverContactNumber}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="md:col-span-3 bg-white rounded-lg shadow">
          <MapContainer
            center={defaultCenter}
            zoom={5}
            style={{ height: '600px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {buses.map((bus) => (
              bus.currentLocation && (
                <Marker
                  key={bus._id}
                  position={[bus.currentLocation.lat, bus.currentLocation.lon]}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{bus.busNumber}</h3>
                      <p>Driver: {bus.driverName}</p>
                      <p>Contact: {bus.driverContactNumber}</p>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default BusTracking; 