# Shipment Management UI

A React application for managing last-mile delivery shipments and assignments, built as a take-home exercise for Jitsu.

This implementation includes all requirements from the Core and Stretch tiers, along with the Extra Credit assignment workflow.

---

## Tech Stack

| Concern         | Choice                           | Reason                                                                               |
| --------------- | -------------------------------- | ------------------------------------------------------------------------------------ |
| Build tool      | **Vite**                         | Fast dev server, minimal config, first-class TS support                              |
| Language        | **TypeScript**                   | Type-safety across domain models (Shipment, Assignment) and API boundaries           |
| Styling         | **Tailwind CSS**                 | Utility-first, fast iteration, no context-switching to separate CSS files            |
| Routing         | **React Router**                 | Standard SPA routing for the two pages (Shipments / Assignments)                     |
| Server state    | **TanStack Query (React Query)** | Caching, background refetch, mutation lifecycle, optimistic updates — ideal for CRUD |
| Client/UI state | **Zustand**                      | Lightweight store for cross-component UI state (e.g. selected shipment, filters)     |
| HTTP            | **Axios**                        | Interceptors, cleaner error handling than `fetch`                                    |
| Map             | **Leaflet** (`react-leaflet`)    | Free, no API key required, sufficient for pins + polylines                           |
| Mock backend    | **json-server**                  | Zero-config REST API over the sample JSON                                            |

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or pnpm/yarn — scripts use `npm`)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. (Optional) Regenerate mock data

The repo already includes `data/shipments.json` so you can run the app immediately.
If you want a fresh dataset:

```bash
npm run gen:data
```

> ⚠️ This will overwrite `data/shipments.json`. Mutations made through the UI (PUT/POST/DELETE) are persisted to this file by `json-server`, so re-run this script anytime you want to reset state.

### 3. Run the app

**Recommended — run web + API together:**

```bash
npm run dev:all
```

This starts:

- Vite dev server → http://localhost:3000
- json-server (mock API) → http://localhost:3001

**Or run them separately:**

```bash
npm run dev:api   # mock backend on :3001
npm run dev       # frontend on :3000
```

### Available scripts

| Script             | Description                                        |
| ------------------ | -------------------------------------------------- |
| `npm run dev`      | Start the Vite dev server                          |
| `npm run dev:api`  | Start `json-server` watching `data/shipments.json` |
| `npm run dev:all`  | Run frontend + mock API concurrently               |
| `npm run gen:data` | Regenerate `data/shipments.json` from scratch      |
| `npm run build`    | Type-check and produce a production build          |
| `npm run preview`  | Preview the production build locally               |

---

## Features

### Core ✅

- **Two-panel layout** for the Shipments page
- **Left panel** — shipment list grouped by status (`OPEN`, `IN_TRANSIT`, `DELIVERED`), with search by label or client name
- **Right panel** — full shipment detail
- **Inline editing** of `delivery_by_date`, `lat`, `lng` with save → `PUT /shipments/:id`

### Stretch ✅

- **Status transitions** enforced on the client per the documented lifecycle:
  - `OPEN → IN_TRANSIT` (requires selecting an `assignment_id`)
  - `IN_TRANSIT → DELIVERED`
  - `IN_TRANSIT → OPEN` (clears `assignment_id`)
  - Invalid transitions are simply not offered in the dropdown
- **Map** — Leaflet map in the detail panel showing the shipment's pin
- **Create / Delete shipments** with sensible defaults

### Extra Credit ✅

- **Assignments page** at `/assignments` with a three-panel layout:
  1. Assignment list (grouped by status, searchable)
  2. Assignment detail (metadata + list of its shipments)
  3. Shipment detail when a shipment is clicked inside an assignment
- **Connected map** — when viewing a shipment inside an assignment, the map shows pins for **all** shipments in that assignment connected by a polyline, centered on the selected shipment
- **Create assignments**
- **Delete empty assignments** (deletion is blocked when `shipment_count > 0`)

---

## Project Structure

The codebase is organized **by feature** rather than by file type. Each feature owns its components, hooks, types, and API calls. Shared primitives live under `shared/`.

```
src/
├── app/
│   ├── App.tsx               # Root application component
│   ├── providers.tsx         # React Query, Router, and app-level providers
│   └── routes.tsx            # Route configuration
│
├── features/
│   ├── shipments/
│   │   ├── api/              # API layer + React Query hooks
│   │   ├── components/       # ShipmentList, ShipmentDetail, ShipmentMap, ...
│   │   ├── lib/              # Feature-specific helpers and business logic
│   │   ├── pages/            # ShipmentsPage
│   │   ├── schemas/          # Form validation schemas
│   │   ├── store/            # Zustand UI state
│   │   ├── types/            # Domain types
│   │   └── index.ts          # Public feature exports
│   │
│   └── assignments/
│       ├── api/
│       ├── components/
│       ├── lib/
│       ├── pages/            # AssignmentsPage
│       ├── schemas/
│       ├── store/
│       ├── types/
│       └── index.ts
│
├── shared/
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Shared hooks
│   ├── lib/                  # Axios instance, query client, utilities
│   └── pages/                # ErrorPage, NotFoundPage
│
├── assets/
├── main.tsx                  # Application entry point
└── index.css
```

**Why feature-based?** As the app grows, all code related to "shipments" stays colocated. Refactoring or removing a feature touches one folder instead of five. It also makes ownership clearer if a team later splits work by feature.

---

## Approach & Design Decisions

### Server state vs. UI state — a clear split

A common mistake in CRUD apps is putting server data into a global store (Redux/Zustand) and then having to manually keep it in sync. I separated the two concerns:

- **TanStack Query** owns everything that comes from the server (shipments, assignments). It handles caching, invalidation after mutations, and background refetching. After a successful `PUT /shipments/:id` I invalidate the `['shipments']` query and the list updates automatically — no manual state sync.
- **Zustand** owns ephemeral UI state that doesn't belong in URLs or server: the currently selected shipment id, the search input value, draft form state, etc. It's tiny, has no Provider boilerplate, and is trivial to test.

This split keeps components simple: they read server data from `useQuery` and UI state from the Zustand store, and never have to reconcile the two.

### Enforcing status transitions

The valid transitions are a small finite-state machine. I encoded them as a single source of truth in `features/shipments/utils.ts`:

```ts
const TRANSITIONS: Record<Status, Status[]> = {
  OPEN: ["IN_TRANSIT"],
  IN_TRANSIT: ["DELIVERED", "OPEN"],
  DELIVERED: [],
};
```

The dropdown is derived from this map, so invalid transitions are physically un-selectable rather than validated after the fact. The same function is used when saving to defensively assert the transition is legal and to clear/require `assignment_id` accordingly. Centralizing the rule means I can't forget to update one of two places when the spec changes.

### Optimistic updates — used selectively

I used optimistic updates for the most frequent action (editing `delivery_by_date`, `lat`, `lng`) because the perceived latency matters there. For status transitions and create/delete I kept the standard "mutate → invalidate" flow: those actions are rarer, the user expects a brief confirmation, and the rollback logic isn't worth the added complexity.

### Map decisions

Leaflet was chosen over Mapbox/Google because it needs no API key — a reviewer can clone and run with zero setup. In the assignment view I render one `<Marker>` per shipment and a single `<Polyline>` through their coordinates. The map auto-centers on the selected shipment via a small `useEffect` calling `map.setView()` — simpler than `fitBounds` and matches the spec ("centered on the selected shipment").

### Why client-side filtering & grouping

The dataset is ~100 shipments. Doing search and `status`-grouping in memory after a single `GET /shipments` is simpler, faster (no extra round-trips), and avoids fighting json-server's limited query syntax. For a real backend with 100k+ rows I would push filtering server-side and paginate, but introducing that now would be premature.

---

## Tradeoffs & Things I'd Improve

These are conscious omissions, not oversights:

- **No end-to-end tests.** I would add Playwright tests for the main flows (assign a shipment, complete delivery, delete an empty assignment) in a real project. Unit tests for the transition FSM and date helpers would be the highest-value tests to add first.
- **Validation is minimal.** `lat`/`lng` are checked for being numeric, but I don't enforce realistic ranges. A real app would use Zod schemas shared between form validation and API parsing.
- **No URL state.** The selected shipment id lives in Zustand, not in the URL. That means selection isn't shareable or preserved on refresh. Moving it to a URL search param (`?shipment=shp_003`) would be a small but nice improvement.
- **No accessibility audit.** Tailwind defaults are mostly fine, but I haven't tested keyboard navigation or screen-reader labels on the custom dropdowns.
- **json-server limitations.** It rewrites the entire JSON file on each mutation, which can lose data under concurrent writes. Fine for a demo, not production.
- **No error boundaries / toast system.** Errors are surfaced inline next to the action. A global toast layer would be a small upgrade.

---

## Assumptions

- **Assignments aren't in the generated sample data.** The provided generator only emits `shipments` and `statuses`. I added a small in-app bootstrap that derives assignments from shipments that already have an `assignment_id` on first load, and treats `POST /assignments` as the source of truth from then on. This is documented in `features/assignments/api/`.
- **`shipment_count` and `clients` on an Assignment are derived**, not stored. I compute them from the current shipments rather than maintaining a denormalized counter that could drift.
- **Status transitions are enforced on the client only**, since the mock backend has no business logic. In production this would also be enforced server-side.
- **"Empty assignment" for deletion** means `shipment_count === 0` at the moment of click — checked against the live cache, not the assignment record.

---

## Author

[Mạnh Tiến] — [manhtien1509@gmail.com]
