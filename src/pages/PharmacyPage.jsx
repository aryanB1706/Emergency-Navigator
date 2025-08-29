import CommonDropdown from "../components/CommonDropdown";
import PharmacyMap from "../components/Pharmacy";

export default function Bloodbank() {
  return (
    <div className="min-h-screen p-4">
      
      <CommonDropdown />

      
      <h2 className="text-2xl font-bold mb-4 text-center">
        Nearby Pharmacies
      </h2>

      {/* 🔹 Map */}
      <PharmacyMap />
    </div>
  );
}
