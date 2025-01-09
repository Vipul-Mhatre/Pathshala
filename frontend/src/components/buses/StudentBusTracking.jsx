import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const StudentBusTracking = () => {
  const [busLocation, setBusLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusLocation = async () => {
      try {
        const response = await API.get('/students/bus-location');
        setBusLocation(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load bus location');
        setLoading(false);
      }
    };

    fetchBusLocation();
    // Set up polling for real-time updates
    const interval = setInterval(fetchBusLocation, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!busLocation) return <div>No bus location data available</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bus Location</h1>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="h-[500px] rounded-lg overflow-hidden">
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
                Last updated: {new Date(busLocation.lastUpdate).toLocaleTimeString()}
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Bus Details</h2>
          <p><span className="font-medium">Bus Number:</span> {busLocation.busNumber}</p>
          <p><span className="font-medium">Driver:</span> {busLocation.driverName}</p>
          <p><span className="font-medium">Contact:</span> {busLocation.driverContactNumber}</p>
          <p><span className="font-medium">Last Updated:</span> {new Date(busLocation.lastUpdate).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentBusTracking; 