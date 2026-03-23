import * as react_jsx_runtime from 'react/jsx-runtime';

interface ChoroplethFeatureProperties {
    /**
     * Generic feature properties map to support different regions and schemas.
     */
    [key: string]: unknown;
    /**
     * Backwards-compatible defaults for existing Huila-based usages.
     */
    NAME_2?: string;
    mock_value?: number;
    color?: string;
}
interface ChoroplethMapProps {
    geojsonUrl: string;
    /** Map centre [lat, lng]. Defaults to [2.5, -75.5]. */
    center?: [number, number];
    zoom?: number;
    height?: string;
    width?: string;
    /**
     * Name of the property in each feature's properties used as the display label.
     * Defaults to "NAME_2" for backwards compatibility.
     */
    nameProperty?: string;
    /**
     * Name of the property in each feature's properties used as the numeric value.
     * Defaults to "mock_value" for backwards compatibility.
     */
    valueProperty?: string;
    valueName?: string;
}
declare const DSChoroplethMap: ({ geojsonUrl, center, zoom, height, width, nameProperty, valueProperty, valueName, }: ChoroplethMapProps) => react_jsx_runtime.JSX.Element;

export { type ChoroplethFeatureProperties, type ChoroplethMapProps, DSChoroplethMap };
