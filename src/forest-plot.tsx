'use client'

import { useMemo } from 'react'

export interface ForestPlotRow {
  indicador: string
  label: string
  correlacion: number
  ci_lower: number
  ci_upper: number
  p_value: number
  n: number
}

export interface ForestPlotProps {
  data: ForestPlotRow[]
  /** Width of the SVG. Defaults to 100% via ResponsiveContainer pattern */
  width?: number
  height?: number
  /** Show significance markers */
  showSignificance?: boolean
  /** Currently selected indicator key — highlights that row */
  selectedIndicator?: string
  /** Called when user clicks an indicator row */
  onSelectIndicator?: (indicador: string) => void
}

function pStars(p: number): string {
  if (!Number.isFinite(p)) return ''
  if (p < 0.001) return '***'
  if (p < 0.01) return '**'
  if (p < 0.05) return '*'
  if (p < 0.1) return '.'
  return ''
}

function getColor(r: number): string {
  if (!Number.isFinite(r)) return '#9ca3af'
  if (r > 0) return '#5B7BEA'
  if (r < 0) return '#E68632'
  return '#9ca3af'
}

export const DSForestPlot = ({
  data,
  height,
  width,
  showSignificance = true,
  selectedIndicator,
  onSelectIndicator,
}: ForestPlotProps) => {
  // Sort ascending by correlation value (most negative first, matches R arrange(correlacion))
  const sorted = useMemo(
    () =>
      [...data]
        .filter((d) => Number.isFinite(d.correlacion))
        .sort((a, b) => a.correlacion - b.correlacion),
    [data],
  )

  if (sorted.length === 0) {
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

  // Layout constants
  const labelWidth = 180
  const valueWidth = 80
  const plotPadLeft = 16
  const plotPadRight = 16
  const rowHeight = 40
  const dotRadius = 6
  const ciLineWidth = 2
  const headerHeight = 36
  const footerHeight = onSelectIndicator ? 44 : 28
  const axisHeight = 24

  const n = sorted.length
  const svgHeight =
    height ?? headerHeight + n * rowHeight + axisHeight + footerHeight

  // X scale: correlation from -1 to 1
  const xMin = -1
  const xMax = 1

  // The actual plot area width is computed in the render relative to total width.
  // We use a viewBox approach so it's responsive.
  const totalWidth = width ?? 640
  const plotWidth =
    totalWidth - labelWidth - valueWidth - plotPadLeft - plotPadRight
  const plotLeft = labelWidth + plotPadLeft
  const plotRight = plotLeft + plotWidth

  function xPos(r: number): number {
    return plotLeft + ((r - xMin) / (xMax - xMin)) * plotWidth
  }

  const zeroX = xPos(0)

  // Axis tick positions
  const ticks = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1]

  const plotAreaTop = headerHeight
  const plotAreaBottom = plotAreaTop + n * rowHeight

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${svgHeight}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      role="img"
      aria-label="Forest plot de correlaciones de Spearman"
    >
      {/* ── Column headers ── */}
      <text
        x={labelWidth / 2}
        y={20}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill="#374151"
      >
        Indicador
      </text>
      <text
        x={plotLeft + plotWidth / 2}
        y={20}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill="#374151"
      >
        Correlación de Spearman ρ (IC 95%)
      </text>
      <text
        x={plotRight + plotPadRight + valueWidth / 2}
        y={20}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill="#374151"
      >
        ρ (IC)
      </text>

      {/* ── Grid lines ── */}
      {ticks.map((t) => (
        <line
          key={t}
          x1={xPos(t)}
          x2={xPos(t)}
          y1={plotAreaTop}
          y2={plotAreaBottom}
          stroke={t === 0 ? '#374151' : '#e5e7eb'}
          strokeWidth={t === 0 ? 1.5 : 1}
          strokeDasharray={t === 0 ? '4 3' : undefined}
        />
      ))}

      {/* ── Rows ── */}
      {sorted.map((row, i) => {
        const cy = plotAreaTop + i * rowHeight + rowHeight / 2
        const cx = xPos(row.correlacion)
        const ciL = xPos(Math.max(xMin, row.ci_lower))
        const ciR = xPos(Math.min(xMax, row.ci_upper))
        const color = getColor(row.correlacion)
        const stars = showSignificance ? pStars(row.p_value) : ''
        const isSelected = selectedIndicator === row.indicador
        const isClickable = !!onSelectIndicator

        return (
          <g
            key={`${row.indicador}__${i}`}
            onClick={
              isClickable ? () => onSelectIndicator(row.indicador) : undefined
            }
            onKeyDown={
              isClickable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectIndicator(row.indicador)
                    }
                  }
                : undefined
            }
            tabIndex={isClickable ? 0 : undefined}
            style={isClickable ? { cursor: 'pointer' } : undefined}
            role={isClickable ? 'button' : undefined}
            aria-pressed={isClickable ? isSelected : undefined}
          >
            {/* Row background: highlight if selected, else alternating */}
            <rect
              x={0}
              y={plotAreaTop + i * rowHeight}
              width={totalWidth}
              height={rowHeight}
              fill={
                isSelected ? '#eff6ff' : i % 2 === 0 ? '#f9fafb' : 'transparent'
              }
            />
            {/* Selection indicator bar */}
            {isSelected && (
              <rect
                x={0}
                y={plotAreaTop + i * rowHeight}
                width={3}
                height={rowHeight}
                fill="#3b82f6"
              />
            )}

            {/* Label */}
            <text
              x={labelWidth - 8}
              y={cy + 4}
              textAnchor="end"
              fontSize={12}
              fontWeight={isSelected ? 700 : 400}
              fill={isSelected ? '#1d4ed8' : '#374151'}
            >
              {row.label}
            </text>

            {/* CI line */}
            <line
              x1={ciL}
              x2={ciR}
              y1={cy}
              y2={cy}
              stroke={color}
              strokeWidth={ciLineWidth}
            />

            {/* CI caps */}
            <line
              x1={ciL}
              x2={ciL}
              y1={cy - 5}
              y2={cy + 5}
              stroke={color}
              strokeWidth={ciLineWidth}
            />
            <line
              x1={ciR}
              x2={ciR}
              y1={cy - 5}
              y2={cy + 5}
              stroke={color}
              strokeWidth={ciLineWidth}
            />

            {/* Estimate dot */}
            <circle
              cx={cx}
              cy={cy}
              r={dotRadius}
              fill={color}
              stroke="#fff"
              strokeWidth={1.5}
            />

            {/* Value text */}
            <text
              x={plotRight + plotPadRight + valueWidth / 2}
              y={cy + 4}
              textAnchor="middle"
              fontSize={11}
              fill="#374151"
              fontFamily="monospace"
            >
              {row.correlacion.toFixed(2)}
              {stars ? (
                <tspan fill="#7c3aed" fontWeight={700}>
                  {' '}
                  {stars}
                </tspan>
              ) : null}
            </text>
          </g>
        )
      })}

      {/* ── X axis ── */}
      <line
        x1={plotLeft}
        x2={plotRight}
        y1={plotAreaBottom}
        y2={plotAreaBottom}
        stroke="#9ca3af"
        strokeWidth={1}
      />
      {ticks.map((t) => (
        <g key={`tick-${t}`}>
          <line
            x1={xPos(t)}
            x2={xPos(t)}
            y1={plotAreaBottom}
            y2={plotAreaBottom + 4}
            stroke="#9ca3af"
            strokeWidth={1}
          />
          <text
            x={xPos(t)}
            y={plotAreaBottom + 14}
            textAnchor="middle"
            fontSize={10}
            fill="#6b7280"
          >
            {t}
          </text>
        </g>
      ))}

      {/* ── Footer: reference line label and legend ── */}
      <text
        x={zeroX}
        y={plotAreaBottom + axisHeight + 14}
        textAnchor="middle"
        fontSize={10}
        fill="#6b7280"
      >
        sin correlación
      </text>

      {showSignificance && (
        <text
          x={totalWidth - 4}
          y={plotAreaBottom + axisHeight + 14}
          textAnchor="end"
          fontSize={10}
          fill="#6b7280"
        >
          * p&lt;0.05 · ** p&lt;0.01 · *** p&lt;0.001
        </text>
      )}
    </svg>
  )
}
