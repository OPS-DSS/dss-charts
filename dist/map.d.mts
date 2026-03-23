import * as react_jsx_runtime from 'react/jsx-runtime';

interface MapProps {
    center: [number, number];
    zoom?: number;
    markers?: Array<{
        position: [number, number];
        popup?: string;
        color?: string;
    }>;
    height?: string;
    width?: string;
}
declare const DSMap: ({ center, zoom, markers, height, width, }: MapProps) => react_jsx_runtime.JSX.Element;

export { DSMap, type MapProps };
