'use client'

import { motion } from 'framer-motion'
import { StatsCards } from '@/components/admin/stats-cards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EMSMap } from '@/components/map/ems-map'
import { DUMMY_INCIDENTS, DUMMY_VEHICLES, DUMMY_RESPONDERS } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  MapPin,
  Shield,
  Flame,
  Cross,
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { Severity } from '@/store/useAppStore'

const severityConfig: Record<Severity, { color: string }> = {
  critical: { color: 'bg-critical/10 text-critical border-critical/20' },
  serious: { color: 'bg-serious/10 text-serious border-serious/20' },
  minor: { color: 'bg-minor/10 text-minor border-minor/20' },
}

const typeIcons = {
  medical: Cross,
  police: Shield,
  fire: Flame,
}

export default function AdminDashboard() {
  const stats = {
    totalPersonnel: DUMMY_RESPONDERS.length + 15,
    activeResponders: Math.floor(DUMMY_RESPONDERS.length * 0.7) + 8,
    totalVehicles: DUMMY_VEHICLES.length,
    availableVehicles: DUMMY_VEHICLES.filter((v) => v.status === 'available').length,
    activeIncidents: DUMMY_INCIDENTS.filter((i) => i.status !== 'resolved').length,
    resolvedToday: 12,
    avgResponseTime: '8:24',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of EMS Network operations
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border">
              <CardTitle>Live Operations Map</CardTitle>
              <Link href="/dispatch">
                <Button variant="outline" size="sm">
                  Open Dispatch
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <EMSMap
                height="400px"
                showIncidents
                incidents={DUMMY_INCIDENTS}
                showHospitals
                showClinics
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Active Incidents
              </CardTitle>
              <Link href="/admin/incidents">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {DUMMY_INCIDENTS.slice(0, 5).map((incident) => {
                  const TypeIcon = typeIcons[incident.type]
                  return (
                    <div
                      key={incident.id}
                      className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'p-2 rounded-lg shrink-0',
                            incident.type === 'medical' && 'bg-medical/10',
                            incident.type === 'police' && 'bg-police/10',
                            incident.type === 'fire' && 'bg-fire/10'
                          )}
                        >
                          <TypeIcon
                            className={cn(
                              'w-4 h-4',
                              incident.type === 'medical' && 'text-medical',
                              incident.type === 'police' && 'text-police',
                              incident.type === 'fire' && 'text-fire'
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">
                              {incident.incidentType}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                'shrink-0',
                                severityConfig[incident.severity].color
                              )}
                            >
                              {incident.severity}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                              {incident.location.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(incident.timestamp, {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/personnel">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Shield className="w-6 h-6 text-medical" />
                  <span>Personnel</span>
                </Button>
              </Link>
              <Link href="/admin/fleet">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Cross className="w-6 h-6 text-police" />
                  <span>Fleet</span>
                </Button>
              </Link>
              <Link href="/admin/incidents">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <AlertTriangle className="w-6 h-6 text-fire" />
                  <span>Incidents</span>
                </Button>
              </Link>
              <Link href="/dispatch">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Flame className="w-6 h-6 text-amber-500" />
                  <span>Dispatch</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
