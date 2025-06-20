import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-white to-blue-50 py-24 px-4 text-center overflow-hidden">

      
      <div className="absolute inset-0 flex justify-center items-center opacity-10 z-0">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-[350px] h-[350px] bg-red-400 rounded-full blur-3xl"
        />
      </div>

  
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 relative z-10 flex items-center justify-center gap-2"
      >
        Real-Time Emergency Navigator
        <span className="text-red-600 text-5xl animate-bounce">🚨</span>
      </motion.h1>

      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-lg md:text-xl text-gray-600 mb-10 font-medium"
      >
        Quickly locate help — hospitals, ambulances, or share emergency alerts with ease.
      </motion.p>

     
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="flex flex-wrap justify-center gap-4 relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/emergency')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-200"
        >
          🚑 Get Help Now
        </motion.button>

      
      </motion.div>

     
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
          className="relative px-12 py-6 rounded-full text-white font-extrabold text-3xl bg-red-600 shadow-xl border-4 border-white transition-all duration-150 ease-in-out focus:outline-none focus:ring-8 focus:ring-red-400"
        >
         
          <span className="absolute -inset-2 animate-ping rounded-full bg-red-500 opacity-40 z-0"></span>
          
          <span className="relative z-10">🚨 SOS</span>
        </motion.button>
      </motion.div>
    </section>
  );
}
