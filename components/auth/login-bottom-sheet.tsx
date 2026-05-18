'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useAppStore, type User, type EmergencyContact } from '@/store/useAppStore'
import {
  BLOOD_TYPES,
  LANGUAGES,
  MEDICAL_CONDITIONS,
  MEDICAL_AIDS,
  INSURERS,
  DEPARTMENTS,
  CERTIFICATIONS,
} from '@/lib/dummy-data'

interface LoginBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  mode: 'patient' | 'responder'
}

export function LoginBottomSheet({ isOpen, onClose, mode }: LoginBottomSheetProps) {
  const login = useAppStore((state) => state.login)
  const [step, setStep] = useState(1)
  const [isLogin, setIsLogin] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    // Basic info
    name: '',
    surname: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    language: 'English',
    // Medical info
    bloodType: '',
    weight: '',
    height: '',
    medicalConditions: [] as string[],
    medications: '',
    medicalAid: '',
    medicalAidNumber: '',
    insurer: '',
    preferredGP: '',
    emergencyContacts: [{ name: '', relationship: '', phone: '' }] as EmergencyContact[],
    // EMS Worker fields
    employeeId: '',
    department: '' as typeof DEPARTMENTS[number] | '',
    rank: '',
    certifications: [] as string[],
  })

  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCondition = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalConditions: prev.medicalConditions.includes(condition)
        ? prev.medicalConditions.filter((c) => c !== condition)
        : [...prev.medicalConditions, condition],
    }))
  }

  const toggleCertification = (cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }))
  }

  const addEmergencyContact = () => {
    if (formData.emergencyContacts.length < 3) {
      setFormData((prev) => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, { name: '', relationship: '', phone: '' }],
      }))
    }
  }

  const removeEmergencyContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }))
  }

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      ),
    }))
  }

  const handleSubmit = () => {
    const user: User = {
      id: Math.random().toString(36).substring(7),
      name: formData.name,
      surname: formData.surname,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      language: formData.language,
      bloodType: formData.bloodType,
      weight: parseFloat(formData.weight) || 0,
      height: parseFloat(formData.height) || 0,
      medicalConditions: formData.medicalConditions,
      medications: formData.medications,
      medicalAid: formData.medicalAid,
      medicalAidNumber: formData.medicalAidNumber,
      insurer: formData.insurer,
      preferredGP: formData.preferredGP,
      emergencyContacts: formData.emergencyContacts,
      ...(mode === 'responder' && {
        employeeId: formData.employeeId,
        department: formData.department as typeof DEPARTMENTS[number],
        rank: formData.rank,
        certifications: formData.certifications,
      }),
    }
    login(user)
    onClose()
  }

  const totalSteps = mode === 'responder' ? 4 : 3

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
                <h2 className="font-semibold text-foreground">
                  {isLogin ? 'Sign In' : `Create ${mode === 'responder' ? 'EMS Worker' : 'Patient'} Account`}
                </h2>
                {!isLogin && <p className="text-xs text-muted-foreground">Step {step} of {totalSteps}</p>}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Progress bar */}
            {!isLogin && (
              <div className="h-1 bg-muted">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLogin ? (
                /* Login Form */
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    className="w-full h-12 rounded-xl mt-4"
                  >
                    Sign In
                  </Button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className="w-full text-sm text-primary hover:underline"
                  >
                    {"Don't have an account? Register"}
                  </button>
                </div>
              ) : (
                /* Registration Form */
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="font-medium text-foreground">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="name">First Name</Label>
                          <Input
                            id="name"
                            placeholder="John"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            className="mt-1.5 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="surname">Surname</Label>
                          <Input
                            id="surname"
                            placeholder="Doe"
                            value={formData.surname}
                            onChange={(e) => updateField('surname', e.target.value)}
                            className="mt-1.5 rounded-xl"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => updateField('dateOfBirth', e.target.value)}
                          className="mt-1.5 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
                          <SelectTrigger className="mt-1.5 rounded-xl">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="language">Preferred Language</Label>
                        <Select value={formData.language} onValueChange={(v) => updateField('language', v)}>
                          <SelectTrigger className="mt-1.5 rounded-xl">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="font-medium text-foreground">Medical Information</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label>Blood Type</Label>
                          <Select value={formData.bloodType} onValueChange={(v) => updateField('bloodType', v)}>
                            <SelectTrigger className="mt-1.5 rounded-xl">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {BLOOD_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Weight (kg)</Label>
                          <Input
                            type="number"
                            placeholder="70"
                            value={formData.weight}
                            onChange={(e) => updateField('weight', e.target.value)}
                            className="mt-1.5 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label>Height (cm)</Label>
                          <Input
                            type="number"
                            placeholder="175"
                            value={formData.height}
                            onChange={(e) => updateField('height', e.target.value)}
                            className="mt-1.5 rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Medical Conditions</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {MEDICAL_CONDITIONS.map((condition) => (
                            <button
                              key={condition}
                              onClick={() => toggleCondition(condition)}
                              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                formData.medicalConditions.includes(condition)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-accent'
                              }`}
                            >
                              {condition}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Current Medications</Label>
                        <Textarea
                          placeholder="List any medications you are currently taking..."
                          value={formData.medications}
                          onChange={(e) => updateField('medications', e.target.value)}
                          className="mt-1.5 rounded-xl resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Medical Aid</Label>
                          <Select value={formData.medicalAid} onValueChange={(v) => updateField('medicalAid', v)}>
                            <SelectTrigger className="mt-1.5 rounded-xl">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {MEDICAL_AIDS.map((aid) => (
                                <SelectItem key={aid} value={aid}>{aid}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Medical Aid Number</Label>
                          <Input
                            placeholder="Number"
                            value={formData.medicalAidNumber}
                            onChange={(e) => updateField('medicalAidNumber', e.target.value)}
                            className="mt-1.5 rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Insurer</Label>
                        <Select value={formData.insurer} onValueChange={(v) => updateField('insurer', v)}>
                          <SelectTrigger className="mt-1.5 rounded-xl">
                            <SelectValue placeholder="Select insurer" />
                          </SelectTrigger>
                          <SelectContent>
                            {INSURERS.map((ins) => (
                              <SelectItem key={ins} value={ins}>{ins}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Preferred GP / Doctor</Label>
                        <Input
                          placeholder="Dr. Name"
                          value={formData.preferredGP}
                          onChange={(e) => updateField('preferredGP', e.target.value)}
                          className="mt-1.5 rounded-xl"
                        />
                      </div>
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
                      <h3 className="font-medium text-foreground">Emergency Contacts</h3>
                      <p className="text-sm text-muted-foreground">Add up to 3 emergency contacts</p>

                      {formData.emergencyContacts.map((contact, index) => (
                        <div key={index} className="bg-muted rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Contact {index + 1}</span>
                            {index > 0 && (
                              <button
                                onClick={() => removeEmergencyContact(index)}
                                className="text-destructive hover:text-destructive/80"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <Input
                            placeholder="Name"
                            value={contact.name}
                            onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                            className="rounded-xl"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Relationship"
                              value={contact.relationship}
                              onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                              className="rounded-xl"
                            />
                            <Input
                              placeholder="Phone"
                              value={contact.phone}
                              onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                      ))}

                      {formData.emergencyContacts.length < 3 && (
                        <Button
                          variant="outline"
                          onClick={addEmergencyContact}
                          className="w-full rounded-xl"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Contact
                        </Button>
                      )}
                    </motion.div>
                  )}

                  {mode === 'responder' && step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="font-medium text-foreground">EMS Worker Details</h3>

                      <div>
                        <Label>Employee ID</Label>
                        <Input
                          placeholder="EMS001"
                          value={formData.employeeId}
                          onChange={(e) => updateField('employeeId', e.target.value)}
                          className="mt-1.5 rounded-xl"
                        />
                      </div>

                      <div>
                        <Label>Department</Label>
                        <Select value={formData.department} onValueChange={(v) => updateField('department', v as typeof DEPARTMENTS[number])}>
                          <SelectTrigger className="mt-1.5 rounded-xl">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Rank / Role</Label>
                        <Input
                          placeholder="Paramedic"
                          value={formData.rank}
                          onChange={(e) => updateField('rank', e.target.value)}
                          className="mt-1.5 rounded-xl"
                        />
                      </div>

                      <div>
                        <Label>Certifications</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {CERTIFICATIONS.map((cert) => (
                            <button
                              key={cert}
                              onClick={() => toggleCertification(cert)}
                              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                formData.certifications.includes(cert)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-accent'
                              }`}
                            >
                              {cert}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {!isLogin && (
              <div className="p-4 border-t border-border flex gap-3">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep((prev) => prev - 1)}
                    className="flex-1 h-12 rounded-xl"
                  >
                    Back
                  </Button>
                )}
                {step < totalSteps ? (
                  <Button
                    onClick={() => setStep((prev) => prev + 1)}
                    className="flex-1 h-12 rounded-xl"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 h-12 rounded-xl"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
