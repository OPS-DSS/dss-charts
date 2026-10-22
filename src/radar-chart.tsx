'use client'

import {
  Legend,
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

export interface DSRadarSeries {
  /** Key of this series' value in each data row */
  dataKey: string
  /** Legend and tooltip label */
  name: string
  color: string
  /** SVG dash pattern: '8 4' dashed, '2 4' dotted. Omit for a solid line. */
  strokeDasharray?: string
  /** Default 2 */
  strokeWidth?: number
  /** Default 0 */
  fillOpacity?: number
}

/** One row per spoke: `label`, plus one value per series `dataKey`. */
export type RadarChartRow = { label: string } & Record<
  string,
  string | number | null
>

export interface DSRadarChartProps {
  /** RadarChartDatum[] still fits */
  data: RadarChartRow[]
  /** One <Radar> per series. When set, `name`, `color` and `fillOpacity` are ignored */
  series?: DSRadarSeries[]
  /** Default: true when there are 2 or more series */
  showLegend?: boolean
  /** `dataKey` of the series to emphasize; the others are drawn at 30% opacity */
  highlightKey?: string
  /** Formats values in the tooltip */
  valueFormatter?: (value: number) => string
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

const singleSeries = (
  name: string | undefined,
  color: string,
  fillOpacity: number,
): DSRadarSeries[] => [
  {
    dataKey: 'value',
    name: name ?? 'value',
    color,
    fillOpacity,
    strokeWidth: 1,
  },
]

export const DSRadarChart = ({
  data,
  series,
  showLegend,
  valueFormatter,
  highlightKey,
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
  const radars = series ?? singleSeries(name, color, fillOpacity)
  const legend = showLegend ?? (series !== undefined && series.length >= 2)
  const formatValue = valueFormatter
    ? (value: unknown) =>
        typeof value === 'number' ? valueFormatter(value) : String(value)
    : undefined

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
      <Tooltip formatter={formatValue} />
      {legend && <Legend />}
      {radars.map((radar) => {
        const dimmed =
          highlightKey !== undefined && highlightKey !== radar.dataKey
        return (
          <Radar
            key={radar.dataKey}
            name={radar.name}
            dataKey={radar.dataKey}
            stroke={radar.color}
            fill={radar.color}
            fillOpacity={(radar.fillOpacity ?? 0) * (dimmed ? 0.3 : 1)}
            strokeOpacity={dimmed ? 0.3 : 1}
            strokeWidth={radar.strokeWidth ?? 2}
            strokeDasharray={radar.strokeDasharray}
            legendType={series ? 'plainline' : undefined}
            isAnimationActive={animate}
          />
        )
      })}
    </RadarChart>
  )

  if (fixedSize) return chart

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      {chart}
    </ResponsiveContainer>
  )
}
