import { useState, useEffect } from 'react';
import API from '../../api/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const StudentBusTracking = () => {
  const [busLocation, setBusLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusLocation = async () => {
      try {
        const response = await API.get('/students/my-bus-location');
        setBusLocation(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bus location');
        setLoading(false);
      }
    };

    fetchBusLocation();
    const interval = setInterval(fetchBusLocation, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!busLocation) return <div>No bus assigned</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Bus Tracking</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <div style={{ height: '500px' }}>
          <MapContainer
            center={[busLocation.lat, busLocation.lon]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[busLocation.lat, busLocation.lon]}>
              <Popup>
                Bus {busLocation.busNumber}
                <br />
                Last updated: {new Date(busLocation.updatedAt).toLocaleString()}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default StudentBusTracking; 