'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, CheckCircle, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EMSMap } from '@/components/map/ems-map'
import { cn } from '@/lib/utils'
import type { Severity, EmergencyType } from '@/store/useAppStore'
import { DUMMY_RESPONDERS } from '@/lib/dummy-data'

interface DispatchStatusProps {
  isOpen: boolean
  onClose: () => void
  emergencyType: EmergencyType
  severity: Severity
  incidentType: string
}

export function DispatchStatus({
  isOpen,
  onClose,
  emergencyType,
  severity,
  incidentType,
}: DispatchStatusProps) {
  const [eta, setEta] = useState(8) // minutes
  const [vehicleLocation, setVehicleLocation] = useState({ lat: -26.0200, lng: 28.2150 })
  const userLocation = { lat: -26.0067, lng: 28.2260 }

  // Simulate vehicle movement
  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setVehicleLocation((prev) => ({
        lat: prev.lat + (userLocation.lat - prev.lat) * 0.1,
        lng: prev.lng + (userLocation.lng - prev.lng) * 0.1,
      }))

      setEta((prev) => Math.max(0, prev - 0.5))
    }, 3000)

    return () => clearInterval(interval)
  }, [isOpen])

  // Get a random responder based on emergency type
  const responder = DUMMY_RESPONDERS.find((r) =>
    emergencyType === 'medical'
      ? r.department === 'EMS/Ambulance'
      : emergencyType === 'police'
      ? r.department === 'Police/Metro'
      : r.department === 'Fire & Rescue'
  ) || DUMMY_RESPONDERS[0]

  const severityColors = {
    critical: 'bg-critical text-white',
    serious: 'bg-serious text-black',
    minor: 'bg-minor text-white',
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      {/* Map */}
      <div className="flex-1">
        <EMSMap
          height="100%"
          userLocation={userLocation}
          vehicleLocation={vehicleLocation}
          showHospitals
          showClinics={false}
        />

        {/* Header overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-2">
            <div className={cn('px-3 py-1 rounded-full text-sm font-medium', severityColors[severity])}>
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </div>
            <span className="text-white font-medium">{incidentType}</span>
          </div>
        </div>
      </div>

      {/* Bottom card */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-card rounded-t-3xl p-6 shadow-lg"
      >
        {/* Status header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-minor rounded-full flex items-center justify-center">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Help is on the way</h2>
            <p className="text-muted-foreground">
              ETA: <span className="font-medium text-foreground">{Math.ceil(eta)} min</span>
            </p>
          </div>
        </div>

        {/* Responder info */}
        <div className="bg-muted rounded-xl p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-police rounded-full flex items-center justify-center text-white font-bold text-lg">
              {responder.name?.charAt(0)}{responder.surname?.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {responder.name} {responder.surname}
              </p>
              <p className="text-sm text-muted-foreground">{responder.rank} - {responder.department}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Vehicle: GP 456 EMS
              </p>
            </div>
            <button className="w-12 h-12 bg-minor rounded-full flex items-center justify-center hover:bg-minor/90 transition-colors">
              <Phone className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <MapPin className="w-4 h-4" />
          <span>Responding to your current location</span>
        </div>

        {/* Resolve button */}
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full h-12 rounded-xl"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark Emergency Resolved
        </Button>
      </motion.div>
    </motion.div>
  )
}
