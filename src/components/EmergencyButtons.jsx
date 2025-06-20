import React from 'react';

export default function EmergencyButtons() {
  const buttons = [
    {
      label: '🚑 Call Ambulance',
      number: '102',
      color: 'bg-red-500',
    },
    {
      label: '🚓 Call Police',
      number: '100',
      color: 'bg-blue-600',
    },
    {
      label: '🔥 Call Fire Brigade',
      number: '101',
      color: 'bg-orange-500',
    },
    {
      label: '🩸 Find Blood Bank (soon)',
      link: '/bloodbank',
      color: 'bg-pink-500',
    },
    {
      label: '🏥 Nearest Hospital',
      link: '/nearby-hospital',
      color: 'bg-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 max-w-xl mx-auto">
      {buttons.map((btn, i) =>
        btn.number ? (
          <a href={`tel:${btn.number}`} key={i}>
            <button
              className={`${btn.color} text-white w-full py-4 rounded-xl text-lg font-semibold shadow-lg hover:opacity-90`}
            >
              {btn.label}
            </button>
          </a>
        ) : (
          <a href={btn.link} key={i}>
            <button
              className={`${btn.color} text-white w-full py-4 rounded-xl text-lg font-semibold shadow-lg hover:opacity-90`}
            >
              {btn.label}
            </button>
          </a>
        )
      )}
    </div>
  );
}
