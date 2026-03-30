"use client";

// src/quintil-bar-chart.tsx
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ErrorBar,
  LabelList,
  Cell
} from "recharts";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
var DSQuintilBarChart = ({
  data,
  height = 400,
  colors = DEFAULT_COLORS
}) => {
  const processedData = data.map((d) => ({
    ...d,
    errorBar: [
      Math.max(0, d.tasa_ponderada - d.ic_inf),
      Math.max(0, d.ic_sup - d.tasa_ponderada)
    ]
  }));
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height, children: /* @__PURE__ */ jsxs(
    ComposedChart,
    {
      data: processedData,
      margin: { top: 24, right: 16, left: 8, bottom: 24 },
      children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
        /* @__PURE__ */ jsx(
          XAxis,
          {
            dataKey: "quintil",
            label: { value: "Quintil DSS", position: "insideBottom", offset: -12 }
          }
        ),
        /* @__PURE__ */ jsx(
          YAxis,
          {
            tickFormatter: (v) => typeof v === "number" ? v.toFixed(0) : String(v)
          }
        ),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            content: ({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;
              const d = payload[0]?.payload;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5em",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    padding: "0.5em 0.75em",
                    fontSize: "0.875em"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("p", { style: { fontWeight: 600, marginBottom: "0.25em" }, children: [
                      "Quintil ",
                      label
                    ] }),
                    /* @__PURE__ */ jsxs("p", { style: { margin: "0.1em 0" }, children: [
                      "Tasa ponderada: ",
                      d.tasa_ponderada.toFixed(1)
                    ] }),
                    /* @__PURE__ */ jsxs("p", { style: { margin: "0.1em 0", color: "#6b7280" }, children: [
                      "IC 95%: [",
                      d.ic_inf.toFixed(1),
                      ", ",
                      d.ic_sup.toFixed(1),
                      "]"
                    ] })
                  ]
                }
              );
            }
          }
        ),
        /* @__PURE__ */ jsxs(
          Bar,
          {
            dataKey: "tasa_ponderada",
            name: "Tasa ponderada",
            isAnimationActive: false,
            children: [
              processedData.map((_, index) => /* @__PURE__ */ jsx(
                Cell,
                {
                  fill: colors[index % colors.length],
                  fillOpacity: 0.8
                },
                `cell-${index}`
              )),
              /* @__PURE__ */ jsx(
                ErrorBar,
                {
                  dataKey: "errorBar",
                  width: 6,
                  strokeWidth: 2,
                  stroke: "#374151"
                }
              ),
              /* @__PURE__ */ jsx(
                LabelList,
                {
                  dataKey: "tasa_ponderada",
                  position: "top",
                  formatter: (v) => v.toFixed(1),
                  style: { fontSize: "0.75em", fill: "#374151" }
                }
              )
            ]
          }
        )
      ]
    }
  ) });
};
export {
  DSQuintilBarChart
};
