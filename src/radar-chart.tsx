'use client'

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

export interface RadarChartDatum {
  /** Label shown on the angle axis for this spoke */
  label: string
  value: number
}

export interface DSRadarChartProps {
  data: RadarChartDatum[]
  /** Series name shown in the tooltip */
  name?: string
  /** Radius axis domain. Defaults to recharts' automatic domain. */
  domain?: [number, number]
  color?: string
  fillOpacity?: number
  outerRadius?: number | string
  /** Fixed width in pixels. Omit (with height) to fill the parent container. */
  width?: number
  /** Fixed height in pixels. Omit (with width) to fill the parent container. */
  height?: number
  angleTickFontSize?: number
  radiusTickFontSize?: number
  /** Set to false for print or static rendering */
  animate?: boolean
  className?: string
}

export const DSRadarChart = ({
  data,
  name,
  domain,
  color = '#8884d8',
  fillOpacity = 0.6,
  outerRadius = '80%',
  width,
  height,
  angleTickFontSize,
  radiusTickFontSize,
  animate = true,
  className,
}: DSRadarChartProps) => {
  const fixedSize = width !== undefined && height !== undefined

  const chart = (
    <RadarChart
      data={data}
      outerRadius={outerRadius}
      width={fixedSize ? width : undefined}
      height={fixedSize ? height : undefined}
      className={fixedSize ? className : undefined}
    >
      <PolarGrid />
      <PolarAngleAxis
        dataKey="label"
        tick={angleTickFontSize ? { fontSize: angleTickFontSize } : true}
      />
      <PolarRadiusAxis
        domain={domain}
        tick={radiusTickFontSize ? { fontSize: radiusTickFontSize } : true}
      />
      <Tooltip />
      <Radar
        name={name}
        dataKey="value"
        stroke={color}
        fill={color}
        fillOpacity={fillOpacity}
        isAnimationActive={animate}
      />
    </RadarChart>
  )

  if (fixedSize) return chart

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      {chart}
    </ResponsiveContainer>
  )
}
