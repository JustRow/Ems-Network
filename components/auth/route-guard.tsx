'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppStore, type UserRole } from '@/store/useAppStore'

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  allowUnauthenticated?: boolean
}

export function RouteGuard({ children, allowedRoles, allowUnauthenticated = false }: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn, role } = useAppStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    if (!isLoggedIn) {
      if (!allowUnauthenticated) {
        router.push('/')
      }
      return
    }

    if (!allowedRoles.includes(role)) {
      if (role === 'patient') {
        router.push('/app')
      } else if (role === 'responder') {
        router.push('/responder')
      } else if (role === 'dispatcher') {
        router.push('/dispatch')
      } else if (role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }
  }, [isClient, isLoggedIn, role, router, allowedRoles, pathname, allowUnauthenticated])

  // Prevent rendering children if not yet hydrated or not allowed
  if (!isClient || (!isLoggedIn && !allowUnauthenticated) || (isLoggedIn && !allowedRoles.includes(role))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
