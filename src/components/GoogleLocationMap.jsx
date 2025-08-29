import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
  DirectionsRenderer,
  CircleF,
} from "@react-google-maps/api";
import { Card, CardContent } from "@mui/material";
import { Geolocation } from "@capacitor/geolocation";

const circleOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.2,
};

export default function HospitalMap() {
  const [userPosition, setUserPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [steps, setSteps] = useState([]);
  const [radius, setRadius] = useState(5000);
  const [watchId, setWatchId] = useState(null);

  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your key
    libraries: ["places"],
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 🔹 Get current position using Capacitor Geolocation
  useEffect(() => {
    const getUserPosition = async () => {
      try {
        const position = await Geolocation.getCurrentPosition();
        setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
      } catch (err) {
        console.error("Geolocation error:", err);
        setUserPosition({ lat: 19.076, lng: 72.8777 }); // fallback
      }
    };
    getUserPosition();
  }, []);

  // 🔹 Fetch nearby hospitals
  useEffect(() => {
    if (!userPosition || !isLoaded) return;

    const fetchHospitals = async () => {
      try {
        setLoadingHospitals(true);
        const response = await fetch(
          `https://places.googleapis.com/v1/places:searchText`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
              "X-Goog-FieldMask":
                "places.displayName,places.location,places.formattedAddress,places.rating,places.userRatingCount",
            },
            body: JSON.stringify({
              textQuery: "hospital",
              locationBias: {
                circle: { center: { latitude: userPosition.lat, longitude: userPosition.lng }, radius },
              },
              maxResultCount: 15,
              languageCode: "en",
              rankPreference: "DISTANCE",
            }),
          }
        );
        const data = await response.json();
        if (data.places) setHospitals(data.places);
      } catch (err) {
        console.error("Places API error:", err);
      } finally {
        setLoadingHospitals(false);
      }
    };

    fetchHospitals();
  }, [userPosition, isLoaded, radius]);

  // 🔹 Calculate route and track user
  const calculateRoute = useCallback(
    async (hospital) => {
      if (!userPosition) return;

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userPosition,
          destination: { lat: hospital.location.latitude, lng: hospital.location.longitude },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setDirectionsResponse(result);
            setSelectedHospital(hospital);

            const stepsList = result.routes[0].legs[0].steps.map((step) =>
              step.instructions.replace(/<[^>]+>/g, "")
            );
            setSteps(stepsList);

            if (stepsList.length > 0) speakStep(`Navigating to ${hospital.displayName.text}`);
          }
        }
      );

      // Watch position
      if (watchId) await Geolocation.clearWatch({ id: watchId });
      const id = Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position, err) => {
          if (err) return console.error(err);
          if (!position) return;

          const newPos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserPosition(newPos);

          const dist = getDistance(
            newPos.lat,
            newPos.lng,
            hospital.location.latitude,
            hospital.location.longitude
          );
          if (dist < 100) {
            speakStep("You have reached your destination.");
            Geolocation.clearWatch({ id });
          }
        }
      );
      setWatchId(id);
    },
    [userPosition, watchId]
  );

  const speakStep = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;
  if (!userPosition || !isLoaded) return <div>Loading map...</div>;

  return (
    <div className="flex flex-col md:flex-row w-full h-[90vh] bg-gray-100 p-2 rounded-xl gap-2">
      {/* Map */}
      <div className="w-full md:w-2/3 h-1/2 md:h-full rounded-xl overflow-hidden shadow">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={userPosition || { lat: 19.076, lng: 72.8777 }}
          zoom={13}
          onLoad={onMapLoad}
          options={{ scrollwheel: true, gestureHandling: "greedy" }}
        >
          {userPosition && (
            <>
              <MarkerF position={userPosition} title="You are here" />
              <CircleF center={userPosition} radius={radius} options={circleOptions} />
            </>
          )}

          {hospitals.map((hospital, index) => (
            <MarkerF
              key={index}
              position={{ lat: hospital.location.latitude, lng: hospital.location.longitude }}
              title={hospital.displayName.text}
              onClick={() => calculateRoute(hospital)}
            />
          ))}

          {selectedHospital && (
            <InfoWindowF
              position={{
                lat: selectedHospital.location.latitude,
                lng: selectedHospital.location.longitude,
              }}
              onCloseClick={() => setSelectedHospital(null)}
            >
              <div style={{ maxWidth: "250px", maxHeight: "200px", overflowY: "auto" }}>
                <h4 className="font-bold">{selectedHospital.displayName.text}</h4>
                <p className="text-sm">{selectedHospital.formattedAddress}</p>
              </div>
            </InfoWindowF>
          )}

          {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
      </div>

      {/* List + Radius */}
      <div className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto bg-gray-50 p-4 rounded-xl shadow">
        <div className="mb-4 text-center">
          <label className="font-bold">Search Radius: </label>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="p-2 ml-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2000}>2 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={20000}>20 km</option>
          </select>
        </div>

        <h2 className="text-center text-lg font-semibold mb-2">Nearby Hospitals</h2>
        {loadingHospitals ? (
          <p>Searching hospitals...</p>
        ) : hospitals.length > 0 ? (
          hospitals.map((hospital, idx) => (
            <Card
              key={idx}
              className="mb-3 cursor-pointer shadow hover:shadow-lg transition"
              onClick={() => calculateRoute(hospital)}
            >
              <CardContent>
                <h4 className="font-bold">{hospital.displayName.text}</h4>
                <p className="text-gray-600">{hospital.formattedAddress}</p>
                <p>⭐ {hospital.rating || "N/A"}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No hospitals found</p>
        )}

        {steps.length > 0 && (
          <div className="mt-4 p-3 bg-white rounded-lg shadow max-h-[200px] overflow-y-auto">
            <h3 className="font-bold mb-2">Navigation Steps</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              {steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
