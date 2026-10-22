import * as react from 'react';

interface RadarChartDatum {
    /** Label shown on the angle axis for this spoke */
    label: string;
    value: number;
}
interface DSRadarSeries {
    /** Key of this series' value in each data row */
    dataKey: string;
    /** Legend and tooltip label */
    name: string;
    color: string;
    /** SVG dash pattern: '8 4' dashed, '2 4' dotted. Omit for a solid line. */
    strokeDasharray?: string;
    /** Default 2 */
    strokeWidth?: number;
    /** Default 0 */
    fillOpacity?: number;
}
/** One row per spoke: `label`, plus one value per series `dataKey`. */
type RadarChartRow = {
    label: string;
} & Record<string, string | number | null>;
interface DSRadarChartProps {
    /** RadarChartDatum[] still fits */
    data: RadarChartRow[];
    /** One <Radar> per series. When set, `name`, `color` and `fillOpacity` are ignored */
    series?: DSRadarSeries[];
    /** Default: true when there are 2 or more series */
    showLegend?: boolean;
    /** `dataKey` of the series to emphasize; the others are drawn at 30% opacity */
    highlightKey?: string;
    /** Formats values in the tooltip */
    valueFormatter?: (value: number) => string;
    /** Series name shown in the tooltip */
    name?: string;
    /** Radius axis domain. Defaults to recharts' automatic domain. */
    domain?: [number, number];
    color?: string;
    fillOpacity?: number;
    outerRadius?: number | string;
    /** Fixed width in pixels. Omit (with height) to fill the parent container. */
    width?: number;
    /** Fixed height in pixels. Omit (with width) to fill the parent container. */
    height?: number;
    angleTickFontSize?: number;
    radiusTickFontSize?: number;
    /** Set to false for print or static rendering */
    animate?: boolean;
    className?: string;
}
declare const DSRadarChart: ({ data, series, showLegend, valueFormatter, highlightKey, name, domain, color, fillOpacity, outerRadius, width, height, angleTickFontSize, radiusTickFontSize, animate, className, }: DSRadarChartProps) => react.JSX.Element;

export { DSRadarChart, type DSRadarChartProps, type DSRadarSeries, type RadarChartDatum, type RadarChartRow };
