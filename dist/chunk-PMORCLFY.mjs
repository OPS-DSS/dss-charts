// src/map.tsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { jsx } from "react/jsx-runtime";
var DSMap = ({
  center,
  zoom = 6,
  markers = [],
  height = "400px",
  width = "100%"
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current).setView(center, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "\xA9 OpenStreetMap contributors"
    }).addTo(map);
    mapInstanceRef.current = map;
    markers.forEach((marker) => {
      const leafletMarker = L.marker(marker.position).addTo(map);
      if (marker.popup) {
        leafletMarker.bindPopup(marker.popup);
      }
    });
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, markers]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: mapRef,
      style: { height, width },
      className: "rounded-lg overflow-hidden"
    }
  );
};

export {
  DSMap
};
