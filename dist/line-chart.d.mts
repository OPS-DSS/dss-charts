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
}
declare const DSLineChart: ({ data, xAxisKey, lines, width, height, }: LineChartProps) => react_jsx_runtime.JSX.Element;

export { DSLineChart, type LineChartData, type LineChartProps };
