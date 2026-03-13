'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

export interface ComboChartData {
  [key: string]: string | number | undefined
}

export interface LineConfig {
  dataKey: string
  name: string
  color: string
  yAxisId?: string
}

export interface BarConfig {
  dataKey: string
  name: string
  color: string
  yAxisId?: string
}

export interface ComboChartProps {
  data: ComboChartData[]
  xAxisKey: string
  lines: LineConfig[]
  bars: BarConfig[]
  height?: number
  alignZeroAxes?: boolean
}

/**
 * Computes a single shared domain from all line and bar series so both
 * Y axes use identical min/max values.
 */
function computeSharedDomain(
  data: ComboChartData[],
  lineKeys: string[],
  barKeys: string[],
): [number, number] {
  const allValues = data
    .flatMap((d) => [...lineKeys, ...barKeys].map((k) => Number(d[k])))
    .filter(Number.isFinite)

  if (allValues.length === 0) {
    // Avoid a degenerate [0, 0] domain when no finite values are present.
    // Return a small non-zero range so Recharts can render sensibly.
    return [0, 1]
  }

  const min = Math.min(...allValues, 0)
  const max = Math.max(...allValues, 0)
  const pad = 0.1

  return [min < 0 ? min * (1 + pad) : 0, max * (1 + pad)]
}

export const DSComboChart = ({
  data,
  xAxisKey,
  lines,
  bars,
  height = 400,
  alignZeroAxes = false,
}: ComboChartProps) => {
  let leftDomain: [number, number] | undefined
  let rightDomain: [number, number] | undefined

  if (alignZeroAxes) {
    const lineKeys = lines.map((l) => l.dataKey)
    const barKeys = bars.map((b) => b.dataKey)
    const shared = computeSharedDomain(data, lineKeys, barKeys)
    leftDomain = shared
    rightDomain = shared
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis
          yAxisId="left"
          domain={leftDomain}
          tickFormatter={(v) => Math.round(v).toString()}
        />
        <YAxis yAxisId="right" orientation="right" domain={rightDomain} hide />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload || payload.length === 0) return null
            const visible = payload.filter((entry) => {
              const n =
                typeof entry.value === 'number'
                  ? entry.value
                  : Number(entry.value)
              return Number.isFinite(n) && n !== 0
            })
            if (visible.length === 0) return null

            const formatEntryValue = (entry: { value?: unknown }) => {
              const n =
                typeof entry.value === 'number'
                  ? entry.value
                  : Number(entry.value)
              return Number.isFinite(n) ? n.toFixed(2) : ''
            }

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
                <p style={{ marginBottom: '0.25em', fontWeight: 600 }}>
                  {label}
                </p>
                {visible.map((entry) => (
                  <p
                    key={entry.dataKey as string}
                    style={{ color: entry.color, margin: '0.1em 0' }}
                  >
                    {entry.name}: {formatEntryValue(entry)}
                  </p>
                ))}
              </div>
            )
          }}
        />
        <Legend />
        <ReferenceLine yAxisId="left" y={0} stroke="#9ca3af" strokeWidth={1} />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
            yAxisId={bar.yAxisId ?? 'right'}
            opacity={0.7}
          />
        ))}
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            yAxisId={line.yAxisId ?? 'left'}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
