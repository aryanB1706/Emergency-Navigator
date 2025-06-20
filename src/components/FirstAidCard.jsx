import React from 'react';

const firstAidTips = [
  {
    title: 'CPR (Cardiopulmonary Resuscitation)',
    description: 'If a person is not breathing, start chest compressions at 100–120 per minute. Give rescue breaths if trained.',
    video: 'https://www.youtube.com/watch?v=cosVBV96E2g',
  },
  {
    title: 'Bleeding Control',
    description: 'Apply firm pressure on the wound with a clean cloth or bandage. Elevate the area if possible.',
    video: 'https://www.youtube.com/watch?v=6B_y7e1SKfw',
  },
  {
    title: 'Burns',
    description: 'Cool the burn with running water for at least 10 minutes. Do not apply ice or butter.',
    video: 'https://www.youtube.com/watch?v=XJGPzl3ENKo',
  },
  {
    title: 'Fractures',
    description: 'Immobilize the area using a splint or cloth. Avoid moving the injured limb.',
    video: 'https://www.youtube.com/watch?v=sPzXAVNVJr0',
  },
  {
    title: 'Choking',
    description: 'Perform the Heimlich maneuver (abdominal thrusts) to help the person dislodge the object.',
    video: 'https://www.youtube.com/shorts/1wCCkLD1Vmk',
  },
  {
    title: 'Heatstroke',
    description: 'Move the person to a cool place and apply wet cloths. Provide sips of water if conscious.',
    video: 'https://www.youtube.com/watch?v=jvGC_dQJUtE',
  },
  {
    title: 'Nosebleed',
    description: 'Sit the person down and tilt head forward. Pinch the soft part of the nose for 10 minutes.',
    video: 'https://www.youtube.com/watch?v=z95eB_fDknQ',
  },
  {
    title: 'Poisoning',
    description: 'Do not induce vomiting. Call emergency services and try to identify the substance.',
    video: 'https://www.youtube.com/watch?v=b2ieb8BZJuY',
  },
  {
    title: 'Seizures',
    description: 'Clear the area around the person. Do not restrain them or put anything in their mouth.',
    video: 'https://www.youtube.com/watch?v=1SMFUwyEafw',
  },
  {
    title: 'Snake Bite',
    description: 'Keep the bitten area still and lower than the heart. Seek medical help immediately.',
    video: 'https://www.youtube.com/watch?v=lLkw4BXa7pQ',
  },
];

export default function FirstAidCard() {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {firstAidTips.map((tip, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-2xl p-5 border-l-4 border-red-500 hover:scale-[1.02] transition-all duration-300"
        >
          <h3 className="text-xl font-bold text-red-600 mb-2">{tip.title}</h3>
          <p className="text-gray-700">{tip.description}</p>
          <a
            href={tip.video}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mt-3 inline-block"
          >
            ▶️ Watch Video
          </a>
        </div>
      ))}
    </div>
  );
}
