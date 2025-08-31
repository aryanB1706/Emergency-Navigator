import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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

// Custom dark, high-contrast map theme
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

// Updated circle options to blue for hospitals
const circleOptions = {
  strokeColor: "#4285F4",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#4285F4",
  fillOpacity: 0.2,
};

export default function HospitalMap() {
  const [userPosition, setUserPosition] = useState(null);
  const [livePosition, setLivePosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [radius, setRadius] = useState(5000);
  const watchId = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // ✨ Icons defined inside the component to prevent race condition
  const userIcon = useMemo(() => {
    if (!isLoaded) return null;
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: "#4285F4",
      fillOpacity: 1,
      strokeColor: "white",
      strokeWeight: 2,
    };
  }, [isLoaded]);

  const hospitalIcon = useMemo(() => {
    if (!isLoaded) return null;
    return {
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="#EA4335"><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>'
        ),
      scaledSize: new window.google.maps.Size(40, 40),
    };
  }, [isLoaded]);

  const selectedHospitalIcon = useMemo(() => {
    if (!isLoaded) return null;
    return {
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="#34A853"><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>'
        ),
      scaledSize: new window.google.maps.Size(50, 50),
    };
  }, [isLoaded]);

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
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const getUserPosition = async () => {
      try {
        const position = await Geolocation.getCurrentPosition();
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (err) {
        console.error("Geolocation error:", err);
        setUserPosition({ lat: 24.817, lng: 93.9368 }); // Fallback to Imphal
      }
    };
    getUserPosition();
  }, []);

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
                circle: {
                  center: {
                    latitude: userPosition.lat,
                    longitude: userPosition.lng,
                  },
                  radius,
                },
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

  useEffect(() => {
    return () => {
      if (watchId.current) {
        Geolocation.clearWatch({ id: watchId.current });
      }
    };
  }, []);

  const speakStep = (text) => {
    const cleanText = text.replace(/<[^>]+>/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const calculateRoute = useCallback(
    async (hospital) => {
      if (!userPosition || !isLoaded) return;
      const origin = livePosition || userPosition;
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination: {
            lat: hospital.location.latitude,
            lng: hospital.location.longitude,
          },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        async (result, status) => {
          if (status === "OK" && result) {
            setDirectionsResponse(result);
            setSelectedHospital(hospital);
            const routeSteps = result.routes[0].legs[0].steps;
            setSteps(routeSteps);
            setCurrentStepIndex(0);
            if (mapRef.current)
              mapRef.current.fitBounds(result.routes[0].bounds);
            if (routeSteps.length > 0) speakStep(routeSteps[0].instructions);
            if (watchId.current)
              await Geolocation.clearWatch({ id: watchId.current });
            const id = await Geolocation.watchPosition(
              { enableHighAccuracy: true },
              (position, err) => {
                if (err || !position) return;
                setLivePosition({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });
              }
            );
            watchId.current = id;
          }
        }
      );
    },
    [userPosition, livePosition, isLoaded]
  );

  useEffect(() => {
    if (!livePosition || !steps || currentStepIndex >= steps.length) return;
    const currentStep = steps[currentStepIndex];
    const endOfStep = currentStep.end_location;
    const distanceToEnd = getDistance(
      livePosition.lat,
      livePosition.lng,
      endOfStep.lat(),
      endOfStep.lng()
    );
    if (distanceToEnd < 20) {
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < steps.length) {
        const nextStep = steps[nextStepIndex];
        speakStep(nextStep.instructions);
        setCurrentStepIndex(nextStepIndex);
      } else {
        speakStep("You have arrived at your destination.");
        if (watchId.current) {
          Geolocation.clearWatch({ id: watchId.current });
          watchId.current = null;
        }
      }
    }
  }, [livePosition, steps, currentStepIndex]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded || !userPosition) return <div>Loading map...</div>;

  return (
    <div className="flex flex-col md:flex-row w-full h-[90vh] bg-gray-100 p-2 rounded-xl gap-2">
      <div className="w-full md:w-2/3 h-1/2 md:h-full rounded-xl overflow-hidden shadow">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={userPosition}
          zoom={13}
          onLoad={onMapLoad}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            fullscreenControl: true, // <-- ADD THIS LINE
            gestureHandling: "greedy", // <-- AND THIS LINE
          }}
        >
          {userPosition && (
            <>
              <MarkerF
                position={livePosition || userPosition}
                title="You are here"
                icon={userIcon}
              />
              <CircleF
                center={userPosition}
                radius={radius}
                options={circleOptions}
              />
            </>
          )}
          {hospitals.map((hospital) => (
            <MarkerF
              key={hospital.location.latitude}
              position={{
                lat: hospital.location.latitude,
                lng: hospital.location.longitude,
              }}
              title={hospital.displayName.text}
              onClick={() => calculateRoute(hospital)}
              icon={
                selectedHospital?.location.latitude ===
                hospital.location.latitude
                  ? selectedHospitalIcon
                  : hospitalIcon
              }
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
              <div
                style={{
                  backgroundColor: "white",
                  color: "black",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <h4 className="font-bold">
                  {selectedHospital.displayName.text}
                </h4>
                <p className="text-sm">{selectedHospital.formattedAddress}</p>
              </div>
            </InfoWindowF>
          )}
          {directionsResponse && (
            <DirectionsRenderer
              options={{
                suppressMarkers: true,
                polylineOptions: { strokeColor: "#4285F4", strokeWeight: 6 },
              }}
              directions={directionsResponse}
            />
          )}
        </GoogleMap>
      </div>
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
        <h2 className="text-center text-lg font-semibold mb-2">
          Nearby Hospitals
        </h2>
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
                <li
                  key={i}
                  className={
                    i === currentStepIndex ? "font-bold text-blue-600" : ""
                  }
                >
                  {s.instructions.replace(/<[^>]+>/g, "")} ({s.distance.text})
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
