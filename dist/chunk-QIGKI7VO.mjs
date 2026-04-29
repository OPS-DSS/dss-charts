// src/ci-line-chart.tsx
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";
import { jsx, jsxs } from "react/jsx-runtime";
var DSCILineChart = ({
  data,
  xAxisKey = "x",
  valueLabel = "Valor",
  referenceLine,
  decimals = 2,
  color = "#3b82f6",
  height = 350,
  xAxisLabel,
  yAxisLabel
}) => {
  const areaData = data.map((d) => ({
    ...d,
    ci_band: [d.ic_inf, d.ic_sup]
  }));
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height, children: /* @__PURE__ */ jsxs(
    ComposedChart,
    {
      data: areaData,
      margin: {
        top: 8,
        right: 16,
        left: yAxisLabel ? 20 : 8,
        bottom: xAxisLabel ? 20 : 8
      },
      children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
        /* @__PURE__ */ jsx(
          XAxis,
          {
            dataKey: xAxisKey,
            label: xAxisLabel ? {
              value: xAxisLabel,
              position: "insideBottom",
              offset: -10,
              fontSize: 12
            } : void 0
          }
        ),
        /* @__PURE__ */ jsx(
          YAxis,
          {
            tickFormatter: (v) => typeof v === "number" ? v.toFixed(decimals) : String(v),
            label: yAxisLabel ? {
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              offset: -10,
              fontSize: 12
            } : void 0
          }
        ),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            content: ({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;
              const d = payload[0]?.payload;
              const lo = d.ic_inf;
              const hi = d.ic_sup;
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
                    d.valor !== null && /* @__PURE__ */ jsxs("p", { style: { margin: "0.1em 0" }, children: [
                      valueLabel,
                      ": ",
                      d.valor.toFixed(decimals)
                    ] }),
                    lo !== null && hi !== null && /* @__PURE__ */ jsxs("p", { style: { margin: "0.1em 0", color: "#6b7280" }, children: [
                      "IC 95%: [",
                      lo.toFixed(decimals),
                      ", ",
                      hi.toFixed(decimals),
                      "]"
                    ] })
                  ]
                }
              );
            }
          }
        ),
        referenceLine !== void 0 && /* @__PURE__ */ jsx(
          ReferenceLine,
          {
            y: referenceLine,
            stroke: "#9ca3af",
            strokeDasharray: "4 2"
          }
        ),
        /* @__PURE__ */ jsx(
          Area,
          {
            type: "monotone",
            dataKey: "ci_band",
            stroke: "none",
            fill: color,
            fillOpacity: 0.15,
            isAnimationActive: false
          }
        ),
        /* @__PURE__ */ jsx(
          Line,
          {
            type: "monotone",
            dataKey: "valor",
            stroke: color,
            strokeWidth: 2,
            dot: { r: 3 },
            isAnimationActive: false
          }
        )
      ]
    }
  ) });
};

export {
  DSCILineChart
};
