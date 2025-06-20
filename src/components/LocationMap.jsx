import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Distance calculation using OSRM API
const getDistanceAndDuration = async (start, end) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=false`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes?.length > 0) {
      const { distance, duration } = data.routes[0];
      return {
        distance: (distance / 1000).toFixed(2), // km
        duration: (duration / 60).toFixed(0), // mins
      };
    }
  } catch (err) {
    console.error("OSRM API error:", err);
  }
  return null;
};

// Custom icons
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const hospitalIcon = new L.Icon({
  iconUrl:
    "https://img.icons8.com/?size=100&id=rBh1fuOC6Bjx&format=png&color=000000",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -30],
});

// Fix Leaflet marker icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function LocationMap() {
  const [userPosition, setUserPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  const fetchNearbyHospitals = async ([lat, lon]) => {
    const radius = 5000;
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lon});
        way["amenity"="hospital"](around:${radius},${lat},${lon});
        relation["amenity"="hospital"](around:${radius},${lat},${lon});
      );
      out center;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      query
    )}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const userCoords = [lat, lon];

      const locations = await Promise.all(
        data.elements.map(async (el) => {
          const hLat = el.lat || el.center?.lat;
          const hLon = el.lon || el.center?.lon;
          const name = el.tags.name || "Unnamed Hospital";

          let distance = null;
          let duration = null;

          if (hLat && hLon) {
            const result = await getDistanceAndDuration(userCoords, [
              hLat,
              hLon,
            ]);
            distance = result?.distance;
            duration = result?.duration;
          }

          return {
            id: el.id,
            lat: hLat,
            lon: hLon,
            name,
            distance,
            duration,
          };
        })
      );

      setHospitals(locations);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(coords);
        fetchNearbyHospitals(coords);
      },
      (err) => {
        console.error("Location error:", err);
        const fallback = [24.817, 93.9368]; // Imphal fallback
        setUserPosition(fallback);
        fetchNearbyHospitals(fallback);
      }
    );
  }, []);

  if (!userPosition)
    return <p className="text-center">Getting your location...</p>;

  return (
    <div className="h-[500px] w-full">
      <MapContainer
        center={userPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={userPosition} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
        <Circle
          center={userPosition}
          radius={5000} // in meters (5km)
          pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.1 }}
        />

        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.lat, hospital.lon]}
            icon={hospitalIcon}
          >
            <Popup>
              <div>
                <strong>{hospital.name}</strong>
                <br />
                {hospital.distance && hospital.duration && (
                  <>
                    📍 {hospital.distance} km
                    <br />
                    🕒 {hospital.duration} mins
                    <br />
                  </>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userPosition[0]},${userPosition[1]}&destination=${hospital.lat},${hospital.lon}`}
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
