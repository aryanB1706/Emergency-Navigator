import { NavLink } from "react-router";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses =
    "px-4 py-2 rounded transition-colors duration-200 font-semibold text-sm md:text-base block";
  const activeClasses = "bg-red-600 text-white";
  const inactiveClasses = "text-gray-200 hover:bg-red-700 hover:text-white";

  return (
    <nav
      className="bg-black bg-opacity-90 sticky top-0 z-50 shadow-lg"
      style={{ paddingTop: "env(safe-area-inset-top, 20px)" }} // Fix status bar overlap
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-white font-bold text-xl tracking-wide">
          🚨 EM-NAV
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6">
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
            First-aid Cards
          </NavLink>
          <NavLink
            to="/sos"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive
                  ? "bg-red-700 text-white"
                  : "bg-red-600 text-white hover:bg-red-700"
              } px-5`
            }
          >
            🆘 SOS
          </NavLink>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden flex flex-col gap-2 px-4 pb-4 bg-black bg-opacity-95"
          style={{ paddingTop: "env(safe-area-inset-top, 20px)" }} // Same fix
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/emergency"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
            onClick={() => setIsOpen(false)}
          >
            Emergency Help
          </NavLink>
          <NavLink
            to="/firstaid"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
            onClick={() => setIsOpen(false)}
          >
            First-aid Cards
          </NavLink>
          <NavLink
            to="/sos"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive
                  ? "bg-red-700 text-white"
                  : "bg-red-600 text-white hover:bg-red-700"
              } px-5`
            }
            onClick={() => setIsOpen(false)}
          >
            🆘 SOS
          </NavLink>
        </div>
      )}
    </nav>
  );
}
