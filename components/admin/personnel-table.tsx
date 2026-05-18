'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, MoreHorizontal, UserPlus, Filter, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DUMMY_RESPONDERS, DEPARTMENTS } from '@/lib/dummy-data'
import type { Department } from '@/store/useAppStore'

interface Personnel {
  id: string
  name: string
  surname: string
  employeeId: string
  department: Department
  rank: string
  certifications: string[]
  status: 'on-duty' | 'off-duty' | 'on-leave'
  lastActive: string
}

const DUMMY_PERSONNEL: Personnel[] = [
  ...DUMMY_RESPONDERS.map((r, i) => ({
    id: r.id!,
    name: r.name!,
    surname: r.surname!,
    employeeId: r.employeeId!,
    department: r.department!,
    rank: r.rank!,
    certifications: r.certifications || [],
    status: (i % 3 === 0 ? 'off-duty' : i % 3 === 1 ? 'on-leave' : 'on-duty') as 'on-duty' | 'off-duty' | 'on-leave',
    lastActive: i % 3 === 0 ? '2h ago' : 'Active now',
  })),
  { id: 'p6', name: 'Grace', surname: 'Mbeki', employeeId: 'EMS003', department: 'EMS/Ambulance', rank: 'Senior Paramedic', certifications: ['ALS', 'BLS', 'Paramedic'], status: 'on-duty', lastActive: 'Active now' },
  { id: 'p7', name: 'David', surname: 'Nkosi', employeeId: 'FIRE002', department: 'Fire & Rescue', rank: 'Firefighter', certifications: ['First Responder', 'BLS'], status: 'on-duty', lastActive: 'Active now' },
  { id: 'p8', name: 'Maria', surname: 'Santos', employeeId: 'POL003', department: 'Police/Metro', rank: 'Inspector', certifications: ['First Responder'], status: 'off-duty', lastActive: '4h ago' },
  { id: 'p9', name: 'Themba', surname: 'Zulu', employeeId: 'DM001', department: 'Disaster Management', rank: 'Coordinator', certifications: ['BLS', 'First Responder'], status: 'on-leave', lastActive: '2d ago' },
  { id: 'p10', name: 'Ayesha', surname: 'Khan', employeeId: 'EMS004', department: 'EMS/Ambulance', rank: 'EMT', certifications: ['EMT', 'BLS'], status: 'on-duty', lastActive: 'Active now' },
]

const statusColors = {
  'on-duty': 'bg-green-500/10 text-green-500 border-green-500/20',
  'off-duty': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  'on-leave': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
}

const departmentColors: Record<Department, string> = {
  'EMS/Ambulance': 'bg-medical/10 text-medical border-medical/20',
  'Police/Metro': 'bg-police/10 text-police border-police/20',
  'Fire & Rescue': 'bg-fire/10 text-fire border-fire/20',
  'Disaster Management': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
}

export function PersonnelTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'all'>('all')

  const filteredPersonnel = DUMMY_PERSONNEL.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment =
      departmentFilter === 'all' || person.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Personnel Directory</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search personnel..."
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
                <DropdownMenuItem onClick={() => setDepartmentFilter('all')}>
                  All Departments
                </DropdownMenuItem>
                {DEPARTMENTS.map((dept) => (
                  <DropdownMenuItem
                    key={dept}
                    onClick={() => setDepartmentFilter(dept)}
                  >
                    {dept}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
            <Button className="bg-medical hover:bg-medical/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Personnel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead>Certifications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPersonnel.map((person, index) => (
              <motion.tr
                key={person.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-muted">
                        {person.name[0]}
                        {person.surname[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {person.name} {person.surname}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {person.lastActive}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {person.employeeId}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(departmentColors[person.department])}
                  >
                    {person.department}
                  </Badge>
                </TableCell>
                <TableCell>{person.rank}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {person.certifications.slice(0, 2).map((cert) => (
                      <Badge key={cert} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                    {person.certifications.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{person.certifications.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(statusColors[person.status])}
                  >
                    {person.status.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>View Schedule</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
