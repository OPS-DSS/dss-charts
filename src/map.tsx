'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapProps {
  center: [number, number]
  zoom?: number
  markers?: Array<{
    position: [number, number]
    popup?: string
    color?: string
  }>
  height?: string
  width?: string
}

export const DSMap = ({
  center,
  zoom = 6,
  markers = [],
  height = '400px',
  width = '100%',
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)

    mapInstanceRef.current = map

    // Add markers
    markers.forEach((marker) => {
      const leafletMarker = L.marker(marker.position).addTo(map)
      if (marker.popup) {
        leafletMarker.bindPopup(marker.popup)
      }
    })

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [center, zoom, markers])

  return (
    <div
      ref={mapRef}
      style={{ height, width }}
      className="rounded-lg overflow-hidden"
    />
  )
}
