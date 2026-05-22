'use client'

import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceCardProps {
  icon: LucideIcon
  label: string
  color: 'police' | 'medical' | 'fire'
  onClick: () => void
  className?: string
}

const colorMap = {
  police: { bg: 'bg-police', border: 'border-police', text: 'text-police' },
  medical: { bg: 'bg-medical', border: 'border-medical', text: 'text-medical' },
  fire: { bg: 'bg-fire', border: 'border-fire', text: 'text-fire' },
}

export function ServiceCard({ icon: Icon, label, color, onClick, className }: ServiceCardProps) {
  const styles = colorMap[color] || colorMap.medical

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'flex items-stretch rounded-2xl overflow-hidden w-full min-h-[72px]',
        'border-2 bg-card transition-colors shadow-sm',
        styles.border,
        className
      )}
    >
      {/* Icon section */}
      <div className={cn('flex items-center justify-center w-[72px] flex-shrink-0', styles.bg)}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      {/* Label section */}
      <div className={cn('flex-1 flex items-center px-4 bg-transparent')}>
        <span className="text-foreground font-semibold text-left">{label}</span>
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
