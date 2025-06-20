import { useState, useRef } from "react";

export default function VoiceSos() {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("Idle");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      setStatus("Requesting microphone...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setStatus("Processing recording...");
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];
        const audioUrl = URL.createObjectURL(blob);

        // Try getting location (but don’t wait for it before opening WhatsApp)
        let locationURL = "Location not available";
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            locationURL = `https://maps.google.com/?q=${lat},${lon}`;
          },
          (error) => {
            console.warn("Location error:", error);
          }
        );

        const message = `🚨 *EMERGENCY SOS*\nI'm in danger!\n📍 Location: ${locationURL}\n🎙️ Voice Message: ${audioUrl}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

        window.open(whatsappUrl, "_blank");
        setStatus("WhatsApp opened.");
      };

      mediaRecorder.start();
      setRecording(true);
      setStatus("Recording...");

      setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
      }, 8000);
    } catch (err) {
      console.error("Recording error:", err);
      setStatus("Error accessing microphone.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl text-center space-y-4">
      <h2 className="text-2xl font-bold text-red-600">🎙️ Voice SOS</h2>
      <p className="text-gray-600">Record voice + send location via WhatsApp</p>
      <button
        onClick={startRecording}
        disabled={recording}
        className={`px-6 py-3 rounded-full text-white font-bold ${
          recording ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {recording ? "Recording..." : "Start Recording"}
      </button>
      <p className="text-sm text-gray-500">{status}</p>
    </div>
  );
}
