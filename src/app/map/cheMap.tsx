"use client";

import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React from 'react';

interface MapProps {
    latitude: any;
    longitude: any;
}

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const Map: React.FC<MapProps> = ({ latitude, longitude }) => {
    return (
        <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '350px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[latitude, longitude]}>
                <Popup>Ubicación de la propiedad</Popup>
            </Marker>
        </MapContainer>
    );
};

// prueben que el mapa esta funcionando, la vida me hizo piola, no FrontEnd

export default Map;