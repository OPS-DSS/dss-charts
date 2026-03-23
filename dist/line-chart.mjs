"use client";

// src/line-chart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { jsx, jsxs } from "react/jsx-runtime";
var DSChartTooltipContent = ({
  active,
  payload,
  label
}) => {
  if (!active || !payload || payload.length === 0) return null;
  const getNumericValue = (value) => {
    const raw = Array.isArray(value) ? value[0] : value;
    const n = typeof raw === "number" ? raw : Number(raw);
    return Number.isFinite(n) ? n : null;
  };
  const visible = payload.filter((entry) => {
    const n = getNumericValue(entry.value);
    return n !== null && n !== 0;
  });
  if (visible.length === 0) return null;
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
        visible.map((entry, index) => /* @__PURE__ */ jsxs(
          "p",
          {
            style: { color: entry.color, margin: "0.1em 0" },
            children: [
              entry.name ?? entry.dataKey,
              ":",
              " ",
              getNumericValue(entry.value)?.toFixed(2)
            ]
          },
          String(entry.dataKey ?? entry.name ?? index)
        ))
      ]
    }
  );
};
var DSLineChart = ({
  data,
  xAxisKey,
  lines,
  width = "100%",
  height = 350
}) => {
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width, height, children: /* @__PURE__ */ jsxs(LineChart, { data, children: [
    /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
    /* @__PURE__ */ jsx(XAxis, { dataKey: xAxisKey }),
    /* @__PURE__ */ jsx(YAxis, {}),
    /* @__PURE__ */ jsx(Tooltip, { content: (props) => /* @__PURE__ */ jsx(DSChartTooltipContent, { ...props }) }),
    /* @__PURE__ */ jsx(Legend, {}),
    lines.map((line) => /* @__PURE__ */ jsx(
      Line,
      {
        type: "monotone",
        dataKey: line.dataKey,
        name: line.name,
        stroke: line.color,
        strokeWidth: 2
      },
      line.dataKey
    ))
  ] }) });
};
export {
  DSLineChart
};
