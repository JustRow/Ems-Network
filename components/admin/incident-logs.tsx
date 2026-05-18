'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  MoreHorizontal,
  Filter,
  Download,
  MapPin,
  Clock,
  User,
  Truck,
  FileText,
  Calendar,
  AlertTriangle,
  Shield,
  Flame,
  Cross,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DUMMY_INCIDENTS } from '@/lib/dummy-data'
import type { Incident, Severity } from '@/store/useAppStore'
import { formatDistanceToNow } from 'date-fns'

const severityConfig: Record<Severity, { color: string; label: string }> = {
  critical: { color: 'bg-critical/10 text-critical border-critical/20', label: 'Critical' },
  serious: { color: 'bg-serious/10 text-serious border-serious/20', label: 'Serious' },
  minor: { color: 'bg-minor/10 text-minor border-minor/20', label: 'Minor' },
}

const statusConfig = {
  pending: { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', label: 'Pending' },
  dispatched: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', label: 'Dispatched' },
  'in-progress': { color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', label: 'In Progress' },
  resolved: { color: 'bg-green-500/10 text-green-500 border-green-500/20', label: 'Resolved' },
}

const typeIcons = {
  medical: Cross,
  police: Shield,
  fire: Flame,
}

// Extended dummy data with historical incidents
const EXTENDED_INCIDENTS: Incident[] = [
  ...DUMMY_INCIDENTS,
  {
    id: 'inc4',
    type: 'medical',
    incidentType: 'Road Traffic Accident',
    severity: 'serious',
    description: 'Two vehicle collision, multiple injuries reported',
    patientId: 'p4',
    patientName: 'Multiple Patients',
    location: { lat: -26.0156, lng: 28.2201, address: 'N1 Highway Offramp, Midrand' },
    timestamp: new Date(Date.now() - 2 * 3600000),
    status: 'resolved',
    assignedVehicle: 'GP 123 EMS',
    assignedResponder: 'Thabo Mokoena',
  },
  {
    id: 'inc5',
    type: 'police',
    incidentType: 'Domestic Violence',
    severity: 'serious',
    description: 'Domestic dispute, caller reports physical altercation',
    patientId: 'p5',
    patientName: 'Anonymous Caller',
    location: { lat: -26.0078, lng: 28.2345, address: '156 Phomolong Section, Tembisa' },
    timestamp: new Date(Date.now() - 4 * 3600000),
    status: 'resolved',
    assignedVehicle: 'JHB METRO 01',
    assignedResponder: 'Constable Khumalo',
  },
  {
    id: 'inc6',
    type: 'fire',
    incidentType: 'Veld Fire',
    severity: 'minor',
    description: 'Small veld fire near residential area, contained',
    patientId: 'p6',
    patientName: 'Community Report',
    location: { lat: -26.0023, lng: 28.2156, address: 'Open Field, Ivory Park' },
    timestamp: new Date(Date.now() - 8 * 3600000),
    status: 'resolved',
    assignedVehicle: 'EKU FIRE 01',
    assignedResponder: 'Captain Dlamini',
  },
]

export function IncidentLogs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Incident['status']>('all')
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)

  const filteredIncidents = EXTENDED_INCIDENTS.filter((incident) => {
    const matchesSearch =
      incident.incidentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeCount = EXTENDED_INCIDENTS.filter((i) => i.status !== 'resolved').length
  const resolvedCount = EXTENDED_INCIDENTS.filter((i) => i.status === 'resolved').length

  return (
    <>
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Incidents</p>
                  <p className="text-2xl font-bold">{activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <FileText className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                  <p className="text-2xl font-bold">{resolvedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-critical/10">
                  <Cross className="w-5 h-5 text-critical" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Medical</p>
                  <p className="text-2xl font-bold">
                    {EXTENDED_INCIDENTS.filter((i) => i.type === 'medical').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-fire/10">
                  <Flame className="w-5 h-5 text-fire" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fire</p>
                  <p className="text-2xl font-bold">
                    {EXTENDED_INCIDENTS.filter((i) => i.type === 'fire').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incidents Table */}
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Incident Log</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search incidents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('dispatched')}>
                      Dispatched
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('in-progress')}>
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('resolved')}>
                      Resolved
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Incident</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident, index) => {
                  const TypeIcon = typeIcons[incident.type]
                  return (
                    <motion.tr
                      key={incident.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'p-2 rounded-lg',
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
                          <div>
                            <p className="font-medium">{incident.incidentType}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {incident.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="line-clamp-1">{incident.location.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(severityConfig[incident.severity].color)}
                        >
                          {severityConfig[incident.severity].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(statusConfig[incident.status].color)}
                        >
                          {statusConfig[incident.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {incident.assignedResponder || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(incident.timestamp, { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Export Report</DropdownMenuItem>
                            <DropdownMenuItem>View Timeline</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Incident Detail Dialog */}
      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-2xl">
          {selectedIncident && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(severityConfig[selectedIncident.severity].color)}
                  >
                    {severityConfig[selectedIncident.severity].label}
                  </Badge>
                  {selectedIncident.incidentType}
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="details" className="mt-4">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Patient</p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{selectedIncident.patientName}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Assigned Vehicle</p>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        <span>{selectedIncident.assignedVehicle || 'Not assigned'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedIncident.location.address}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Time</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDistanceToNow(selectedIncident.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{selectedIncident.description}</p>
                  </div>
                </TabsContent>
                <TabsContent value="timeline" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                      <div>
                        <p className="font-medium">Incident Created</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(selectedIncident.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    {selectedIncident.assignedVehicle && (
                      <div className="flex gap-4">
                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                        <div>
                          <p className="font-medium">
                            Vehicle {selectedIncident.assignedVehicle} dispatched
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Assigned to {selectedIncident.assignedResponder}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedIncident.status === 'resolved' && (
                      <div className="flex gap-4">
                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                        <div>
                          <p className="font-medium">Incident Resolved</p>
                          <p className="text-sm text-muted-foreground">
                            Successfully completed
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
