import * as react from 'react';

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
declare const DSMap: ({ center, zoom, markers, height, width, }: MapProps) => react.JSX.Element;

export { DSMap, type MapProps };
