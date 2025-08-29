import { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";

export default function SOS() {
  const [locationURL, setLocationURL] = useState("Getting location...");

  // Function to fetch current location using Capacitor
  const fetchLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setLocationURL(`https://maps.google.com/?q=${lat},${lon}`);
    } catch (err) {
      console.error("Geolocation error:", err);
      setLocationURL("Location not available");
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleClick = () => {
    const message = `🚨 Emergency! I need help. Here is my location: ${locationURL}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-6 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-red-700">🚨 SOS Alert</h1>

      <p className="text-center text-gray-700">
        Your current location will be sent to your emergency contacts.
      </p>

      <button
        onClick={handleClick}
        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-8 py-4 rounded-full shadow-lg border-4 border-white animate-pulse"
      >
        📍 Send Location via WhatsApp
      </button>
    </div>
  );
}
