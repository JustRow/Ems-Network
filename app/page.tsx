'use client'

import { useState, useEffect } from 'react'
import { OnboardingCarousel } from '@/components/onboarding/carousel'
import { RoleSelector } from '@/components/onboarding/role-selector'
import { useAppStore } from '@/store/useAppStore'

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-police flex items-center justify-center bg-white dark:bg-card animate-pulse">
          <span className="text-police font-bold text-lg">EMS</span>
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    return <OnboardingCarousel onComplete={() => setShowOnboarding(false)} />
  }

  return <RoleSelector />
}
