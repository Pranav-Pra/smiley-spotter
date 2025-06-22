import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

interface Pin {
  lat: number;
  lng: number;
  image?: string; // ✅ Add image property
}

interface MapProps {
  center: LatLngExpression;
  pins?: Pin[];
}

const smileyIcon = L.icon({
  iconUrl: "/circle button.PNG", // ✅ Make sure this is in public/
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function Map({ center, pins = [] }: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins.map((pin, idx) => (
        <Marker key={idx} position={[pin.lat, pin.lng]} icon={smileyIcon}>
          <Popup>
            {pin.image ? (
              <img
                src={pin.image}
                alt="Smiley"
                className="w-32 h-auto rounded"
              />
            ) : (
              "No image"
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}