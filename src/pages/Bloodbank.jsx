import BloodBankMap from "../components/BloodBankMap";

export default function Bloodbank() {
  return (
    <div className="min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Nearby Blood Banks</h2>
      <BloodBankMap />
    </div>
  );
}
