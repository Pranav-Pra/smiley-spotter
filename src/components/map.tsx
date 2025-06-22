import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

interface MapProps {
  center: LatLngExpression;
  pins?: { lat: number; lng: number }[];
}

const smileyIcon = L.icon({
  iconUrl: "/circle button.PNG", // make sure this file exists in /public
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function Map({ center, pins = [] }: MapProps) {
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins.map((pin, idx) => (
        <Marker key={idx} position={[pin.lat, pin.lng]} icon={smileyIcon} />
      ))}
    </MapContainer>
  );
}