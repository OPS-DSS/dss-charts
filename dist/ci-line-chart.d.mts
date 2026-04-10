import * as react_jsx_runtime from 'react/jsx-runtime';

interface CILineChartDataPoint {
    x: number | string;
    valor: number | null;
    ic_inf: number | null;
    ic_sup: number | null;
}
interface CILineChartProps {
    data: CILineChartDataPoint[];
    xAxisKey?: string;
    /** Label shown in the tooltip for the main value */
    valueLabel?: string;
    /** Draws a horizontal reference line at this y value (e.g. 0 for absolute gaps, 1 for ratios) */
    referenceLine?: number;
    /** Number of decimal places for Y axis ticks and tooltip values */
    decimals?: number;
    color?: string;
    height?: number;
    xAxisLabel?: string;
    yAxisLabel?: string;
}
declare const DSCILineChart: ({ data, xAxisKey, valueLabel, referenceLine, decimals, color, height, xAxisLabel, yAxisLabel, }: CILineChartProps) => react_jsx_runtime.JSX.Element;

export { type CILineChartDataPoint, type CILineChartProps, DSCILineChart };
