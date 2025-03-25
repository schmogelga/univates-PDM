import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const loadLocations = async () => {
  try {
    const response = await fetch('/locations.json');
    if (!response.ok) {
      throw new Error('Erro ao carregar o arquivo JSON');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar localizações:', error);
    return [];
  }
};

const Map = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await loadLocations();
      setLocations(data); 
    };
    getData();
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <MapContainer center={[37.4219983, -122.084]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {locations.length > 0 ? (
          locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={new L.Icon({
                iconUrl: '/marker.png',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30],
            })}            >
              <Popup>
                <div>
                  <strong>ID:</strong> {location.id} <br />
                  <strong>Latitude:</strong> {location.latitude} <br />
                  <strong>Longitude:</strong> {location.longitude} <br />
                  <strong>Timestamp:</strong> {location.timestamp}
                </div>
              </Popup>
            </Marker>
          ))
        ) : (
          <div>Carregando localizações...</div>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;