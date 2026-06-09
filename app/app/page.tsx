'use client'

import { useState, useEffect } from 'react'
import { Shield, Ambulance, Flame, Newspaper, Heart, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { MobileShell } from '@/components/shell/mobile-shell'
import { EMSMap } from '@/components/map/ems-map'
import { createClient } from '@/utils/supabase/client'
import { ServiceCard, ServiceCardGrid } from '@/components/emergency/service-card'
import { TriageFlow } from '@/components/emergency/triage-flow'
import { PanicCallUI } from '@/components/emergency/panic-call-ui'
import { SuicideHelpline } from '@/components/emergency/suicide-helpline'
import { DispatchStatus } from '@/components/emergency/dispatch-status'
import { LoginBottomSheet } from '@/components/auth/login-bottom-sheet'
import { ProfileSheet } from '@/components/profile/profile-sheet'
import { useAppStore, type EmergencyType, type Severity, type Incident } from '@/store/useAppStore'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function PatientHomePage() {
  const { isLoggedIn, user, setActiveDispatch, resolveDispatch, activeDispatch } = useAppStore()
  const [triageOpen, setTriageOpen] = useState(false)
  const [triageType, setTriageType] = useState<EmergencyType>('medical')
  const [panicOpen, setPanicOpen] = useState(false)
  const [helplineOpen, setHelplineOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [dispatchOpen, setDispatchOpen] = useState(false)
  const [dispatchData, setDispatchData] = useState<{
    type: EmergencyType
    severity: Severity
    incidentType: string
  } | null>(null)

  useEffect(() => {
    if (!activeDispatch?.id) return

    const supabase = createClient()
    const channel = supabase
      .channel(`incident-${activeDispatch.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'incidents', filter: `id=eq.${activeDispatch.id}` },
        (payload) => {
          const updated = payload.new
          setActiveDispatch({
            ...activeDispatch,
            status: updated.status,
            assignedVehicle: updated.assigned_vehicle_plate || activeDispatch.assignedVehicle,
            assignedResponder: updated.assigned_responder_name || activeDispatch.assignedResponder,
          })
          
          if (updated.status === 'resolved' || updated.status === 'cancelled') {
             resolveDispatch()
             setDispatchOpen(false)
             setDispatchData(null)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeDispatch?.id, activeDispatch, setActiveDispatch, resolveDispatch])

  const handleServiceTap = (type: EmergencyType) => {
    setTriageType(type)
    setTriageOpen(true)
  }

  const handleDispatch = async (data: { incidentType: string; severity: Severity; description: string }) => {
    if (!user) {
      setLoginOpen(true)
      return
    }

    const supabase = createClient()
    const lng = 28.2260
    const lat = -26.0067

    const { data: insertedIncident, error } = await supabase.from('incidents').insert({
      type: triageType,
      incident_type: data.incidentType,
      severity: data.severity,
      description: data.description,
      status: 'pending',
      patient_id: user.id,
      patient_name: `${user.name} ${user.surname}`.trim(),
      patient_age: user.dateOfBirth ? Math.floor((new Date().getTime() - new Date(user.dateOfBirth).getTime()) / 31557600000) : null,
      patient_blood_type: user.bloodType || null,
      patient_conditions: user.medicalConditions || [],
      patient_language: user.language || 'English',
      location: `POINT(${lng} ${lat})`,
      location_address: 'Current location',
    }).select().single()

    if (error) {
      console.error('Failed to create incident:', error)
      alert('Failed to dispatch emergency.')
      return
    }

    const incident: Incident = {
      id: insertedIncident.id,
      type: triageType,
      incidentType: data.incidentType,
      severity: data.severity,
      description: data.description,
      patientId: user.id,
      patientName: `${user.name} ${user.surname}`.trim(),
      location: {
        lat,
        lng,
        address: 'Current location',
      },
      timestamp: new Date(insertedIncident.created_at),
      status: 'pending',
      assignedVehicle: undefined,
      assignedResponder: undefined,
    }

    setActiveDispatch(incident)
    setDispatchData({
      type: triageType,
      severity: data.severity,
      incidentType: data.incidentType,
    })
    setTriageOpen(false)
    setDispatchOpen(true)
  }

  const handleProfilePress = (loggedIn: boolean) => {
    if (loggedIn) {
      setProfileOpen(true)
    } else {
      setLoginOpen(true)
    }
  }

  return (
    <>
      <MobileShell onPanicPress={() => setPanicOpen(true)} onProfilePress={handleProfilePress}>
        <div className="flex flex-col h-full">
          {/* Map section */}
          {activeDispatch && (
            <EMSMap height="35vh" className="rounded-none" />
          )}

          {/* Active emergency alert */}
          {activeDispatch && (
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
                    <p className="text-sm text-white/80">{activeDispatch.incidentType} - {activeDispatch.patientName}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Service cards */}
          <div className={cn('p-4 flex flex-col flex-1 gap-4', activeDispatch ? 'pt-4' : 'pt-6')}>
            <h2 className="text-lg font-semibold text-foreground flex-shrink-0">Emergency Services</h2>
            
            <ServiceCardGrid className="flex-1 flex flex-col justify-evenly gap-3">
              <ServiceCard
                icon={Shield}
                label="Police & Metro"
                color="police"
                className="flex-1 max-h-[120px]"
                onClick={() => handleServiceTap('police')}
              />
              <ServiceCard
                icon={Ambulance}
                label="Medical"
                color="medical"
                className="flex-1 max-h-[120px]"
                onClick={() => handleServiceTap('medical')}
              />
              <ServiceCard
                icon={Flame}
                label="Fire & Rescue"
                color="fire"
                className="flex-1 max-h-[120px]"
                onClick={() => handleServiceTap('fire')}
              />
            </ServiceCardGrid>

            {/* Quick links */}
            <div className="flex flex-col gap-3 flex-1 justify-evenly mt-2">
              <Link href="/app/news" className="w-full flex-1 flex max-h-[120px]">
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-fire to-helpline rounded-2xl p-4 shadow-sm flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <Newspaper className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">News & Updates</p>
                      <p className="text-white/80 text-xs">Stay informed on local events</p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setHelplineOpen(true)}
                className="bg-helpline rounded-2xl p-4 shadow-sm w-full flex-1 flex items-center justify-between max-h-[120px]"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">Crisis Helpline</p>
                    <p className="text-white/80 text-xs">24/7 Support and counseling</p>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Quick tip */}
            <div className="bg-muted rounded-2xl p-4 mt-auto flex-shrink-0">
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

      <ProfileSheet
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      {dispatchData && (
        <DispatchStatus
          isOpen={dispatchOpen}
          onClose={() => {
            setDispatchOpen(false)
            setDispatchData(null)
          }}
          onResolve={() => {
            resolveDispatch()
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
