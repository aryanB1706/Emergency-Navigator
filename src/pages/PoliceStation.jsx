import CommonDropdown from "../components/CommonDropdown";
import PoliceStationMap from "../components/PoliceStationMap";

export default function Bloodbank() {
  return (
    <div className="min-h-screen p-4">
      
      <CommonDropdown />

      
      <h2 className="text-2xl font-bold mb-4 text-center">
        Nearby Police stations
      </h2>

      {/* 🔹 Map */}
      <PoliceStationMap/>
    </div>
  );
}
