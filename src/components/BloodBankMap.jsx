import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

const circleOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.2,
};

export default function BloodBankMap() {
  const [userPosition, setUserPosition] = useState(null);
  const [livePosition, setLivePosition] = useState(null);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [radius, setRadius] = useState(5000);
  const watchId = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // ✨ FIX: Icons are now defined inside the component and memoized
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

  const bankIcon = useMemo(() => {
    if (!isLoaded) return null;
    return {
      url: "data:image/svg+xml;charset=UTF-8," +
           encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EA4335"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm-1 11h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>'),
      scaledSize: new window.google.maps.Size(40, 40),
    };
  }, [isLoaded]);

  const selectedBankIcon = useMemo(() => {
    if (!isLoaded) return null;
    return {
      url: "data:image/svg+xml;charset=UTF-8," +
           encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34A853"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm-1 11h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>'),
      scaledSize: new window.google.maps.Size(50, 50),
    };
  }, [isLoaded]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    const getUserPosition = async () => {
        try {
          const position = await Geolocation.getCurrentPosition();
          setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        } catch (err) {
          console.error("Geolocation error:", err);
          setUserPosition({ lat: 19.076, lng: 72.8777 });
        }
      };
      getUserPosition();
  }, []);

  useEffect(() => {
    if (!userPosition || !isLoaded) return;
    const fetchBloodBanks = async () => {
        try {
          setLoadingBanks(true);
          const response = await fetch(
            `https://places.googleapis.com/v1/places:searchText`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json", "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY, "X-Goog-FieldMask": "places.displayName,places.location,places.formattedAddress,places.rating,places.userRatingCount" },
              body: JSON.stringify({ textQuery: "blood bank", locationBias: { circle: { center: { latitude: userPosition.lat, longitude: userPosition.lng }, radius } }, maxResultCount: 15, languageCode: "en", rankPreference: "DISTANCE" }),
            }
          );
          const data = await response.json();
          if (data.places) setBloodBanks(data.places);
        } catch (err) {
          console.error("Places API error:", err);
        } finally {
          setLoadingBanks(false);
        }
      };
      fetchBloodBanks();
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

  const calculateRoute = useCallback(async (bank) => {
      if (!userPosition || !isLoaded) return;
      const origin = livePosition || userPosition;
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        { origin, destination: { lat: bank.location.latitude, lng: bank.location.longitude }, travelMode: window.google.maps.TravelMode.DRIVING },
        async (result, status) => {
          if (status === "OK" && result) {
            setDirectionsResponse(result);
            setSelectedBank(bank);
            const routeSteps = result.routes[0].legs[0].steps;
            setSteps(routeSteps);
            setCurrentStepIndex(0);
            if (mapRef.current) mapRef.current.fitBounds(result.routes[0].bounds);
            if (routeSteps.length > 0) speakStep(routeSteps[0].instructions);
            if (watchId.current) await Geolocation.clearWatch({ id: watchId.current });
            const id = await Geolocation.watchPosition({ enableHighAccuracy: true }, (position, err) => {
                if (err || !position) return;
                setLivePosition({ lat: position.coords.latitude, lng: position.coords.longitude });
            });
            watchId.current = id;
          }
        }
      );
    }, [userPosition, livePosition, isLoaded]);

  useEffect(() => {
    if (!livePosition || !steps || currentStepIndex >= steps.length) return;
    const currentStep = steps[currentStepIndex];
    const endOfStep = currentStep.end_location;
    const distanceToEnd = getDistance(livePosition.lat, livePosition.lng, endOfStep.lat(), endOfStep.lng());
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
          options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: true }}
        >
          {userPosition && (
            <>
              <MarkerF position={livePosition || userPosition} title="You are here" icon={userIcon} />
              <CircleF center={userPosition} radius={radius} options={circleOptions} />
            </>
          )}
          {bloodBanks.map((bank) => (
            <MarkerF
              key={bank.location.latitude}
              position={{ lat: bank.location.latitude, lng: bank.location.longitude }}
              title={bank.displayName.text}
              onClick={() => calculateRoute(bank)}
              icon={selectedBank?.location.latitude === bank.location.latitude ? selectedBankIcon : bankIcon}
            />
          ))}
          {selectedBank && (
            <InfoWindowF position={{ lat: selectedBank.location.latitude, lng: selectedBank.location.longitude }} onCloseClick={() => setSelectedBank(null)}>
              <div style={{ backgroundColor: 'white', color: 'black', padding: '10px', borderRadius: '5px' }}>
                <h4 className="font-bold">{selectedBank.displayName.text}</h4>
                <p className="text-sm">{selectedBank.formattedAddress}</p>
              </div>
            </InfoWindowF>
          )}
          {directionsResponse && <DirectionsRenderer options={{ suppressMarkers: true, polylineOptions: { strokeColor: '#4285F4', strokeWeight: 6 } }} directions={directionsResponse} />}
        </GoogleMap>
      </div>
      <div className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto bg-gray-50 p-4 rounded-xl shadow">
        <div className="mb-4 text-center">
          <label className="font-bold">Search Radius: </label>
          <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="p-2 ml-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value={2000}>2 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={20000}>20 km</option>
          </select>
        </div>
        <h2 className="text-center text-lg font-semibold mb-2">Nearby Blood Banks</h2>
        {loadingBanks ? (<p>Searching blood banks...</p>) : bloodBanks.length > 0 ? (
          bloodBanks.map((bank, idx) => (
            <Card key={idx} className="mb-3 cursor-pointer shadow hover:shadow-lg transition" onClick={() => calculateRoute(bank)}>
              <CardContent>
                <h4 className="font-bold">{bank.displayName.text}</h4>
                <p className="text-gray-600">{bank.formattedAddress}</p>
                <p>⭐ {bank.rating || "N/A"}</p>
              </CardContent>
            </Card>
          ))
        ) : (<p>No blood banks found</p>)}
        {steps.length > 0 && (
          <div className="mt-4 p-3 bg-white rounded-lg shadow max-h-[200px] overflow-y-auto">
            <h3 className="font-bold mb-2">Navigation Steps</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              {steps.map((s, i) => (
                <li key={i} className={i === currentStepIndex ? 'font-bold text-blue-600' : ''}>
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