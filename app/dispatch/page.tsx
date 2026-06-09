'use client'

import { useState } from 'react'
import { 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  PhoneOff,
  Clock,
  Coffee,
  LogOut,
  Menu,
  List,
  Car,
  Radio
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EMSMap } from '@/components/map/ems-map'
import { IncidentQueue } from '@/components/dispatcher/incident-queue'
import { VehicleList } from '@/components/dispatcher/vehicle-list'
import { IncidentDetailPanel } from '@/components/dispatcher/incident-detail-panel'
import { NotificationTray } from '@/components/notifications/notification-tray'
import { useAppStore, type Incident, type Vehicle } from '@/store/useAppStore'
import { MAP_CENTER, DUMMY_DISPATCHERS, DUMMY_VEHICLES } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

export default function DispatcherDashboard() {
  const {
    dispatcherStatus,
    setDispatcherStatus,
    addNotification,
    unreadCount,
    activeIncidents,
    updateIncident,
  } = useAppStore()

  const vehicles = DUMMY_VEHICLES
  const dispatchers = DUMMY_DISPATCHERS

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('queue')
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Stats
  const stats = {
    critical: activeIncidents.filter((i) => i.severity === 'critical').length,
    serious: activeIncidents.filter((i) => i.severity === 'serious').length,
    minor: activeIncidents.filter((i) => i.severity === 'minor').length,
  }

  const dispatcher = dispatchers[0]

  const handleDispatch = (incidentId: string, vehicleId: string, notes: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId)
    updateIncident(incidentId, {
      status: 'dispatched',
      assignedVehicle: vehicle?.plate,
      assignedResponder: vehicle?.assignedTo || 'Available Unit',
      dispatcherNotes: notes,
    })

    addNotification({
      type: 'system',
      title: 'Vehicle Dispatched',
      body: `${vehicle?.plate} dispatched to ${activeIncidents.find((i) => i.id === incidentId)?.location.address}`,
    })
    setSelectedIncident(null)
  }

  const statusActions = [
    { 
      id: 'active', 
      label: 'Active', 
      icon: Phone, 
      color: 'bg-on-duty text-white',
      action: () => setDispatcherStatus('active')
    },
    { 
      id: 'on-break', 
      label: 'Break', 
      icon: Coffee, 
      color: 'bg-serious text-black',
      action: () => setDispatcherStatus('on-break')
    },
    { 
      id: 'clocked-out', 
      label: 'Clock Out', 
      icon: LogOut, 
      color: 'bg-muted text-muted-foreground',
      action: () => setDispatcherStatus('clocked-out')
    },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'bg-card border-r border-border flex flex-col transition-all duration-300',
          sidebarCollapsed ? 'w-[60px]' : 'w-[320px]'
        )}
      >
        {/* Sidebar header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-police flex items-center justify-center bg-white">
                <span className="text-police font-bold text-xs">EMS</span>
              </div>
              <span className="font-semibold text-foreground">Dispatch</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Tabs */}
        {!sidebarCollapsed ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 m-3 mb-0">
              <TabsTrigger value="queue" className="text-xs">
                <List className="w-4 h-4 mr-1" />
                Queue
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="text-xs">
                <Car className="w-4 h-4 mr-1" />
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="calls" className="text-xs">
                <Radio className="w-4 h-4 mr-1" />
                Calls
              </TabsTrigger>
            </TabsList>

            <TabsContent value="queue" className="flex-1 overflow-y-auto m-0">
              <IncidentQueue
                incidents={activeIncidents}
                selectedIncidentId={selectedIncident?.id}
                onSelectIncident={setSelectedIncident}
              />
            </TabsContent>

            <TabsContent value="vehicles" className="flex-1 overflow-y-auto m-0">
              <VehicleList
                vehicles={vehicles}
                selectedVehicleId={selectedVehicle?.id}
                onSelectVehicle={setSelectedVehicle}
              />
            </TabsContent>

            <TabsContent value="calls" className="flex-1 overflow-y-auto m-0 p-4">
              <p className="text-muted-foreground text-sm text-center py-8">
                No active calls
              </p>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex-1 flex flex-col items-center py-4 gap-4">
            <button
              onClick={() => { setActiveTab('queue'); setSidebarCollapsed(false); }}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                activeTab === 'queue' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setActiveTab('vehicles'); setSidebarCollapsed(false); }}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                activeTab === 'vehicles' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              <Car className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setActiveTab('calls'); setSidebarCollapsed(false); }}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                activeTab === 'calls' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              <Radio className="w-5 h-5" />
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            {/* Dispatcher info */}
            <div>
              <p className="font-semibold text-foreground">{dispatcher.name}</p>
              <p className="text-xs text-muted-foreground">{dispatcher.area}</p>
            </div>

            {/* Status controls */}
            <div className="flex items-center gap-2">
              {statusActions.map((action) => {
                const Icon = action.icon
                const isActive = dispatcherStatus === action.id

                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className={cn(
                      'px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors',
                      isActive ? action.color : 'bg-muted text-muted-foreground hover:bg-accent'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-critical" />
                <span className="font-semibold text-foreground">{stats.critical}</span>
                <span className="text-xs text-muted-foreground">Priority</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-serious" />
                <span className="font-semibold text-foreground">{stats.serious}</span>
                <span className="text-xs text-muted-foreground">Intermediary</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-minor" />
                <span className="font-semibold text-foreground">{stats.minor}</span>
                <span className="text-xs text-muted-foreground">Minor</span>
              </div>
            </div>

            {/* Notifications */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-critical text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Clock */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </header>

        {/* Map area */}
        <div className="flex-1 relative">
          <EMSMap
            height="100%"
            showHospitals
            showClinics
            showIncidents
            incidents={activeIncidents}
            userLocation={MAP_CENTER}
          />

          {/* Map legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-xl p-3 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Incident Severity</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-critical" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-serious" />
                <span>Serious</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-minor" />
                <span>Minor</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Incident detail panel */}
      <IncidentDetailPanel
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onDispatch={handleDispatch}
      />

      {/* Notification tray */}
      <NotificationTray
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  )
}
