import CommonDropdown from "../components/CommonDropdown";
import GoogleLocationMap from "../components/GoogleLocationMap"


export default function Bloodbank() {
  return (
    <div className="min-h-screen p-4">
      
      <CommonDropdown />

      
      <h2 className="text-2xl font-bold mb-4 text-center">
        Nearby Hospitals
      </h2>

      {/* 🔹 Map */}
      <GoogleLocationMap />
    </div>
  );
}
