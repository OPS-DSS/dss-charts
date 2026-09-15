import * as react from 'react';

interface ScatterPoint {
    x: number;
    y: number;
    label: string;
    /** Optional bubble size (e.g. population or births). When provided, dot
     *  radius is scaled proportionally. */
    size?: number;
}
interface DSScatterChartProps {
    data: ScatterPoint[];
    xLabel?: string;
    yLabel?: string;
    height?: number;
    width?: number;
    /** Fraction of extreme points (by y-value or size) to label.
     *  0 = no labels, 1 = label all. Defaults to 0.15. */
    labelFraction?: number;
}
declare const DSScatterChart: ({ data, xLabel, yLabel, height, width, labelFraction, }: DSScatterChartProps) => react.JSX.Element;

export { DSScatterChart, type DSScatterChartProps, type ScatterPoint };
