'use client'

import { useState, useEffect } from 'react'
import { OnboardingCarousel } from '@/components/onboarding/carousel'
import { RoleSelector } from '@/components/onboarding/role-selector'
import { useAppStore } from '@/store/useAppStore'
import { Logo } from '@/components/ui/logo'

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const hasOnboarded = useAppStore((state) => state.hasOnboarded)

  useEffect(() => {
    // Check localStorage for onboarding status
    const onboarded = localStorage.getItem('ems_onboarded') === 'true'
    setShowOnboarding(!onboarded && !hasOnboarded)
    setIsLoading(false)
  }, [hasOnboarded])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Logo size="lg" rounded className="border-4 border-police bg-white dark:bg-card animate-pulse" />
      </div>
    )
  }

  if (showOnboarding) {
    return <OnboardingCarousel onComplete={() => setShowOnboarding(false)} />
  }

  return <RoleSelector />
}
