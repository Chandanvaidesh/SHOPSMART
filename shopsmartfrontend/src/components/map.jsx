import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import assortment from "../assets/icons/assortment.png";

import "leaflet/dist/leaflet.css";

// Shop marker
const assortmentIcon = new L.Icon({
  iconUrl: assortment,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// User marker
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4879/4879882.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Custom cluster icon
const createClusterCustomIcon = (cluster) => {
  return L.divIcon({
    html: `<div style="
      background-color: rgba(0,123,255,0.7);
      color:white;
      border-radius:50%;
      width:50px;
      height:50px;
      display:flex;
      justify-content:center;
      align-items:center;
      font-size:18px;
      font-weight:bold;
      border: 2px solid white;
    ">
      ${cluster.getChildCount()}
    </div>`,
    className: "custom-marker-cluster",
    iconSize: L.point(50, 50, true),
  });
};

function FitBounds({ markers, userLocation, fallbackCenter, fallbackZoom }) {
  const map = useMap();

  useEffect(() => {
    const points = [
      ...markers.filter(m => m.lat && m.lng).map(m => [m.lat, m.lng]),
      ...(userLocation ? [[userLocation.lat, userLocation.lng]] : []),
    ];

    if (points.length === 0) {
      map.setView(fallbackCenter, fallbackZoom);
      return;
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [markers, userLocation, map, fallbackCenter, fallbackZoom]);

  return null;
}

export default function Map({
  center = [12.2958, 76.6394], // fallback Mysuru
  zoom = 12,
  markers = [],
  height = "400px",
}) {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.warn("Location access denied, using fallback", err)
    );
  }, []);

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <FitBounds markers={markers} userLocation={userLocation} fallbackCenter={center} fallbackZoom={zoom} />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon} // ✅ custom cluster icons
        >
          {markers.map((m, i) => (
            <Marker key={`${m.name}-${i}`} position={[m.lat, m.lng]} icon={assortmentIcon}>
              <Popup>
                <strong>{m.name}</strong><br />
                {m.address}<br />
                {userLocation && (
                  <>Distance: {Math.round(L.latLng(userLocation).distanceTo([m.lat, m.lng]) / 1000)} km</>
                )}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
