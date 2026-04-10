"use client";

// src/forest-plot.tsx
import { useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function pStars(p) {
  if (!Number.isFinite(p)) return "";
  if (p < 1e-3) return "***";
  if (p < 0.01) return "**";
  if (p < 0.05) return "*";
  if (p < 0.1) return ".";
  return "";
}
function getColor(r) {
  if (!Number.isFinite(r)) return "#9ca3af";
  if (r > 0) return "#5B7BEA";
  if (r < 0) return "#E68632";
  return "#9ca3af";
}
var DSForestPlot = ({
  data,
  height,
  width,
  showSignificance = true,
  selectedIndicator,
  onSelectIndicator
}) => {
  const sorted = useMemo(
    () => [...data].filter((d) => Number.isFinite(d.correlacion)).sort((a, b) => a.correlacion - b.correlacion),
    [data]
  );
  if (sorted.length === 0) {
    return /* @__PURE__ */ jsx(
      "p",
      {
        style: {
          color: "#6b7280",
          fontStyle: "italic",
          textAlign: "center",
          padding: "2rem 0"
        },
        children: "No hay datos disponibles."
      }
    );
  }
  const labelWidth = 180;
  const valueWidth = 80;
  const plotPadLeft = 16;
  const plotPadRight = 16;
  const rowHeight = 40;
  const dotRadius = 6;
  const ciLineWidth = 2;
  const headerHeight = 36;
  const footerHeight = onSelectIndicator ? 44 : 28;
  const axisHeight = 24;
  const n = sorted.length;
  const svgHeight = height ?? headerHeight + n * rowHeight + axisHeight + footerHeight;
  const xMin = -1;
  const xMax = 1;
  const totalWidth = width ?? 640;
  const plotWidth = totalWidth - labelWidth - valueWidth - plotPadLeft - plotPadRight;
  const plotLeft = labelWidth + plotPadLeft;
  const plotRight = plotLeft + plotWidth;
  function xPos(r) {
    return plotLeft + (r - xMin) / (xMax - xMin) * plotWidth;
  }
  const zeroX = xPos(0);
  const ticks = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];
  const plotAreaTop = headerHeight;
  const plotAreaBottom = plotAreaTop + n * rowHeight;
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: `0 0 ${totalWidth} ${svgHeight}`,
      style: { width: "100%", height: "auto", display: "block" },
      role: "img",
      "aria-label": "Forest plot de correlaciones de Spearman",
      children: [
        /* @__PURE__ */ jsx(
          "text",
          {
            x: labelWidth / 2,
            y: 20,
            textAnchor: "middle",
            fontSize: 11,
            fontWeight: 600,
            fill: "#374151",
            children: "Indicador"
          }
        ),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: plotLeft + plotWidth / 2,
            y: 20,
            textAnchor: "middle",
            fontSize: 11,
            fontWeight: 600,
            fill: "#374151",
            children: "Correlaci\xF3n de Spearman \u03C1 (IC 95%)"
          }
        ),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: plotRight + plotPadRight + valueWidth / 2,
            y: 20,
            textAnchor: "middle",
            fontSize: 11,
            fontWeight: 600,
            fill: "#374151",
            children: "\u03C1 (IC)"
          }
        ),
        ticks.map((t) => /* @__PURE__ */ jsx(
          "line",
          {
            x1: xPos(t),
            x2: xPos(t),
            y1: plotAreaTop,
            y2: plotAreaBottom,
            stroke: t === 0 ? "#374151" : "#e5e7eb",
            strokeWidth: t === 0 ? 1.5 : 1,
            strokeDasharray: t === 0 ? "4 3" : void 0
          },
          t
        )),
        sorted.map((row, i) => {
          const cy = plotAreaTop + i * rowHeight + rowHeight / 2;
          const cx = xPos(row.correlacion);
          const ciL = xPos(Math.max(xMin, row.ci_lower));
          const ciR = xPos(Math.min(xMax, row.ci_upper));
          const color = getColor(row.correlacion);
          const stars = showSignificance ? pStars(row.p_value) : "";
          const isSelected = selectedIndicator === row.indicador;
          const isClickable = !!onSelectIndicator;
          return /* @__PURE__ */ jsxs(
            "g",
            {
              onClick: isClickable ? () => onSelectIndicator(row.indicador) : void 0,
              onKeyDown: isClickable ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectIndicator(row.indicador);
                }
              } : void 0,
              tabIndex: isClickable ? 0 : void 0,
              style: isClickable ? { cursor: "pointer" } : void 0,
              role: isClickable ? "button" : void 0,
              "aria-pressed": isClickable ? isSelected : void 0,
              children: [
                /* @__PURE__ */ jsx(
                  "rect",
                  {
                    x: 0,
                    y: plotAreaTop + i * rowHeight,
                    width: totalWidth,
                    height: rowHeight,
                    fill: isSelected ? "#eff6ff" : i % 2 === 0 ? "#f9fafb" : "transparent"
                  }
                ),
                isSelected && /* @__PURE__ */ jsx(
                  "rect",
                  {
                    x: 0,
                    y: plotAreaTop + i * rowHeight,
                    width: 3,
                    height: rowHeight,
                    fill: "#3b82f6"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "text",
                  {
                    x: labelWidth - 8,
                    y: cy + 4,
                    textAnchor: "end",
                    fontSize: 12,
                    fontWeight: isSelected ? 700 : 400,
                    fill: isSelected ? "#1d4ed8" : "#374151",
                    children: row.label
                  }
                ),
                /* @__PURE__ */ jsx(
                  "line",
                  {
                    x1: ciL,
                    x2: ciR,
                    y1: cy,
                    y2: cy,
                    stroke: color,
                    strokeWidth: ciLineWidth
                  }
                ),
                /* @__PURE__ */ jsx(
                  "line",
                  {
                    x1: ciL,
                    x2: ciL,
                    y1: cy - 5,
                    y2: cy + 5,
                    stroke: color,
                    strokeWidth: ciLineWidth
                  }
                ),
                /* @__PURE__ */ jsx(
                  "line",
                  {
                    x1: ciR,
                    x2: ciR,
                    y1: cy - 5,
                    y2: cy + 5,
                    stroke: color,
                    strokeWidth: ciLineWidth
                  }
                ),
                /* @__PURE__ */ jsx(
                  "circle",
                  {
                    cx,
                    cy,
                    r: dotRadius,
                    fill: color,
                    stroke: "#fff",
                    strokeWidth: 1.5
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "text",
                  {
                    x: plotRight + plotPadRight + valueWidth / 2,
                    y: cy + 4,
                    textAnchor: "middle",
                    fontSize: 11,
                    fill: "#374151",
                    fontFamily: "monospace",
                    children: [
                      row.correlacion.toFixed(2),
                      stars ? /* @__PURE__ */ jsxs("tspan", { fill: "#7c3aed", fontWeight: 700, children: [
                        " ",
                        stars
                      ] }) : null
                    ]
                  }
                )
              ]
            },
            `${row.indicador}__${i}`
          );
        }),
        /* @__PURE__ */ jsx(
          "line",
          {
            x1: plotLeft,
            x2: plotRight,
            y1: plotAreaBottom,
            y2: plotAreaBottom,
            stroke: "#9ca3af",
            strokeWidth: 1
          }
        ),
        ticks.map((t) => /* @__PURE__ */ jsxs("g", { children: [
          /* @__PURE__ */ jsx(
            "line",
            {
              x1: xPos(t),
              x2: xPos(t),
              y1: plotAreaBottom,
              y2: plotAreaBottom + 4,
              stroke: "#9ca3af",
              strokeWidth: 1
            }
          ),
          /* @__PURE__ */ jsx(
            "text",
            {
              x: xPos(t),
              y: plotAreaBottom + 14,
              textAnchor: "middle",
              fontSize: 10,
              fill: "#6b7280",
              children: t
            }
          )
        ] }, `tick-${t}`)),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: zeroX,
            y: plotAreaBottom + axisHeight + 14,
            textAnchor: "middle",
            fontSize: 10,
            fill: "#6b7280",
            children: "sin correlaci\xF3n"
          }
        ),
        showSignificance && /* @__PURE__ */ jsx(
          "text",
          {
            x: totalWidth - 4,
            y: plotAreaBottom + axisHeight + 14,
            textAnchor: "end",
            fontSize: 10,
            fill: "#6b7280",
            children: "* p<0.05 \xB7 ** p<0.01 \xB7 *** p<0.001"
          }
        )
      ]
    }
  );
};
export {
  DSForestPlot
};
