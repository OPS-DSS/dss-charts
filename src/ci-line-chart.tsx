'use client'

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

export interface CILineChartDataPoint {
  x: number | string
  valor: number | null
  ic_inf: number | null
  ic_sup: number | null
}

export interface CILineChartProps {
  data: CILineChartDataPoint[]
  xAxisKey?: string
  /** Label shown in the tooltip for the main value */
  valueLabel?: string
  /** Draws a horizontal reference line at this y value (e.g. 0 for absolute gaps, 1 for ratios) */
  referenceLine?: number
  /** Number of decimal places for Y axis ticks and tooltip values */
  decimals?: number
  color?: string
  height?: number
}

export const DSCILineChart = ({
  data,
  xAxisKey = 'x',
  valueLabel = 'Valor',
  referenceLine,
  decimals = 2,
  color = '#3b82f6',
  height = 350,
}: CILineChartProps) => {
  // Recharts Area with a two-element array dataKey renders a band between the two values
  const areaData = data.map((d) => ({
    ...d,
    ci_band: [d.ic_inf, d.ic_sup] as [number | null, number | null],
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={areaData}
        margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis
          tickFormatter={(v) =>
            typeof v === 'number' ? v.toFixed(decimals) : String(v)
          }
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload || payload.length === 0) return null
            const d = payload[0]?.payload as (typeof areaData)[number]
            const lo = d.ic_inf
            const hi = d.ic_sup
            return (
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5em',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                  padding: '0.5em 0.75em',
                  fontSize: '0.875em',
                }}
              >
                <p style={{ fontWeight: 600, marginBottom: '0.25em' }}>
                  {label}
                </p>
                {d.valor !== null && (
                  <p style={{ margin: '0.1em 0' }}>
                    {valueLabel}: {d.valor.toFixed(decimals)}
                  </p>
                )}
                {lo !== null && hi !== null && (
                  <p style={{ margin: '0.1em 0', color: '#6b7280' }}>
                    IC 95%: [{lo.toFixed(decimals)}, {hi.toFixed(decimals)}]
                  </p>
                )}
              </div>
            )
          }}
        />
        {referenceLine !== undefined && (
          <ReferenceLine
            y={referenceLine}
            stroke="#9ca3af"
            strokeDasharray="4 2"
          />
        )}
        <Area
          type="monotone"
          dataKey="ci_band"
          stroke="none"
          fill={color}
          fillOpacity={0.15}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="valor"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3 }}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
