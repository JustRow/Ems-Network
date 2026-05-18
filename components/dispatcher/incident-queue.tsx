'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  User, 
  ChevronRight,
  Phone,
  Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Incident } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

interface IncidentQueueProps {
  incidents: Incident[]
  selectedIncidentId?: string
  onSelectIncident: (incident: Incident) => void
  isLoading?: boolean
}

export function IncidentQueue({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  isLoading = false,
}: IncidentQueueProps) {
  // Sort incidents by severity (critical first) then by time
  const sortedIncidents = [...incidents].sort((a, b) => {
    const severityOrder = { critical: 0, serious: 1, minor: 2 }
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity]
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  const severityColors = {
    critical: 'border-l-critical bg-critical/5',
    serious: 'border-l-serious bg-serious/5',
    minor: 'border-l-minor bg-minor/5',
  }

  const severityBadgeColors = {
    critical: 'bg-critical text-white',
    serious: 'bg-serious text-black',
    minor: 'bg-minor text-white',
  }

  const typeColors = {
    police: 'text-police',
    medical: 'text-medical',
    fire: 'text-fire',
  }

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-border">
            <div className="flex items-start gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2 p-3">
      <AnimatePresence>
        {sortedIncidents.map((incident, index) => {
          const isSelected = incident.id === selectedIncidentId
          const minutesAgo = Math.round(
            (Date.now() - new Date(incident.timestamp).getTime()) / 60000
          )

          return (
            <motion.button
              key={incident.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectIncident(incident)}
              className={cn(
                'w-full p-3 rounded-xl border-l-4 text-left transition-all',
                severityColors[incident.severity],
                isSelected
                  ? 'ring-2 ring-primary shadow-md'
                  : 'hover:shadow-sm'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  severityBadgeColors[incident.severity]
                )}>
                  <AlertTriangle className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn('font-semibold text-sm', typeColors[incident.type])}>
                      {incident.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {minutesAgo}m
                    </span>
                  </div>

                  <p className="font-medium text-foreground text-sm truncate">
                    {incident.incidentType}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">
                      {incident.patientName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">
                      {incident.location.address}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {incident.status === 'pending' && (
                    <span className="px-2 py-0.5 bg-critical/20 text-critical text-xs rounded-full font-medium">
                      Pending
                    </span>
                  )}
                  {incident.status === 'dispatched' && (
                    <span className="px-2 py-0.5 bg-on-duty/20 text-on-duty text-xs rounded-full font-medium">
                      Dispatched
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
