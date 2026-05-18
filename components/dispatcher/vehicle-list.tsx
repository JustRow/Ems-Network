'use client'

import { motion } from 'framer-motion'
import { Car, User, Clock, MapPin, AlertTriangle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { Vehicle } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

interface VehicleListProps {
  vehicles: Vehicle[]
  selectedVehicleId?: string
  onSelectVehicle: (vehicle: Vehicle) => void
  isLoading?: boolean
}

export function VehicleList({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  isLoading = false,
}: VehicleListProps) {
  const statusColors = {
    available: 'bg-on-duty text-white',
    dispatched: 'bg-serious text-black',
    returning: 'bg-helpline text-white',
  }

  const typeColors = {
    ambulance: 'bg-medical',
    police: 'bg-police',
    fire: 'bg-fire',
  }

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Group by status
  const available = vehicles.filter((v) => v.status === 'available')
  const dispatched = vehicles.filter((v) => v.status === 'dispatched')
  const returning = vehicles.filter((v) => v.status === 'returning')

  const renderVehicle = (vehicle: Vehicle) => {
    const isSelected = vehicle.id === selectedVehicleId

    return (
      <motion.button
        key={vehicle.id}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onSelectVehicle(vehicle)}
        className={cn(
          'w-full p-3 rounded-xl text-left transition-all',
          isSelected
            ? 'ring-2 ring-primary shadow-md bg-accent'
            : 'bg-muted hover:bg-accent/50'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', typeColors[vehicle.type])}>
            <Car className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm">{vehicle.plate}</p>
            <p className="text-xs text-muted-foreground">{vehicle.make}</p>
            {vehicle.assignedTo && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <User className="w-3 h-3" />
                {vehicle.assignedTo}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[vehicle.status])}>
              {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
            </span>
            {!vehicle.inspectionComplete && (
              <span className="px-2 py-0.5 bg-critical/20 text-critical text-xs rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                No inspection
              </span>
            )}
          </div>
        </div>
      </motion.button>
    )
  }

  return (
    <div className="p-3 space-y-4">
      {available.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
            Available ({available.length})
          </h4>
          <div className="space-y-2">
            {available.map(renderVehicle)}
          </div>
        </div>
      )}

      {dispatched.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
            Dispatched ({dispatched.length})
          </h4>
          <div className="space-y-2">
            {dispatched.map(renderVehicle)}
          </div>
        </div>
      )}

      {returning.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
            Returning ({returning.length})
          </h4>
          <div className="space-y-2">
            {returning.map(renderVehicle)}
          </div>
        </div>
      )}
    </div>
  )
}
