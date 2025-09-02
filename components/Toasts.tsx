"use client";
import React from "react";
import { AlertBanner } from "./AlertBanner";

interface Toast {
  id: string;
  title: string;
  type: "info" | "warning" | "danger";
  message?: string;
}

interface ToastsProps {
  items: Toast[];
}

export function Toasts({ items }: ToastsProps) {
  if (!items.length) return null;
  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col-reverse gap-3 w-72 pointer-events-none">
      {items.map((t) => (
        <div key={t.id} className="pointer-events-auto animate-slide-in-right">
          <AlertBanner type={t.type} title={t.title} message={t.message} />
        </div>
      ))}
    </div>
  );
}
