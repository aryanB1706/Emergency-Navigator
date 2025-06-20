import React from 'react'
import EmergencyButtons from '../components/EmergencyButtons'

export default function EmergencyHelp() {
  return (
     <div className="py-10 px-4 bg-blue-50">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        🚨 Emergency Dashboard
      </h1>
      <EmergencyButtons />
    </div>
  )
}
