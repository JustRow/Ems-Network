'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { INCIDENT_TYPES } from '@/lib/dummy-data'
import type { EmergencyType, Severity } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

interface TriageFlowProps {
  type: EmergencyType
  isOpen: boolean
  onClose: () => void
  onDispatch: (data: {
    incidentType: string
    severity: Severity
    description: string
  }) => void
}

const TYPE_LABELS: Record<EmergencyType, string> = {
  police: 'Police & Metro',
  medical: 'Medical Emergency',
  fire: 'Fire & Rescue',
}

const TYPE_COLORS: Record<EmergencyType, string> = {
  police: 'bg-police',
  medical: 'bg-medical',
  fire: 'bg-fire',
}

const SEVERITY_OPTIONS: { id: Severity; label: string; description: string; color: string }[] = [
  { id: 'critical', label: 'Critical', description: 'Life threatening, immediate danger', color: 'bg-critical' },
  { id: 'serious', label: 'Serious', description: 'Urgent but stable', color: 'bg-serious' },
  { id: 'minor', label: 'Minor', description: 'Non-life threatening', color: 'bg-minor' },
]

export function TriageFlow({ type, isOpen, onClose, onDispatch }: TriageFlowProps) {
  const [step, setStep] = useState(1)
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | null>(null)
  const [description, setDescription] = useState('')

  const incidentTypes = INCIDENT_TYPES[type] || []

  const handleReset = () => {
    setStep(1)
    setSelectedIncident(null)
    setSelectedSeverity(null)
    setDescription('')
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const handleDispatch = () => {
    if (selectedIncident && selectedSeverity) {
      onDispatch({
        incidentType: selectedIncident,
        severity: selectedSeverity,
        description,
      })
      handleReset()
    }
  }

  const handleSelectIncident = (incident: string) => {
    setSelectedIncident(incident)
    setStep(2)
  }

  const handleSelectSeverity = (severity: Severity) => {
    setSelectedSeverity(severity)
    setStep(3)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', TYPE_COLORS[type])}>
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{TYPE_LABELS[type]}</h2>
                  <p className="text-xs text-muted-foreground">Step {step} of 4</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-muted">
              <motion.div
                className={cn('h-full', TYPE_COLORS[type])}
                initial={{ width: '0%' }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <h3 className="font-medium text-foreground mb-4">What type of incident?</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {incidentTypes.map((incident) => (
                        <button
                          key={incident}
                          onClick={() => handleSelectIncident(incident)}
                          className="p-3 bg-muted hover:bg-accent rounded-xl text-left transition-colors min-h-[56px] flex items-center"
                        >
                          <span className="text-sm font-medium text-foreground">{incident}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <h3 className="font-medium text-foreground mb-4">How severe is it?</h3>
                    {SEVERITY_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSelectSeverity(option.id)}
                        className="w-full p-4 bg-muted hover:bg-accent rounded-xl text-left transition-colors flex items-center gap-4"
                      >
                        <div className={cn('w-4 h-4 rounded-full', option.color)} />
                        <div>
                          <p className="font-semibold text-foreground">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-foreground">Any additional details? (Optional)</h3>
                    <Textarea
                      placeholder="Briefly describe the situation..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                      className="min-h-[120px] resize-none rounded-xl"
                    />
                    <p className="text-xs text-muted-foreground text-right">{description.length}/200</p>
                    
                    <div className="pt-2">
                      <Button
                        onClick={() => setStep(4)}
                        className={cn('w-full rounded-xl h-12', TYPE_COLORS[type], 'hover:opacity-90')}
                      >
                        Continue
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-foreground mb-4">Confirm Emergency Dispatch</h3>
                    
                    {/* Summary */}
                    <div className="bg-muted rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm font-medium text-foreground">{TYPE_LABELS[type]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Incident</span>
                        <span className="text-sm font-medium text-foreground">{selectedIncident}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Severity</span>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-3 h-3 rounded-full',
                            selectedSeverity === 'critical' ? 'bg-critical' :
                            selectedSeverity === 'serious' ? 'bg-serious' : 'bg-minor'
                          )} />
                          <span className="text-sm font-medium text-foreground capitalize">{selectedSeverity}</span>
                        </div>
                      </div>
                      {description && (
                        <div className="pt-2 border-t border-border">
                          <span className="text-sm text-muted-foreground">Notes:</span>
                          <p className="text-sm text-foreground mt-1">{description}</p>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleDispatch}
                      className={cn('w-full rounded-xl h-14 text-base font-semibold', TYPE_COLORS[type], 'hover:opacity-90')}
                    >
                      Confirm & Dispatch
                    </Button>

                    <button
                      onClick={handleReset}
                      className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Start Over
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
