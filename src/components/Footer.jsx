import React from "react";
import { NavLink } from "react-router";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-12 pb-6 mt-auto relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-[400px] h-[400px] bg-red-500 rounded-full blur-3xl absolute -top-20 -left-20"></div>
        <div className="w-[300px] h-[300px] bg-indigo-500 rounded-full blur-3xl absolute bottom-0 right-0"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-red-400">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <NavLink to="/" className="hover:text-white transition-colors">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/emergency"
                className="hover:text-white transition-colors"
              >
                Emergency Help
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/firstaid"
                className="hover:text-white transition-colors"
              >
                First Aid
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Emergency Numbers */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-red-400">
            Emergency Numbers
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              🚑 <span className="font-medium text-white">Ambulance:</span>{" "}
              <span className="font-semibold text-green-400">102</span>
            </li>
            <li>
              👮 <span className="font-medium text-white">Police:</span>{" "}
              <span className="font-semibold text-blue-400">100</span>
            </li>
            <li>
              🔥 <span className="font-medium text-white">Fire:</span>{" "}
              <span className="font-semibold text-red-400">101</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-red-400">Contact Info</h3>
          <p className="text-sm text-gray-300 mb-2">
            📧 Email:{" "}
            <a
              href="mailto:aryankumarbndm0@gmail.com"
              className="underline hover:text-white"
            >
              aryankumarbndm0@gmail.com
            </a>
          </p>
          <p className="text-sm text-gray-300">📍 Serving India 24/7</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-xs text-gray-400 relative z-10">
        <p className="mb-1">
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-semibold">
            Emergency Navigator
          </span>
          . All rights reserved.
        </p>
        <p>
          Made with <span className="text-red-500">❤️</span> by{" "}
          <span className="text-white font-semibold">Aryan</span>
        </p>
      </div>
    </footer>
  );
}
