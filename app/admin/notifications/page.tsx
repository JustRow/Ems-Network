'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  Settings,
  Volume2,
  Vibrate,
  Mail,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DUMMY_NOTIFICATIONS } from '@/lib/dummy-data'
import { formatDistanceToNow } from 'date-fns'

const typeConfig = {
  critical: { icon: AlertTriangle, color: 'text-critical bg-critical/10' },
  inspection: { icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
  'off-duty': { icon: Clock, color: 'text-blue-500 bg-blue-500/10' },
  resolved: { icon: CheckCircle2, color: 'text-green-500 bg-green-500/10' },
  system: { icon: Bell, color: 'text-muted-foreground bg-muted' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS)
  const [settings, setSettings] = useState({
    sound: true,
    vibration: true,
    email: false,
    criticalOnly: false,
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Manage alerts and notification preferences
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="bg-critical/10 text-critical">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-border">
              <CardTitle>Recent Notifications</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllRead}>
                  Mark all read
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification, index) => {
                    const config = typeConfig[notification.type]
                    const Icon = config.icon
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={cn(
                          'p-4 hover:bg-muted/50 transition-colors cursor-pointer',
                          !notification.read && 'bg-muted/30'
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn('p-2 rounded-lg', config.color)}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{notification.title}</p>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-critical" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.body}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDistanceToNow(notification.timestamp, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label>Sound Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sound for new notifications
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.sound}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, sound: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Vibrate className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label>Vibration</Label>
                    <p className="text-sm text-muted-foreground">
                      Vibrate device on new notifications
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.vibration}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, vibration: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email for critical alerts
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.email}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, email: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label>Critical Only</Label>
                    <p className="text-sm text-muted-foreground">
                      Only receive critical emergency alerts
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.criticalOnly}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, criticalOnly: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
