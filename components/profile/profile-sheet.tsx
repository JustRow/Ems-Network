'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, LogOut, User, Shield, Edit2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore, type User as UserType, type EmergencyContact } from '@/store/useAppStore'
import {
  BLOOD_TYPES,
  LANGUAGES,
  MEDICAL_CONDITIONS,
  MEDICAL_AIDS,
  INSURERS,
} from '@/lib/dummy-data'

interface ProfileSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileSheet({ isOpen, onClose }: ProfileSheetProps) {
  const router = useRouter()
  const { user, setUser, logout } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<UserType>>({})

  // Detect if staff (has department field)
  const isStaff = !!user?.department

  const startEditing = () => {
    if (user) {
      setFormData({ ...user })
      setIsEditing(true)
    }
  }

  const saveChanges = () => {
    if (user && formData) {
      setUser({ ...user, ...formData } as UserType)
      setIsEditing(false)
    }
  }

  const cancelEditing = () => {
    setFormData({})
    setIsEditing(false)
  }

  const updateField = <K extends keyof UserType>(field: K, value: UserType[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCondition = (condition: string) => {
    const current = formData.medicalConditions || user?.medicalConditions || []
    const updated = current.includes(condition)
      ? current.filter((c) => c !== condition)
      : [...current, condition]
    updateField('medicalConditions', updated)
  }

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const contacts = [...(formData.emergencyContacts || user?.emergencyContacts || [])]
    contacts[index] = { ...contacts[index], [field]: value }
    updateField('emergencyContacts', contacts)
  }

  const handleSignOut = () => {
    logout()
    onClose()
    router.push('/')
  }

  if (!user) return null

  const displayData = isEditing ? formData : user
  const conditions = displayData.medicalConditions || []

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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  {isStaff ? (
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  ) : (
                    <User className="w-6 h-6 text-primary-foreground" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">
                    {user.name} {user.surname}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {isStaff ? `${user.rank} - ${user.department}` : 'Patient Profile'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isStaff && !isEditing && (
                  <button
                    onClick={startEditing}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                {isEditing && (
                  <>
                    <button
                      onClick={cancelEditing}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={saveChanges}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 transition-colors"
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </button>
                  </>
                )}
                {!isEditing && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {isStaff ? (
                /* Staff Profile (Read-only) */
                <>
                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Employee Information</h3>
                    <div className="bg-muted rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Employee ID</span>
                        <span className="text-sm font-medium text-foreground">{user.employeeId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Department</span>
                        <span className="text-sm font-medium text-foreground">{user.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rank</span>
                        <span className="text-sm font-medium text-foreground">{user.rank}</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.certifications?.map((cert) => (
                        <span
                          key={cert}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </section>

                  {user.assignedVehicle && (
                    <section>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Current Vehicle</h3>
                      <div className="bg-muted rounded-xl p-4">
                        <p className="font-medium text-foreground">{user.assignedVehicle.plate}</p>
                        <p className="text-sm text-muted-foreground">{user.assignedVehicle.make}</p>
                      </div>
                    </section>
                  )}

                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Personal Details</h3>
                    <div className="bg-muted rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Blood Type</span>
                        <span className="text-sm font-medium text-foreground">{user.bloodType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Language</span>
                        <span className="text-sm font-medium text-foreground">{user.language}</span>
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                /* Patient Profile (Editable) */
                <>
                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Personal Information</h3>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>First Name</Label>
                            <Input
                              value={displayData.name || ''}
                              onChange={(e) => updateField('name', e.target.value)}
                              className="mt-1.5 rounded-xl"
                            />
                          </div>
                          <div>
                            <Label>Surname</Label>
                            <Input
                              value={displayData.surname || ''}
                              onChange={(e) => updateField('surname', e.target.value)}
                              className="mt-1.5 rounded-xl"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Date of Birth</Label>
                          <Input
                            type="date"
                            value={displayData.dateOfBirth || ''}
                            onChange={(e) => updateField('dateOfBirth', e.target.value)}
                            className="mt-1.5 rounded-xl"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Gender</Label>
                            <Select
                              value={displayData.gender || ''}
                              onValueChange={(v) => updateField('gender', v)}
                            >
                              <SelectTrigger className="mt-1.5 rounded-xl">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Language</Label>
                            <Select
                              value={displayData.language || ''}
                              onValueChange={(v) => updateField('language', v)}
                            >
                              <SelectTrigger className="mt-1.5 rounded-xl">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {LANGUAGES.map((lang) => (
                                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted rounded-xl p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Date of Birth</span>
                          <span className="text-sm font-medium text-foreground">{user.dateOfBirth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Gender</span>
                          <span className="text-sm font-medium text-foreground capitalize">{user.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Language</span>
                          <span className="text-sm font-medium text-foreground">{user.language}</span>
                        </div>
                      </div>
                    )}
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Medical Information</h3>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label>Blood Type</Label>
                            <Select
                              value={displayData.bloodType || ''}
                              onValueChange={(v) => updateField('bloodType', v)}
                            >
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
                              value={displayData.weight || ''}
                              onChange={(e) => updateField('weight', parseFloat(e.target.value) || 0)}
                              className="mt-1.5 rounded-xl"
                            />
                          </div>
                          <div>
                            <Label>Height (cm)</Label>
                            <Input
                              type="number"
                              value={displayData.height || ''}
                              onChange={(e) => updateField('height', parseFloat(e.target.value) || 0)}
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
                                  conditions.includes(condition)
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
                          <Label>Medications</Label>
                          <Textarea
                            value={displayData.medications || ''}
                            onChange={(e) => updateField('medications', e.target.value)}
                            className="mt-1.5 rounded-xl resize-none"
                            placeholder="List current medications..."
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted rounded-xl p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Blood Type</span>
                          <span className="text-sm font-medium text-foreground">{user.bloodType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Weight</span>
                          <span className="text-sm font-medium text-foreground">{user.weight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Height</span>
                          <span className="text-sm font-medium text-foreground">{user.height} cm</span>
                        </div>
                        {conditions.length > 0 && (
                          <div>
                            <span className="text-sm text-muted-foreground">Conditions</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {conditions.map((c) => (
                                <span key={c} className="px-2 py-0.5 bg-critical/10 text-critical rounded text-xs">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {user.medications && (
                          <div>
                            <span className="text-sm text-muted-foreground">Medications</span>
                            <p className="text-sm text-foreground mt-1">{user.medications}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Insurance</h3>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Medical Aid</Label>
                            <Select
                              value={displayData.medicalAid || ''}
                              onValueChange={(v) => updateField('medicalAid', v)}
                            >
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
                            <Label>Member Number</Label>
                            <Input
                              value={displayData.medicalAidNumber || ''}
                              onChange={(e) => updateField('medicalAidNumber', e.target.value)}
                              className="mt-1.5 rounded-xl"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Insurer</Label>
                          <Select
                            value={displayData.insurer || ''}
                            onValueChange={(v) => updateField('insurer', v)}
                          >
                            <SelectTrigger className="mt-1.5 rounded-xl">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {INSURERS.map((ins) => (
                                <SelectItem key={ins} value={ins}>{ins}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Preferred GP</Label>
                          <Input
                            value={displayData.preferredGP || ''}
                            onChange={(e) => updateField('preferredGP', e.target.value)}
                            className="mt-1.5 rounded-xl"
                            placeholder="Dr. Name"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted rounded-xl p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Medical Aid</span>
                          <span className="text-sm font-medium text-foreground">{user.medicalAid || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Member Number</span>
                          <span className="text-sm font-medium text-foreground">{user.medicalAidNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Insurer</span>
                          <span className="text-sm font-medium text-foreground">{user.insurer || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Preferred GP</span>
                          <span className="text-sm font-medium text-foreground">{user.preferredGP || '-'}</span>
                        </div>
                      </div>
                    )}
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Emergency Contacts</h3>
                    {isEditing ? (
                      <div className="space-y-3">
                        {(displayData.emergencyContacts || user.emergencyContacts || []).map((contact, index) => (
                          <div key={index} className="bg-muted rounded-xl p-4 space-y-3">
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
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {user.emergencyContacts?.map((contact, index) => (
                          <div key={index} className="bg-muted rounded-xl p-4">
                            <p className="font-medium text-foreground">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {contact.relationship} - {contact.phone}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>

            {/* Sign Out Button */}
            <div className="p-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
