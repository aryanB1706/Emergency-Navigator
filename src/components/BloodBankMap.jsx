import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const getDistanceAndDuration = async (start, end) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=false`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const { distance, duration } = data.routes[0];
      return {
        distance: (distance / 1000).toFixed(2),
        duration: (duration / 60).toFixed(0),
      };
    }
  } catch (err) {
    console.error("OSRM API error:", err);
  }
  return null;
};

const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const bloodBankIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/?size=100&id=26115&format=png&color=000000",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -30],
});

export default function BloodBankMap() {
  const [userPosition, setUserPosition] = useState(null);
  const [bloodBanks, setBloodBanks] = useState([]);

  const fetchNearbyBloodBanks = async ([lat, lon]) => {
    const radius = 30000;
    const query = `
      [out:json];
      (
        node["healthcare"="blood_bank"](around:${radius},${lat},${lon});
        node["amenity"="blood_donation"](around:${radius},${lat},${lon});
      );
      out center;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const userCoords = [lat, lon];

      const locations = await Promise.all(
        data.elements.map(async (el) => {
          const bLat = el.lat || el.center?.lat;
          const bLon = el.lon || el.center?.lon;
          const name = el.tags.name || "Unnamed Blood Bank";

          let distance = null;
          let duration = null;

          if (bLat && bLon) {
            const result = await getDistanceAndDuration(userCoords, [bLat, bLon]);
            distance = result?.distance;
            duration = result?.duration;
          }

          return {
            id: el.id,
            lat: bLat,
            lon: bLon,
            name,
            distance,
            duration,
          };
        })
      );

      setBloodBanks(locations);
    } catch (error) {
      console.error("Error fetching blood banks:", error);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(coords);
        fetchNearbyBloodBanks(coords);
      },
      (err) => {
        console.error("Location error:", err);
        const fallback = [24.817, 93.9368];
        setUserPosition(fallback);
        fetchNearbyBloodBanks(fallback);
      }
    );
  }, []);

  if (!userPosition) return <p className="text-center">Getting your location...</p>;

  return (
    <div className="h-[500px] w-full">
      <MapContainer center={userPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={userPosition} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>

        <Circle
          center={userPosition}
          radius={30000}
          pathOptions={{ color: "red", fillColor: "pink", fillOpacity: 0.1 }}
        />

        {bloodBanks.map((bank) => (
          <Marker key={bank.id} position={[bank.lat, bank.lon]} icon={bloodBankIcon}>
            <Popup>
              <div>
                <strong>{bank.name}</strong>
                <br />
                {bank.distance && bank.duration && (
                  <>
                    📍 {bank.distance} km
                    <br />
                    🕒 {bank.duration} mins
                    <br />
                  </>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userPosition[0]},${userPosition[1]}&destination=${bank.lat},${bank.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Navigate
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
