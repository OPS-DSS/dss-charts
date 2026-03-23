import * as react_jsx_runtime from 'react/jsx-runtime';

interface ForestPlotRow {
    indicador: string;
    label: string;
    correlacion: number;
    ci_lower: number;
    ci_upper: number;
    p_value: number;
    n: number;
}
interface ForestPlotProps {
    data: ForestPlotRow[];
    /** Width of the SVG. Defaults to 100% via ResponsiveContainer pattern */
    width?: number;
    height?: number;
    /** Show significance markers */
    showSignificance?: boolean;
}
declare const DSForestPlot: ({ data, height, width, showSignificance, }: ForestPlotProps) => react_jsx_runtime.JSX.Element;

export { DSForestPlot, type ForestPlotProps, type ForestPlotRow };
