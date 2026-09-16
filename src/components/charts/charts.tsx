"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.28, 0.11, 0.32, 1] as const;

/* ---------------------------------------------------------------- */
/*  Helpers                                                         */
/* ---------------------------------------------------------------- */
function buildPath(
  values: number[],
  width: number,
  height: number,
  pad = 4,
): { line: string; area: string; points: [number, number][] } {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = (width - pad * 2) / (values.length - 1 || 1);
  const points = values.map(
    (v, i) =>
      [
        pad + i * stepX,
        height - pad - ((v - min) / range) * (height - pad * 2),
      ] as [number, number],
  );
  // Monotone-ish smoothing with short cubic handles
  const line = points
    .map((p, i, arr) => {
      if (i === 0) return `M ${p[0]},${p[1]}`;
      const prev = arr[i - 1];
      const cx = (prev[0] + p[0]) / 2;
      return `C ${cx},${prev[1]} ${cx},${p[1]} ${p[0]},${p[1]}`;
    })
    .join(" ");
  const area = `${line} L ${points[points.length - 1][0]},${height} L ${points[0][0]},${height} Z`;
  return { line, area, points };
}

function Gridlines({ count = 4 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-px w-full bg-foreground/[0.06]" />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Area / line chart                                              */
/* ---------------------------------------------------------------- */
export function AreaChart({
  data,
  labels,
  height = 200,
  className,
  color = "var(--violet)",
}: {
  data: number[];
  labels?: string[];
  height?: number;
  className?: string;
  color?: string;
}) {
  const width = 600;
  const { line, area, points } = buildPath(data, width, height, 8);
  const gid = React.useId().replace(/:/g, "");
  const last = points[points.length - 1];

  return (
    <div className={cn("w-full", className)}>
      <div className="relative" style={{ height }}>
        <Gridlines />
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`area-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${color} / 0.16)`} />
              <stop offset="100%" stopColor={`hsl(${color} / 0)`} />
            </linearGradient>
          </defs>
          <motion.path
            d={area}
            fill={`url(#area-${gid})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke={`hsl(${color})`}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease }}
          />
        </svg>
        {/* End-point marker, drawn in HTML so it stays round */}
        <motion.span
          className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card"
          style={{
            left: `${(last[0] / width) * 100}%`,
            top: `${(last[1] / height) * 100}%`,
            background: `hsl(${color})`,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.3 }}
        />
      </div>
      {labels && (
        <div className="mt-3 flex justify-between text-[11px] text-muted-foreground tabular">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Bar chart                                                      */
/* ---------------------------------------------------------------- */
export function BarChart({
  data,
  labels,
  height = 200,
  className,
}: {
  data: number[];
  labels?: string[];
  height?: number;
  className?: string;
}) {
  const max = Math.max(...data, 1);
  const peak = data.indexOf(Math.max(...data));
  return (
    <div className={cn("w-full", className)}>
      <div className="relative" style={{ height }}>
        <Gridlines />
        <div className="relative flex h-full items-end gap-2">
          {data.map((v, i) => (
            <div
              key={i}
              className="group flex h-full flex-1 flex-col items-center justify-end"
              title={`${v}`}
            >
              <motion.div
                className={cn(
                  "w-full max-w-7 rounded-t-[5px] rounded-b-[2px] transition-colors",
                  i === peak
                    ? "bg-primary"
                    : "bg-foreground/[0.14] group-hover:bg-foreground/25",
                )}
                style={{ minHeight: v > 0 ? 3 : 0 }}
                initial={{ height: 0 }}
                whileInView={{ height: `${Math.max((v / max) * 100, v > 0 ? 3 : 0)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.04, ease }}
              />
            </div>
          ))}
        </div>
      </div>
      {labels && (
        <div className="mt-3 flex gap-2 text-[11px] text-muted-foreground">
          {labels.map((l) => (
            <span key={l} className="flex-1 text-center">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Donut chart                                                    */
/* ---------------------------------------------------------------- */
export function DonutChart({
  segments,
  size = 180,
  strokeWidth = 16,
  className,
  children,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = segments.length > 1 ? 3 : 0;
  const dashes = segments.map((seg) => (seg.value / total) * circumference);
  const offsets = dashes.map((_, i) =>
    dashes.slice(0, i).reduce((sum, d) => sum + d, 0),
  );

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((seg, i) => {
          const visible = Math.max(dashes[i] - gap, 0.5);
          return (
            <motion.circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${visible} ${circumference - visible}`}
              strokeDashoffset={-offsets[i]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            />
          );
        })}
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Sparkline                                                      */
/* ---------------------------------------------------------------- */
export function Sparkline({
  data,
  className,
  color = "var(--green)",
  width = 120,
  height = 36,
}: {
  data: number[];
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}) {
  const { line } = buildPath(data, width, height, 2);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      style={{ width, height }}
    >
      <path
        d={line}
        fill="none"
        stroke={`hsl(${color})`}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
