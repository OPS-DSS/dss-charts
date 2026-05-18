'use client'

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ErrorBar,
  Cell,
  ReferenceLine,
} from 'recharts'

export interface GapBarChartDataPoint {
  anio: number
  value: number
  ic_inf: number
  ic_sup: number
}

export interface GapBarChartProps {
  data: GapBarChartDataPoint[]
  color?: string
  highlightYear?: number
  height?: number
  yAxisLabel?: string
  name?: string
  decimalPlaces?: number
  referenceLine?: number
}

export const DSGapBarChart = ({
  data,
  color = '#8b5cf6',
  highlightYear,
  height = 320,
  yAxisLabel,
  name = 'Valor',
  decimalPlaces = 1,
  referenceLine = 0,
}: GapBarChartProps) => {
  const processedData = data.map((d) => ({
    ...d,
    errorBar: [
      Math.max(0, d.value - d.ic_inf),
      Math.max(0, d.ic_sup - d.value),
    ] as [number, number],
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={processedData}
        margin={{ top: 24, right: 16, left: yAxisLabel ? 24 : 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="anio" />
        <YAxis
          tickFormatter={(v) =>
            typeof v === 'number' ? v.toFixed(decimalPlaces) : String(v)
          }
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                  fontSize: 12,
                  offset: -8,
                }
              : undefined
          }
        />
        <ReferenceLine y={referenceLine} stroke="#9ca3af" strokeWidth={1} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload || payload.length === 0) return null
            const d = payload[0]?.payload as (typeof processedData)[number]
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
                <p style={{ fontWeight: 600, marginBottom: '0.25em' }}>{label}</p>
                <p style={{ margin: '0.1em 0' }}>
                  {name}: {d.value.toFixed(decimalPlaces)}
                </p>
                <p style={{ margin: '0.1em 0', color: '#6b7280' }}>
                  IC 95%: [{d.ic_inf.toFixed(decimalPlaces)},&nbsp;
                  {d.ic_sup.toFixed(decimalPlaces)}]
                </p>
              </div>
            )
          }}
        />
        <Bar dataKey="value" name={name} isAnimationActive={false}>
          {processedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={color}
              fillOpacity={entry.anio === highlightYear ? 1.0 : 0.55}
            />
          ))}
          <ErrorBar
            dataKey="errorBar"
            width={6}
            strokeWidth={2}
            stroke="#374151"
          />
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  )
}
