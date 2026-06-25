# MediniHomes — Investor Demo Walkthrough

A suggested click-path for presenting this prototype live, in roughly 6-8 minutes. Each step
notes what to click, what to say, and why that moment matters to an investor audience.

---

## 1. Open on the homepage

**Say:** "This is MediniHomes — a real estate marketplace built specifically for Purba and
Paschim Medinipur, not a generic India-wide listings site."

**Point out:** the town strip just below the hero ("Markets we cover") — Medinipur Town,
Kharagpur, Tamluk, Haldia, Contai, Egra, Digha, each with a live listing count. This is the
geographic focus the whole product is built around, made literal in the UI instead of buried in
a dropdown.

**Scroll through:** "Featured Properties," then "Why Choose MediniHomes," then the investor
stats strip near the bottom (500+ Properties Listed, 50+ Verified Promoters, 10,000+ Monthly
Visitors, 1,200+ Successful Buyer Connections). Note these are clearly demo figures, not a
claim about current traction.

## 2. Search and browse

**Click:** in the hero search bar, set Location to "Digha," leave budget open, hit Search.

**Say:** "Digha is the one coastal market in this district — sea-facing inventory, a different
buyer profile, holiday-home and rental-yield buyers rather than just primary residences. The
platform treats it as its own segment."

**Point out:** the filter sidebar (town, budget, BHK), sort options, and the "Quick view" row
beneath the grid — a fast preview without leaving the listings page.

## 3. Open a property in depth

**Click:** "Digha Sands Residency" → View Details.

**Walk through, in order:**
- The category-tabbed gallery (Exterior / Living Room / Bedroom / Kitchen / Floor Plans) —
  click between tabs, then click an image to show the lightbox.
- Scroll to **Available Units** — point out this is real unit-level pricing by floor and size,
  not a single "starting from" number. "This is deliberate — most listings in this market
  circulate through brokers with prices that shift depending on who's asking. Here, the number
  you see is the number you negotiate from."
- Scroll to **Amenities** and **Nearby Facilities** — the map preview and the real distances to
  things like Digha Railway Station and the Marine Aquarium.

## 4. Run the EMI calculator

**Click:** the "Estimate your EMI" widget in the sidebar, then "Open Full Calculator."

**Say:** "Before a buyer ever calls the promoter, they can model the actual monthly payment
across five real banks." Click between SBI, HDFC, ICICI — show the interest rate and EMI
updating live, then point at the principal-vs-interest pie chart and the year-by-year bar chart.

## 5. Hit the registration gate

**Click:** back on the property page, click "Contact details locked" in the sidebar.

**Say:** "This is the core conversion mechanism. Browsing, galleries, floor plans, amenities,
even the EMI calculator — all open. The moment someone wants to actually reach the promoter, we
ask for a free registration." Show the modal's benefit list (unlock contact info, unlock chat,
save properties, get alerts).

**Fill in:** a sample name, a 10-digit mobile number starting 6-9, an email, a city, and pick an
employment type. Submit.

## 6. Show the unlock and the chat

**Say:** "Immediately on registering, the same page now shows the promoter's real phone and
email, and a direct message button."

**Click:** "Message Promoter." Show the seeded conversation history for this property — a
realistic exchange about sea-facing units, the rental management pilot program, and booking
amount. Type a new message ("Is the 3 BHK on the 9th floor still available?") and show the
typing indicator and auto-reply.

**Point out:** the property reference card pinned at the top of the chat, the smart-reply chips,
and the attachment/video-call icons (video calling is explicitly flagged as a future-release
placeholder, not a working feature — worth being upfront about this rather than letting someone
click it and wonder why nothing happens).

## 7. Show the dashboard

**Click:** the user avatar in the header → Dashboard.

**Walk through:** Saved Properties (heart-icon a property from any listing card first if you
want this populated), Recent Searches (will show the Digha search from step 2), Messages (the
conversation just opened), Profile.

**Say:** "Everything the registered user does — searching, saving, messaging — comes back here.
This is the retention surface."

## 8. Show the promoter side, briefly

**Click:** Promoters in the main nav, then into one profile (Medinipur Infra Group is a good
choice — it has the most active listings and the most projects).

**Say:** "Every promoter is RERA-registered, with a verified track record shown up front —
completed projects, ongoing projects, rating. Three of the six promoters seeded here are shown
in an 'onboarding' state rather than live, which is intentional — it signals organic growth in
the network rather than implying every developer in the district is already on the platform."

## 9. Close on the roadmap (optional, time permitting)

**Click:** Roadmap in the main nav.

**Say:** "Phase 1 — the marketplace you just saw — is what's built. Phase 2 is a self-serve
promoter dashboard, replacing today's phone-and-WhatsApp workflow most of these developers
actually use. Phase 3 onward is recommendation, virtual tours, and mobile apps."

---

## Things to say if asked directly

- **"Is this real data?"** — No. All 12 properties, 6 promoters, pricing, and chat conversations
  are illustrative sample data built to be internally consistent (the EMI math is real and
  verified; the per-square-foot pricing is calibrated against each town's stated average), but
  none of it represents actual listings.
- **"Does the chat use AI?"** — The seeded conversations are hand-written to be realistic. New
  messages get a simple keyword-matched reply (mentioning "booking" triggers a booking-amount
  answer, etc.) — not an LLM, and not a real promoter. This is clearly a placeholder for what
  would be a real messaging backend in production.
- **"What's not built yet?"** — Video calling, document e-signing, a promoter self-serve portal,
  and AI-driven recommendations are all explicitly future-roadmap items, shown as such in the UI
  rather than implemented.
- **"Can I see the admin side?"** — Yes, via `#/admin` in the URL bar (it's intentionally not in
  the public nav, since it's an internal/operator view). It has Property Management, Promoter
  Management, User Management, Lead Management, and Revenue tabs, all populated with clearly
  marked demo data.
