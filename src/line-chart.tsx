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
        <Tooltip
          labelStyle={{
            borderRadius: '0.2em',
            backgroundColor: 'ghostwhite',
            padding: '0.5em',
            color: 'grey',
          }}
          contentStyle={{
            borderRadius: '0.5em',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value) => {
            const numericValue =
              typeof value === 'number' ? value : Number(value)

            if (!Number.isFinite(numericValue)) {
              return ''
            }

            return `${Math.round(numericValue * 100) / 100}`
          }}
        />
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
