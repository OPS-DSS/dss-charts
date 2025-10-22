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
  height = 400,
}: LineChartProps) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
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
// Complete sync test - Wed 22 Oct 2025 12:15:51 BST
