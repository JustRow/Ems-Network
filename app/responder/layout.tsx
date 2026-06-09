import { RouteGuard } from '@/components/auth/route-guard'

export default function ResponderLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={['responder', 'admin']} allowUnauthenticated>
      {children}
    </RouteGuard>
  )
}
