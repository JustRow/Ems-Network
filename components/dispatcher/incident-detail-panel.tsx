'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Car, User, Droplets, Globe, AlertCircle, MapPin, Clock, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Incident, Vehicle } from '@/store/useAppStore'
import { DUMMY_VEHICLES } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

interface IncidentDetailPanelProps {
  incident: Incident | null
  onClose: () => void
  onDispatch: (incidentId: string, vehicleId: string, notes: string) => void
}

export function IncidentDetailPanel({ incident, onClose, onDispatch }: IncidentDetailPanelProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [notes, setNotes] = useState('')

  const availableVehicles = DUMMY_VEHICLES.filter(
    (v) => v.status === 'available' && 
    (incident?.type === 'medical' ? v.type === 'ambulance' :
     incident?.type === 'police' ? v.type === 'police' :
     v.type === 'fire')
  )

  const handleDispatch = () => {
    if (incident && selectedVehicle) {
      onDispatch(incident.id, selectedVehicle, notes)
      setSelectedVehicle('')
      setNotes('')
    }
  }

  const severityColors = {
    critical: 'bg-critical text-white',
    serious: 'bg-serious text-black',
    minor: 'bg-minor text-white',
  }

  const typeColors = {
    police: 'bg-police',
    medical: 'bg-medical',
    fire: 'bg-fire',
  }

  return (
    <AnimatePresence>
      {incident && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-[400px] bg-card border-l border-border shadow-xl z-40 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className={cn('px-2 py-1 rounded-lg text-xs font-medium', severityColors[incident.severity])}>
                {incident.severity.toUpperCase()}
              </div>
              <div className={cn('px-2 py-1 rounded-lg text-xs font-medium text-white', typeColors[incident.type])}>
                {incident.type.toUpperCase()}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Incident info */}
            <div>
              <h2 className="text-xl font-bold text-foreground">{incident.incidentType}</h2>
              <p className="text-muted-foreground mt-1">{incident.description}</p>
            </div>

            {/* Time and location */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Reported {Math.round((Date.now() - new Date(incident.timestamp).getTime()) / 60000)} minutes ago
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-foreground">{incident.location.address}</span>
              </div>
            </div>

            {/* Patient info */}
            <div className="bg-muted rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Patient Information
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{incident.patientName}</p>
                </div>
                {incident.patientAge && (
                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">{incident.patientAge} years</p>
                  </div>
                )}
                {incident.patientBloodType && (
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-critical" />
                    <div>
                      <p className="text-xs text-muted-foreground">Blood Type</p>
                      <p className="font-medium text-foreground">{incident.patientBloodType}</p>
                    </div>
                  </div>
                )}
                {incident.patientLanguage && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-helpline" />
                    <div>
                      <p className="text-xs text-muted-foreground">Language</p>
                      <p className="font-medium text-foreground">{incident.patientLanguage}</p>
                    </div>
                  </div>
                )}
              </div>

              {incident.patientConditions && incident.patientConditions.length > 0 && (
                <div className="pt-2 border-t border-border">
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
            </div>

            {/* Status badge */}
            {incident.status === 'dispatched' && incident.assignedVehicle && (
              <div className="bg-on-duty/10 border border-on-duty rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-4 h-4 text-on-duty" />
                  <span className="font-medium text-on-duty">Vehicle Dispatched</span>
                </div>
                <p className="text-sm text-foreground">{incident.assignedVehicle}</p>
                <p className="text-xs text-muted-foreground">{incident.assignedResponder}</p>
              </div>
            )}

            {/* Dispatch form */}
            {incident.status === 'pending' && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground">Dispatch Vehicle</h3>

                <div>
                  <label className="text-sm font-medium text-foreground">Select Vehicle</label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger className="mt-1.5 rounded-xl">
                      <SelectValue placeholder="Choose available vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.plate} - {vehicle.make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Dispatcher Notes</label>
                  <Textarea
                    placeholder="Add notes for the responder..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1.5 rounded-xl resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            {incident.status === 'pending' && (
              <Button
                onClick={handleDispatch}
                disabled={!selectedVehicle}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4 mr-2" />
                Dispatch Vehicle
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {/* Call functionality */}}
              className="w-full h-10 rounded-xl"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call {incident.patientName}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
