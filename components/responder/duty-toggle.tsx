'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Square, Clock } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

interface DutyToggleProps {
  onGoOnDuty: () => void
}

export function DutyToggle({ onGoOnDuty }: DutyToggleProps) {
  const { isOnDuty, setOnDuty, shiftStartTime, setShiftStartTime, user, currentVehicle } = useAppStore()
  const [shiftDuration, setShiftDuration] = useState('00:00:00')

  useEffect(() => {
    if (isOnDuty && shiftStartTime) {
      const interval = setInterval(() => {
        const now = new Date()
        const start = new Date(shiftStartTime)
        const diff = Math.floor((now.getTime() - start.getTime()) / 1000)
        
        const hours = Math.floor(diff / 3600)
        const minutes = Math.floor((diff % 3600) / 60)
        const seconds = diff % 60
        
        setShiftDuration(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        )
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isOnDuty, shiftStartTime])

  const handleToggle = () => {
    if (isOnDuty) {
      setOnDuty(false)
      setShiftStartTime(null)
    } else {
      onGoOnDuty()
    }
  }

  return (
    <motion.div
      layout
      className={cn(
        'rounded-2xl p-4 transition-colors',
        isOnDuty ? 'bg-on-duty' : 'bg-muted'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {isOnDuty ? (
            <>
              <p className="text-white font-semibold text-lg">On Duty</p>
              <p className="text-white/80 text-sm">
                {user?.name} {user?.surname}
              </p>
              {currentVehicle && (
                <p className="text-white/70 text-xs mt-1">
                  Vehicle: {currentVehicle.plate}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-foreground font-semibold text-lg">Off Duty</p>
              <p className="text-muted-foreground text-sm">
                Tap to start your shift
              </p>
            </>
          )}
        </div>

        {isOnDuty && (
          <div className="flex items-center gap-2 mr-4">
            <Clock className="w-4 h-4 text-white/70" />
            <span className="font-mono text-white text-lg">{shiftDuration}</span>
          </div>
        )}

        <button
          onClick={handleToggle}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center transition-colors',
            isOnDuty
              ? 'bg-white/20 hover:bg-white/30'
              : 'bg-on-duty hover:bg-on-duty/90'
          )}
        >
          {isOnDuty ? (
            <Square className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1" />
          )}
        </button>
      </div>
    </motion.div>
  )
}
