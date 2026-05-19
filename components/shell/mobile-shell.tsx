'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Bell as AlarmIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'

interface MobileShellProps {
  children: ReactNode
  onPanicPress?: () => void
  onProfilePress?: (isLoggedIn: boolean) => void
  centerButton?: 'panic' | 'duty'
}

export function MobileShell({ children, onPanicPress, onProfilePress, centerButton = 'panic' }: MobileShellProps) {
  const { isLoggedIn, user, role } = useAppStore()
  const handleProfileClick = () => {
    if (onProfilePress) {
      onProfilePress(isLoggedIn)
    }
  }
  const pathname = usePathname()

  const isPatient = role === 'patient'
  const homeRoute = isPatient ? '/app' : '/responder'

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[430px] mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between p-4 safe-area-top">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-police flex items-center justify-center bg-white dark:bg-card">
            <span className="text-police font-bold text-xs">EMS</span>
          </div>
          <span className="font-semibold text-foreground">EMS Network</span>
        </div>
        
        {/* Profile / Login button */}
        <button
          onClick={handleProfileClick}
          className="w-11 h-11 rounded-full overflow-hidden border-2 border-border flex items-center justify-center bg-muted hover:bg-accent transition-colors"
        >
          {isLoggedIn && user ? (
            <span className="text-sm font-semibold text-foreground">
              {user.name.charAt(0)}{user.surname.charAt(0)}
            </span>
          ) : (
            <User className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="border-t border-border bg-card/80 backdrop-blur-lg safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {/* Home */}
          <Link
            href={homeRoute}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-xl transition-colors min-w-[64px]',
              pathname === homeRoute ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Center button - Panic or Duty */}
          {centerButton === 'panic' ? (
            <button
              onClick={onPanicPress}
              className="relative -mt-6"
            >
              <div className="absolute inset-0 bg-critical/30 rounded-full animate-pulse-ring" />
              <div className="relative w-16 h-16 bg-background border-2 border-critical rounded-full flex items-center justify-center hover:bg-critical/10 transition-colors">
                <AlarmIcon className="w-7 h-7 text-critical" />
              </div>
            </button>
          ) : (
            <div className="w-16" /> // Placeholder for duty toggle (handled separately)
          )}

          {/* Profile */}
          <button
            onClick={onProfilePress}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-xl transition-colors min-w-[64px]',
              'text-muted-foreground hover:text-foreground'
            )}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
