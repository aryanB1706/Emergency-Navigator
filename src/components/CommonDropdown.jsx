import React from "react";
import { useNavigate, useLocation } from "react-router";

export default function CommonDropdown() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    navigate(e.target.value);
  };

  return (
    <div className="w-full bg-gray-100 py-3 px-4 flex justify-center">
      <select
        value={location.pathname}
        onChange={handleChange}
        className="
          w-full sm:w-1/2 md:w-1/3
          px-3 py-2
          rounded-lg border border-gray-300 
          font-semibold text-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500
          text-sm sm:text-base
        "
      >
        <option value="/nearby-hospital">🏥 Hospital</option>
        <option value="/bloodbank">🩸 Blood Bank</option>
        <option value="/policestation">🚓 Police Station</option>
        <option value="/pharmacy">💊 Pharmacy</option>
      </select>
    </div>
  );
}
