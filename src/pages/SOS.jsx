import { useEffect,useState } from "react"
import VoiceSos from "../components/VoiceSos";

export default function SOS() {
  const [locationURL,setLocationURL]=useState("Getting location...");

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition((pos)=>{
      const lat=pos.coords.latitude;
      const lon=pos.coords.longitude;
      setLocationURL(`https://maps.google.com/?q=${lat},${lon}`);
    },
    () => setLocationURL("Location not available")
  );
  },[]);

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

      <div className="border-t-2 border-gray-300 w-1/2 my-6"></div>

      <VoiceSos locationURL={locationURL} />
    </div>
  )
}
