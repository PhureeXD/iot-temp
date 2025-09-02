import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, ref, onValue, type Database } from "firebase/database";

let app: FirebaseApp | undefined;
let db: Database | undefined;

export interface SensorsData {
  touch: boolean;
  light: number;
  /** Ultrasonic distance in cm (mapped from 'distance' in DB) */
  ultrasonic: number;
  smoke: number;
  temperature: number;
  /** Raw timestamp string from DB if provided */
  timestamp?: string;
  history?: {
    t: number; // epoch ms
    temperature?: number;
    light?: number;
    ultrasonic?: number;
    smoke?: number;
    touch?: number; // 0/1
  }[];
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function isConfigMissing() {
  return Object.values(firebaseConfig).some((v) => !v);
}

export function getFirebase() {
  if (isConfigMissing())
    throw new Error("Firebase config missing; using mock data");
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  }
  db = getDatabase(app);
  return { app, db };
}

// ---- Mock data fallback ----
const MOCK_BASE: SensorsData = {
  touch: false,
  light: 500,
  ultrasonic: 40,
  smoke: 90,
  temperature: 28.5,
};

function nextMock(prev: SensorsData): SensorsData {
  return {
    ...prev,
    // occasional touch event
    touch: Math.random() < 0.08 ? !prev.touch : false,
    light: clamp(prev.light + randDelta(-40, 40), 80, 800),
    ultrasonic: clamp(prev.ultrasonic + randDelta(-5, 5), 5, 60),
    smoke: clamp(prev.smoke + randDelta(-5, 12), 60, 260),
    temperature: clamp(prev.temperature + randDelta(-0.4, 0.6), 20, 42),
  };
}

function randDelta(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function subscribeSensors(callback: (data: SensorsData) => void) {
  // Try real Firebase first
  try {
    const { db } = getFirebase();
    // Paths:
    //  sensor_data/current -> latest snapshot
    //  sensor_data/history -> list of historical records
    const currentRef = ref(db, "sensor_data/current");
    const historyRef = ref(db, "sensor_data/history");

    let latest: SensorsData | undefined;

    const emit = () => {
      if (latest) callback({ ...latest });
    };

    const unsubCurrent = onValue(currentRef, (snapshot) => {
      const raw = snapshot.val();
      if (!raw) return;
      const distance =
        typeof raw.distance === "number"
          ? raw.distance
          : typeof raw.ultrasonic === "number"
          ? raw.ultrasonic
          : 0;
      if (!latest) {
        latest = {
          touch: !!raw.touch,
          light: Number(raw.light ?? 0),
          ultrasonic: Number(distance),
          smoke: Number(raw.smoke ?? 0),
          temperature: Number(raw.temperature ?? 0),
          timestamp: raw.timestamp,
        };
      } else {
        latest.touch = !!raw.touch;
        latest.light = Number(raw.light ?? 0);
        latest.ultrasonic = Number(distance);
        latest.smoke = Number(raw.smoke ?? 0);
        latest.temperature = Number(raw.temperature ?? 0);
        latest.timestamp = raw.timestamp;
      }
      emit();
    });

    const unsubHistory = onValue(historyRef, (snapshot) => {
      const rawHist = snapshot.val();
      if (!rawHist) return;
      // rawHist is an object of pushId -> record
      const arr = Object.values<any>(rawHist)
        .map((r) => {
          const tsRaw = r.timestamp ?? r.time ?? r.t;
          const tNum = typeof tsRaw === "number" ? tsRaw : Date.parse(tsRaw) || Date.now();
            const dist =
              typeof r.distance === "number"
                ? r.distance
                : typeof r.ultrasonic === "number"
                ? r.ultrasonic
                : undefined;
          return {
            t: tNum,
            temperature: typeof r.temperature === "number" ? r.temperature : undefined,
            light: typeof r.light === "number" ? r.light : undefined,
            ultrasonic: dist,
            smoke: typeof r.smoke === "number" ? r.smoke : undefined,
            touch: typeof r.touch === "number" ? r.touch : r.touch ? 1 : 0,
          };
        })
        .filter((e) => !Number.isNaN(e.t))
        .sort((a, b) => a.t - b.t)
        .slice(-300); // keep last 300
      if (!latest) {
        latest = { ...MOCK_BASE };
      }
      latest.history = arr;
      emit();
    });

    return () => {
      unsubCurrent();
      unsubHistory();
    };
  } catch (err) {
    // Fallback to mock stream
    console.warn(
      "Firebase unavailable, using mock sensor data:",
      (err as Error).message
    );
    let current: SensorsData & { __tick?: number } = { ...MOCK_BASE };
    current.history = [];
    callback(current);
    const interval = setInterval(() => {
      current = nextMock(current);
      // Append to mock history
      current.history = [
        ...(current.history || []).slice(-299),
        {
          t: Date.now(),
          temperature: current.temperature,
          light: current.light,
          ultrasonic: current.ultrasonic,
          smoke: current.smoke,
          touch: current.touch ? 1 : 0,
        },
      ];
      callback({ ...current });
    }, 2000);
    return () => clearInterval(interval);
  }
}

export const usingMockData = isConfigMissing();
