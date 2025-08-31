import { useState, useRef } from "react";
import { Geolocation } from "@capacitor/geolocation";

export default function SOS() {
  // State for the text-based SOS
  const [isLoading, setIsLoading] = useState(false);

  // ✨ 1. New states for voice recording
  const [permission, setPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [stream, setStream] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  // --- Original Text SOS Function ---
  const handleTextSOSClick = async () => {
    setIsLoading(true);
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const locationURL = `https://maps.google.com/?q=$${lat},${lon}`;
      const message = `🚨 Emergency! I need help. Here is my current location: ${locationURL}`;
      const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, "_blank");
    } catch (err) {
      console.error("Geolocation error:", err);
      alert("Could not get your location. Please make sure location services are enabled and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- New Voice SOS Functions ---

  // ✨ 2. Function to get microphone permission
  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  // ✨ 3. Functions to start and stop recording
  const startRecording = () => {
    setIsRecording(true);
    setAudioBlob(null); // Clear previous recording
    const media = new MediaRecorder(stream, { type: "audio/webm" });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    audioChunks.current = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined" || event.data.size === 0) return;
      audioChunks.current.push(event.data);
    };
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      setAudioBlob(blob);
      audioChunks.current = [];
    };
  };

  // ✨ 4. Function to share the recorded voice message and location
  const handleVoiceSOS = async () => {
    if (!audioBlob) {
      alert("Please record a voice message first.");
      return;
    }
    
    setIsLoading(true); // Reuse loading state for feedback
    let locationURL = "Location not available";
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      locationURL = `https://maps.google.com/?q=$19.076,72.8777${position.coords.latitude},${position.coords.longitude}`;
    } catch (err) {
      console.error("Could not get location for voice SOS:", err);
    }

    const message = `🚨 Emergency Voice Message! I need help. My location: ${locationURL}`;
    const audioFile = new File([audioBlob], "sos-recording.webm", { type: audioBlob.type });

    // Use the Web Share API to send the file and text
    if (navigator.canShare && navigator.canShare({ files: [audioFile] })) {
      try {
        await navigator.share({
          text: message,
          files: [audioFile],
          title: "Emergency SOS",
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing files is not supported on this browser.");
    }
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-4 py-10 space-y-6">
      <div className="w-full max-w-md text-center p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-red-700">🚨 SOS Alert</h1>
        <p className="mt-2 text-gray-600">
          Send your location to an emergency contact.
        </p>
        <button
          onClick={handleTextSOSClick}
          disabled={isLoading}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-6 py-3 rounded-full shadow-lg border-4 border-white transition-opacity duration-300 disabled:opacity-70 disabled:cursor-not-allowed animate-pulse disabled:animate-none"
        >
          {isLoading ? "Getting location..." : "📍 Send Location via WhatsApp"}
        </button>
      </div>

      <hr className="w-full max-w-md border-t-2 border-gray-300" />

      {/* --- Voice SOS Section --- */}
      <div className="w-full max-w-md text-center p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-red-700">🎤 Voice SOS</h2>
        <p className="mt-2 text-gray-600">
          Record a short voice message to send with your location.
        </p>
        
        {!permission ? (
          <button onClick={getMicrophonePermission} className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded">
            Enable Microphone
          </button>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="flex justify-center gap-4">
              <button onClick={startRecording} disabled={isRecording} className="bg-green-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                Start
              </button>
              <button onClick={stopRecording} disabled={!isRecording} className="bg-red-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                Stop
              </button>
            </div>
            {isRecording && <p className="text-red-500 animate-pulse">Recording...</p>}
            
            {audioBlob && (
              <div className="space-y-4">
                <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
                <button
                  onClick={handleVoiceSOS}
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-6 py-3 rounded-full shadow-lg border-4 border-white transition-opacity duration-300 disabled:opacity-70"
                >
                  {isLoading ? "Getting location..." : "🔊 Send Voice SOS"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}