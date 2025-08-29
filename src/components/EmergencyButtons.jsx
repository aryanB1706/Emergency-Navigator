import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

export default function EmergencyButtons() {
  const navigate = useNavigate();

  const buttons = [
    { label: '🩸 Find Blood Bank', link: '/bloodbank', color: 'from-pink-500 to-pink-700' },
    { label: '🏥 Nearest Hospital', link: '/nearby-hospital', color: 'from-green-600 to-green-800' },
    { label: '💊 Nearest Pharmacy', link: '/pharmacy', color: 'from-teal-500 to-teal-700' },
    { label: '🚔 Find Police Station', link: '/policestation', color: 'from-indigo-600 to-indigo-800' },
    { label: '🚑 Call Ambulance', number: '102', color: 'from-red-500 to-red-700' },
    { label: '🚓 Call Police', number: '100', color: 'from-blue-600 to-blue-800' },
    { label: '🔥 Call Fire Brigade', number: '101', color: 'from-orange-500 to-orange-700' },
    { label: '👩‍🦰 Women Helpline', number: '1091', color: 'from-pink-600 to-pink-800' },
    { label: '🌪 Disaster Management', number: '108', color: 'from-yellow-500 to-yellow-700' },
    { label: '☣️ Poison Helpline', number: '1800116117', color: 'from-purple-600 to-purple-800' },
    
  ];

  return (
    <section className="min-h-[85vh] flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
    

      {/* Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {buttons.map((btn, i) => {
          const content = (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-br ${btn.color} text-white w-full py-6 px-4 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-300 relative overflow-hidden`}
            >
              <span className="relative z-10">{btn.label}</span>
              {/* Subtle Glow */}
              <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-all duration-300"></span>
            </motion.button>
          );

          return btn.number ? (
            <a href={`tel:${btn.number}`} key={i}>
              {content}
            </a>
          ) : (
            <div key={i} onClick={() => navigate(btn.link)}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
