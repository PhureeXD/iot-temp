import React from "react";
import clsx from "clsx";

export interface SensorIconProps {
  name: string;
  value: string | number;
  unit?: string;
  status?: "normal" | "alert";
  description?: string;
  icon: React.ReactNode;
}

export function SensorIcon({
  name,
  value,
  unit,
  status = "normal",
  description,
  icon,
}: SensorIconProps) {
  const isAlert = status === "alert";
  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div
        className={clsx(
          "relative flex items-center justify-center w-24 h-24 rounded-full border-4 bg-white/60 backdrop-blur shadow-sm",
          isAlert
            ? "border-red-400 animate-pulse-alert ring ring-red-300"
            : "border-emerald-300"
        )}
        aria-label={name}
        title={description || name}
      >
        <div
          className={clsx(
            "w-12 h-12 text-emerald-600",
            isAlert && "text-red-500"
          )}
        >
          {icon}
        </div>
      </div>
      <div className="flex flex-col items-center text-center">
        <span
          className={clsx(
            "text-sm font-semibold",
            isAlert ? "text-red-600" : "text-slate-700"
          )}
        >
          {name}
        </span>
        <span className={"text-xs text-slate-500 font-medium"}>
          {typeof value === "number" ? value : value}
          {unit && (
            <>
              <span className="ml-0.5">{unit}</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

// Simple inline SVG icon helpers (to avoid extra dependencies)
export const Icons = {
  touch: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M18 11.5V7.8a2.8 2.8 0 0 0-5.6 0v3.7" />
      <path d="M12.4 11.5V6.2a2.2 2.2 0 0 0-4.4 0v7.1" />
      <path d="M8 13.3V9.5a2 2 0 0 0-4 0v5.9c0 3.1 1.9 4.6 4.9 4.6h4.6c4 0 6.5-1.6 6.5-5.7v-2.8a2.1 2.1 0 0 0-4.2 0" />
    </svg>
  ),
  light: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.1 6.1-1.4-1.4M8.3 9.3 6.9 7.9m0 8.2 1.4-1.4m8.2-8.2-1.4 1.4" />
    </svg>
  ),
  ultrasonic: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M5 12c0-3.9 3.1-7 7-7m0 14c-3.9 0-7-3.1-7-7" />
      <path d="M9 12c0-1.7 1.3-3 3-3m0 6c-1.7 0-3-1.3-3-3" />
      <path d="M13 5c3.9 0 7 3.1 7 7s-3.1 7-7 7" />
    </svg>
  ),
  smoke: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M4 16h14a3 3 0 0 0 0-6h-1.3" />
      <path d="M9 10S8 8 9 6s0-4-2-4" />
      <path d="M13 10s-1-2 0-4 0-4-2-4" />
      <path d="M5 20h10a3 3 0 0 0 0-6h-1" />
    </svg>
  ),
  temperature: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M12 2a2 2 0 0 0-2 2v9.1a4 4 0 1 0 4 0V4a2 2 0 0 0-2-2Z" />
      <path d="M10 10h4" />
    </svg>
  ),
  // humidity icon removed
};
