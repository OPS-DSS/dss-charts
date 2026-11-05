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
  DotItemDotProps,
  TooltipContentProps,
  TooltipValueType,
} from 'recharts'

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
  yAxisDomain?: [number, number] | undefined
  xAxisLabel?: string
  yAxisLabel?: string
  /** When set, draws a larger highlighted dot at this x-axis value */
  highlightX?: string | number
}

type DSChartTooltipContentProps = Pick<
  TooltipContentProps,
  'active' | 'payload' | 'label'
>

const DSChartTooltipContent = ({
  active,
  payload,
  label,
}: DSChartTooltipContentProps) => {
  if (!active || !payload || payload.length === 0) return null

  const getNumericValue = (value: TooltipValueType | undefined) => {
    const raw = Array.isArray(value) ? value[0] : value
    const n = typeof raw === 'number' ? raw : Number(raw)
    return Number.isFinite(n) ? n : null
  }

  const visible = payload.filter((entry) => {
    const n = getNumericValue(entry.value)
    return n !== null && n !== 0
  })

  if (visible.length === 0) return null

  // In recharts 3, `dataKey` can also be an accessor function
  const entryLabel = (entry: (typeof visible)[number]) =>
    entry.name ??
    (typeof entry.dataKey === 'function' ? undefined : entry.dataKey)

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
          key={String(entryLabel(entry) ?? index)}
          style={{ color: entry.color, margin: '0.1em 0' }}
        >
          {entryLabel(entry)}:{' '}
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
  yAxisDomain = undefined,
  xAxisLabel,
  yAxisLabel,
  highlightX,
}: LineChartProps) => {
  return (
    <ResponsiveContainer
      width={width as number | `${number}%`}
      height={height}
    >
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          bottom: xAxisLabel ? 20 : 5,
          left: yAxisLabel ? 10 : 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisKey}
          fontSize={12}
          label={
            xAxisLabel
              ? {
                  value: xAxisLabel,
                  position: 'insideBottom',
                  offset: -10,
                  fontSize: 12,
                }
              : undefined
          }
        />
        <YAxis
          domain={yAxisDomain}
          fontSize={12}
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: 'insideBottomLeft',
                  offset: 10,
                  fontSize: 12,
                }
              : undefined
          }
        />
        <Tooltip content={(props) => <DSChartTooltipContent {...props} />} />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            dot={(props: DotItemDotProps) => {
              const { cx, cy, stroke } = props
              const payload = props.payload as LineChartData
              if (
                cx === undefined ||
                cy === undefined ||
                !Number.isFinite(cx) ||
                !Number.isFinite(cy)
              ) {
                return <g key={String(payload[xAxisKey])} />
              }
              const isHighlighted =
                highlightX !== undefined && payload[xAxisKey] === highlightX
              return (
                <circle
                  key={String(payload[xAxisKey])}
                  cx={cx}
                  cy={cy}
                  r={isHighlighted ? 8 : 3}
                  fill={stroke}
                  stroke="white"
                  strokeWidth={isHighlighted ? 2 : 0}
                />
              )
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
