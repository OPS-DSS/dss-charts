'use client'

import { useMemo, useState } from 'react'

export interface ScatterPoint {
  x: number
  y: number
  label: string
  /** Optional bubble size (e.g. population or births). When provided, dot
   *  radius is scaled proportionally. */
  size?: number
}

export interface DSScatterChartProps {
  data: ScatterPoint[]
  xLabel?: string
  yLabel?: string
  height?: number
  width?: number
  /** Fraction of extreme points (by y-value or size) to label.
   *  0 = no labels, 1 = label all. Defaults to 0.15. */
  labelFraction?: number
}

function linearRegression(
  points: Array<{ x: number; y: number }>,
): { slope: number; intercept: number } | null {
  const n = points.length
  if (n < 2) return null
  const sumX = points.reduce((s, p) => s + p.x, 0)
  const sumY = points.reduce((s, p) => s + p.y, 0)
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0)
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0)
  const denom = n * sumX2 - sumX * sumX
  if (Math.abs(denom) < 1e-12) return null
  const slope = (n * sumXY - sumX * sumY) / denom
  const intercept = (sumY - slope * sumX) / n
  return { slope, intercept }
}

function quantile(arr: number[], q: number): number {
  const sorted = [...arr].sort((a, b) => a - b)
  const pos = q * (sorted.length - 1)
  const lo = Math.floor(pos)
  const hi = Math.ceil(pos)
  return sorted[lo]! + ((sorted[hi] ?? sorted[lo]!) - sorted[lo]!) * (pos - lo)
}

export const DSScatterChart = ({
  data,
  xLabel,
  yLabel,
  height,
  width,
  labelFraction = 0.15,
}: DSScatterChartProps) => {
  const [hovered, setHovered] = useState<number | null>(null)

  const validData = useMemo(
    () => data.filter((d) => Number.isFinite(d.x) && Number.isFinite(d.y)),
    [data],
  )

  const regression = useMemo(() => linearRegression(validData), [validData])

  // Dot radius scale (when size provided) — computed before labelSet so it
  // can be used in the label-selection logic
  const hasSizes = useMemo(
    () => validData.some((d) => (d.size ?? 0) > 0),
    [validData],
  )
  // Determine which points get a permanent label
  const labelSet = useMemo(() => {
    if (labelFraction <= 0 || validData.length === 0) return new Set<number>()
    const ys = validData.map((d) => d.y)
    const yQ = quantile(ys, 1 - labelFraction)
    const set = new Set<number>()
    if (hasSizes) {
      // Only apply size-based threshold when at least one point has a real size
      const sizes = validData.map((d) => d.size ?? 0)
      const sQ = quantile(sizes, 1 - labelFraction)
      validData.forEach((d, i) => {
        if (d.y >= yQ || (d.size ?? 0) >= sQ) set.add(i)
      })
    } else {
      validData.forEach((d, i) => {
        if (d.y >= yQ) set.add(i)
      })
    }
    return set
  }, [validData, labelFraction, hasSizes])

  const maxSize = hasSizes ? Math.max(...validData.map((d) => d.size ?? 0)) : 1
  const dotRadius = (d: ScatterPoint) => {
    if (!hasSizes) return 5
    const r = Math.sqrt((d.size ?? 0) / maxSize) * 12 + 3
    return Math.max(3, r)
  }

  if (validData.length === 0) {
    return (
      <p
        style={{
          color: '#6b7280',
          fontStyle: 'italic',
          textAlign: 'center',
          padding: '2rem 0',
        }}
      >
        No hay datos disponibles.
      </p>
    )
  }

  // Layout
  const padLeft = 62
  const padRight = 24
  const padTop = 24
  const padBottom = 54
  const totalWidth = width ?? 640
  const totalHeight = height ?? 420
  const plotW = totalWidth - padLeft - padRight
  const plotH = totalHeight - padTop - padBottom

  const xs = validData.map((d) => d.x)
  const ys = validData.map((d) => d.y)
  const xSpan = Math.max(...xs) - Math.min(...xs) || 1
  const ySpan = Math.max(...ys) - Math.min(...ys) || 1
  const xPad = xSpan * 0.12
  const yPad = ySpan * 0.18

  const xDom = { min: Math.min(...xs) - xPad, max: Math.max(...xs) + xPad }
  const yDom = { min: Math.min(...ys) - yPad, max: Math.max(...ys) + yPad }

  const xScale = (v: number) =>
    padLeft + ((v - xDom.min) / (xDom.max - xDom.min)) * plotW
  const yScale = (v: number) =>
    padTop + plotH - ((v - yDom.min) / (yDom.max - yDom.min)) * plotH

  const nTicks = 5
  const xTicks = Array.from(
    { length: nTicks },
    (_, i) => xDom.min + (i / (nTicks - 1)) * (xDom.max - xDom.min),
  )
  const yTicks = Array.from(
    { length: nTicks },
    (_, i) => yDom.min + (i / (nTicks - 1)) * (yDom.max - yDom.min),
  )

  const trendY = (x: number) =>
    regression ? regression.slope * x + regression.intercept : 0

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      role="img"
      aria-label="Gráfico de dispersión"
    >
      {/* Grid lines */}
      {xTicks.map((t, i) => (
        <line
          key={`xg-${i}`}
          x1={xScale(t)}
          x2={xScale(t)}
          y1={padTop}
          y2={padTop + plotH}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      ))}
      {yTicks.map((t, i) => (
        <line
          key={`yg-${i}`}
          x1={padLeft}
          x2={padLeft + plotW}
          y1={yScale(t)}
          y2={yScale(t)}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      ))}

      {/* Axes */}
      <line
        x1={padLeft}
        x2={padLeft + plotW}
        y1={padTop + plotH}
        y2={padTop + plotH}
        stroke="#9ca3af"
        strokeWidth={1}
      />
      <line
        x1={padLeft}
        x2={padLeft}
        y1={padTop}
        y2={padTop + plotH}
        stroke="#9ca3af"
        strokeWidth={1}
      />

      {/* X tick labels */}
      {xTicks.map((t, i) => (
        <g key={`xt-${i}`}>
          <line
            x1={xScale(t)}
            x2={xScale(t)}
            y1={padTop + plotH}
            y2={padTop + plotH + 4}
            stroke="#9ca3af"
            strokeWidth={1}
          />
          <text
            x={xScale(t)}
            y={padTop + plotH + 15}
            textAnchor="middle"
            fontSize={10}
            fill="#6b7280"
          >
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      {/* Y tick labels */}
      {yTicks.map((t, i) => (
        <g key={`yt-${i}`}>
          <line
            x1={padLeft - 4}
            x2={padLeft}
            y1={yScale(t)}
            y2={yScale(t)}
            stroke="#9ca3af"
            strokeWidth={1}
          />
          <text
            x={padLeft - 8}
            y={yScale(t) + 4}
            textAnchor="end"
            fontSize={10}
            fill="#6b7280"
          >
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      {/* Trendline */}
      {regression && (
        <line
          x1={xScale(xDom.min)}
          y1={yScale(trendY(xDom.min))}
          x2={xScale(xDom.max)}
          y2={yScale(trendY(xDom.max))}
          stroke="#6b7280"
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
      )}

      {/* Data points (render non-hovered first, hovered on top) */}
      {validData.map((d, i) => {
        const cx = xScale(d.x)
        const cy = yScale(d.y)
        const r = dotRadius(d)
        const isHovered = hovered === i
        const showLabel = labelSet.has(i) || isHovered

        return (
          <g
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'default' }}
          >
            <circle
              cx={cx}
              cy={cy}
              r={isHovered ? r + 2 : r}
              fill="#3b82f6"
              stroke="#fff"
              strokeWidth={1.5}
              opacity={0.7}
            />
            {showLabel && (
              <text
                x={cx}
                y={cy - r - 4}
                textAnchor="middle"
                fontSize={isHovered ? 11 : 9}
                fill={isHovered ? '#1d4ed8' : '#374151'}
                fontWeight={isHovered ? 600 : 400}
              >
                {d.label}
              </text>
            )}
            {isHovered && (
              <text
                x={cx}
                y={cy + r + 14}
                textAnchor="middle"
                fontSize={10}
                fill="#1d4ed8"
                fontWeight={600}
              >
                ({d.x.toFixed(1)}, {d.y.toFixed(1)})
              </text>
            )}
          </g>
        )
      })}

      {/* Axis labels */}
      {xLabel && (
        <text
          x={padLeft + plotW / 2}
          y={totalHeight - 6}
          textAnchor="middle"
          fontSize={11}
          fill="#374151"
        >
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text
          x={12}
          y={padTop + plotH / 2}
          textAnchor="middle"
          fontSize={11}
          fill="#374151"
          transform={`rotate(-90, 12, ${padTop + plotH / 2})`}
        >
          {yLabel}
        </text>
      )}
    </svg>
  )
}
