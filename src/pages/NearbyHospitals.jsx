import LocationMap from '../components/LocationMap';

export default function NearbyHospitals() {
  return (
    <div className="min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Nearby Hospitals</h2>
      <LocationMap  />
    </div>
  );
}
