# GuardPay — Frontend

React Native (Expo) mobile app for the GuardPay fraud prevention platform.

## Stack

- **Framework:** React Native + Expo (SDK 54)
- **Navigation:** Expo Router (file-based)
- **Icons:** @expo/vector-icons (Ionicons)
- **Fonts:** Inter (Google Fonts)
- **Language:** TypeScript

## Project Structure

```
frontend/
├── app/                        # All screens (file-based routing)
│   ├── _layout.tsx             # Root layout & font loading
│   ├── index.tsx               # Entry redirect
│   ├── welcome.tsx             # Welcome/onboarding screen
│   ├── auth/
│   │   ├── login.tsx           # Login screen
│   │   └── register.tsx        # Register screen
│   ├── (tabs)/                 # Bottom tab navigator
│   │   ├── _layout.tsx         # Tab bar setup
│   │   ├── index.tsx           # Home dashboard
│   │   ├── verify.tsx          # Verify + Scam Message Checker
│   │   ├── emergency.tsx       # Emergency recovery
│   │   ├── learn.tsx           # Educational articles
│   │   └── profile.tsx         # User profile & settings
│   ├── emergency/
│   │   └── notify-contacts.tsx # Warning message generator
│   ├── report/
│   │   └── new.tsx             # Report fraud (multi-step form)
│   ├── learn/
│   │   └── [slug].tsx          # Article detail page
│   └── fraud-alerts.tsx        # Fraud alerts feed
├── components/
│   └── ui/                     # Reusable components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── ProgressBar.tsx
│       └── Toast.tsx
├── constants/
│   ├── Colors.ts               # Design system colors
│   ├── Typography.ts           # Font sizes & styles
│   └── Spacing.ts              # 8-point grid, shadows, radii
├── package.json
├── app.json
├── tsconfig.json
└── babel.config.js
```

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your Android device (for testing)

### Install dependencies

```bash
cd frontend
npm install
```

You'll also need the Inter font package:

```bash
npm install @expo-google-fonts/inter
```

### Run on Android

```bash
npm run android
```

Or start Expo and scan the QR code with Expo Go:

```bash
npm start
```

## Connecting to the Backend

All API calls are marked with `// TODO: wire to backend` comments. The backend team should share their endpoint contracts and you replace the mock `setTimeout` calls with real `fetch`/`axios` calls.

Expected endpoints (to be confirmed with backend team):

| Method | Endpoint | Screen |
|--------|----------|--------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| POST | `/api/analyze-message` | Scam Message Checker |
| POST | `/api/reports` | Report Fraud |
| GET | `/api/alerts` | Fraud Alerts |
| GET | `/api/articles` | Learn |

## Design System

Colors, typography, and spacing are all in `constants/`. Do not hardcode any values — always import from there.

Colors reference:
- `trustBlue` — `#1565C0` — primary actions
- `securityGreen` — `#2E7D32` — success states
- `warningOrange` — `#EF6C00` — warnings
- `alertRed` — `#D32F2F` — danger/emergency
