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
  LabelList,
  Cell,
} from 'recharts'

export interface QuintilBarChartDataPoint {
  quintil: number
  tasa_ponderada: number
  ic_inf: number
  ic_sup: number
}

export interface QuintilBarChartProps {
  data: QuintilBarChartDataPoint[]
  height?: number
  colors?: string[]
  yAxisLabel?: string
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export const DSQuintilBarChart = ({
  data,
  height = 400,
  colors = DEFAULT_COLORS,
  yAxisLabel,
}: QuintilBarChartProps) => {
  // ErrorBar expects [negativeDeviation, positiveDeviation] from the bar value
  const processedData = data.map((d) => ({
    ...d,
    errorBar: [
      Math.max(0, d.tasa_ponderada - d.ic_inf),
      Math.max(0, d.ic_sup - d.tasa_ponderada),
    ] as [number, number],
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={processedData}
        margin={{ top: 24, right: 16, left: yAxisLabel ? 20 : 8, bottom: 24 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="quintil"
          label={{
            value: 'Quintil DSS',
            position: 'insideBottom',
            offset: -12,
            fontSize: 12,
          }}
        />
        <YAxis
          tickFormatter={(v) =>
            typeof v === 'number' ? v.toFixed(0) : String(v)
          }
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                  fontSize: 12,
                }
              : undefined
          }
        />
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
                <p style={{ fontWeight: 600, marginBottom: '0.25em' }}>
                  Quintil {label}
                </p>
                <p style={{ margin: '0.1em 0' }}>
                  Tasa ponderada: {d.tasa_ponderada.toFixed(1)}
                </p>
                <p style={{ margin: '0.1em 0', color: '#6b7280' }}>
                  IC 95%: [{d.ic_inf.toFixed(1)}, {d.ic_sup.toFixed(1)}]
                </p>
              </div>
            )
          }}
        />
        <Bar
          dataKey="tasa_ponderada"
          name="Tasa ponderada"
          isAnimationActive={false}
        >
          {processedData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              fillOpacity={0.8}
            />
          ))}
          <ErrorBar
            dataKey="errorBar"
            width={6}
            strokeWidth={2}
            stroke="#374151"
          />
          <LabelList
            dataKey="tasa_ponderada"
            position="top"
            formatter={(v: number) => v.toFixed(1)}
            style={{ fontSize: '0.75em', fill: '#374151' }}
          />
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  )
}
