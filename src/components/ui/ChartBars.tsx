import React from "react";
interface ChartBarsProps {
  data?: { name: string; value: number }[];
}

const BAR_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

export default function ChartBars({ data = [] }: ChartBarsProps) {
  if (data.length === 0)
    return <div className="text-sm text-gray-500">Sin categorías</div>;
  const maxVal = Math.max(...data.map((c) => c.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((c, i) => {
        const pct = Math.round((c.value / maxVal) * 100);
        const color = BAR_COLORS[i % BAR_COLORS.length];
        return (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{c.name}</span>
              <span className="font-semibold text-gray-800">{c.value}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                style={{ width: `${pct}%`, background: color }}
                className="h-3 rounded-full transition-all"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
