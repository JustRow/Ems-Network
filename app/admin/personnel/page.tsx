'use client'

import { PersonnelTable } from '@/components/admin/personnel-table'

export default function PersonnelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Personnel Management</h1>
        <p className="text-muted-foreground">
          Manage EMS workers, responders, and staff
        </p>
      </div>
      <PersonnelTable />
    </div>
  )
}
