import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { classNames } from '../../utils/classNames';

// Fix for default marker icons
delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export function Map({
  buses,
  center = { lat: 20.5937, lon: 78.9629 }, // Default center of India
  zoom = 5,
  className,
}) {
  return (
    <div className={classNames('h-[500px]', className)}>
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={zoom}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            position={[bus.currentLocation.lat, bus.currentLocation.lon]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">Bus {bus.busNumber}</h3>
                <p className="text-sm text-gray-600">Driver: {bus.driverName}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 