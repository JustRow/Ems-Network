'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Truck, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
  color: string
  delay?: number
}

function StatCard({ title, value, change, changeType = 'neutral', icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              {change && (
                <p
                  className={cn(
                    'text-sm flex items-center gap-1',
                    changeType === 'positive' && 'text-green-500',
                    changeType === 'negative' && 'text-red-500',
                    changeType === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  {changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
                  {change}
                </p>
              )}
            </div>
            <div className={cn('p-3 rounded-lg', color)}>{icon}</div>
          </div>
        </CardContent>
        <div className={cn('absolute bottom-0 left-0 right-0 h-1', color)} />
      </Card>
    </motion.div>
  )
}

interface StatsCardsProps {
  stats: {
    totalPersonnel: number
    activeResponders: number
    totalVehicles: number
    availableVehicles: number
    activeIncidents: number
    resolvedToday: number
    avgResponseTime: string
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Personnel"
        value={stats.totalPersonnel}
        change={`${stats.activeResponders} on duty`}
        changeType="neutral"
        icon={<Users className="w-6 h-6 text-white" />}
        color="bg-medical"
        delay={0}
      />
      <StatCard
        title="Fleet Vehicles"
        value={stats.totalVehicles}
        change={`${stats.availableVehicles} available`}
        changeType="positive"
        icon={<Truck className="w-6 h-6 text-white" />}
        color="bg-police"
        delay={0.1}
      />
      <StatCard
        title="Active Incidents"
        value={stats.activeIncidents}
        change="Requiring attention"
        changeType="negative"
        icon={<AlertTriangle className="w-6 h-6 text-white" />}
        color="bg-fire"
        delay={0.2}
      />
      <StatCard
        title="Resolved Today"
        value={stats.resolvedToday}
        change={`Avg ${stats.avgResponseTime}`}
        changeType="positive"
        icon={<CheckCircle className="w-6 h-6 text-white" />}
        color="bg-green-500"
        delay={0.3}
      />
    </div>
  )
}

export function ResponseTimeCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10">
            <Clock className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
            <p className="text-2xl font-bold">8:24</p>
            <p className="text-xs text-green-500">-1:12 from last week</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
