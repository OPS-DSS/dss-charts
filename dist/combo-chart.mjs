"use client";

// src/combo-chart.tsx
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";
import { jsx, jsxs } from "react/jsx-runtime";
function computeSharedDomain(data, lineKeys, barKeys) {
  const allValues = data.flatMap((d) => [...lineKeys, ...barKeys].map((k) => Number(d[k]))).filter(Number.isFinite);
  if (allValues.length === 0) {
    return [0, 1];
  }
  const min = Math.min(...allValues, 0);
  const max = Math.max(...allValues, 0);
  const pad = 0.1;
  return [min < 0 ? min * (1 + pad) : 0, max * (1 + pad)];
}
var DSComboChart = ({
  data,
  xAxisKey,
  lines,
  bars,
  height = 400,
  alignZeroAxes = false
}) => {
  let leftDomain;
  let rightDomain;
  if (alignZeroAxes) {
    const lineKeys = lines.map((l) => l.dataKey);
    const barKeys = bars.map((b) => b.dataKey);
    const shared = computeSharedDomain(data, lineKeys, barKeys);
    leftDomain = shared;
    rightDomain = shared;
  }
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height, children: /* @__PURE__ */ jsxs(ComposedChart, { data, children: [
    /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
    /* @__PURE__ */ jsx(XAxis, { dataKey: xAxisKey }),
    /* @__PURE__ */ jsx(
      YAxis,
      {
        yAxisId: "left",
        domain: leftDomain,
        tickFormatter: (v) => Math.round(v).toString()
      }
    ),
    /* @__PURE__ */ jsx(YAxis, { yAxisId: "right", orientation: "right", domain: rightDomain, hide: true }),
    /* @__PURE__ */ jsx(
      Tooltip,
      {
        content: ({ active, payload, label }) => {
          if (!active || !payload || payload.length === 0) return null;
          const visible = payload.filter((entry) => {
            const n = typeof entry.value === "number" ? entry.value : Number(entry.value);
            return Number.isFinite(n) && n !== 0;
          });
          if (visible.length === 0) return null;
          const formatEntryValue = (entry) => {
            const n = typeof entry.value === "number" ? entry.value : Number(entry.value);
            return Number.isFinite(n) ? n.toFixed(2) : "";
          };
          return /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5em",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                padding: "0.5em 0.75em",
                fontSize: "0.875em"
              },
              children: [
                /* @__PURE__ */ jsx("p", { style: { marginBottom: "0.25em", fontWeight: 600 }, children: label }),
                visible.map((entry) => /* @__PURE__ */ jsxs(
                  "p",
                  {
                    style: { color: entry.color, margin: "0.1em 0" },
                    children: [
                      entry.name,
                      ": ",
                      formatEntryValue(entry)
                    ]
                  },
                  entry.dataKey
                ))
              ]
            }
          );
        }
      }
    ),
    /* @__PURE__ */ jsx(Legend, {}),
    /* @__PURE__ */ jsx(ReferenceLine, { yAxisId: "left", y: 0, stroke: "#9ca3af", strokeWidth: 1 }),
    bars.map((bar) => /* @__PURE__ */ jsx(
      Bar,
      {
        dataKey: bar.dataKey,
        name: bar.name,
        fill: bar.color,
        yAxisId: bar.yAxisId ?? "right",
        opacity: 0.7
      },
      bar.dataKey
    )),
    lines.map((line) => /* @__PURE__ */ jsx(
      Line,
      {
        type: "monotone",
        dataKey: line.dataKey,
        name: line.name,
        stroke: line.color,
        strokeWidth: 2,
        yAxisId: line.yAxisId ?? "left"
      },
      line.dataKey
    ))
  ] }) });
};
export {
  DSComboChart
};
