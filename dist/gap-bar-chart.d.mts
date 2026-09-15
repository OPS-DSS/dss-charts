import * as react from 'react';

interface GapBarChartDataPoint {
    anio: number;
    value: number;
    ic_inf: number;
    ic_sup: number;
}
interface GapBarChartProps {
    data: GapBarChartDataPoint[];
    color?: string;
    highlightYear?: number;
    height?: number;
    yAxisLabel?: string;
    name?: string;
    decimalPlaces?: number;
    referenceLine?: number;
}
declare const DSGapBarChart: ({ data, color, highlightYear, height, yAxisLabel, name, decimalPlaces, referenceLine, }: GapBarChartProps) => react.JSX.Element;

export { DSGapBarChart, type GapBarChartDataPoint, type GapBarChartProps };
