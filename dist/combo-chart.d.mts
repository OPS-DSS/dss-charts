import * as react from 'react';

interface ComboChartData {
    [key: string]: string | number | undefined;
}
interface LineConfig {
    dataKey: string;
    name: string;
    color: string;
    yAxisId?: string;
}
interface BarConfig {
    dataKey: string;
    name: string;
    color: string;
    yAxisId?: string;
}
interface ComboChartProps {
    data: ComboChartData[];
    xAxisKey: string;
    lines: LineConfig[];
    bars: BarConfig[];
    height?: number;
    alignZeroAxes?: boolean;
    highlightX?: string | number;
    showRightAxis?: boolean;
    rightAxisTickFormatter?: (v: number) => string;
}
declare const DSComboChart: ({ data, xAxisKey, lines, bars, height, alignZeroAxes, highlightX, showRightAxis, rightAxisTickFormatter, }: ComboChartProps) => react.JSX.Element;

export { type BarConfig, type ComboChartData, type ComboChartProps, DSComboChart, type LineConfig };
