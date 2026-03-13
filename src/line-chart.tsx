'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type {
  NameType,
  Payload,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'

export interface LineChartData {
  [key: string]: string | number
}

export interface LineChartProps {
  data: LineChartData[]
  xAxisKey: string
  lines: Array<{
    dataKey: string
    name: string
    color: string | undefined
  }>
  width?: number | string
  height?: number
}

interface DSChartTooltipContentProps {
  active?: boolean
  payload?: Array<Payload<ValueType, NameType>>
  label?: string | number
}

const DSChartTooltipContent = ({
  active,
  payload,
  label,
}: DSChartTooltipContentProps) => {
  if (!active || !payload || payload.length === 0) return null

  const getNumericValue = (value: ValueType | undefined) => {
    const raw = Array.isArray(value) ? value[0] : value
    const n = typeof raw === 'number' ? raw : Number(raw)
    return Number.isFinite(n) ? n : null
  }

  const visible = payload.filter((entry) => {
    const n = getNumericValue(entry.value)
    return n !== null && n !== 0
  })

  if (visible.length === 0) return null
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5em',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        padding: '0.5em 0.75em',
        fontSize: '0.875em',
      }}
    >
      <p style={{ marginBottom: '0.25em', fontWeight: 600 }}>{label}</p>
      {visible.map((entry, index) => (
        <p
          key={String(entry.dataKey ?? entry.name ?? index)}
          style={{ color: entry.color, margin: '0.1em 0' }}
        >
          {entry.name ?? entry.dataKey}:{' '}
          {getNumericValue(entry.value)?.toFixed(2)}
        </p>
      ))}
    </div>
  )
}

export const DSLineChart = ({
  data,
  xAxisKey,
  lines,
  width = '100%',
  height = 350,
}: LineChartProps) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip content={(props) => <DSChartTooltipContent {...props} />} />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
