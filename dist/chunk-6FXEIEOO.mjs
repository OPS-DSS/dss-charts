// src/gap-bar-chart.tsx
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ErrorBar,
  Cell,
  ReferenceLine
} from "recharts";
import { jsx, jsxs } from "react/jsx-runtime";
var DSGapBarChart = ({
  data,
  color = "#8b5cf6",
  highlightYear,
  height = 320,
  yAxisLabel,
  name = "Valor",
  decimalPlaces = 1,
  referenceLine = 0
}) => {
  const processedData = data.map((d) => ({
    ...d,
    errorBar: [
      Math.max(0, d.value - d.ic_inf),
      Math.max(0, d.ic_sup - d.value)
    ]
  }));
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height, children: /* @__PURE__ */ jsxs(
    ComposedChart,
    {
      data: processedData,
      margin: { top: 24, right: 16, left: yAxisLabel ? 24 : 8, bottom: 8 },
      children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "anio" }),
        /* @__PURE__ */ jsx(
          YAxis,
          {
            tickFormatter: (v) => typeof v === "number" ? v.toFixed(decimalPlaces) : String(v),
            label: yAxisLabel ? {
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
              offset: -8
            } : void 0
          }
        ),
        /* @__PURE__ */ jsx(ReferenceLine, { y: referenceLine, stroke: "#9ca3af", strokeWidth: 1 }),
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
                    /* @__PURE__ */ jsx("p", { style: { fontWeight: 600, marginBottom: "0.25em" }, children: label }),
                    /* @__PURE__ */ jsxs("p", { style: { margin: "0.1em 0" }, children: [
                      name,
                      ": ",
                      d.value.toFixed(decimalPlaces)
                    ] }),
                    /* @__PURE__ */ jsxs("p", { style: { margin: "0.1em 0", color: "#6b7280" }, children: [
                      "IC 95%: [",
                      d.ic_inf.toFixed(decimalPlaces),
                      ",\xA0",
                      d.ic_sup.toFixed(decimalPlaces),
                      "]"
                    ] })
                  ]
                }
              );
            }
          }
        ),
        /* @__PURE__ */ jsxs(Bar, { dataKey: "value", name, isAnimationActive: false, children: [
          processedData.map((entry, index) => /* @__PURE__ */ jsx(
            Cell,
            {
              fill: color,
              fillOpacity: entry.anio === highlightYear ? 1 : 0.55
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
          )
        ] })
      ]
    }
  ) });
};

export {
  DSGapBarChart
};
