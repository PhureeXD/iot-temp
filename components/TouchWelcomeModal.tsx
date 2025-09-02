"use client";
import React, { useEffect } from "react";
import clsx from "clsx";

interface TouchWelcomeModalProps {
  open: boolean;
  onClose: () => void;
  autoHideMs?: number;
}

export function TouchWelcomeModal({
  open,
  onClose,
  autoHideMs = 4000,
}: TouchWelcomeModalProps) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, autoHideMs);
    return () => clearTimeout(t);
  }, [open, autoHideMs, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-emerald-900/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative w-full max-w-sm rounded-2xl border bg-white/90 shadow-lg overflow-hidden",
          "animate-fade-in"
        )}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute text-sm top-2 right-2 text-slate-500 hover:text-slate-700"
        >
          ✕
        </button>
        <div className="flex flex-col items-center gap-4 px-6 pt-8 pb-6 text-center">
          {/* Simple stylized SVG avatar (placeholder for an image) */}
          <div className="relative w-32 h-32">
            <svg
              viewBox="0 0 120 120"
              className="w-full h-full drop-shadow-sm"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="60"
                cy="60"
                r="56"
                fill="#fef2f2"
                stroke="#fecaca"
                strokeWidth="4"
              />
              <circle cx="60" cy="54" r="22" fill="#fde68a" />
              <path d="M38 90c8-10 36-10 44 0-14 8-30 8-44 0Z" fill="#fecaca" />
              <circle cx="50" cy="54" r="4" fill="#1e293b" />
              <circle cx="70" cy="54" r="4" fill="#1e293b" />
              <path
                d="M52 66c4 3 12 3 16 0"
                stroke="#1e293b"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M36 46c4-10 16-18 24-18 8 0 20 8 24 18-4-4-12-8-24-8s-20 4-24 8Z"
                fill="#94a3b8"
              />
            </svg>
            <div className="absolute inset-0 pointer-events-none animate-bounce-slow" />
          </div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">
            Welcome!
          </h2>
          <p className="text-sm leading-snug text-slate-600">
            Door touched. Have a great day in the Smart Garden 🌱
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-sm font-medium shadow hover:bg-emerald-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// To use a custom image instead of the SVG avatar above, place an image (e.g., /images/anime-girl.png)
// in public/images and replace the SVG block with: <img src="/images/anime-girl.png" alt="Welcome" className="object-contain w-32 h-32" />
