'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SuicideHelplineProps {
  isOpen: boolean
  onClose: () => void
}

export function SuicideHelpline({ isOpen, onClose }: SuicideHelplineProps) {
  const [countdown, setCountdown] = useState(3)
  const [canClose, setCanClose] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setCountdown(3)
      setCanClose(false)

      // Allow close after 1.5s
      const closeTimer = setTimeout(() => {
        setCanClose(true)
      }, 1500)

      // Countdown timer
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            // Trigger phone call
            window.location.href = 'tel:0800456789'
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        clearTimeout(closeTimer)
        clearInterval(interval)
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #00888880 100%)',
          }}
        >
          {/* Close button - appears after 1.5s */}
          <AnimatePresence>
            {canClose && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Breathing circle */}
          <motion.div
            className="relative w-48 h-48 mb-8"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-helpline/30 rounded-full" />
            <div className="absolute inset-4 bg-helpline/40 rounded-full" />
            <div className="absolute inset-8 bg-helpline/50 rounded-full" />
            <div className="absolute inset-12 bg-helpline rounded-full flex items-center justify-center">
              <span className="text-white font-medium">Breathe</span>
            </div>
          </motion.div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white text-lg text-center mb-8 max-w-xs"
          >
            {"We're connecting you to someone who cares."}
          </motion.p>

          {/* Countdown ring */}
          <div className="relative w-24 h-24 mb-8">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="44"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="4"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="44"
                fill="none"
                stroke="#00aaaa"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={276}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 276 }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{countdown}</span>
            </div>
          </div>

          {/* Helpline info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-helpline font-semibold">SADAG Helpline</p>
            <p className="text-white text-lg">0800 456 789</p>
            <p className="text-white/60 text-sm mt-1">Free, confidential, 24/7</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
