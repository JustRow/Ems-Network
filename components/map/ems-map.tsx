'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Skeleton } from '@/components/ui/skeleton'
import { MAP_CENTER, HOSPITALS, CLINICS } from '@/lib/dummy-data'
import type { Incident } from '@/store/useAppStore'

// Set Mapbox token
if (typeof window !== 'undefined') {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
}

interface EMSMapProps {
  height?: string
  showHospitals?: boolean
  showClinics?: boolean
  showIncidents?: boolean
  incidents?: Incident[]
  userLocation?: { lat: number; lng: number }
  vehicleLocation?: { lat: number; lng: number }
  routeToUser?: boolean
  className?: string
  onMapClick?: (lngLat: { lng: number; lat: number }) => void
}

export function EMSMap({
  height = '40vh',
  showHospitals = true,
  showClinics = true,
  showIncidents = false,
  incidents = [],
  userLocation,
  vehicleLocation,
  className = '',
  onMapClick,
}: EMSMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const userMarker = useRef<mapboxgl.Marker | null>(null)
  const vehicleMarker = useRef<mapboxgl.Marker | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)

  const initializeMap = useCallback(() => {
    if (!mapContainer.current || map.current) return

    // Check for token
    if (!mapboxgl.accessToken) {
      setMapError('Mapbox token not configured')
      setIsLoading(false)
      return
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [MAP_CENTER.lng, MAP_CENTER.lat],
        zoom: 13,
        attributionControl: false,
      })

      map.current.on('load', () => {
        setIsLoading(false)

        // Add hospitals
        if (showHospitals) {
          HOSPITALS.forEach((hospital) => {
            const el = document.createElement('div')
            el.className = 'hospital-marker'
            el.innerHTML = `
              <div class="w-8 h-8 bg-medical rounded-lg flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-sm">H</span>
              </div>
            `
            new mapboxgl.Marker(el)
              .setLngLat([hospital.lng, hospital.lat])
              .setPopup(new mapboxgl.Popup().setHTML(`<p class="font-semibold">${hospital.name}</p>`))
              .addTo(map.current!)
          })
        }

        // Add clinics
        if (showClinics) {
          CLINICS.forEach((clinic) => {
            const el = document.createElement('div')
            el.className = 'clinic-marker'
            el.innerHTML = `
              <div class="w-6 h-6 bg-fire rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span class="text-white font-bold text-xs">+</span>
              </div>
            `
            new mapboxgl.Marker(el)
              .setLngLat([clinic.lng, clinic.lat])
              .setPopup(new mapboxgl.Popup().setHTML(`<p class="font-semibold">${clinic.name}</p>`))
              .addTo(map.current!)
          })
        }

        // Add user location marker
        if (userLocation) {
          const el = document.createElement('div')
          el.innerHTML = `
            <div class="relative">
              <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              <div class="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
          `
          userMarker.current = new mapboxgl.Marker(el)
            .setLngLat([userLocation.lng, userLocation.lat])
            .addTo(map.current!)
        }
      })

      map.current.on('click', (e) => {
        if (onMapClick) {
          onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat })
        }
      })

      map.current.on('error', () => {
        setMapError('Failed to load map')
        setIsLoading(false)
      })
    } catch {
      setMapError('Failed to initialize map')
      setIsLoading(false)
    }
  }, [showHospitals, showClinics, userLocation, onMapClick])

  // Initialize map
  useEffect(() => {
    initializeMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [initializeMap])

  // Update incidents
  useEffect(() => {
    if (!map.current || !showIncidents) return

    // Clear existing incident markers
    const existingMarkers = document.querySelectorAll('.incident-marker')
    existingMarkers.forEach((el) => el.remove())

    incidents.forEach((incident) => {
      const el = document.createElement('div')
      el.className = 'incident-marker'
      const color = incident.severity === 'critical' ? 'bg-critical' : 
                    incident.severity === 'serious' ? 'bg-serious' : 'bg-minor'
      el.innerHTML = `
        <div class="w-6 h-6 ${color} rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
      `
      new mapboxgl.Marker(el)
        .setLngLat([incident.location.lng, incident.location.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <p class="font-semibold">${incident.incidentType}</p>
          <p class="text-sm text-gray-500">${incident.location.address}</p>
        `))
        .addTo(map.current!)
    })
  }, [incidents, showIncidents])

  // Update vehicle location
  useEffect(() => {
    if (!map.current || !vehicleLocation) return

    if (vehicleMarker.current) {
      vehicleMarker.current.setLngLat([vehicleLocation.lng, vehicleLocation.lat])
    } else {
      const el = document.createElement('div')
      el.innerHTML = `
        <div class="w-10 h-10 bg-medical rounded-lg flex items-center justify-center shadow-lg transform -rotate-45">
          <svg class="w-6 h-6 text-white transform rotate-45" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        </div>
      `
      vehicleMarker.current = new mapboxgl.Marker(el)
        .setLngLat([vehicleLocation.lng, vehicleLocation.lat])
        .addTo(map.current!)
    }
  }, [vehicleLocation])

  if (mapError) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center p-4">
          <p className="text-muted-foreground text-sm">{mapError}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add NEXT_PUBLIC_MAPBOX_TOKEN to enable maps
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
    </div>
  )
}
