// src/choropleth-map.tsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { jsx, jsxs } from "react/jsx-runtime";
var DSChoroplethMap = ({
  geojsonUrl,
  baseLayerConfig,
  center = [2.5, -75.5],
  zoom = 8,
  height = "500px",
  width = "100%",
  nameProperty = "NAME_2",
  valueProperty = "mock_value",
  valueName = "Valor",
  secondaryValueProperty,
  secondaryValueName,
  valueFormatter = (v) => v.toFixed(2)
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geojsonLayerRef = useRef(null);
  const baseLayerRef = useRef(null);
  const baseLayerDataRef = useRef(/* @__PURE__ */ new Map());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current).setView(center, zoom);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }
    ).addTo(map);
    mapInstanceRef.current = map;
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!baseLayerConfig) {
      if (baseLayerRef.current) {
        baseLayerRef.current.remove();
        baseLayerRef.current = null;
      }
      baseLayerDataRef.current.clear();
      return;
    }
    if (!map) return;
    const abortController = new AbortController();
    let isCancelled = false;
    if (baseLayerRef.current) {
      baseLayerRef.current.remove();
      baseLayerRef.current = null;
    }
    if (!geojsonUrl) {
      setLoading(true);
      setError(null);
    }
    const baseNameProp = baseLayerConfig.nameProperty ?? nameProperty;
    const baseValueProp = baseLayerConfig.valueProperty ?? "value";
    fetch(baseLayerConfig.geojsonUrl, { signal: abortController.signal }).then((res) => {
      if (!res.ok)
        throw new Error(
          `No se pudo cargar el GeoJSON base (HTTP ${res.status})`
        );
      return res.json();
    }).then((geojson) => {
      if (isCancelled || !mapInstanceRef.current) return;
      const currentMap = mapInstanceRef.current;
      const lookup = /* @__PURE__ */ new Map();
      for (const feat of geojson.features ?? []) {
        const props = feat.properties;
        const name = String(props[baseNameProp] ?? "");
        const val = props[baseValueProp];
        lookup.set(name, typeof val === "number" ? val : null);
      }
      baseLayerDataRef.current = lookup;
      const layer = L.geoJSON(geojson, {
        style: (feature) => ({
          fillColor: feature?.properties?.color ?? "#CCCCCC",
          fillOpacity: 0.75,
          color: "white",
          weight: 1.5
        }),
        // When there is no overlay, the base layer handles all interactions
        onEachFeature: geojsonUrl ? void 0 : (feature, featureLayer) => {
          const props = feature.properties;
          const featureName = String(props[baseNameProp] ?? "");
          const rawValue = props[baseValueProp];
          const displayValue = rawValue == null || rawValue === "" ? "Sin datos" : typeof rawValue === "number" ? rawValue.toFixed(2) : String(rawValue);
          const popupContent = document.createElement("div");
          const title = document.createElement("strong");
          title.textContent = featureName;
          popupContent.appendChild(title);
          popupContent.appendChild(document.createElement("br"));
          popupContent.appendChild(
            document.createTextNode(
              `${baseLayerConfig.valueName ?? "Valor"}: ${displayValue}`
            )
          );
          if (secondaryValueProperty && secondaryValueName) {
            const secRaw = props[secondaryValueProperty];
            const secDisplay = secRaw == null || secRaw === "" ? "Sin datos" : typeof secRaw === "number" ? secRaw.toFixed(2) : String(secRaw);
            popupContent.appendChild(document.createElement("br"));
            popupContent.appendChild(
              document.createTextNode(
                `${secondaryValueName}: ${secDisplay}`
              )
            );
          }
          featureLayer.bindPopup(popupContent);
          featureLayer.on("mouseover", (e) => {
            const target = e.target;
            target.setStyle({ fillOpacity: 0.95, weight: 2.5 });
            target.bringToFront();
          });
          featureLayer.on("mouseout", () => {
            layer.resetStyle(featureLayer);
          });
        }
      }).addTo(currentMap);
      baseLayerRef.current = layer;
      if (!geojsonUrl) {
        currentMap.fitBounds(layer.getBounds(), { padding: [16, 16] });
        if (!isCancelled) setLoading(false);
      } else if (geojsonLayerRef.current) {
        geojsonLayerRef.current.bringToFront();
      }
    }).catch((err) => {
      if (isCancelled) return;
      if (err.name === "AbortError") return;
      if (!geojsonUrl) {
        setError(err.message);
        setLoading(false);
      } else {
        console.error("Base layer error:", err.message);
      }
    });
    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [
    baseLayerConfig?.geojsonUrl,
    baseLayerConfig?.nameProperty,
    baseLayerConfig?.valueProperty,
    baseLayerConfig?.valueName,
    // nameProperty is the fallback for baseNameProp when baseLayerConfig.nameProperty is unset
    nameProperty,
    // Popup content depends on these; re-run so handlers always reflect latest props
    secondaryValueProperty,
    secondaryValueName,
    // Re-run when overlay presence changes so popup handlers are added/removed
    !!geojsonUrl
  ]);
  useEffect(() => {
    if (!geojsonUrl) {
      if (geojsonLayerRef.current) {
        geojsonLayerRef.current.remove();
        geojsonLayerRef.current = null;
      }
      if (!baseLayerConfig?.geojsonUrl) {
        setLoading(false);
        setError(null);
      }
      return;
    }
    const map = mapInstanceRef.current;
    if (!map) return;
    const abortController = new AbortController();
    let isCancelled = false;
    setLoading(true);
    setError(null);
    if (geojsonLayerRef.current) {
      geojsonLayerRef.current.remove();
      geojsonLayerRef.current = null;
    }
    const overlayFillOpacity = baseLayerConfig ? 0.5 : 0.75;
    fetch(geojsonUrl, { signal: abortController.signal }).then((res) => {
      if (!res.ok)
        throw new Error(`No se pudo cargar el GeoJSON (HTTP ${res.status})`);
      return res.json();
    }).then((geojson) => {
      if (isCancelled || !mapInstanceRef.current) return;
      const currentMap = mapInstanceRef.current;
      const layer = L.geoJSON(geojson, {
        style: (feature) => ({
          fillColor: feature?.properties?.color ?? "#CCCCCC",
          fillOpacity: overlayFillOpacity,
          color: "white",
          weight: 1.5
        }),
        onEachFeature: (feature, featureLayer) => {
          const props = feature.properties;
          const featureName = String(props[nameProperty] ?? "");
          const rawValue = props[valueProperty];
          const displayValue = rawValue == null || rawValue === "" ? "Sin datos" : typeof rawValue === "number" ? valueFormatter(rawValue) : String(rawValue);
          const buildPopup = () => {
            const container = document.createElement("div");
            const title = document.createElement("strong");
            title.textContent = featureName;
            container.appendChild(title);
            if (baseLayerConfig) {
              const baseVal = baseLayerDataRef.current.get(featureName);
              const baseDisplay = baseVal == null || !Number.isFinite(baseVal) ? "Sin datos" : baseVal.toFixed(2);
              container.appendChild(document.createElement("br"));
              container.appendChild(
                document.createTextNode(
                  `${baseLayerConfig.valueName ?? "Capa base"}: ${baseDisplay}`
                )
              );
            }
            container.appendChild(document.createElement("br"));
            container.appendChild(
              document.createTextNode(`${valueName}: ${displayValue}`)
            );
            if (secondaryValueProperty && secondaryValueName) {
              const secRaw = props[secondaryValueProperty];
              const secDisplay = secRaw == null || secRaw === "" ? "Sin datos" : typeof secRaw === "number" ? secRaw.toFixed(2) : String(secRaw);
              container.appendChild(document.createElement("br"));
              container.appendChild(
                document.createTextNode(
                  `${secondaryValueName}: ${secDisplay}`
                )
              );
            }
            return container;
          };
          if (baseLayerConfig) {
            featureLayer.bindPopup(buildPopup);
          } else {
            featureLayer.bindPopup(buildPopup());
          }
          featureLayer.on("mouseover", (e) => {
            const target = e.target;
            target.setStyle({ fillOpacity: 0.95, weight: 2.5 });
            target.bringToFront();
          });
          featureLayer.on("mouseout", () => {
            layer.resetStyle(featureLayer);
          });
        }
      }).addTo(currentMap);
      geojsonLayerRef.current = layer;
      layer.bringToFront();
      currentMap.fitBounds(layer.getBounds(), { padding: [16, 16] });
      if (!isCancelled) setLoading(false);
    }).catch((err) => {
      if (isCancelled) return;
      if (err.name === "AbortError") return;
      setError(err.message);
      setLoading(false);
    });
    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [
    geojsonUrl,
    nameProperty,
    valueProperty,
    valueName,
    secondaryValueProperty,
    secondaryValueName,
    baseLayerConfig?.geojsonUrl
  ]);
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", height, width, isolation: "isolate" }, children: [
    loading && !error && /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          zIndex: 1e3
        },
        children: /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Cargando mapa\u2026" })
      }
    ),
    error && /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fee2e2",
          zIndex: 1e3,
          padding: "1rem"
        },
        children: /* @__PURE__ */ jsx("span", { className: "text-red-700 text-sm", children: error })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: mapRef,
        style: { height: "100%", width: "100%" },
        className: "rounded-lg overflow-hidden"
      }
    )
  ] });
};

export {
  DSChoroplethMap
};
