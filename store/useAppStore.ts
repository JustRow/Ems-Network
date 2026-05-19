import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'patient' | 'responder' | 'dispatcher' | 'admin' | null

export type Department = 'EMS/Ambulance' | 'Police/Metro' | 'Fire & Rescue' | 'Disaster Management'

export type EmergencyType = 'police' | 'medical' | 'fire'

export type Severity = 'critical' | 'serious' | 'minor'

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface Vehicle {
  id: string
  plate: string
  make: string
  type: 'ambulance' | 'police' | 'fire'
  status: 'available' | 'dispatched' | 'returning'
  assignedTo?: string
  lastInspection?: string
  inspectionComplete: boolean
}

export interface User {
  id: string
  name: string
  surname: string
  dateOfBirth: string
  gender: string
  language: string
  bloodType: string
  weight: number
  height: number
  medicalConditions: string[]
  medications: string
  medicalAid: string
  medicalAidNumber: string
  insurer: string
  preferredGP: string
  emergencyContacts: EmergencyContact[]
  profilePhoto?: string
  // EMS Worker fields
  employeeId?: string
  department?: Department
  rank?: string
  certifications?: string[]
  assignedVehicle?: Vehicle
  partners?: string[]
  radioChannel?: string
}

export interface Incident {
  id: string
  type: EmergencyType
  incidentType: string
  severity: Severity
  description: string
  patientId: string
  patientName: string
  patientAge?: number
  patientBloodType?: string
  patientConditions?: string[]
  patientLanguage?: string
  location: {
    lat: number
    lng: number
    address: string
  }
  timestamp: Date
  status: 'pending' | 'dispatched' | 'in-progress' | 'resolved'
  assignedVehicle?: string
  assignedResponder?: string
  dispatcherNotes?: string
}

export interface Notification {
  id: string
  type: 'critical' | 'inspection' | 'off-duty' | 'resolved' | 'system'
  title: string
  body: string
  timestamp: Date
  read: boolean
}

interface AppState {
  // Onboarding
  hasOnboarded: boolean
  setHasOnboarded: (value: boolean) => void
  
  // Role
  role: UserRole
  setRole: (role: UserRole) => void
  
  // User
  user: User | null
  setUser: (user: User | null) => void
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
  
  // Duty Status (Responder)
  isOnDuty: boolean
  setOnDuty: (value: boolean) => void
  shiftStartTime: Date | null
  setShiftStartTime: (time: Date | null) => void
  
  // Vehicle & Inspection
  currentVehicle: Vehicle | null
  setCurrentVehicle: (vehicle: Vehicle | null) => void
  inspectionComplete: boolean
  setInspectionComplete: (value: boolean) => void
  
  // Incidents
  activeIncidents: Incident[]
  addIncident: (incident: Incident) => void
  updateIncident: (id: string, updates: Partial<Incident>) => void
  removeIncident: (id: string) => void
  currentIncident: Incident | null
  setCurrentIncident: (incident: Incident | null) => void
  
  // Active Dispatch (patient's current emergency - session only, not persisted)
  activeDispatch: Incident | null
  setActiveDispatch: (incident: Incident | null) => void
  resolveDispatch: () => void
  
  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void
  unreadCount: number
  
  // Dispatcher
  dispatcherStatus: 'active' | 'on-break' | 'clocked-out'
  setDispatcherStatus: (status: 'active' | 'on-break' | 'clocked-out') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Onboarding
      hasOnboarded: false,
      setHasOnboarded: (value) => set({ hasOnboarded: value }),
      
      // Role
      role: null,
      setRole: (role) => set({ role }),
      
      // User
      user: null,
      setUser: (user) => set({ user }),
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ 
        user: null, 
        isLoggedIn: false, 
        role: null,
        isOnDuty: false, 
        currentVehicle: null,
        currentIncident: null,
        activeDispatch: null,
        inspectionComplete: false,
        shiftStartTime: null,
      }),
      
      // Duty Status
      isOnDuty: false,
      setOnDuty: (value) => set({ isOnDuty: value }),
      shiftStartTime: null,
      setShiftStartTime: (time) => set({ shiftStartTime: time }),
      
      // Vehicle & Inspection
      currentVehicle: null,
      setCurrentVehicle: (vehicle) => set({ currentVehicle: vehicle }),
      inspectionComplete: false,
      setInspectionComplete: (value) => set({ inspectionComplete: value }),
      
      // Incidents
      activeIncidents: [],
      addIncident: (incident) => set((state) => ({ 
        activeIncidents: [...state.activeIncidents, incident] 
      })),
      updateIncident: (id, updates) => set((state) => ({
        activeIncidents: state.activeIncidents.map((i) => 
          i.id === id ? { ...i, ...updates } : i
        )
      })),
      removeIncident: (id) => set((state) => ({
        activeIncidents: state.activeIncidents.filter((i) => i.id !== id)
      })),
      currentIncident: null,
      setCurrentIncident: (incident) => set({ currentIncident: incident }),
      
      // Active Dispatch (patient's current emergency)
      activeDispatch: null,
      setActiveDispatch: (incident) => set({ activeDispatch: incident }),
      resolveDispatch: () => set({ activeDispatch: null }),
      
      // Notifications
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Math.random().toString(36).substring(7),
            timestamp: new Date(),
            read: false,
          },
          ...state.notifications,
        ],
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      })),
      clearNotifications: () => set({ notifications: [] }),
      unreadCount: 0, // Placeholder - use selector instead
      
      // Dispatcher
      dispatcherStatus: 'clocked-out',
      setDispatcherStatus: (status) => set({ dispatcherStatus: status }),
    }),
    {
      name: 'ems-network-storage',
      partialize: (state) => ({
        hasOnboarded: state.hasOnboarded,
        role: state.role,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
)

// Derived selector for unread notification count
export const useUnreadCount = () => useAppStore((state) => 
  state.notifications.filter((n) => !n.read).length
)
