'use client'

import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceCardProps {
  icon: LucideIcon
  label: string
  color: string
  onClick: () => void
  className?: string
}

export function ServiceCard({ icon: Icon, label, color, onClick, className }: ServiceCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'flex items-stretch rounded-2xl shadow-sm overflow-hidden w-full min-h-[72px]',
        className
      )}
    >
      {/* Icon section */}
      <div className={cn('flex items-center justify-center w-[72px] flex-shrink-0', color)}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      {/* Label section */}
      <div className={cn('flex-1 flex items-center px-4', color, 'bg-opacity-90')}>
        <span className="text-white font-semibold text-left">{label}</span>
      </div>
    </motion.button>
  )
}

interface ServiceCardGridProps {
  children: React.ReactNode
  className?: string
}

export function ServiceCardGrid({ children, className }: ServiceCardGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-3', className)}>
      {children}
    </div>
  )
}
