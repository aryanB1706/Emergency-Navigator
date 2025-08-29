import React, { useState } from "react";
import { motion } from "framer-motion";

const firstAidTips = [
  {
    title: "CPR (Cardiopulmonary Resuscitation)",
    description:
      "If a person is not breathing, start chest compressions at 100–120 per minute. Give rescue breaths if trained.",
    video: "https://www.youtube.com/watch?v=cosVBV96E2g",
  },
  {
    title: "Bleeding Control",
    description:
      "Apply firm pressure on the wound with a clean cloth or bandage. Elevate the area if possible.",
    video: "https://www.youtube.com/watch?v=6B_y7e1SKfw",
  },
  {
    title: "Burns",
    description:
      "Cool the burn with running water for at least 10 minutes. Do not apply ice or butter.",
    video: "https://www.youtube.com/watch?v=XJGPzl3ENKo",
  },
  {
    title: "Fractures",
    description:
      "Immobilize the area using a splint or cloth. Avoid moving the injured limb.",
    video: "https://www.youtube.com/watch?v=sPzXAVNVJr0",
  },
  {
    title: "Choking",
    description:
      "Perform the Heimlich maneuver (abdominal thrusts) to help the person dislodge the object.",
    video: "https://www.youtube.com/shorts/1wCCkLD1Vmk",
  },
  {
    title: "Heatstroke",
    description:
      "Move the person to a cool place and apply wet cloths. Provide sips of water if conscious.",
    video: "https://www.youtube.com/watch?v=jvGC_dQJUtE",
  },
  {
    title: "Nosebleed",
    description:
      "Sit the person down and tilt head forward. Pinch the soft part of the nose for 10 minutes.",
    video: "https://www.youtube.com/watch?v=z95eB_fDknQ",
  },
  {
    title: "Poisoning",
    description:
      "Do not induce vomiting. Call emergency services and try to identify the substance.",
    video: "https://www.youtube.com/watch?v=b2ieb8BZJuY",
  },
  {
    title: "Seizures",
    description:
      "Clear the area around the person. Do not restrain them or put anything in their mouth.",
    video: "https://www.youtube.com/watch?v=1SMFUwyEafw",
  },
  {
    title: "Snake Bite",
    description:
      "Keep the bitten area still and lower than the heart. Seek medical help immediately.",
    video: "https://www.youtube.com/watch?v=lLkw4BXa7pQ",
  },
];

function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    // youtube.com/watch?v=ID
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/watch")) {
        return `https://www.youtube.com/embed/${u.searchParams.get("v")}?autoplay=1`;
      }
      // /shorts/ID
      const parts = u.pathname.split("/");
      const id = parts[parts.length - 1];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    // youtu.be/ID
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
  } catch (e) {
    // not a valid URL
  }
  return url;
}

export default function FirstAidCard() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 py-12 px-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-10"
      >
        🩹 First Aid Quick Guide
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {firstAidTips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.45 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          >
            <div className="px-5 py-3 flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-700">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-white">{tip.title}</h3>
            </div>

            <div className="p-5 flex flex-col">
              <p className="text-gray-700 text-sm leading-relaxed">{tip.description}</p>

              {/* WATCH button (guaranteed visible) */}
              {tip.video ? (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      console.log("Opening video:", tip.video);
                      setActiveVideo(tip.video);
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-md font-semibold shadow-md hover:opacity-95 transition"
                  >
                    {/* simple play SVG inline */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v18l15-9L5 3z" />
                    </svg>
                    Watch Video
                  </button>
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-500">No video available</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for video */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden">
            <div className="flex justify-between items-center px-3 py-2 border-b">
              <div className="text-sm font-semibold">Video</div>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div style={{ paddingTop: "56.25%" }} className="relative">
              <iframe
                title="first-aid-video"
                src={toEmbedUrl(activeVideo)}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}