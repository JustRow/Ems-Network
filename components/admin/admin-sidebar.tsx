'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  Truck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Shield,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Logo } from '@/components/ui/logo'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/personnel', icon: Users, label: 'Personnel' },
  { href: '/admin/fleet', icon: Truck, label: 'Fleet Management' },
  { href: '/admin/incidents', icon: FileText, label: 'Incident Logs' },
  { href: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { logout, setRole } = useAppStore()

  const handleLogout = () => {
    logout()
    setRole(null)
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="h-screen bg-card border-r border-border flex flex-col"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-medical flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Logo size="sm" rounded className="w-8 h-8 bg-medical flex items-center justify-center" />
                <div>
                  <h1 className="font-bold text-foreground">EMS Network</h1>
                  <p className="text-xs text-muted-foreground">Admin Portal</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-10 h-10 rounded-lg bg-medical flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 h-11',
                  collapsed && 'justify-center px-0',
                  isActive && 'bg-medical/10 text-medical hover:bg-medical/20'
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground',
            collapsed && 'justify-center px-0'
          )}
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={cn('w-full', collapsed && 'w-10 mx-auto')}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.aside>
  )
}
