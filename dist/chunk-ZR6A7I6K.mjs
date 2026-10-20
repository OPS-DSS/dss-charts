// src/radar-chart.tsx
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { jsx, jsxs } from "react/jsx-runtime";
var DSRadarChart = ({
  data,
  name,
  domain,
  color = "#8884d8",
  fillOpacity = 0.6,
  outerRadius = "80%",
  width,
  height,
  angleTickFontSize,
  radiusTickFontSize,
  animate = true,
  className
}) => {
  const fixedSize = width !== void 0 && height !== void 0;
  const chart = /* @__PURE__ */ jsxs(
    RadarChart,
    {
      data,
      outerRadius,
      width: fixedSize ? width : void 0,
      height: fixedSize ? height : void 0,
      className: fixedSize ? className : void 0,
      children: [
        /* @__PURE__ */ jsx(PolarGrid, {}),
        /* @__PURE__ */ jsx(
          PolarAngleAxis,
          {
            dataKey: "label",
            tick: angleTickFontSize ? { fontSize: angleTickFontSize } : true
          }
        ),
        /* @__PURE__ */ jsx(
          PolarRadiusAxis,
          {
            domain,
            tick: radiusTickFontSize ? { fontSize: radiusTickFontSize } : true
          }
        ),
        /* @__PURE__ */ jsx(Tooltip, {}),
        /* @__PURE__ */ jsx(
          Radar,
          {
            name,
            dataKey: "value",
            stroke: color,
            fill: color,
            fillOpacity,
            isAnimationActive: animate
          }
        )
      ]
    }
  );
  if (fixedSize) return chart;
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", className, children: chart });
};

export {
  DSRadarChart
};
