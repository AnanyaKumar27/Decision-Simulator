# DecisionLab – Scenario Simulator for Real-Life Decisions

> A production-level React + Firebase + Tailwind CSS application for university end-term project.

---

## 📁 Full Folder Structure

```
decisionlab/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                      # React entry point
    ├── App.jsx                       # Router + lazy loading + providers
    ├── index.css                     # Tailwind + global styles
    │
    ├── context/
    │   ├── AuthContext.jsx            # Firebase Auth global state (Context API)
    │   └── ScenarioContext.jsx        # Scenarios global state (lifted up)
    │
    ├── hooks/
    │   ├── useSimulation.js           # useMemo-powered simulation hook
    │   └── useForm.js                 # Reusable controlled form hook
    │
    ├── services/
    │   ├── firebase.js                # Firebase app init
    │   ├── authService.js             # signup / login / logout
    │   └── scenarioService.js         # Full CRUD with Firestore
    │
    ├── utils/
    │   ├── simulationEngine.js        # Deterministic simulation model
    │   └── helpers.js                 # Date formatting, colors, clamp
    │
    ├── components/
    │   ├── Layout.jsx                 # Sidebar + mobile nav shell
    │   ├── PrivateRoute.jsx           # Auth guard for protected routes
    │   ├── Spinner.jsx                # Loading indicator
    │   ├── ScenarioCard.jsx           # Reusable scenario list card
    │   ├── ScenarioForm.jsx           # Controlled form with useRef
    │   ├── SimulationChart.jsx        # Recharts area chart
    │   ├── InsightCard.jsx            # Color-coded insight display
    │   └── StatWidget.jsx             # Dashboard stat block
    │
    └── pages/
        ├── Login.jsx                  # Public — email/password login
        ├── Signup.jsx                 # Public — new account creation
        ├── Dashboard.jsx              # Protected — overview + recent
        ├── ScenarioBuilder.jsx        # Protected — create scenario
        ├── Results.jsx                # Protected — view results + chart
        ├── History.jsx                # Protected — full list with filters
        └── EditScenario.jsx           # Protected — edit + update
```

---

## ⚡ Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd decisionlab
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (e.g., `decisionlab-app`)
3. Enable **Authentication** → Sign-in method → **Email/Password** → Enable
4. Enable **Firestore Database** → Create database → Start in **test mode**
5. Go to **Project Settings** → Your apps → Web app → Copy SDK config

6. Paste your config into `src/services/firebase.js`:

```js
const firebaseConfig = {
  apiKey:            "AIza...",
  authDomain:        "decisionlab-app.firebaseapp.com",
  projectId:         "decisionlab-app",
  storageBucket:     "decisionlab-app.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123...",
}
```

### 3. Firestore Security Rules (Optional — for production)

In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/scenarios/{scenarioId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### 4. Run Locally

```bash
npm run dev
# App starts at http://localhost:5173
```

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

## 🧠 Simulation Logic Explained

The simulation engine is in `src/utils/simulationEngine.js`.

### Formula

```
score(t) = INITIAL + (GROWTH_RATE × effort × consistency × t) − PENALTY × missedDays(t)
```

| Constant    | Value | Meaning                               |
|-------------|-------|---------------------------------------|
| INITIAL     | 10    | Baseline starting score               |
| GROWTH_RATE | 1.5   | Compounding multiplier                |
| PENALTY     | 2     | Score lost per missed day             |

### Parameters (user input)

| Parameter   | Range  | Effect                                |
|-------------|--------|---------------------------------------|
| effort      | 1–12h  | Hours per day — scales growth linearly|
| consistency | 0–1    | Discipline — reduces missed days      |
| duration    | 7–90d  | Total simulation window               |

### Missed Days Calculation

```js
const isMissed = (t % Math.round(1 / Math.max(1 - consistency, 0.001))) === 0
```

- At `consistency = 1.0` → 0 missed days (perfect)
- At `consistency = 0.5` → misses every 2nd day
- At `consistency = 0.2` → misses every ~1.25 days (very poor)

### Insights Generation

The `generateInsights()` function analyses results and outputs:
- **Goal**: Predicted final score
- **Growth %**: Improvement from baseline
- **Consistency warning/praise**: Based on threshold
- **Effort tip**: If too low or very high
- **Milestone**: Day you cross score = 50

---

## ⚛️ React Concepts Map (for Viva)

### Fundamentals

| Concept               | Where Used                                       |
|-----------------------|--------------------------------------------------|
| Functional components | Every file — no class components used            |
| Props                 | `ScenarioCard`, `InsightCard`, `StatWidget`, `ScenarioForm` |
| useState              | Login, Signup, Dashboard, Results, History       |
| useEffect             | Dashboard (fetch on mount), Results, EditScenario|
| Conditional rendering | Empty states, loading spinners, error messages   |
| Lists with keys       | Dashboard grid, History grid, insights list      |

### Intermediate

| Concept              | Where Used                                         |
|----------------------|----------------------------------------------------|
| Lifting state up     | `ScenarioContext` lifts scenario list out of pages |
| Controlled components| `ScenarioForm` — all inputs use `value + onChange` |
| React Router v6      | `App.jsx` — 7 routes with nested protected layout  |
| Context API          | `AuthContext`, `ScenarioContext`                   |

### Advanced

| Concept              | Where Used                                              |
|----------------------|---------------------------------------------------------|
| useMemo              | `useSimulation` (simulation), Dashboard (stats), History (filter+sort) |
| useCallback          | `ScenarioContext.fetchScenarios`, `removeScenario`, History `handleDelete` |
| useRef               | `ScenarioForm` — auto-focuses title input on mount      |
| React.lazy + Suspense| `App.jsx` — all 7 pages are lazy-loaded (code split)   |

### Backend

| Feature              | Implementation                                    |
|----------------------|---------------------------------------------------|
| Firebase Auth        | `AuthContext` via `onAuthStateChanged`            |
| Persistent session   | Firebase handles token refresh automatically      |
| Protected routes     | `PrivateRoute.jsx` — redirects if `user === null` |
| Firestore CRUD       | `scenarioService.js` — Create, Read, Update, Delete|
| User-specific data   | Path: `users/{uid}/scenarios/{id}`               |

---

## 🎨 UI/UX Decisions

- **Color**: Dark background (`#0f1117`) with indigo-blue brand (`#5263ff`) accent
- **Typography**: Syne (display/headings) + DM Sans (body) + JetBrains Mono (code values)
- **Layout**: Sidebar on desktop, slide-out drawer on mobile
- **Animations**: `fade-in` and `slide-up` Tailwind keyframes for smooth entry
- **Chart**: Recharts `AreaChart` with gradient fill and custom tooltip
- **Loading**: Spinner component for fullscreen and inline states

---

## 🔑 Key Architecture Decisions

1. **Context API over Redux** — app is small enough; Context avoids Redux boilerplate
2. **Custom hooks** — `useSimulation` and `useForm` isolate logic for reuse and testing
3. **Service layer** — all Firebase calls isolated in `/services`, pages stay clean
4. **Lazy loading** — each page is a separate JS chunk, reducing initial bundle size
5. **Memoization** — simulation runs inside `useMemo` so expensive loops don't re-run on every keystroke

---

## 🎓 Viva Q&A Cheatsheet

**Q: Why use Context API instead of prop drilling?**
A: When multiple unrelated pages (Dashboard, History) need the same state (scenarios list), passing props through every component becomes messy. Context provides a clean global store without third-party libraries.

**Q: What does useCallback do in ScenarioContext?**
A: It memoizes `fetchScenarios` so its reference stays stable across renders. Without it, any component using it in a `useEffect` dependency array would re-fetch infinitely.

**Q: How does lazy loading work here?**
A: `React.lazy(() => import('./pages/Dashboard'))` tells Vite to split Dashboard into its own JS chunk. It only downloads when the user navigates there. `<Suspense>` shows a fallback spinner while it loads.

**Q: How is the simulation deterministic?**
A: Given the same `effort`, `consistency`, `duration`, it always produces the same output — no randomness. The missed-day formula uses modular arithmetic, not `Math.random()`.

**Q: What's the difference between useEffect and useMemo?**
A: `useEffect` runs *side effects* after render (e.g., fetching data). `useMemo` *computes a value* during render and caches it to avoid re-calculation. Never fetch data in useMemo.
