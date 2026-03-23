"use client";

// src/choropleth-map.tsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { jsx, jsxs } from "react/jsx-runtime";
var DSChoroplethMap = ({
  geojsonUrl,
  center = [2.5, -75.5],
  zoom = 8,
  height = "500px",
  width = "100%",
  nameProperty = "NAME_2",
  valueProperty = "mock_value",
  valueName = "Valor"
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geojsonLayerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current).setView(center, zoom);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png",
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
    if (!map) return;
    const abortController = new AbortController();
    let isCancelled = false;
    setLoading(true);
    setError(null);
    if (geojsonLayerRef.current) {
      geojsonLayerRef.current.remove();
      geojsonLayerRef.current = null;
    }
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
          fillOpacity: 0.75,
          color: "white",
          weight: 1.5
        }),
        onEachFeature: (feature, featureLayer) => {
          const props = feature.properties;
          const popupContent = document.createElement("div");
          const titleElement = document.createElement("strong");
          titleElement.textContent = String(props[nameProperty] ?? "");
          popupContent.appendChild(titleElement);
          popupContent.appendChild(document.createElement("br"));
          const rawValue = props[valueProperty];
          const displayValue = rawValue == null || rawValue === "" ? "Sin datos" : typeof rawValue === "number" ? rawValue.toFixed(2) : String(rawValue);
          popupContent.appendChild(
            document.createTextNode(`${valueName}: ${displayValue}`)
          );
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
      geojsonLayerRef.current = layer;
      currentMap.fitBounds(layer.getBounds(), { padding: [16, 16] });
      if (!isCancelled) {
        setLoading(false);
      }
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
  }, [geojsonUrl, nameProperty, valueProperty, valueName]);
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", height, width }, children: [
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
