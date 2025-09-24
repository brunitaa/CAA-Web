import React from "react";
interface ChartLineProps {
  data?: { day: string; uploads: number }[];
  width?: number;
  height?: number;
}

export default function ChartLine({
  data = [],
  width = 360,
  height = 120,
}: ChartLineProps) {
  if (data.length === 0)
    return (
      <div className="w-full h-[120px] flex items-center justify-center text-sm text-gray-500">
        Sin datos de actividad
      </div>
    );

  const values = data.map((d) => d.uploads);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const padding = 12;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const stepX = innerW / Math.max(1, data.length - 1);

  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const normalized = max === min ? 0.5 : (d.uploads - min) / (max - min);
    const y = padding + (1 - normalized) * innerH;
    return { x, y, label: d.day, value: d.uploads };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaD = `${pathD} L ${padding + innerW} ${
    height - padding
  } L ${padding} ${height - padding} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block"
    >
      <path d={areaD} fill="#EEF2FF" opacity="0.9" />
      <path
        d={pathD}
        fill="none"
        stroke="#4F46E5"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {[0, 0.5, 1].map((t, idx) => {
        const y = padding + innerH * t;
        return (
          <line
            key={idx}
            x1={padding}
            x2={padding + innerW}
            y1={y}
            y2={y}
            stroke="#E5E7EB"
            strokeDasharray="2 4"
          />
        );
      })}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3.2} fill="#4F46E5" />
          <text
            x={p.x}
            y={height - 2}
            textAnchor="middle"
            fontSize={10}
            fill="#6B7280"
          >
            {p.label}
          </text>
          <text
            x={p.x}
            y={p.y - 8}
            fontSize={10}
            textAnchor="middle"
            fill="#374151"
          >
            {p.value}
          </text>
        </g>
      ))}
    </svg>
  );
}
