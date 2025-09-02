import React from "react";
import clsx from "clsx";

interface AlertBannerProps {
  type?: "warning" | "danger" | "info";
  title: string;
  message?: string;
}

export function AlertBanner({
  type = "info",
  title,
  message,
}: AlertBannerProps) {
  const styles: Record<string, string> = {
    info: "bg-blue-50/70 border-blue-300/60 text-blue-800",
    warning: "bg-amber-50/70 border-amber-300/60 text-amber-800",
    danger: "bg-red-50/70 border-red-300/60 text-red-800",
  };
  return (
    <div
      className={clsx(
        "rounded-lg border px-4 py-3 flex flex-col gap-1 animate-fade-in backdrop-blur-sm shadow-sm transition-opacity opacity-70 hover:opacity-100",
        styles[type]
      )}
      role="status"
    >
      <span className="font-semibold tracking-wide">{title}</span>
      {message && <span className="text-sm leading-snug">{message}</span>}
    </div>
  );
}
