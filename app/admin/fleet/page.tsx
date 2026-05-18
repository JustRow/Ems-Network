'use client'

import { FleetManagement } from '@/components/admin/fleet-management'

export default function FleetPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fleet Management</h1>
        <p className="text-muted-foreground">
          Manage vehicles, maintenance, and assignments
        </p>
      </div>
      <FleetManagement />
    </div>
  )
}
