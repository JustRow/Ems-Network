import { RouteGuard } from '@/components/auth/route-guard'

export default function DispatchLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={['dispatcher', 'admin']} allowUnauthenticated>
      {children}
    </RouteGuard>
  )
}
