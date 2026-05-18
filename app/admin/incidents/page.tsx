'use client'

import { IncidentLogs } from '@/components/admin/incident-logs'

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Incident Logs</h1>
        <p className="text-muted-foreground">
          View and manage incident records and history
        </p>
      </div>
      <IncidentLogs />
    </div>
  )
}
