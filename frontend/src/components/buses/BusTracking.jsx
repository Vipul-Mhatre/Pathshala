import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon path issues
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const BusTracking = ({ busId }) => {
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusLocation = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/buses/${busId}/location`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setBus(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching bus location');
      } finally {
        setLoading(false);
      }
    };

    fetchBusLocation();
    // Set up real-time updates
    const interval = setInterval(fetchBusLocation, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [busId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!bus) return <div>Bus not found</div>;

  return (
    <div className="h-[500px] w-full">
      <MapContainer
        center={[bus.currentLocation.lat, bus.currentLocation.lon]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[bus.currentLocation.lat, bus.currentLocation.lon]}>
          <Popup>
            <div>
              <h3 className="font-bold">Bus {bus.busNumber}</h3>
              <p>Driver: {bus.driverName}</p>
              <p>Contact: {bus.driverContactNumber}</p>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(bus.updatedAt).toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default BusTracking; 