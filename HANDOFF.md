# Developer Handoff — MediniHomes Prototype

This document is for whoever picks this codebase up next. It's written to be honest about what
was and wasn't verified, not to make the build sound more finished than it is.

## TL;DR

The code is structurally sound — every file has been verified for balanced
brackets/braces/parens, every import resolves, every cross-page navigation target exists, every
data foreign-key reference is valid. **But this project has never actually been run.** The
sandbox it was built in has no outbound network access, so `npm install` was never executed and
no real bundler (Vite, webpack, esbuild) ever compiled this code. Treat the first `npm install
&& npm run dev` as the real first test, and budget time for whatever that surfaces.

## Build environment constraints (why this matters)

This was built in a sandboxed container with:
- No network egress (no `npm install`, no fetching packages, no live image loading)
- No `vite`, `webpack`, `esbuild`, or `react-router-dom` actually installed locally — only
  `react` and `react-dom` were available as global packages
- No way to run a real JSX/Babel compile check

Given that, verification leaned on:
1. **Manual code review** of every file, read back in full after writing
2. **An automated bracket/brace/paren balance checker** run across all 22 `.jsx` files, all 5
   `.js` data files, and all 4 config files — this catches unclosed JSX, mismatched parens, etc.,
   though it cannot catch every class of JS/JSX syntax error (e.g. it won't catch a misplaced
   comma or an invalid JSX attribute)
3. **Node-executed data integrity checks** — every property's `promoterId`/`townId` foreign keys
   were verified against the real `PROMOTERS`/`TOWNS` arrays, every `chatSeeds.js` key was
   checked against real property IDs, the EMI formula was checked against known reference EMI
   values (50L @ 8.5%/20yr → ₹43,391/month, matched exactly)
4. **Grep-based import/export audits** — every `useRouter()`/`useAuth()` call site confirmed to
   have a matching import; unused imports found and removed in two files

What this verification **cannot** substitute for: an actual `npm run build`. There is real risk
that something — a Tailwind class that doesn't exist, a recharts prop name that's subtly wrong,
an actual JSX edge case the bracket-checker can't see — will surface the first time this
compiles for real. The codebase is in a position to be confidently *fixed* quickly if so (it's
~22 files, clearly separated by concern), but it has not been proven to build clean.

## What's mocked vs. what's real logic

**Real, working logic** (not mocked, will behave correctly):
- EMI amortization math (`src/data/emiCalculator.js`) — standard reducing-balance formula,
  numerically verified
- The registration gate flow (`AuthContext.requireAuth`) — genuinely blocks contact/chat/save
  actions until a user object exists in state
- Filtering logic on the Properties page (town/budget/BHK, URL-synced)
- The custom router (`RouterContext.jsx`) — real hash-based navigation with query params

**Mocked / seeded, by design** (this is a prototype, not a backend):
- "Registration" just sets local React state — no real account is created, nothing persists
  past a page refresh
- Chat replies are either pre-seeded conversation history (4 properties) or a simple
  keyword-matching `pickReply()` function — not an LLM, not a real promoter
- All "investor statistics" (500+ properties, 10,000+ visitors, etc.) on the homepage are
  hardcoded illustrative figures, clearly commented as such in the Admin Dashboard
- The Admin Dashboard's leads, users, and revenue tables are static mock arrays, not derived
  from any real backend

## Known limitations (carried forward honestly from QA)

1. **`/admin` route has no nav entry point.** `AdminDashboardPage` is wired into the router and
   reachable at `#/admin`, but no header, footer, or in-app link points to it — found during the
   route audit and intentionally left as a direct-URL-only route rather than adding a public nav
   item for an internal/investor-only view. If you want it discoverable, add a link in `Footer.jsx`
   or behind a keyboard shortcut.
2. **Unsplash image URLs are structurally valid but functionally unverified.** Every `coverImage`
   and gallery URL in `properties.js` was checked for correct URL schema
   (`https://images.unsplash.com/photo-{id}?w=...&h=...&fit=crop&q=...`), but none were fetched,
   because this sandbox has no network access. They should resolve to real photos when run with
   internet access, but that has not been confirmed.
3. **No real persistence layer.** Saved properties, recent searches, and chat messages all live
   in React state and vanish on refresh. If you want this to survive a refresh, you'd want
   `localStorage`/`sessionStorage` or a real backend — there is no server-side storage in this
   project.
4. **`react-router-dom` is in `package.json` but unused.** The actual routing is the custom
   `RouterContext`. It was left in the dependency list in case you want to swap to a "real"
   router for a production build; removing it has no effect on the current code.
5. **No automated test suite.** Verification in this handoff was manual/scripted ad-hoc checks,
   not unit or integration tests. If this moves toward production, that gap should be closed
   before relying on it.

## Recommended first steps in a real environment

1. `npm install` — see what actually resolves vs. what package.json got wrong
2. `npm run dev` — open every route once by hand: `/`, `/#/properties`,
   `/#/property/green-valley-residency`, `/#/promoters`, `/#/promoter/shanti-developers`,
   `/#/emi-calculator`, `/#/dashboard`, `/#/admin`, `/#/roadmap`, and
   `/#/chat?property=green-valley-residency` (chat requires being "registered" first via the
   gate)
3. Check the browser console for any Tailwind class warnings or React key warnings
4. Confirm the Unsplash images actually load (this is the one thing that genuinely could not be
   checked in the build environment)
5. Run a Lighthouse/mobile-emulation pass — the mobile responsiveness audit done during QA was
   thorough but was reasoning about Tailwind breakpoint classes from source, not from an actual
   rendered, resized browser window

## File-by-file map (for fast orientation)

```
src/data/properties.js      12 properties, AMENITY_CATALOG, BANKS, formatINR(), img() helper
src/data/promoters.js       6 promoters, inline SVG data-URI logos
src/data/towns.js           7 towns with real coordinates, getTownsWithCounts() derives listing counts
src/data/chatSeeds.js       4 seeded conversations + 1 default fallback seed
src/data/emiCalculator.js   calculateEMI() — pure function, numerically verified

src/context/RouterContext.jsx   navigate(), segments[], params (URLSearchParams)
src/context/AuthContext.jsx     user, requireAuth(intent), register(), saved/search state

src/components/ui.jsx             Button, Badge, Card, RatingStars, StatusPill, SectionEyebrow
src/components/Header.jsx         Nav + auth-aware account menu
src/components/Footer.jsx         Site links, town links, contact info
src/components/PropertyCard.jsx   Used on Home, Properties, Dashboard, Promoter Profile
src/components/PropertyGallery.jsx  Category-tabbed gallery + lightbox (fixed for mobile in QA)
src/components/QuickViewModal.jsx   Lightweight preview modal from the listings grid
src/components/RegistrationModal.jsx  The gate — triggered by AuthContext.requireAuth()
src/components/MapPreview.jsx       Stylized deterministic map (no live tile service — no network)
src/components/EmiTeaser.jsx        Inline EMI widget on property details, links to full calculator

src/pages/*.jsx              10 top-level routes, see App.jsx's ROUTES table for the mapping
```
