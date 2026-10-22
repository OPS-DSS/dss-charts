// src/radar-chart.tsx
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { jsx, jsxs } from "react/jsx-runtime";
var singleSeries = (name, color, fillOpacity) => [
  {
    dataKey: "value",
    name: name ?? "value",
    color,
    fillOpacity,
    strokeWidth: 1
  }
];
var DSRadarChart = ({
  data,
  series,
  showLegend,
  valueFormatter,
  highlightKey,
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
  const radars = series ?? singleSeries(name, color, fillOpacity);
  const legend = showLegend ?? (series !== void 0 && series.length >= 2);
  const formatValue = valueFormatter ? (value) => typeof value === "number" ? valueFormatter(value) : String(value) : void 0;
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
        /* @__PURE__ */ jsx(Tooltip, { formatter: formatValue }),
        legend && /* @__PURE__ */ jsx(Legend, {}),
        radars.map((radar) => {
          const dimmed = highlightKey !== void 0 && highlightKey !== radar.dataKey;
          return /* @__PURE__ */ jsx(
            Radar,
            {
              name: radar.name,
              dataKey: radar.dataKey,
              stroke: radar.color,
              fill: radar.color,
              fillOpacity: (radar.fillOpacity ?? 0) * (dimmed ? 0.3 : 1),
              strokeOpacity: dimmed ? 0.3 : 1,
              strokeWidth: radar.strokeWidth ?? 2,
              strokeDasharray: radar.strokeDasharray,
              legendType: series ? "plainline" : void 0,
              isAnimationActive: animate
            },
            radar.dataKey
          );
        })
      ]
    }
  );
  if (fixedSize) return chart;
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", className, children: chart });
};

export {
  DSRadarChart
};
