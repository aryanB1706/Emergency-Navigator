import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import IndiaMap from '../assets/India-map.svg'; // your tricolor map

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col justify-center items-center min-h-[90vh] bg-gradient-to-br from-white via-blue-50 to-blue-100 py-16 md:py-24 px-4 text-center overflow-hidden">

      {/* India Map Background */}
      <motion.img
        src={IndiaMap}
        alt="India Map"
        className="absolute w-[80%] md:w-[60%] opacity-10 z-0 select-none pointer-events-none mix-blend-multiply"
        animate={{ scale: [1, 1.02, 1], rotate: [0, 0.5, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute w-[400px] h-[400px] bg-red-400 rounded-full blur-3xl -top-20 -left-20"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 60, 0], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute w-[350px] h-[350px] bg-indigo-400 rounded-full blur-3xl bottom-0 -right-20"
        />
      </div>

      {/* Heading */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 relative z-10 leading-snug"
      >
        Stay Safe with <br />
        <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
          Real-Time Emergency Navigator
        </span>{" "}
        <span className="animate-bounce inline-block">🚨</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-base sm:text-lg md:text-xl text-gray-600 mb-12 font-medium max-w-2xl mx-auto px-2 relative z-10"
      >
        Instantly find hospitals 🏥, call ambulances 🚑, or trigger SOS alerts ⚡ — all at your fingertips.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-center items-center gap-5 relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/emergency')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-200 w-full sm:w-auto"
        >
          🚑 Get Help Now
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/firstaid')}
          className="bg-white text-indigo-700 border-2 border-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold shadow-md transition-all duration-200 w-full sm:w-auto"
        >
          📘 Learn More
        </motion.button>
      </motion.div>

      {/* SOS Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-16 flex justify-center relative z-10"
      >
        <motion.button
          onClick={() => navigate('/sos')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative px-12 py-6 rounded-full text-white font-extrabold text-3xl bg-red-600 shadow-2xl border-4 border-white transition-all duration-150 ease-in-out focus:outline-none focus:ring-8 focus:ring-red-400"
        >
          <span className="absolute -inset-2 animate-ping rounded-full bg-red-500 opacity-40 z-0"></span>
          <span className="relative z-10">🚨 SOS</span>
        </motion.button>
      </motion.div>
    </section>
  );
}
