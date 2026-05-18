'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ChevronRight, 
  Search, 
  Camera, 
  Check, 
  Car,
  Users,
  Radio as RadioIcon,
  ClipboardCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { useAppStore, type Vehicle } from '@/store/useAppStore'
import { DUMMY_VEHICLES, DUMMY_RESPONDERS, INSPECTION_CHECKLIST } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

interface InspectionFlowProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

type Step = 'vehicle' | 'partners' | 'radio' | 'inspection'

export function InspectionFlow({ isOpen, onClose, onComplete }: InspectionFlowProps) {
  const { setCurrentVehicle, setInspectionComplete, setOnDuty, setShiftStartTime, user } = useAppStore()
  
  const [step, setStep] = useState<Step>('vehicle')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Form data
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [selectedPartners, setSelectedPartners] = useState<string[]>([])
  const [radioChannel, setRadioChannel] = useState('')
  
  // Inspection data
  const [odometer, setOdometer] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [vinNumber, setVinNumber] = useState('')
  const [exteriorChecks, setExteriorChecks] = useState<Record<string, boolean>>({})
  const [equipmentChecks, setEquipmentChecks] = useState<Record<string, boolean>>({})
  const [photosTaken, setPhotosTaken] = useState<Record<string, boolean>>({})

  const availableVehicles = DUMMY_VEHICLES.filter(
    (v) => v.status === 'available' && 
    v.plate.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const availableResponders = DUMMY_RESPONDERS.filter(
    (r) => r.id !== user?.id &&
    (r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     r.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Calculate inspection progress
  const totalItems = 
    INSPECTION_CHECKLIST.exterior.length + 
    INSPECTION_CHECKLIST.equipment.length + 
    2 // odometer and license plate required

  const completedItems = 
    Object.values(exteriorChecks).filter(Boolean).length +
    Object.values(equipmentChecks).filter(Boolean).length +
    (odometer ? 1 : 0) +
    (licensePlate ? 1 : 0)

  const progress = Math.round((completedItems / totalItems) * 100)

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setLicensePlate(vehicle.plate)
    setStep('partners')
    setSearchQuery('')
  }

  const togglePartner = (id: string) => {
    if (selectedPartners.includes(id)) {
      setSelectedPartners(selectedPartners.filter((p) => p !== id))
    } else if (selectedPartners.length < 3) {
      setSelectedPartners([...selectedPartners, id])
    }
  }

  const handleComplete = () => {
    if (selectedVehicle) {
      setCurrentVehicle({
        ...selectedVehicle,
        inspectionComplete: true,
      })
      setInspectionComplete(true)
      setOnDuty(true)
      setShiftStartTime(new Date())
      onComplete()
    }
  }

  const steps: { id: Step; label: string; icon: typeof Car }[] = [
    { id: 'vehicle', label: 'Vehicle', icon: Car },
    { id: 'partners', label: 'Partners', icon: Users },
    { id: 'radio', label: 'Radio', icon: RadioIcon },
    { id: 'inspection', label: 'Inspection', icon: ClipboardCheck },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-4 border-b border-border">
              <div>
                <h2 className="font-semibold text-foreground">Start Your Shift</h2>
                <p className="text-xs text-muted-foreground">Complete vehicle assignment and inspection</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              {steps.map((s, index) => {
                const Icon = s.icon
                const isActive = s.id === step
                const isComplete = index < currentStepIndex

                return (
                  <div key={s.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                          isActive ? 'bg-primary text-primary-foreground' :
                          isComplete ? 'bg-on-duty text-white' :
                          'bg-muted text-muted-foreground'
                        )}
                      >
                        {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span className={cn(
                        'text-xs mt-1',
                        isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                      )}>
                        {s.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        'w-8 h-0.5 mx-1',
                        index < currentStepIndex ? 'bg-on-duty' : 'bg-muted'
                      )} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {/* Step 1: Select Vehicle */}
                {step === 'vehicle' && (
                  <motion.div
                    key="vehicle"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by plate number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      {availableVehicles.map((vehicle) => (
                        <button
                          key={vehicle.id}
                          onClick={() => handleVehicleSelect(vehicle)}
                          className="w-full p-4 bg-muted hover:bg-accent rounded-xl flex items-center gap-4 transition-colors text-left"
                        >
                          <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center',
                            vehicle.type === 'ambulance' ? 'bg-medical' :
                            vehicle.type === 'police' ? 'bg-police' : 'bg-fire'
                          )}>
                            <Car className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{vehicle.plate}</p>
                            <p className="text-sm text-muted-foreground">{vehicle.make}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Assign Partners */}
                {step === 'partners' && (
                  <motion.div
                    key="partners"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-muted-foreground">Select up to 3 partners (optional)</p>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      {availableResponders.map((responder) => {
                        const isSelected = selectedPartners.includes(responder.id!)
                        return (
                          <button
                            key={responder.id}
                            onClick={() => togglePartner(responder.id!)}
                            className={cn(
                              'w-full p-4 rounded-xl flex items-center gap-4 transition-colors text-left',
                              isSelected ? 'bg-primary/10 border border-primary' : 'bg-muted hover:bg-accent'
                            )}
                          >
                            <div className="w-10 h-10 rounded-full bg-police flex items-center justify-center text-white font-bold">
                              {responder.name?.charAt(0)}{responder.surname?.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {responder.name} {responder.surname}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {responder.employeeId} · {responder.rank}
                              </p>
                            </div>
                            <div className={cn(
                              'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                              isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                            )}>
                              {isSelected && <Check className="w-4 h-4 text-white" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Radio Assignment */}
                {step === 'radio' && (
                  <motion.div
                    key="radio"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label>Radio Channel / Callsign</Label>
                      <Input
                        placeholder="e.g., Channel 5 / Unit 7"
                        value={radioChannel}
                        onChange={(e) => setRadioChannel(e.target.value)}
                        className="mt-1.5 rounded-xl"
                      />
                    </div>

                    <div className="bg-muted rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">
                        Enter your assigned radio channel and callsign for this shift. This will be used for communication with dispatch.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Inspection */}
                {step === 'inspection' && (
                  <motion.div
                    key="inspection"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Inspection Progress</span>
                        <span className="font-medium text-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Required fields */}
                    <div className="space-y-3">
                      <div>
                        <Label>Odometer Reading *</Label>
                        <Input
                          type="number"
                          placeholder="Current odometer"
                          value={odometer}
                          onChange={(e) => setOdometer(e.target.value)}
                          className="mt-1.5 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label>License Plate *</Label>
                        <Input
                          value={licensePlate}
                          onChange={(e) => setLicensePlate(e.target.value)}
                          className="mt-1.5 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label>VIN Number (first-time only)</Label>
                        <Input
                          placeholder="Vehicle identification number"
                          value={vinNumber}
                          onChange={(e) => setVinNumber(e.target.value)}
                          className="mt-1.5 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Exterior checks */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Vehicle Exterior</h4>
                      <div className="space-y-2">
                        {INSPECTION_CHECKLIST.exterior.map((item) => (
                          <div key={item} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={exteriorChecks[item] || false}
                                onCheckedChange={(checked) =>
                                  setExteriorChecks((prev) => ({ ...prev, [item]: !!checked }))
                                }
                              />
                              <span className="text-sm text-foreground">{item}</span>
                            </div>
                            <button
                              onClick={() => setPhotosTaken((prev) => ({ ...prev, [item]: true }))}
                              className={cn(
                                'p-2 rounded-lg transition-colors',
                                photosTaken[item] ? 'bg-on-duty text-white' : 'bg-background hover:bg-accent'
                              )}
                            >
                              <Camera className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Equipment checks */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Equipment Check</h4>
                      <div className="space-y-2">
                        {INSPECTION_CHECKLIST.equipment.map((item) => (
                          <div key={item} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={equipmentChecks[item] || false}
                                onCheckedChange={(checked) =>
                                  setEquipmentChecks((prev) => ({ ...prev, [item]: !!checked }))
                                }
                              />
                              <span className="text-sm text-foreground">{item}</span>
                            </div>
                            <button
                              onClick={() => setPhotosTaken((prev) => ({ ...prev, [`eq-${item}`]: true }))}
                              className={cn(
                                'p-2 rounded-lg transition-colors',
                                photosTaken[`eq-${item}`] ? 'bg-on-duty text-white' : 'bg-background hover:bg-accent'
                              )}
                            >
                              <Camera className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex gap-3">
              {step !== 'vehicle' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const prevIndex = currentStepIndex - 1
                    if (prevIndex >= 0) {
                      setStep(steps[prevIndex].id)
                    }
                  }}
                  className="flex-1 h-12 rounded-xl"
                >
                  Back
                </Button>
              )}
              {step === 'inspection' ? (
                <Button
                  onClick={handleComplete}
                  disabled={progress < 100}
                  className="flex-1 h-12 rounded-xl bg-on-duty hover:bg-on-duty/90"
                >
                  Submit Inspection
                </Button>
              ) : step !== 'vehicle' && (
                <Button
                  onClick={() => {
                    const nextIndex = currentStepIndex + 1
                    if (nextIndex < steps.length) {
                      setStep(steps[nextIndex].id)
                    }
                  }}
                  className="flex-1 h-12 rounded-xl"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
