import React from 'react'
import { NavLink } from 'react-router'

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>
              <NavLink to="/" className="hover:text-white transition-colors">Home</NavLink>
            </li>
           
            <li>
              <NavLink to="/emergency" className="hover:text-white transition-colors">Emergency Help</NavLink>
            </li>
            <li>
              <NavLink to="/firstaid" className="hover:text-white transition-colors">First Aid</NavLink>
            </li>
          </ul>
        </div>

        {/* Emergency Numbers */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <h3 className="text-lg font-semibold mb-3">Emergency Numbers</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>
              <span className="font-medium text-white">Ambulance:</span> <span className="font-semibold text-green-400">102</span>
            </li>
            <li>
              <span className="font-medium text-white">Police:</span> <span className="font-semibold text-blue-400">100</span>
            </li>
            <li>
              <span className="font-medium text-white">Fire:</span> <span className="font-semibold text-red-400">101</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <h3 className="text-lg font-semibold mb-3">Contact Info</h3>
          <p className="text-sm text-gray-300">Email: <a href="mailto:aryankumarbndm0@gmail.com" className="underline hover:text-white">aryankumarbndm0@gmail.com</a></p>
          <p className="text-sm text-gray-300">Serving India 24/7</p>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4 flex flex-col items-center gap-2 max-w-7xl mx-auto px-4 text-xs text-gray-400">
        <div className="text-center mb-1">
          {new Date().getFullYear()} Emergency Navigator. All rights reserved.
        </div>
        <div className="text-center">
          Made with <span className="text-red-500">❤️</span> by Aryan
        </div>
      </div>
    </footer>
  )
}
