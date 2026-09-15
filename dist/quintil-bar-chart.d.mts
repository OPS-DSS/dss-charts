import * as react from 'react';

interface QuintilBarChartDataPoint {
    quintil: number;
    tasa_ponderada: number;
    ic_inf: number;
    ic_sup: number;
}
interface QuintilBarChartProps {
    data: QuintilBarChartDataPoint[];
    height?: number;
    colors?: string[];
    yAxisLabel?: string;
}
declare const DSQuintilBarChart: ({ data, height, colors, yAxisLabel, }: QuintilBarChartProps) => react.JSX.Element;

export { DSQuintilBarChart, type QuintilBarChartDataPoint, type QuintilBarChartProps };
