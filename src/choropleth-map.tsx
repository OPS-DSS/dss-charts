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
   * Backwards-compatible defaults for existing usages.
   */
  NAME_2?: string
  mock_value?: number
  color?: string
}

/**
 * Configuration for an optional base layer rendered underneath the main layer.
 * The base layer is always visible regardless of the main layer selection.
 */
export interface BaseLayerConfig {
  geojsonUrl: string
  /** Property used as the display label. Defaults to nameProperty of the parent map. */
  nameProperty?: string
  /** Property used as the numeric value. Defaults to "value". */
  valueProperty?: string
  /** Human-readable label shown in popups. */
  valueName?: string
}

export interface ChoroplethMapProps {
  /**
   * Optional overlay GeoJSON URL. When provided it renders on top of the base
   * layer at 50% opacity. When omitted, only the base layer is shown at full
   * opacity and the base layer handles click popups.
   */
  geojsonUrl?: string
  /**
   * Optional base layer shown underneath the overlay at full opacity.
   * Clicking a municipality shows data from both layers in the popup.
   */
  baseLayerConfig?: BaseLayerConfig
  /** Map centre [lat, lng]. Defaults to [2.5, -75.5]. */
  center?: [number, number]
  zoom?: number
  height?: string
  width?: string
  /**
   * Name of the property used as the display label (overlay layer).
   * Defaults to "NAME_2" for backwards compatibility.
   */
  nameProperty?: string
  /**
   * Name of the property used as the numeric value (overlay layer).
   * Defaults to "mock_value" for backwards compatibility.
   */
  valueProperty?: string
  valueName?: string
  /**
   * Optional second numeric property to show in the popup (e.g. maternal_value
   * for bivariate maps where the primary value is an education indicator).
   */
  secondaryValueProperty?: string
  secondaryValueName?: string
  /** Optional formatter for the primary numeric value in popups. Defaults to two decimal places. */
  valueFormatter?: (value: number) => string
  /** Fit the map to loaded GeoJSON bounds. Defaults to true. */
  fitBounds?: boolean
}

export const DSChoroplethMap = ({
  geojsonUrl,
  baseLayerConfig,
  center = [2.5, -75.5],
  zoom = 8,
  height = '500px',
  width = '100%',
  nameProperty = 'NAME_2',
  valueProperty = 'mock_value',
  valueName = 'Valor',
  secondaryValueProperty,
  secondaryValueName,
  valueFormatter = (v: number) => v.toFixed(2),
  fitBounds = true,
}: ChoroplethMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null)
  const baseLayerRef = useRef<L.GeoJSON | null>(null)
  // Lookup map: municipality name -> base layer value, populated when base layer loads
  const baseLayerDataRef = useRef<Map<string, number | null>>(new Map())
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Map initialisation — runs once on mount
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current).setView(center, zoom)

    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_background/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; Stadia Maps &copy; Stamen Design &copy; OpenMapTiles &copy; OpenStreetMap contributors',
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Base layer — re-runs when the base layer URL changes
  useEffect(() => {
    const map = mapInstanceRef.current

    // If the base layer config is removed, clean up any existing base layer and data.
    if (!baseLayerConfig) {
      if (baseLayerRef.current) {
        baseLayerRef.current.remove()
        baseLayerRef.current = null
      }
      baseLayerDataRef.current.clear()
      return
    }

    if (!map) return

    const abortController = new AbortController()
    let isCancelled = false

    if (baseLayerRef.current) {
      baseLayerRef.current.remove()
      baseLayerRef.current = null
    }

    // When there is no overlay we manage the loading indicator from here
    if (!geojsonUrl) {
      setLoading(true)
      setError(null)
    }

    const baseNameProp = baseLayerConfig.nameProperty ?? nameProperty
    const baseValueProp = baseLayerConfig.valueProperty ?? 'value'

    fetch(baseLayerConfig.geojsonUrl, { signal: abortController.signal })
      .then((res) => {
        if (!res.ok)
          throw new Error(
            `No se pudo cargar el GeoJSON base (HTTP ${res.status})`,
          )
        return res.json()
      })
      .then((geojson) => {
        if (isCancelled || !mapInstanceRef.current) return

        const currentMap = mapInstanceRef.current

        // Build name -> value lookup for use in overlay popups
        const lookup = new Map<string, number | null>()
        for (const feat of geojson.features ?? []) {
          const props = feat.properties as ChoroplethFeatureProperties
          const name = String(props[baseNameProp] ?? '')
          const val = props[baseValueProp]
          lookup.set(name, typeof val === 'number' ? val : null)
        }
        baseLayerDataRef.current = lookup

        const layer = L.geoJSON(geojson, {
          style: (feature) => ({
            fillColor:
              (feature?.properties as ChoroplethFeatureProperties)?.color ??
              '#CCCCCC',
            fillOpacity: 0.75,
            color: 'white',
            weight: 1.5,
          }),
          // When there is no overlay, the base layer handles all interactions
          onEachFeature: geojsonUrl
            ? undefined
            : (feature, featureLayer) => {
                const props = feature.properties as ChoroplethFeatureProperties
                const featureName = String(props[baseNameProp] ?? '')
                const rawValue = props[baseValueProp]
                const displayValue =
                  rawValue == null || rawValue === ''
                    ? 'Sin datos'
                    : typeof rawValue === 'number'
                      ? (rawValue as number).toFixed(2)
                      : String(rawValue)

                const popupContent = document.createElement('div')
                const title = document.createElement('strong')
                title.textContent = featureName
                popupContent.appendChild(title)
                popupContent.appendChild(document.createElement('br'))
                popupContent.appendChild(
                  document.createTextNode(
                    `${baseLayerConfig.valueName ?? 'Valor'}: ${displayValue}`,
                  ),
                )
                if (secondaryValueProperty && secondaryValueName) {
                  const secRaw = props[secondaryValueProperty]
                  const secDisplay =
                    secRaw == null || secRaw === ''
                      ? 'Sin datos'
                      : typeof secRaw === 'number'
                        ? (secRaw as number).toFixed(2)
                        : String(secRaw)
                  popupContent.appendChild(document.createElement('br'))
                  popupContent.appendChild(
                    document.createTextNode(
                      `${secondaryValueName}: ${secDisplay}`,
                    ),
                  )
                }
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

        baseLayerRef.current = layer

        if (!geojsonUrl) {
          if (fitBounds) currentMap.fitBounds(layer.getBounds(), { padding: [16, 16] })
          if (!isCancelled) setLoading(false)
        } else if (geojsonLayerRef.current) {
          // Ensure the overlay stays on top
          geojsonLayerRef.current.bringToFront()
        }
      })
      .catch((err: Error) => {
        if (isCancelled) return
        if ((err as { name?: string }).name === 'AbortError') return
        if (!geojsonUrl) {
          setError(err.message)
          setLoading(false)
        } else {
          console.error('Base layer error:', err.message)
        }
      })

    return () => {
      isCancelled = true
      abortController.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    baseLayerConfig?.geojsonUrl,
    baseLayerConfig?.nameProperty,
    baseLayerConfig?.valueProperty,
    baseLayerConfig?.valueName,
    // nameProperty is the fallback for baseNameProp when baseLayerConfig.nameProperty is unset
    nameProperty,
    // Popup content depends on these; re-run so handlers always reflect latest props
    secondaryValueProperty,
    secondaryValueName,
    // Re-run when overlay presence changes so popup handlers are added/removed
    !!geojsonUrl,
  ])

  // Main (overlay) GeoJSON layer — re-runs whenever geojsonUrl changes
  useEffect(() => {
    if (!geojsonUrl) {
      // Remove any stale overlay when indicator is deselected
      if (geojsonLayerRef.current) {
        geojsonLayerRef.current.remove()
        geojsonLayerRef.current = null
      }
      // If there is no base layer either, nothing will clear the loading state
      if (!baseLayerConfig?.geojsonUrl) {
        setLoading(false)
        setError(null)
      }
      return
    }

    const map = mapInstanceRef.current
    if (!map) return

    const abortController = new AbortController()
    let isCancelled = false

    setLoading(true)
    setError(null)

    if (geojsonLayerRef.current) {
      geojsonLayerRef.current.remove()
      geojsonLayerRef.current = null
    }

    // Overlay renders at 50% opacity when a base layer is present
    const overlayFillOpacity = baseLayerConfig ? 0.5 : 0.75

    fetch(geojsonUrl, { signal: abortController.signal })
      .then((res) => {
        if (!res.ok)
          throw new Error(`No se pudo cargar el GeoJSON (HTTP ${res.status})`)
        return res.json()
      })
      .then((geojson) => {
        if (isCancelled || !mapInstanceRef.current) return

        const currentMap = mapInstanceRef.current

        const layer = L.geoJSON(geojson, {
          style: (feature) => ({
            fillColor:
              (feature?.properties as ChoroplethFeatureProperties)?.color ??
              '#CCCCCC',
            fillOpacity: overlayFillOpacity,
            color: 'white',
            weight: 1.5,
          }),
          onEachFeature: (feature, featureLayer) => {
            const props = feature.properties as ChoroplethFeatureProperties
            const featureName = String(props[nameProperty] ?? '')
            const rawValue = props[valueProperty]
            const displayValue =
              rawValue == null || rawValue === ''
                ? 'Sin datos'
                : typeof rawValue === 'number'
                  ? valueFormatter(rawValue)
                  : String(rawValue)

            // Helper to build the popup's DOM element.
            // When a baseLayerConfig is present we must defer the base-layer
            // value lookup to click time (the async base-layer fetch may not
            // have resolved yet), so we use a factory.  In all other cases we
            // build the element eagerly so that secondaryValueProperty is
            // captured from the current render's closure with no stale-ref risk.
            const buildPopup = () => {
              const container = document.createElement('div')

              const title = document.createElement('strong')
              title.textContent = featureName
              container.appendChild(title)

              // Base layer row (kept lazy so the lookup is always current)
              if (baseLayerConfig) {
                const baseVal = baseLayerDataRef.current.get(featureName)
                const baseDisplay =
                  baseVal == null || !Number.isFinite(baseVal)
                    ? 'Sin datos'
                    : baseVal.toFixed(2)
                container.appendChild(document.createElement('br'))
                container.appendChild(
                  document.createTextNode(
                    `${baseLayerConfig.valueName ?? 'Capa base'}: ${baseDisplay}`,
                  ),
                )
              }

              // Primary row
              container.appendChild(document.createElement('br'))
              container.appendChild(
                document.createTextNode(`${valueName}: ${displayValue}`),
              )

              // Secondary row (e.g. maternal_value in bivariate mode)
              if (secondaryValueProperty && secondaryValueName) {
                const secRaw = props[secondaryValueProperty]
                const secDisplay =
                  secRaw == null || secRaw === ''
                    ? 'Sin datos'
                    : typeof secRaw === 'number'
                      ? (secRaw as number).toFixed(2)
                      : String(secRaw)
                container.appendChild(document.createElement('br'))
                container.appendChild(
                  document.createTextNode(
                    `${secondaryValueName}: ${secDisplay}`,
                  ),
                )
              }

              return container
            }

            // Use a factory only when base-layer data needs a deferred lookup;
            // otherwise pass the pre-built element to avoid stale closures.
            if (baseLayerConfig) {
              featureLayer.bindPopup(buildPopup)
            } else {
              featureLayer.bindPopup(buildPopup())
            }

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

        geojsonLayerRef.current = layer
        layer.bringToFront()
        currentMap.fitBounds(layer.getBounds(), { padding: [16, 16] })

        if (!isCancelled) setLoading(false)
      })
      .catch((err: Error) => {
        if (isCancelled) return
        if ((err as { name?: string }).name === 'AbortError') return
        setError(err.message)
        setLoading(false)
      })

    return () => {
      isCancelled = true
      abortController.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    geojsonUrl,
    nameProperty,
    valueProperty,
    valueName,
    secondaryValueProperty,
    secondaryValueName,
    baseLayerConfig?.geojsonUrl,
    fitBounds,
  ])

  return (
    <div style={{ position: 'relative', height, width, isolation: 'isolate' }}>
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
