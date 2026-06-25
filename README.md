# MediniHomes

**Find Your Perfect Home in Medinipur**

A clickable, high-fidelity investor prototype for a regional real estate platform focused on
apartment discovery and direct promoter (developer) connection across Purba Medinipur and
Paschim Medinipur, West Bengal, India.

This is a **frontend prototype**, not a production backend. All data — properties, promoters,
chat conversations, users — is seeded locally and lives only in memory for the duration of a
browser session. There is no server, no database, and no real authentication.

---

## What's inside

| Area | Count | Notes |
|---|---|---|
| Pages | 10 | Home, Properties, Property Details, Promoters, Promoter Profile, EMI Calculator, Chat, Dashboard, Admin Dashboard, Roadmap |
| Reusable components | 9 | Header, Footer, PropertyCard, PropertyGallery, QuickViewModal, RegistrationModal, MapPreview, EmiTeaser, shared UI primitives |
| Context providers | 2 | Routing (`RouterContext`), Auth + saved/search state (`AuthContext`) |
| Data files | 5 | `properties.js`, `promoters.js`, `towns.js`, `chatSeeds.js`, `emiCalculator.js` |
| Sample properties | 12 | Spread across all 7 covered towns |
| Sample promoters | 6 | 3 with active listings, 3 in "onboarding" state for narrative realism |
| Towns covered | 7 | Medinipur Town, Kharagpur, Tamluk, Haldia, Contai, Egra, Digha |

## Getting started (for a real Node environment)

This project was authored as a standard Vite + React + Tailwind app. The files are written to
run with the usual toolchain:

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run preview  # preview the production build
```

> **Note on this delivery environment:** the sandbox this prototype was built in has no
> outbound network access, so `npm install` could not actually be executed here and the project
> has not been run through a real Vite build. See `HANDOFF.md` for what that means in practice
> and what to check first when you run it in a normal environment.

## Tech stack

- **React 18** — function components, hooks, context. No class components.
- **A custom 60-line hash router** (`src/context/RouterContext.jsx`) instead of
  `react-router-dom`. It supports named routes, a single dynamic segment (`property/:id`,
  `promoter/:id`), and query-string params, which is everything this prototype's navigation
  needs. `react-router-dom` is listed in `package.json` if you'd rather swap it in for a larger
  build — the router's public API (`navigate`, `segments`, `params`) was kept intentionally
  small so that swap is mechanical.
- **Tailwind CSS** with a custom theme (`tailwind.config.js`) implementing the brand's navy/gold
  palette, plus `Poppins` (display) and `Inter` (body) from Google Fonts.
- **lucide-react** for icons, **recharts** for the EMI calculator's charts.
- No backend. No real persistence. Refreshing the page resets all session state (registered
  user, saved properties, chat messages sent during the session).

## Brand & design tokens

| Token | Value | Usage |
|---|---|---|
| Primary | `#0B1F3A` (navy) | Header, footer, primary buttons, headings |
| Secondary | `#D4AF37` (gold) | Accents, badges, CTAs, ratings |
| Background | `#F8FAFC` | Page background |
| Cards | `#FFFFFF` | Card surfaces |
| Text | `#1E293B` | Body copy |
| Success | `#22C55E` | "Ready to move", available-unit indicators |
| Accent | `#2563EB` | Links, secondary badges |

All tokens are defined once in `tailwind.config.js` under `theme.extend.colors` — change them
there, not in individual component files.

## The core user flow this prototype demonstrates

1. Visitor lands on the homepage, searches by town / budget / BHK type
2. Browses listings, opens Quick View or full Property Details
3. Views gallery, floor plans, amenities, nearby facilities, and an EMI estimate
4. Attempts to contact the promoter or open chat → hits a registration gate
5. Registers (name, mobile, email, city, employment type, income band)
6. Promoter contact details and chat unlock immediately
7. Sends a message to the promoter; receives a realistic seeded/auto-generated reply
8. Can return via the Dashboard to see saved properties, recent searches, and message history

See `INVESTOR_WALKTHROUGH.md` for a guided click-path through this flow.

## Project structure

```
src/
  App.jsx                 # Root: router + auth providers, route dispatch table
  main.jsx                # React entry point
  index.css               # Tailwind directives + base styles
  context/
    RouterContext.jsx     # Custom hash router
    AuthContext.jsx       # Registration gate, saved properties, recent searches
  components/
    Header.jsx / Footer.jsx
    PropertyCard.jsx / PropertyGallery.jsx / QuickViewModal.jsx
    RegistrationModal.jsx / MapPreview.jsx / EmiTeaser.jsx
    ui.jsx                # Button, Badge, Card, RatingStars, etc.
  pages/
    HomePage.jsx / PropertiesPage.jsx / PropertyDetailsPage.jsx
    PromotersPage.jsx / PromoterProfilePage.jsx
    EmiCalculatorPage.jsx / ChatPage.jsx
    DashboardPage.jsx / AdminDashboardPage.jsx / RoadmapPage.jsx
  data/
    properties.js         # 12 properties, AMENITY_CATALOG, BANKS, formatINR()
    promoters.js           # 6 promoters
    towns.js               # 7 towns with real coordinates
    chatSeeds.js           # Seeded conversations for 4 properties
    emiCalculator.js       # calculateEMI() — verified against known reference values
```

## Further reading

- **`HANDOFF.md`** — what a developer needs to know to pick this up: known limitations, what
  was and wasn't verified, and what to check first in a real Node environment.
- **`INVESTOR_WALKTHROUGH.md`** — a guided click-path for presenting this prototype live.
- **`COMPLETION_REPORT.md`** — full QA findings, readiness scores, and a final accounting of
  what was built.
