"use client";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface MusicPlayerProps {
  autoPlay?: boolean;
  active: boolean;
  src: string;
  title?: string;
}

export function MusicPlayer({
  autoPlay,
  active,
  src,
  title = "Christmas Music",
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    if (active) {
      if (autoPlay) {
        audioRef.current.volume = 0.6;
        audioRef.current.play().catch(() => {});
        setPlaying(true);
      }
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    }
  }, [active, autoPlay]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <div
      className={clsx(
        "rounded-md border px-4 py-4 bg-white/70 backdrop-blur flex items-center gap-6 relative overflow-hidden"
      )}
    >
      <audio ref={audioRef} src={src} loop />
      {/* Animated Christmas Tree */}
      <div
        className={clsx(
          "relative w-16 h-20 flex items-end justify-center select-none",
          playing ? "animate-bounce-slow" : "opacity-80"
        )}
        title={playing ? "Playing" : "Paused"}
      >
        <div
          className={clsx(
            "absolute inset-0 flex flex-col items-center justify-end"
          )}
        >
          <div
            className={clsx(
              "relative w-0 h-0 border-l-[32px] border-r-[32px] border-b-[46px]",
              "border-l-transparent border-r-transparent",
              playing ? "border-b-green-500" : "border-b-emerald-600",
              "drop-shadow-md"
            )}
          ></div>
          <div
            className={clsx(
              "relative -mt-6 w-0 h-0 border-l-[26px] border-r-[26px] border-b-[38px]",
              "border-l-transparent border-r-transparent",
              playing ? "border-b-green-400" : "border-b-emerald-500",
              "drop-shadow"
            )}
          ></div>
          <div
            className={clsx(
              "relative -mt-5 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px]",
              "border-l-transparent border-r-transparent",
              playing ? "border-b-green-300" : "border-b-emerald-400",
              "drop-shadow-sm"
            )}
          ></div>
          <div className="w-4 h-5 bg-amber-700 rounded-sm mt-1" />
          {/* Decor Ornaments */}
          <div className="absolute top-5 flex flex-col items-center gap-2">
            <span
              className={clsx(
                "w-2 h-2 rounded-full",
                playing ? "bg-red-300 animate-pulse" : "bg-red-400"
              )}
            ></span>
            <span
              className={clsx(
                "w-2 h-2 rounded-full",
                playing
                  ? "bg-yellow-300 animate-pulse delay-150"
                  : "bg-yellow-400"
              )}
            ></span>
            <span
              className={clsx(
                "w-2 h-2 rounded-full",
                playing ? "bg-blue-300 animate-pulse delay-300" : "bg-blue-400"
              )}
            ></span>
          </div>
          {/* Star */}
          <div
            className={clsx(
              "absolute -top-3 text-yellow-300",
              playing && "animate-spin-slow"
            )}
          >
            ★
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-xs text-slate-500">
          {active ? "Auto-triggered by Ultrasonic sensor" : "Idle"}
        </span>
        <span className="text-[10px] uppercase tracking-wide font-medium mt-1 text-emerald-600">
          {playing ? "Playing" : "Paused"}
        </span>
      </div>
      <button
        onClick={toggle}
        className="ml-auto text-sm font-medium rounded px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 transition"
      >
        {playing ? "Pause" : "Play"}
      </button>
      {/* subtle music waves */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 -z-10",
          playing &&
            "[mask-image:radial-gradient(circle_at_center,white,transparent)]"
        )}
      >
        {playing && (
          <div className="absolute inset-0 opacity-30 animate-pulse">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-emerald-300/30 animate-[ping_3s_linear_infinite]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-green-400/20 animate-[ping_5s_linear_infinite]" />
          </div>
        )}
      </div>
    </div>
  );
}

// extra animations via tailwind utilities (extend in tailwind config if desired)
