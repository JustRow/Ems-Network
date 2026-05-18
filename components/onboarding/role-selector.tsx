'use client'

import { motion } from 'framer-motion'
import { 
  User, 
  Siren, 
  Radio, 
  Shield,
  Smartphone,
  Monitor
} from 'lucide-react'
import { type UserRole, useAppStore } from '@/store/useAppStore'
import { useRouter } from 'next/navigation'

const ROLES = [
  {
    id: 'patient' as UserRole,
    title: 'Patient / Public',
    description: 'Request emergency services, track responders, access safety information',
    icon: User,
    device: Smartphone,
    deviceLabel: 'Mobile',
    color: 'bg-medical',
    route: '/app',
  },
  {
    id: 'responder' as UserRole,
    title: 'EMS First Responder',
    description: 'Receive dispatches, manage duty status, complete vehicle inspections',
    icon: Siren,
    device: Smartphone,
    deviceLabel: 'Mobile',
    color: 'bg-fire',
    route: '/responder',
  },
  {
    id: 'dispatcher' as UserRole,
    title: 'Dispatcher',
    description: 'CAD dashboard, manage incident queue, dispatch vehicles',
    icon: Radio,
    device: Monitor,
    deviceLabel: 'Desktop',
    color: 'bg-police',
    route: '/dispatch',
  },
  {
    id: 'admin' as UserRole,
    title: 'Manager / Admin',
    description: 'Staff management, fleet oversight, incident reports, permissions',
    icon: Shield,
    device: Monitor,
    deviceLabel: 'Desktop',
    color: 'bg-helpline',
    route: '/admin',
  },
]

export function RoleSelector() {
  const setRole = useAppStore((state) => state.setRole)
  const router = useRouter()

  const handleSelectRole = (role: UserRole, route: string) => {
    setRole(role)
    router.push(route)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="w-20 h-20 rounded-full border-4 border-police flex items-center justify-center bg-white dark:bg-card">
          <span className="text-police font-bold text-xl">EMS</span>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground mb-2">Select Your Role</h1>
        <p className="text-muted-foreground">Choose how you want to access EMS Network</p>
      </motion.div>

      {/* Role cards */}
      <div className="w-full max-w-md space-y-3">
        {ROLES.map((role, index) => {
          const Icon = role.icon
          const DeviceIcon = role.device
          
          return (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.1 }}
              onClick={() => handleSelectRole(role.id, role.route)}
              className="w-full bg-card hover:bg-accent/50 border border-border rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.98] text-left"
            >
              <div className={`${role.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{role.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    <DeviceIcon className="w-3 h-3" />
                    <span>{role.deviceLabel}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{role.description}</p>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Privacy note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-8 text-xs text-muted-foreground text-center max-w-sm"
      >
        By continuing, you agree to our Terms of Service and Privacy Policy. Your data is only shared with emergency services.
      </motion.p>
    </div>
  )
}
