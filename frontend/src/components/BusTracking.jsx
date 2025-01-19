import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import SchoolNavbar from './SchoolNavbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const BusTracking = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [error, setError] = useState('');
  const defaultCenter = [20.5937, 78.9629]; // Center of India

  useEffect(() => {
    fetchBuses();
    const interval = setInterval(fetchBuses, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await axios.get('/buses');
      setBuses(response.data);
    } catch (error) {
      setError('Failed to fetch buses');
    }
  };

  return (
    <div>
      <SchoolNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Bus Tracking</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bus List */}
          <div className="md:col-span-1 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Active Buses</h2>
            <div className="space-y-2">
              {buses.map(bus => (
                <div
                  key={bus._id}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedBus?._id === bus._id
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedBus(bus)}
                >
                  <h3 className="font-medium">Bus {bus.busNumber}</h3>
                  <p className="text-sm text-gray-600">Driver: {bus.driverName}</p>
                  <p className="text-sm text-gray-600">Status: {bus.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="md:col-span-2">
            <MapContainer
              center={defaultCenter}
              zoom={5}
              style={{ height: '600px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {buses.map(bus => (
                bus.currentLocation?.lat && bus.currentLocation?.lon && (
                  <Marker
                    key={bus._id}
                    position={[bus.currentLocation.lat, bus.currentLocation.lon]}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-bold">Bus {bus.busNumber}</h3>
                        <p>Driver: {bus.driverName}</p>
                        <p>Contact: {bus.driverContactNumber}</p>
                        <p>Status: {bus.status}</p>
                        <p>Last Updated: {new Date(bus.currentLocation.lastUpdated).toLocaleString()}</p>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Selected Bus Details */}
        {selectedBus && (
          <div className="mt-4 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Bus Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Bus Number:</strong> {selectedBus.busNumber}</p>
                <p><strong>Driver:</strong> {selectedBus.driverName}</p>
                <p><strong>Contact:</strong> {selectedBus.driverContactNumber}</p>
                <p><strong>Status:</strong> {selectedBus.status}</p>
              </div>
              <div>
                <p><strong>Current Location:</strong></p>
                {selectedBus.currentLocation?.lat && selectedBus.currentLocation?.lon ? (
                  <>
                    <p>Latitude: {selectedBus.currentLocation.lat}</p>
                    <p>Longitude: {selectedBus.currentLocation.lon}</p>
                    <p>Last Updated: {new Date(selectedBus.currentLocation.lastUpdated).toLocaleString()}</p>
                  </>
                ) : (
                  <p>Location not available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusTracking; 