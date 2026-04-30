import * as react_jsx_runtime from 'react/jsx-runtime';

interface LineChartData {
    [key: string]: string | number;
}
interface LineChartProps {
    data: LineChartData[];
    xAxisKey: string;
    lines: Array<{
        dataKey: string;
        name: string;
        color: string | undefined;
    }>;
    width?: number | string;
    height?: number;
    yAxisDomain?: [number, number] | undefined;
    xAxisLabel?: string;
    yAxisLabel?: string;
    /** When set, draws a larger highlighted dot at this x-axis value */
    highlightX?: string | number;
}
declare const DSLineChart: ({ data, xAxisKey, lines, width, height, yAxisDomain, xAxisLabel, yAxisLabel, highlightX, }: LineChartProps) => react_jsx_runtime.JSX.Element;

export { DSLineChart, type LineChartData, type LineChartProps };
