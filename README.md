# WINTER ARC — DISCIPLINE CHALLENGE ❄️🔥

A high-performance, cross-platform personal discipline and habit-tracking mobile application designed to help users build unstoppable consistency, streaks, and personal growth.

The core challenge rule: **Complete at least 4 meaningful tasks every day.**

---

## 🛠 TECH STACK

### Mobile Frontend
- **Framework**: React Native with Expo (SDK 51), TypeScript
- **Navigation**: React Navigation 6 (Bottom Tabs + Native Stack)
- **State Management**: Zustand
- **UI & Animations**: Custom Winter Dark Theme (`#0B0E14`), Lucide React Native, SVG Circular Progress, Reanimated
- **Offline Storage & Sync**: AsyncStorage with offline action queues and automatic sync engine

### Backend
- **Framework**: Node.js, NestJS, TypeScript
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Authentication**: JWT Access & Refresh Token Rotation with bcrypt hashing
- **Validation & Docs**: Class-Validator, Swagger / OpenAPI (`/api/docs`)
- **Background Tasks**: NestJS Schedule Cron Jobs (Midnight summary, 8 PM streak warning, Token cleanup)

---

## 📁 PROJECT STRUCTURE

```text
winter-arc/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Complete 14-table relational database schema
│   │   └── seed.ts              # Initial achievements & task templates seed
│   ├── src/
│   │   ├── auth/                # JWT Auth, Register, Login, Refresh, Password reset
│   │   ├── users/               # Profile & Preferences management
│   │   ├── tasks/               # Task CRUD, 1-tap templates & completion engine
│   │   ├── daily-summary/       # Daily minimum 4-task goal evaluator
│   │   ├── streaks/             # Streak calculation, freezes & rest days
│   │   ├── analytics/           # Weekly/monthly averages & Discipline Score formula
│   │   ├── achievements/        # Automated badge condition engine & XP rewards
│   │   ├── challenges/          # Weekly quests & group challenges
│   │   ├── friends/             # Social connections & streak sharing
│   │   ├── notifications/       # In-app notification queue
│   │   ├── ai/                  # AI Coach weekly analysis & goal breakdown engine
│   │   ├── cron/                # Scheduled background cron jobs
│   │   ├── common/              # Guards, Filters, Interceptors, Decorators
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                    # Unit & discipline formula test suite
│   ├── package.json
│   └── .env.example
│
├── mobile/
│   ├── src/
│   │   ├── components/ui/       # CircularProgress, TaskCard, StreakBanner, CelebrationModal
│   │   ├── screens/             # Onboarding, Login, Register, Home, Calendar, Analytics, Rewards, Profile
│   │   ├── navigation/          # RootNavigator & TabNavigator (HOME, CALENDAR, ANALYTICS, REWARDS, PROFILE)
│   │   ├── store/               # Zustand stores (useAuthStore, useTaskStore, useAnalyticsStore, useChallengeStore)
│   │   ├── services/            # Axios API client, Storage, Notifications, Offline Sync
│   │   ├── theme/               # Winter Dark Navy / Ice-Blue theme
│   │   └── types/               # TypeScript interfaces
│   ├── App.tsx
│   ├── app.json
│   └── package.json
│
└── README.md
```

---

## ⚡ QUICK START & SETUP

### 1. Environment Setup

Copy `.env.example` in backend:

```bash
cd backend
cp .env.example .env
```

### 2. Backend Setup & Database Migration

Install dependencies:
```bash
cd backend
npm install
```

Generate Prisma Client & Run Database Migration:
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

Start NestJS Backend Server:
```bash
npm run start:dev
```
Backend will run at `http://localhost:3000`.  
Swagger OpenAPI Documentation will be available at `http://localhost:3000/api/docs`.

### 3. Mobile Setup

Install dependencies:
```bash
cd ../mobile
npm install
```

Start Expo Dev Server:
```bash
npx expo start
```

Press `a` to launch Android Emulator, `i` for iOS Simulator, or scan the QR code with Expo Go app.

---

## 🧮 DISCIPLINE SCORE FORMULA

The overall Discipline Score (0–100%) is calculated dynamically using a transparent formula:

$$\text{DisciplineScore} = (\text{GoalSuccessRate} \times 0.5) + (\text{CompletionRate} \times 0.3) + (\text{StreakConsistency} \times 0.2)$$

- **Goal Success Rate**: Percentage of days in the period meeting the 4-task minimum.
- **Completion Rate**: Total completed tasks divided by assigned tasks.
- **Streak Consistency**: Scaled score based on current consecutive day streak.

---

## 🧪 TESTING

To run the backend core discipline rule test suite:

```bash
cd backend
npm run test
```

Verifies:
- 4-task daily minimum success rule (0/4=false, 3/4=false, 4/4=true, 5/4=true).
- Discipline score calculation logic.
- Weekly average task calculation without percentage distortion.
