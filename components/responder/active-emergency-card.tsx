'use client'

import { motion } from 'framer-motion'
import { User, Globe, MapPin, Droplets, AlertCircle, Phone, Navigation, Hospital, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EMSMap } from '@/components/map/ems-map'
import type { Incident } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

interface ActiveEmergencyCardProps {
  incident: Incident
  onNavigate: () => void
  onTakeToHospital: () => void
  onResolve: () => void
}

export function ActiveEmergencyCard({
  incident,
  onNavigate,
  onTakeToHospital,
  onResolve,
}: ActiveEmergencyCardProps) {
  const severityColors = {
    critical: 'bg-critical',
    serious: 'bg-serious',
    minor: 'bg-minor',
  }

  const typeColors = {
    police: 'bg-police',
    medical: 'bg-medical',
    fire: 'bg-fire',
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-lg z-30 max-w-[430px] mx-auto"
    >
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
      </div>

      {/* Header */}
      <div className="px-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <div className={cn('px-2 py-0.5 rounded-full text-xs text-white font-medium', severityColors[incident.severity])}>
            {incident.severity.toUpperCase()}
          </div>
          <div className={cn('px-2 py-0.5 rounded-full text-xs text-white font-medium', typeColors[incident.type])}>
            {incident.type.toUpperCase()}
          </div>
        </div>
        <h3 className="font-semibold text-foreground text-lg">{incident.incidentType}</h3>
        <p className="text-sm text-muted-foreground">{incident.description}</p>
      </div>

      {/* Patient info */}
      <div className="p-4 space-y-3">
        <h4 className="font-medium text-foreground flex items-center gap-2">
          <User className="w-4 h-4" />
          Patient Information
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="font-medium text-foreground">{incident.patientName}</p>
          </div>
          {incident.patientAge && (
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-medium text-foreground">{incident.patientAge} years</p>
            </div>
          )}
          {incident.patientBloodType && (
            <div className="bg-muted rounded-xl p-3 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-critical" />
              <div>
                <p className="text-xs text-muted-foreground">Blood Type</p>
                <p className="font-medium text-foreground">{incident.patientBloodType}</p>
              </div>
            </div>
          )}
          {incident.patientLanguage && (
            <div className="bg-muted rounded-xl p-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-helpline" />
              <div>
                <p className="text-xs text-muted-foreground">Language</p>
                <p className="font-medium text-foreground">{incident.patientLanguage}</p>
              </div>
            </div>
          )}
        </div>

        {incident.patientConditions && incident.patientConditions.length > 0 && (
          <div className="bg-critical/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-critical" />
              <span className="text-sm font-medium text-critical">Medical Conditions</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {incident.patientConditions.map((condition) => (
                <span
                  key={condition}
                  className="px-2 py-0.5 bg-critical/20 text-critical text-xs rounded-full"
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        <div className="bg-muted rounded-xl p-3 flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
          <p className="text-sm text-foreground">{incident.location.address}</p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={onNavigate}
            className="h-12 rounded-xl bg-primary hover:bg-primary/90"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Navigate
          </Button>
          <Button
            onClick={() => window.location.href = 'tel:0800456789'}
            variant="outline"
            className="h-12 rounded-xl"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Patient
          </Button>
        </div>

        {incident.type === 'medical' && (
          <Button
            onClick={onTakeToHospital}
            variant="outline"
            className="w-full h-12 rounded-xl border-medical text-medical hover:bg-medical/10"
          >
            <Hospital className="w-4 h-4 mr-2" />
            Take to Nearest Hospital
          </Button>
        )}

        <Button
          onClick={onResolve}
          variant="ghost"
          className="w-full h-10 rounded-xl text-muted-foreground hover:text-foreground"
        >
          Mark Emergency Resolved
        </Button>
      </div>
    </motion.div>
  )
}
