import * as react_jsx_runtime from 'react/jsx-runtime';

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
}
declare const DSQuintilBarChart: ({ data, height, colors, }: QuintilBarChartProps) => react_jsx_runtime.JSX.Element;

export { DSQuintilBarChart, type QuintilBarChartDataPoint, type QuintilBarChartProps };
