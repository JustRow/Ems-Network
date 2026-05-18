'use client'

import { useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { 
  Siren, 
  Phone, 
  UserCircle, 
  MapPin, 
  Bell, 
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'

const ONBOARDING_SLIDES = [
  {
    icon: Siren,
    title: 'Welcome to EMS Network',
    description: 'Your direct line to emergency services, first responders, and community safety.',
    color: 'bg-police',
  },
  {
    icon: Phone,
    title: 'Tap the right service',
    description: 'Police, Medical, or Fire. Pick your emergency type and we dispatch the nearest unit.',
    color: 'bg-medical',
  },
  {
    icon: UserCircle,
    title: 'Your profile saves lives',
    description: 'Add your blood type, medical aid, and emergency contacts. Responders see it instantly.',
    color: 'bg-fire',
  },
  {
    icon: MapPin,
    title: 'Track help in real time',
    description: 'Watch your assigned vehicle navigate to you live on the map.',
    color: 'bg-helpline',
  },
  {
    icon: Bell,
    title: 'Panic Button',
    description: 'One tap connects you to our 24/7 control centre. They hear everything.',
    color: 'bg-critical',
  },
  {
    icon: Sparkles,
    title: "You're ready",
    description: "Let's get started. Your safety network is live.",
    color: 'bg-police',
  },
]

interface OnboardingCarouselProps {
  onComplete: () => void
}

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded)
  const isLastSlide = currentSlide === ONBOARDING_SLIDES.length - 1

  const handleComplete = () => {
    setHasOnboarded(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ems_onboarded', 'true')
    }
    onComplete()
  }

  const handleNext = () => {
    if (isLastSlide) {
      handleComplete()
    } else {
      setCurrentSlide((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x < -threshold && currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1)
    } else if (info.offset.x > threshold && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
    }
  }

  const slide = ONBOARDING_SLIDES[currentSlide]
  const Icon = slide.icon

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6 z-50">
      {/* Skip button */}
      {!isLastSlide && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          Skip
        </button>
      )}

      {/* Slide content */}
      <div className="flex-1 flex items-center justify-center w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="flex flex-col items-center text-center cursor-grab active:cursor-grabbing"
          >
            <div className={`${slide.color} w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-lg`}>
              <Icon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3 text-balance">
              {slide.title}
            </h1>
            <p className="text-muted-foreground text-base text-pretty leading-relaxed">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {ONBOARDING_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'w-6 bg-primary'
                : 'bg-muted-foreground/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Action button */}
      {isLastSlide ? (
        <Button
          onClick={handleComplete}
          size="lg"
          className="w-full max-w-sm rounded-xl h-14 text-base font-semibold"
        >
          Get Started
        </Button>
      ) : (
        <Button
          onClick={handleNext}
          size="lg"
          variant="ghost"
          className="w-full max-w-sm rounded-xl h-14 text-base font-semibold"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      )}
    </div>
  )
}
