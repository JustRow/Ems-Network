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
  Search,
  MoreHorizontal,
  Truck,
  Plus,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DUMMY_VEHICLES } from '@/lib/dummy-data'
import type { Vehicle } from '@/store/useAppStore'

const statusConfig = {
  available: {
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    icon: CheckCircle2,
  },
  dispatched: {
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    icon: Clock,
  },
  returning: {
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    icon: Truck,
  },
}

const typeConfig = {
  ambulance: { color: 'bg-medical/10 text-medical border-medical/20', label: 'Ambulance' },
  police: { color: 'bg-police/10 text-police border-police/20', label: 'Police' },
  fire: { color: 'bg-fire/10 text-fire border-fire/20', label: 'Fire' },
}

export function FleetManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | Vehicle['type']>('all')

  const filteredVehicles = DUMMY_VEHICLES.filter((vehicle) => {
    const matchesSearch =
      vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter
    return matchesSearch && matchesType
  })

  const stats = {
    total: DUMMY_VEHICLES.length,
    available: DUMMY_VEHICLES.filter((v) => v.status === 'available').length,
    dispatched: DUMMY_VEHICLES.filter((v) => v.status === 'dispatched').length,
    needsInspection: DUMMY_VEHICLES.filter((v) => !v.inspectionComplete).length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Fleet</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{stats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dispatched</p>
                <p className="text-2xl font-bold">{stats.dispatched}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Needs Inspection</p>
                <p className="text-2xl font-bold">{stats.needsInspection}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Table */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Fleet Vehicles</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search vehicles..."
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
                  <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('ambulance')}>
                    Ambulance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('police')}>
                    Police
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('fire')}>
                    Fire
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
              <Button className="bg-medical hover:bg-medical/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Inspection</TableHead>
                <TableHead>Inspection Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle, index) => {
                const StatusIcon = statusConfig[vehicle.status].icon
                return (
                  <motion.tr
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2 rounded-lg', typeConfig[vehicle.type].color)}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{vehicle.plate}</p>
                          <p className="text-xs text-muted-foreground">{vehicle.make}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(typeConfig[vehicle.type].color)}>
                        {typeConfig[vehicle.type].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'flex items-center gap-1 w-fit',
                          statusConfig[vehicle.status].color
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vehicle.assignedTo || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {vehicle.lastInspection || (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {vehicle.inspectionComplete ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Required
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Vehicle</DropdownMenuItem>
                          <DropdownMenuItem>View History</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Decommission
                          </DropdownMenuItem>
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
  )
}
