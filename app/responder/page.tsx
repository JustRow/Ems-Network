'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, MapPin, Clock } from 'lucide-react'
import { MobileShell } from '@/components/shell/mobile-shell'
import { EMSMap } from '@/components/map/ems-map'
import { DutyToggle } from '@/components/responder/duty-toggle'
import { InspectionFlow } from '@/components/responder/inspection-flow'
import { ActiveEmergencyCard } from '@/components/responder/active-emergency-card'
import { LoginBottomSheet } from '@/components/auth/login-bottom-sheet'
import { useAppStore } from '@/store/useAppStore'
import { DUMMY_INCIDENTS, MAP_CENTER } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

export default function ResponderHomePage() {
  const { isLoggedIn, isOnDuty, currentIncident, setCurrentIncident } = useAppStore()
  const [inspectionOpen, setInspectionOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  // Get a sample active incident for demo
  const sampleIncident = DUMMY_INCIDENTS[0]

  const handleGoOnDuty = () => {
    if (!isLoggedIn) {
      setLoginOpen(true)
    } else {
      setInspectionOpen(true)
    }
  }

  const handleInspectionComplete = () => {
    setInspectionOpen(false)
    // Simulate receiving an incident after going on duty
    setTimeout(() => {
      setCurrentIncident(sampleIncident)
    }, 2000)
  }

  const handleProfilePress = () => {
    setLoginOpen(true)
  }

  const handleResolveIncident = () => {
    setCurrentIncident(null)
  }

  return (
    <>
      <MobileShell
        onProfilePress={handleProfilePress}
        centerButton="duty"
      >
        <div className="flex flex-col">
          {/* Duty Toggle */}
          <div className="p-4">
            <DutyToggle onGoOnDuty={handleGoOnDuty} />
          </div>

          {/* Map section */}
          <div className="px-4">
            <EMSMap
              height="40vh"
              showHospitals
              showIncidents={isOnDuty}
              incidents={isOnDuty ? DUMMY_INCIDENTS : []}
              userLocation={MAP_CENTER}
              className="rounded-2xl overflow-hidden"
            />
          </div>

          {/* Incident list (when on duty) */}
          {isOnDuty && !currentIncident && (
            <div className="p-4 space-y-4">
              <h2 className="font-semibold text-foreground">Active Incidents in Your Area</h2>
              
              {DUMMY_INCIDENTS.map((incident, index) => (
                <motion.button
                  key={incident.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setCurrentIncident(incident)}
                  className="w-full bg-card border border-border rounded-2xl p-4 text-left hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      incident.severity === 'critical' ? 'bg-critical' :
                      incident.severity === 'serious' ? 'bg-serious' : 'bg-minor'
                    )}>
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          incident.type === 'medical' ? 'bg-medical/20 text-medical' :
                          incident.type === 'police' ? 'bg-police/20 text-police' :
                          'bg-fire/20 text-fire'
                        )}>
                          {incident.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.round((Date.now() - incident.timestamp.getTime()) / 60000)}m ago
                        </span>
                      </div>
                      <p className="font-medium text-foreground">{incident.incidentType}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {incident.location.address}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Off duty message */}
          {!isOnDuty && (
            <div className="p-4">
              <div className="bg-muted rounded-2xl p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">You are currently off duty</h3>
                <p className="text-sm text-muted-foreground">
                  Go on duty to receive emergency dispatches and view incidents in your area.
                </p>
              </div>
            </div>
          )}
        </div>
      </MobileShell>

      {/* Active emergency overlay */}
      {currentIncident && (
        <ActiveEmergencyCard
          incident={currentIncident}
          onNavigate={() => {/* Open navigation */}}
          onTakeToHospital={() => {/* Route to hospital */}}
          onResolve={handleResolveIncident}
        />
      )}

      {/* Modals */}
      <InspectionFlow
        isOpen={inspectionOpen}
        onClose={() => setInspectionOpen(false)}
        onComplete={handleInspectionComplete}
      />

      <LoginBottomSheet
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        mode="responder"
      />
    </>
  )
}
