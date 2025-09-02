# Smart Garden Dashboard

Next.js 15 App Router dashboard for real-time IoT sensor monitoring using Firebase Realtime Database.

## Features

- Touch, Light, Ultrasonic, Smoke, Temperature, Humidity sensors
- Real-time updates (Firebase onValue listeners)
- Alert banners & audio alerts
- Automatic Christmas music trigger (ultrasonic threshold)
- Historical Temperature & Humidity chart (Recharts)
- Tailwind CSS + (lightweight) custom components (could integrate shadcn/ui further)

## Getting Started

1. Copy `.env.example` to `.env.local` and fill Firebase config.
2. Install deps:
   ```
   npm install
   ```
3. Run dev server:
   ```
   npm run dev
   ```
4. Visit http://localhost:3000

## Firebase Data Structure

```json
{
  "sensors": {
    "touch": false,
    "light": 350,
    "ultrasonic": 18,
    "smoke": 120,
    "temperature": 28.5,
    "humidity": 60
  }
}
```

## Customization

- Thresholds in `app/page.tsx` (lightThreshold, ultrasonicThreshold, smokeThreshold)
- Add more sensors by extending `SensorsData` in `lib/firebase.ts` and replicating a card.

## Audio Assets

Place short mp3 files in `public/sounds/` named:

- `alert1.mp3` (touch)
- `alert2.mp3` (smoke)
- `christmas.mp3` (music loop)

## Notes

- For production, harden security rules in Firebase.
- Consider batching historical data in Firebase or a time-series store if long-term trends needed.
