"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
// import { SensorCard } from "../components/SensorCard"; // old rectangular cards
import { SensorIcon, Icons } from "../components/SensorIcon";
import { AlertBanner } from "../components/AlertBanner"; // kept for styling reuse
import { Toasts } from "../components/Toasts";
import { MusicPlayer } from "../components/MusicPlayer";
import { subscribeSensors, SensorsData, usingMockData } from "../lib/firebase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface AlertItem {
  id: string;
  title: string;
  type: "info" | "warning" | "danger";
  message?: string;
}

const TOUCH_ALERT_SOUND = "/sounds/alert1.mp3";
const SMOKE_ALERT_SOUND = "/sounds/alert2.mp3";
const CHRISTMAS_MUSIC = "/sounds/christmas.mp3";

const lightThreshold = 400; // below = dark
const ultrasonicThreshold = 25; // below = near object
const smokeThreshold = 150; // above = danger

export default function DashboardPage() {
  const [sensors, setSensors] = useState<SensorsData | null>(null);
  const [history, setHistory] = useState<
    {
      t: number;
      temperature?: number;
      light?: number;
      ultrasonic?: number;
      smoke?: number;
      touch?: number;
    }[]
  >([]);
  const [selectedMetric, setSelectedMetric] = useState<
    "temperature" | "light" | "ultrasonic" | "smoke" | "touch"
  >("temperature");
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const touchAudioRef = useRef<HTMLAudioElement | null>(null);
  const smokeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const hideWelcomeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // mock initial data if firebase not yet sending
  useEffect(() => {
    const unsub = subscribeSensors((data) => {
      setSensors(data);
      if (data.history) setHistory(data.history);
      else
        setHistory((h) => [
          ...h.slice(-149),
          {
            t: Date.now(),
            temperature: data.temperature,
            light: data.light,
            ultrasonic: data.ultrasonic,
            smoke: data.smoke,
            touch: data.touch ? 1 : 0,
          },
        ]);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!sensors) return;
    // manage welcome bubble visibility
    if (sensors.touch) {
      if (hideWelcomeTimeoutRef.current) {
        clearTimeout(hideWelcomeTimeoutRef.current);
        hideWelcomeTimeoutRef.current = null;
      }
      setShowWelcome(true);
    } else {
      if (showWelcome && !hideWelcomeTimeoutRef.current) {
        hideWelcomeTimeoutRef.current = setTimeout(() => {
          setShowWelcome(false);
          hideWelcomeTimeoutRef.current = null;
        }, 2000); // keep bubble 2s after touch ends
      }
    }
    const newAlerts: AlertItem[] = [];
    if (sensors.touch)
      newAlerts.push({
        id: "touch",
        title: "ประตูถูกเปิด (Touch Detected)",
        type: "warning",
        message: "Door sensor triggered.",
      });
    if (sensors.light < lightThreshold)
      newAlerts.push({
        id: "light",
        title: "Garden & Dome Lights ON",
        type: "info",
      });
    if (sensors.ultrasonic < ultrasonicThreshold)
      newAlerts.push({
        id: "ultrasonic",
        title: "Christmas Tree Lights ON",
        type: "info",
      });
    if (sensors.smoke > smokeThreshold)
      newAlerts.push({
        id: "smoke",
        title: "High Smoke Detected",
        type: "danger",
        message: `Smoke level ${sensors.smoke} ppm exceeds safe threshold.`,
      });
    if (sensors.temperature > 35)
      newAlerts.push({
        id: "temp",
        title: "High Temperature",
        type: "warning",
        message: `${sensors.temperature.toFixed(1)}°C > 35°C`,
      });
    // humidity alert removed
    setAlerts(newAlerts);
  }, [sensors]);

  // play sounds
  useEffect(() => {
    if (!sensors) return;
    if (sensors.touch && touchAudioRef.current) {
      touchAudioRef.current.currentTime = 0;
      touchAudioRef.current.play().catch(() => {});
    }
    if (sensors.smoke > smokeThreshold && smokeAudioRef.current) {
      smokeAudioRef.current.currentTime = 0;
      smokeAudioRef.current.play().catch(() => {});
    }
  }, [sensors]);

  const latest = sensors;
  const isDark = latest && latest.light < lightThreshold;
  const christmasActive = latest && latest.ultrasonic < ultrasonicThreshold;

  const chartData = useMemo(
    () =>
      history.map((h) => ({
        time: new Date(h.t).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
  value: (h as any)[selectedMetric],
      })),
    [history, selectedMetric]
  );

  const metricMeta: Record<
    typeof selectedMetric,
    { label: string; color: string; unit?: string }
  > = {
    temperature: { label: "Temperature (°C)", color: "#ef4444", unit: "°C" },
    light: { label: "Light (lx)", color: "#f59e0b", unit: "lx" },
    ultrasonic: { label: "Distance (cm)", color: "#3b82f6", unit: "cm" },
    smoke: { label: "Smoke (ppm)", color: "#6b7280", unit: "ppm" },
    touch: { label: "Touch (0/1)", color: "#10b981" },
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-500">
          Smart Garden Dashboard
        </h1>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          Realtime monitoring{" "}
          {usingMockData && (
            <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-800 font-medium border border-amber-300">
              MOCK
            </span>
          )}
        </div>
      </header>

      {/* Alerts now rendered as toast notifications */}
      <Toasts items={alerts} />

      <div className="grid gap-8 sm:grid-cols-3 md:grid-cols-6 justify-items-center">
        <SensorIcon
          name="Touch"
          value={latest ? (latest.touch ? "Touch" : "Idle") : "--"}
          status={latest?.touch ? "alert" : "normal"}
          description={latest?.touch ? "Door opened" : "No touch"}
          icon={Icons.touch}
        />
        <SensorIcon
          name="Light"
          value={latest ? latest.light : "--"}
          unit="lx"
          status={isDark ? "alert" : "normal"}
          description={isDark ? "Dark - lights on" : "Normal light"}
          icon={Icons.light}
        />
        <SensorIcon
          name="Ultrasonic"
          value={latest ? latest.ultrasonic : "--"}
          unit="cm"
          status={christmasActive ? "alert" : "normal"}
          description={christmasActive ? "Tree lights on" : "Distance ok"}
          icon={Icons.ultrasonic}
        />
        <SensorIcon
          name="Smoke"
          value={latest ? latest.smoke : "--"}
          unit="ppm"
          status={latest && latest.smoke > smokeThreshold ? "alert" : "normal"}
          description={
            latest && latest.smoke > smokeThreshold ? "High smoke" : "Safe"
          }
          icon={Icons.smoke}
        />
        <SensorIcon
          name="Temp"
          value={latest ? latest.temperature.toFixed(1) : "--"}
          unit="°C"
          status={latest && latest.temperature > 35 ? "alert" : "normal"}
          description={latest && latest.temperature > 35 ? "Hot" : "Comfort"}
          icon={Icons.temperature}
        />
        {/* Humidity sensor removed */}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_340px] items-start">
        <div className="rounded-xl border bg-white/70 backdrop-blur p-4 space-y-4 min-h-[22rem]">
          <div className="flex flex-col gap-3">
            <h2 className="font-semibold text-lg">History</h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {(
                [
                  "temperature",
                  "light",
                  "ultrasonic",
                  "smoke",
                  "touch",
                ] as const
              ).map((m) => {
                const active = selectedMetric === m;
                return (
                  <button
                    key={m}
                    onClick={() => setSelectedMetric(m)}
                    className={`px-3 py-1 rounded-full border transition text-[11px] font-medium ${
                      active
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white/60 hover:bg-white text-slate-600 border-slate-300"
                    }`}
                  >
                    {metricMeta[m].label.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  interval={history.length > 10 ? "preserveStartEnd" : 0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                {/* Right Y axis (humidity) removed */}
                <Tooltip />
                <Legend
                  formatter={() => metricMeta[selectedMetric].label}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={metricMeta[selectedMetric].color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                  name={metricMeta[selectedMetric].label}
                />
                {/* Humidity line removed */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border bg-white/70 backdrop-blur p-4 flex flex-col gap-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <span>Christmas Tree</span>
              {christmasActive && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-white animate-pulse">
                  ON
                </span>
              )}
            </h2>
            <MusicPlayer
              active={!!christmasActive}
              autoPlay
              src={CHRISTMAS_MUSIC}
            />
            <p className="text-xs text-slate-500 leading-snug">
              Tree lights & music activate automatically when an object is
              within
              <span className="font-semibold"> {ultrasonicThreshold}cm</span>.
            </p>
          </div>
          <div className="rounded-xl border bg-white/80 backdrop-blur p-4 flex flex-col items-center gap-3 animate-fade-in">
            <div className="w-24 h-24 relative">
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
                <path
                  d="M38 90c8-10 36-10 44 0-14 8-30 8-44 0Z"
                  fill="#fecaca"
                />
                <circle cx="50" cy="54" r="4" fill="#1e293b" />
                <circle cx="70" cy="54" r="4" fill="#1e293b" />
                {/* Mouth frame */}
                <g transform="translate(0,0)">
                  <rect
                    x="52"
                    y="64"
                    width="16"
                    height="6"
                    rx="3"
                    fill="#1e293b"
                    className={
                      latest?.touch
                        ? "origin-center animate-talk"
                        : "origin-center"
                    }
                  />
                </g>
                <path
                  d="M36 46c4-10 16-18 24-18 8 0 20 8 24 18-4-4-12-8-24-8s-20 4-24 8Z"
                  fill="#94a3b8"
                />
              </svg>
              <div className="absolute inset-0 animate-bounce-slow pointer-events-none" />
              {showWelcome && (
                <div className="absolute -top-2 -right-2 max-w-[110px] bg-emerald-600 text-white text-[10px] px-2 py-1 rounded-md shadow-md animate-fade-in">
                  Welcome
                  <span className="absolute -bottom-1 right-4 w-2 h-2 rotate-45 bg-emerald-600" />
                </div>
              )}
            </div>
            {/* No static text; speech bubble only when touch is active */}
          </div>
        </div>
      </section>

      <audio ref={touchAudioRef} src={TOUCH_ALERT_SOUND} />
      <audio ref={smokeAudioRef} src={SMOKE_ALERT_SOUND} />
    </main>
  );
}
