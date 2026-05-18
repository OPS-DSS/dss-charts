import * as react_jsx_runtime from 'react/jsx-runtime';

interface ChoroplethFeatureProperties {
    /**
     * Generic feature properties map to support different regions and schemas.
     */
    [key: string]: unknown;
    /**
     * Backwards-compatible defaults for existing usages.
     */
    NAME_2?: string;
    mock_value?: number;
    color?: string;
}
/**
 * Configuration for an optional base layer rendered underneath the main layer.
 * The base layer is always visible regardless of the main layer selection.
 */
interface BaseLayerConfig {
    geojsonUrl: string;
    /** Property used as the display label. Defaults to nameProperty of the parent map. */
    nameProperty?: string;
    /** Property used as the numeric value. Defaults to "value". */
    valueProperty?: string;
    /** Human-readable label shown in popups. */
    valueName?: string;
}
interface ChoroplethMapProps {
    /**
     * Optional overlay GeoJSON URL. When provided it renders on top of the base
     * layer at 50% opacity. When omitted, only the base layer is shown at full
     * opacity and the base layer handles click popups.
     */
    geojsonUrl?: string;
    /**
     * Optional base layer shown underneath the overlay at full opacity.
     * Clicking a municipality shows data from both layers in the popup.
     */
    baseLayerConfig?: BaseLayerConfig;
    /** Map centre [lat, lng]. Defaults to [2.5, -75.5]. */
    center?: [number, number];
    zoom?: number;
    height?: string;
    width?: string;
    /**
     * Name of the property used as the display label (overlay layer).
     * Defaults to "NAME_2" for backwards compatibility.
     */
    nameProperty?: string;
    /**
     * Name of the property used as the numeric value (overlay layer).
     * Defaults to "mock_value" for backwards compatibility.
     */
    valueProperty?: string;
    valueName?: string;
    /**
     * Optional second numeric property to show in the popup (e.g. maternal_value
     * for bivariate maps where the primary value is an education indicator).
     */
    secondaryValueProperty?: string;
    secondaryValueName?: string;
    /** Optional formatter for the primary numeric value in popups. Defaults to two decimal places. */
    valueFormatter?: (value: number) => string;
}
declare const DSChoroplethMap: ({ geojsonUrl, baseLayerConfig, center, zoom, height, width, nameProperty, valueProperty, valueName, secondaryValueProperty, secondaryValueName, valueFormatter, }: ChoroplethMapProps) => react_jsx_runtime.JSX.Element;

export { type BaseLayerConfig, type ChoroplethFeatureProperties, type ChoroplethMapProps, DSChoroplethMap };
