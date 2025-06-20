import { NavLink } from "react-router";
import React from "react";

export default function Navbar() {
  const linkClasses = "px-4 py-2 rounded transition-colors duration-200 font-semibold text-sm md:text-base";
  const activeClasses = "bg-red-600 text-white";
  const inactiveClasses = "text-gray-200 hover:bg-red-700 hover:text-white";

  return (
    <nav className="bg-black bg-opacity-90 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-white font-bold text-xl tracking-wide">🚨 EM-NAV</div>

        {/* Links */}
        <div className="flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Home
          </NavLink>

         

          <NavLink
            to="/emergency"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Emergency Help
          </NavLink>
          <NavLink
            to="/firstaid"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            First-aid cards
          </NavLink>

          <NavLink
            to="/sos"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-red-700 text-white" : "bg-red-600 text-white hover:bg-red-700"} px-5`
            }
          >
            🆘 SOS
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
