# Smart Garden Dashboard

Next.js 15 App Router + Tailwind CSS dashboard for real-time IoT sensor monitoring using Firebase Realtime Database (with mock fallback) and pnpm.

## Features

- Sensors: Touch, Light, Ultrasonic (distance), Smoke, Temperature (humidity removed)
- Dual Firebase listeners: `sensor_data/current` (live) + `sensor_data/history` (time series)
- Selectable history chart (tabs: Temperature, Light, Distance, Smoke, Touch) powered by Recharts
- Toast notifications with audio alerts (touch + smoke)
- Automatic Christmas tree animation & music when distance < threshold
- Avatar with animated mouth when touch active and timed speech bubble
- Mock data mode (auto when Firebase env vars missing) with visual MOCK badge
- Custom Tailwind animations (talk, bounce-slow, spin-slow, slide-in-right, etc.)

## Getting Started (pnpm)

1. Copy `.env.example` to `.env.local` and fill all `NEXT_PUBLIC_FIREBASE_*` variables.
1. Install dependencies:

   ```bash
   pnpm install
   ```

1. Run dev server:

   ```bash
   pnpm dev
   ```

1. Open <http://localhost:3000>

If any Firebase variable is missing the app automatically switches to mock mode.

## Firebase Realtime Database Structure

```jsonc
{
  "sensor_data": {
    "current": {
      "touch": false,
      "light": 350,
      "distance": 22, // or legacy key "ultrasonic"
      "smoke": 118,
      "temperature": 28.4,
      "timestamp": "2025-09-02T10:15:32.123Z",
    },
    "history": {
      "-NvAbCdEf123": {
        "timestamp": "2025-09-02T10:14:32.100Z",
        "light": 360,
        "distance": 23,
        "smoke": 115,
        "temperature": 28.3,
        "touch": 0,
      },
      // more push-id entries ...
    },
  },
}
```

Notes:

- `distance` (or `ultrasonic`) is normalized to `ultrasonic` in the client.
- History is converted to an ordered array; last 300 points kept client-side.

## Thresholds (edit in `app/page.tsx`)

```ts
const lightThreshold = 400; // below -> dark (lights ON)
const ultrasonicThreshold = 25; // below -> tree & music ON
const smokeThreshold = 150; // above -> smoke alert
```

## Extending Sensors

1. Extend `SensorsData` in `lib/firebase.ts` and map new fields in both `current` & `history` sections.
1. Add a new `SensorIcon` instance in `app/page.tsx`.
1. Add to the metric tabs + `metricMeta` if you want it chartable.

## Audio Assets

Place MP3 files under `public/sounds/`:

| File            | Purpose             |
| --------------- | ------------------- |
| `alert1.mp3`    | Touch alert         |
| `alert2.mp3`    | Smoke alert         |
| `christmas.mp3` | Seasonal tree music |

## Mock Mode

If Firebase config is missing, synthetic sensor values publish every 2s (with rolling history). A yellow `MOCK` badge appears under the title.

## Production Notes

- Apply strict Firebase security rules (limit read/write to devices/service accounts).
- Consider offloading long-term storage to a time-series DB (InfluxDB, Timescale, BigQuery) if >300 points needed.
- Debounce or batch device writes to reduce bandwidth & quota.
- Add telemetry/error logging as needed.

## License

Private / educational project (add a license if you plan to distribute).
