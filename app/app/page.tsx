'use client'

import { useState } from 'react'
import { Shield, Ambulance, Flame, Newspaper, Heart, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { MobileShell } from '@/components/shell/mobile-shell'
import { EMSMap } from '@/components/map/ems-map'
import { ServiceCard, ServiceCardGrid } from '@/components/emergency/service-card'
import { TriageFlow } from '@/components/emergency/triage-flow'
import { PanicCallUI } from '@/components/emergency/panic-call-ui'
import { SuicideHelpline } from '@/components/emergency/suicide-helpline'
import { DispatchStatus } from '@/components/emergency/dispatch-status'
import { LoginBottomSheet } from '@/components/auth/login-bottom-sheet'
import { useAppStore, type EmergencyType, type Severity } from '@/store/useAppStore'
import { DUMMY_INCIDENTS } from '@/lib/dummy-data'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function PatientHomePage() {
  const { isLoggedIn } = useAppStore()
  const [triageOpen, setTriageOpen] = useState(false)
  const [triageType, setTriageType] = useState<EmergencyType>('medical')
  const [panicOpen, setPanicOpen] = useState(false)
  const [helplineOpen, setHelplineOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [dispatchOpen, setDispatchOpen] = useState(false)
  const [dispatchData, setDispatchData] = useState<{
    type: EmergencyType
    severity: Severity
    incidentType: string
  } | null>(null)

  // Get active critical incident for alert banner
  const activeIncident = DUMMY_INCIDENTS.find((i) => i.status === 'dispatched' && i.severity === 'critical')

  const handleServiceTap = (type: EmergencyType) => {
    setTriageType(type)
    setTriageOpen(true)
  }

  const handleDispatch = (data: { incidentType: string; severity: Severity; description: string }) => {
    setDispatchData({
      type: triageType,
      severity: data.severity,
      incidentType: data.incidentType,
    })
    setTriageOpen(false)
    setDispatchOpen(true)
  }

  const handleProfilePress = () => {
    setLoginOpen(true)
  }

  return (
    <>
      <MobileShell onPanicPress={() => setPanicOpen(true)} onProfilePress={handleProfilePress}>
        <div className="flex flex-col">
          {/* Map section */}
          <EMSMap height="35vh" className="rounded-none" />

          {/* Active emergency alert */}
          {activeIncident && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-4 -mt-4 relative z-10"
            >
              <div className="bg-critical text-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Active Emergency</p>
                    <p className="text-sm text-white/80">{activeIncident.incidentType} - {activeIncident.patientName}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Service cards */}
          <div className={cn('p-4 space-y-4', activeIncident ? 'pt-4' : 'pt-6')}>
            <h2 className="text-lg font-semibold text-foreground">Emergency Services</h2>
            
            <ServiceCardGrid>
              <ServiceCard
                icon={Shield}
                label="Police & Metro"
                color="bg-police"
                onClick={() => handleServiceTap('police')}
              />
              <ServiceCard
                icon={Ambulance}
                label="Medical"
                color="bg-medical"
                onClick={() => handleServiceTap('medical')}
              />
              <ServiceCard
                icon={Flame}
                label="Fire & Rescue"
                color="bg-fire"
                onClick={() => handleServiceTap('fire')}
              />
            </ServiceCardGrid>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/app/news">
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-fire to-helpline rounded-2xl p-4 shadow-sm"
                >
                  <Newspaper className="w-6 h-6 text-white mb-2" />
                  <p className="text-white font-semibold">News</p>
                  <p className="text-white/70 text-xs">Latest updates</p>
                </motion.div>
              </Link>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setHelplineOpen(true)}
                className="bg-helpline rounded-2xl p-4 shadow-sm text-left"
              >
                <Heart className="w-6 h-6 text-white mb-2" />
                <p className="text-white font-semibold">Crisis Help</p>
                <p className="text-white/70 text-xs">24/7 Support</p>
              </motion.button>
            </div>

            {/* Quick tip */}
            <div className="bg-muted rounded-2xl p-4 mt-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Tip:</span> Complete your profile with medical information to help responders serve you better in emergencies.
              </p>
            </div>
          </div>
        </div>
      </MobileShell>

      {/* Modals */}
      <TriageFlow
        type={triageType}
        isOpen={triageOpen}
        onClose={() => setTriageOpen(false)}
        onDispatch={handleDispatch}
      />

      <PanicCallUI isOpen={panicOpen} onClose={() => setPanicOpen(false)} />

      <SuicideHelpline isOpen={helplineOpen} onClose={() => setHelplineOpen(false)} />

      <LoginBottomSheet
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        mode="patient"
      />

      {dispatchData && (
        <DispatchStatus
          isOpen={dispatchOpen}
          onClose={() => {
            setDispatchOpen(false)
            setDispatchData(null)
          }}
          emergencyType={dispatchData.type}
          severity={dispatchData.severity}
          incidentType={dispatchData.incidentType}
        />
      )}
    </>
  )
}
