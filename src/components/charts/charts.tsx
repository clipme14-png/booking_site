"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`)
    .join(" ");
  const area = `${line} L ${points[points.length - 1][0]},${height} L ${points[0][0]},${height} Z`;
  return { line, area, points };
}

/* ---------------------------------------------------------------- */
/*  Area / Line chart                                              */
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

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height }}
      >
        <defs>
          <linearGradient id={`area-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`hsl(${color} / 0.35)`} />
            <stop offset="100%" stopColor={`hsl(${color} / 0)`} />
          </linearGradient>
        </defs>
        <motion.path
          d={area}
          fill={`url(#area-${gid})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke={`hsl(${color})`}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r={2.5}
            fill={`hsl(${color})`}
            className="opacity-0 transition-opacity hover:opacity-100"
          />
        ))}
      </svg>
      {labels && (
        <div className="mt-2 flex justify-between px-1 text-[11px] text-muted-foreground">
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
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((v, i) => (
          <div
            key={i}
            className="flex h-full flex-1 flex-col justify-end"
            title={`${v}`}
          >
            <motion.div
              className="w-full rounded-t-md bg-brand-gradient"
              style={{ minHeight: v > 0 ? 4 : 0 }}
              initial={{ height: 0 }}
              whileInView={{ height: `${Math.max((v / max) * 100, v > 0 ? 3 : 0)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        ))}
      </div>
      {labels && (
        <div className="mt-2 flex text-[11px] text-muted-foreground">
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
  strokeWidth = 22,
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
  let offset = 0;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circumference;
          const el = (
            <motion.circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          );
          offset += dash;
          return el;
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
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
