'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MicOff, Mic, MessageSquare, X, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PanicCallUIProps {
  isOpen: boolean
  onClose: () => void
}

export function PanicCallUI({ isOpen, onClose }: PanicCallUIProps) {
  const [callState, setCallState] = useState<'connecting' | 'connected'>('connecting')
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [showResolvePrompt, setShowResolvePrompt] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setCallState('connecting')
      setCallDuration(0)
      setIsMuted(false)
      setShowResolvePrompt(false)

      // Simulate connection after 2 seconds
      const connectTimer = setTimeout(() => {
        setCallState('connected')
      }, 2000)

      return () => clearTimeout(connectTimer)
    }
  }, [isOpen])

  useEffect(() => {
    if (callState === 'connected') {
      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [callState])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    setShowResolvePrompt(true)
  }

  const handleResolveResponse = () => {
    setShowResolvePrompt(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex flex-col"
        >
          {showResolvePrompt ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-2">Was your emergency resolved?</h2>
              <p className="text-gray-400 text-center mb-8">Let us know so we can close this incident</p>
              
              <div className="w-full max-w-xs space-y-3">
                <Button
                  onClick={handleResolveResponse}
                  className="w-full h-12 bg-minor hover:bg-minor/90 text-white rounded-xl"
                >
                  Yes, resolved
                </Button>
                <Button
                  onClick={handleResolveResponse}
                  variant="outline"
                  className="w-full h-12 border-gray-600 text-white hover:bg-gray-800 rounded-xl"
                >
                  No, I still need help
                </Button>
                <Button
                  onClick={handleResolveResponse}
                  variant="ghost"
                  className="w-full h-12 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl"
                >
                  Still in progress
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                {/* Pulsing circle */}
                <div className="relative mb-8">
                  {callState === 'connecting' ? (
                    <>
                      <motion.div
                        className="absolute inset-0 w-32 h-32 bg-critical rounded-full"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <div className="w-32 h-32 bg-critical rounded-full flex items-center justify-center relative z-10">
                        <Phone className="w-12 h-12 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        className="absolute inset-0 w-32 h-32 bg-minor rounded-full"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.3, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="w-32 h-32 bg-minor rounded-full flex items-center justify-center relative z-10">
                        <Volume2 className="w-12 h-12 text-white" />
                      </div>
                    </>
                  )}
                </div>

                {/* Status */}
                <div className="text-center mb-4">
                  {callState === 'connecting' ? (
                    <motion.p
                      className="text-lg text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Connecting to EMS Control Centre
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ...
                      </motion.span>
                    </motion.p>
                  ) : (
                    <>
                      <p className="text-lg text-white font-semibold">Connected</p>
                      <p className="text-gray-400">Control Centre - Dispatch Unit 7</p>
                    </>
                  )}
                </div>

                {/* Call timer */}
                {callState === 'connected' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-mono text-white"
                  >
                    {formatDuration(callDuration)}
                  </motion.p>
                )}

                {/* Audio waveform */}
                {callState === 'connected' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-1 h-8 mt-6"
                  >
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-minor rounded-full"
                        animate={{
                          height: ['4px', `${Math.random() * 20 + 8}px`, '4px'],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.05,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Controls */}
              {callState === 'connected' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 pb-10"
                >
                  <div className="flex items-center justify-center gap-6">
                    {/* Mute */}
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={cn(
                        'w-14 h-14 rounded-full flex items-center justify-center transition-colors',
                        isMuted ? 'bg-critical' : 'bg-gray-700 hover:bg-gray-600'
                      )}
                    >
                      {isMuted ? (
                        <MicOff className="w-6 h-6 text-white" />
                      ) : (
                        <Mic className="w-6 h-6 text-white" />
                      )}
                    </button>

                    {/* End call */}
                    <button
                      onClick={handleEndCall}
                      className="w-16 h-16 bg-critical rounded-full flex items-center justify-center hover:bg-critical/90 transition-colors"
                    >
                      <X className="w-8 h-8 text-white" />
                    </button>

                    {/* Text */}
                    <button className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
