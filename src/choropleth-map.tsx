'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface ChoroplethFeatureProperties {
  /**
   * Generic feature properties map to support different regions and schemas.
   */
  [key: string]: unknown
  /**
   * Backwards-compatible defaults for existing Huila-based usages.
   */
  NAME_2?: string
  mock_value?: number
  color?: string
}

export interface ChoroplethMapProps {
  geojsonUrl: string
  /** Map centre [lat, lng]. Defaults to [2.5, -75.5]. */
  center?: [number, number]
  zoom?: number
  height?: string
  width?: string
  /**
   * Name of the property in each feature's properties used as the display label.
   * Defaults to "NAME_2" for backwards compatibility.
   */
  nameProperty?: string
  /**
   * Name of the property in each feature's properties used as the numeric value.
   * Defaults to "mock_value" for backwards compatibility.
   */
  valueProperty?: string
}

export const DSChoroplethMap = ({
  geojsonUrl,
  center = [2.5, -75.5],
  zoom = 8,
  height = '500px',
  width = '100%',
  nameProperty = 'NAME_2',
  valueProperty = 'mock_value',
}: ChoroplethMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const abortController = new AbortController()
    let isCancelled = false

    const map = L.map(mapRef.current).setView(center, zoom)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)

    mapInstanceRef.current = map

    fetch(geojsonUrl, { signal: abortController.signal })
      .then((res) => {
        if (!res.ok)
          throw new Error(`No se pudo cargar el GeoJSON (HTTP ${res.status})`)
        return res.json()
      })
      .then((geojson) => {
        if (isCancelled || !mapInstanceRef.current) {
          return
        }

        const currentMap = mapInstanceRef.current
        if (!currentMap) {
          return
        }

        const layer = L.geoJSON(geojson, {
          style: (feature) => ({
            fillColor: (feature?.properties as ChoroplethFeatureProperties)?.color ?? '#CCCCCC',
            fillOpacity: 0.75,
            color: 'white',
            weight: 1.5,
          }),
          onEachFeature: (feature, featureLayer) => {
            const props = feature.properties as ChoroplethFeatureProperties
            const popupContent = document.createElement('div')
            const titleElement = document.createElement('strong')
            titleElement.textContent = props.NAME_2
            popupContent.appendChild(titleElement)
            popupContent.appendChild(document.createElement('br'))
            popupContent.appendChild(
              document.createTextNode(`Valor: ${props.mock_value}`),
            )
            featureLayer.bindPopup(popupContent)
            featureLayer.on('mouseover', (e) => {
              const target = e.target as L.Path
              target.setStyle({ fillOpacity: 0.95, weight: 2.5 })
              target.bringToFront()
            })
            featureLayer.on('mouseout', () => {
              layer.resetStyle(featureLayer)
            })
          },
        }).addTo(currentMap)

        // Zoom to fit all Huila municipalities
        currentMap.fitBounds(layer.getBounds(), { padding: [16, 16] })

        if (!isCancelled) {
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (isCancelled) {
          return
        }
        // Ignore abort errors explicitly signaled by AbortController
        if ((err as any).name === 'AbortError') {
          return
        }
        setError(err.message)
        setLoading(false)
      })

    return () => {
      isCancelled = true
      abortController.abort()
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ position: 'relative', height, width }}>
      {loading && !error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f3f4f6',
            zIndex: 1000,
          }}
        >
          <span className="text-gray-500">Cargando mapa…</span>
        </div>
      )}
      {error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fee2e2',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}
      <div
        ref={mapRef}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg overflow-hidden"
      />
    </div>
  )
}
