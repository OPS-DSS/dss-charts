import * as react from 'react';

interface RadarChartDatum {
    /** Label shown on the angle axis for this spoke */
    label: string;
    value: number;
}
interface DSRadarChartProps {
    data: RadarChartDatum[];
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
declare const DSRadarChart: ({ data, name, domain, color, fillOpacity, outerRadius, width, height, angleTickFontSize, radiusTickFontSize, animate, className, }: DSRadarChartProps) => react.JSX.Element;

export { DSRadarChart, type DSRadarChartProps, type RadarChartDatum };
