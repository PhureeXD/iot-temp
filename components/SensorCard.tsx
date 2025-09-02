import React from "react";
import clsx from "clsx";

interface SensorCardProps {
  name: string;
  value: string | number;
  unit?: string;
  status?: "normal" | "alert";
  description?: string;
  highlight?: boolean;
  children?: React.ReactNode;
}

export function SensorCard({
  name,
  value,
  unit,
  status = "normal",
  description,
  highlight,
  children,
}: SensorCardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border p-4 shadow-sm bg-white/70 backdrop-blur transition relative overflow-hidden",
        status === "alert" &&
          "border-red-400 ring-1 ring-red-300 animate-pulse-alert",
        highlight && "outline outline-2 outline-emerald-400"
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-slate-800">{name}</h3>
        <span
          className={clsx(
            "text-xs px-2 py-0.5 rounded-full font-medium tracking-wide",
            status === "alert"
              ? "bg-red-500 text-white"
              : "bg-emerald-500 text-white"
          )}
        >
          {status === "alert" ? "Alert" : "Normal"}
        </span>
      </div>
      <div className="mt-2 text-3xl font-bold text-slate-900 flex items-baseline gap-1">
        {value}
        <span className="text-base font-medium text-slate-500">{unit}</span>
      </div>
      {description && (
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      )}
      {children}
    </div>
  );
}
