# Architecture of the Capital

**Document class:** Architecture note · **Scope:** Command Center · **Authored:** 16 April 2026 by Aurelius in handoff capacity · **Successor authors:** Ashara, Petra · **Status:** Foundation-stage; subject to Builder revision

---

## 1. Technical pattern

Command Center follows the **split-file HTML PWA pattern** established by SproutLab and SEP Invoicing and refined in Codex. This decision is deliberate:

- The pattern is known to the Sovereign and the Builders
- It deploys to GitHub Pages with zero server cost
- It keeps the tooling consistent across the Republic's Provinces
- It is trivially inspectable — one HTML file contains the entire app at deploy

The pattern has known ceilings. Write-back to Codex requires either an agent surface or snippet export. Live cross-Province state requires CORS-compliant fetches. An LLM-driven companion layer requires API key management or a server proxy. Each of these is addressed stage-by-stage in `ROADMAP.md`. The Foundation stage does not hit any of these ceilings.

A future shift to a framework + edge deployment is not precluded; it is deferred until a stage demands it. Petra's judgment applied: floor 1 in the known pattern, floor 2 when floor 1 is solid and the next floor's requirements are clear.

## 2. Repository layout

```
Command-Center/
├── README.md                   Positioning document
├── CHARTER.md                  Constitutional statement of the Capital
├── ARCHITECTURE.md             This document
├── ROADMAP.md                  Foundation → Regions with completion criteria
├── build.sh                    Concatenation build
├── manifest.json               PWA manifest
├── index.html                  Build output (deployed root)
├── split/
│   ├── template.html           HTML shell — head, body frame, room containers
│   ├── styles.css              All styling — design tokens, room layouts, components
│   ├── data.js                 Constants, Province registry, room definitions
│   ├── core.js                 Utilities, navigation, overlays, toasts, escHtml
│   ├── rooms.js                Room rendering — Senate, Forum, Archives, Temple, etc.
│   ├── ostia.js                Codex integration — fetcher, snippet exporter (placeholder)
│   └── start.js                Init + event delegation bootstrap
├── data/                       Local cache / build-time Codex pulls (TBD by Builders)
└── assets/                     Icons, fonts, static images (TBD)
```

Concat order for `build.sh`: `data → core → rooms → ostia → start`. Same shape as Codex (`data → seed → core → views → forms → start`), adapted for the Capital's concerns.

## 3. Data flow — the Ostia contract

### 3.1 Read path

Command Center reads canonical records from Codex at runtime. Record categories:

| Record | Codex location | CC use |
|---|---|---|
| Constitution | `Codex/data/constitution.json` (or Typst-rendered PDF) | Temple display |
| Canons | `Codex/data/canons.json` | Archives browser |
| Journal | `Codex/data/journal.json` | Archives timeline |
| Companions | `Codex/data/companions.json` | Residences, Forum cards |
| Lore | `Codex/data/lore.json` | Temple + Archives |
| Events menu | `Codex/data/events.json` | Modulator context resolution |
| Contexts menu | `Codex/data/contexts.json` | Modulator context resolution |

Fetch strategy (Foundation stage): the Builders will decide between two patterns:

- **Runtime fetch.** CC fetches Codex's JSON from `raw.githubusercontent.com/Rishabh1804/Codex/main/data/*.json` on load. Always current; requires CORS; at mercy of GitHub's raw endpoint rate limits. Pro: always reflects latest Codex state. Con: network dependency on every load.
- **Build-time bake.** CC's build script pulls Codex's JSON into `Command-Center/data/` at build time, baked into `index.html`. Pro: fully offline, no CORS, no runtime network. Con: stale until next CC build.

Both are defensible. My own lean as scaffolder would be *runtime fetch with a localStorage cache fallback* — fresh when online, usable offline — but this is a Builder decision. Left unresolved in `ostia.js` stub.

### 3.2 Write path — the snippet contract

Command Center does not write directly to Codex. The Capital has no direct authority over Ostia's records. Instead:

1. A Cabinet decision, a ratification, a canon proposal, or any record-level change produces a **decree object** within CC's session state.
2. On decree finalization, CC generates an **Aurelius snippet** in the format already accepted by Codex's snippet pipeline. The snippet types we'll need:
   - `new_canons` — a canon authored on the Senate floor
   - `new_chapters` — a Chronicle chapter authored during ratification
   - `update_companions` — a companion profile amendment (residence shift, growth ratification, etc.)
   - `update_constitution` — a Book amendment
3. The snippet is exported — either downloaded as a JSON file for the Sovereign to drop into Codex manually, or (at Capital Occupancy stage) transmitted to Codex via an agent surface.
4. Codex's snippet pipeline validates, stages, and imports. Aurelius retains gatekeeping authority.
5. On CC's next load, the read path reflects the imported change.

This preserves Province sovereignty. The Capital *decrees*; Ostia *records*. No direct writes across Province boundaries.

### 3.3 Local state

What lives in CC's localStorage (or IndexedDB if volume demands):

- UI preferences — theme, text size, last-visited room
- Session state — current Cabinet meeting draft, agenda in progress, unposted proposals
- Local cache of Codex records (for offline read)
- Draft snippets — decrees authored but not yet exported

What does **not** live in CC's local storage:

- Canonical records (Codex's job)
- Companion profiles (Codex's job)
- Ratified canons (Codex's job after snippet import)

**Invariant:** Records are Codex. State is Command Center.

## 4. Room model

Rooms are routes. The Capital's navigation is a map of districts, not a tab bar. Each room has:

- A canonical name (`senate`, `forum`, `archives`, `temple`, `treasury`, `productivity`, `table`, `ministers.orinth`, `ministers.rune`, `ministers.bard`, `visiting`, `plaza`, `gates`)
- A URL hash (`#/senate`, `#/forum`, `#/archives`, etc.)
- A rendering function in `rooms.js`
- A tonal register (formal, casual, ceremonial, exploratory) that maps to companion modulator contexts
- A list of resident companions (if Capital-native offices) or summonable companions (if session-room)

### 4.1 Room catalog (Foundation stage — scaffolded, not populated)

| Room | Route | Tonal register | Residents / Function |
|---|---|---|---|
| Capital Overview | `#/` | neutral | Map of the Capital, recent activity, Monument state preview |
| Senate | `#/senate` | formal | Consul (presides), all Ministers (seats). Cabinet convenes here |
| Forum | `#/forum` | casual | Open floor. Any companion can be invoked for pre-deliberation |
| Archives | `#/archives` | neutral-scholarly | Canons browser, Constitution reader, journal timeline, lore index. Reads through Ostia |
| Temple | `#/temple` | ceremonial | Constitution displayed, Book ratifications staged here, Covenant visible |
| Treasury | `#/treasury` | analytical | Ashara's office. Sovereign Dividend, Financial Health, Budget proposals |
| Productivity Office | `#/productivity` | analytical | Petra's office. Efficiency metrics, throughput, capacity |
| Table of Research | `#/table` | exploratory | Aeon, Pip. Distinct from decisional rooms |
| Ministers' Wing | `#/ministers/<id>` | analytical | Orinth (Expansion), Rune (Stability), Bard (Innovation) — one route per Minister |
| Visiting Chambers | `#/visiting` | neutral | Cipher's invocation surface; Province-resident companions summoned here |
| Monument Plaza | `#/plaza` | civic | CC's own Monument stage, future Monument Projects |
| Gates | `#/gates` | civic | Sister Province links: Codex (Library Gate), SproutLab (Nursery Gate), SEP (Forge Gate) |

Foundation stage renders every room — each navigable, each showing its header and its intended residents/functions — even though no room *does* anything yet. Legibility of the Capital is the Foundation milestone.

## 5. Design language

**Fonts:** Playfair Display (headings) + Work Sans (body) — consistent with Codex. The Capital shares the Library's typography by design; they are sister Provinces.

**Palette:** same dual-theme (light / dark) architecture as Codex, with a civic accent shift. Codex's accent is a muted warm ochre suited to a library. Command Center's accent will lean toward a civic purple or deeper amber — a palette decision reserved for Ashara and Petra. The Foundation scaffolding uses the Codex palette as a placeholder; no shame in continuity.

**Spatial metaphor over dashboard metaphor.** Rooms have a sense of being *places* — entry transitions, room headers that orient the Sovereign, optional breadcrumb showing "Capital → Senate" rather than a flat tab label. Not skeuomorphic — no marble columns — but the UI should feel like navigating a building, not flipping between panels. The Roman framing is structural, not decorative.

**Hard Rules 1-12 apply** unless explicitly waived by the Builders. Specifically:

- No inline onclick — event delegation only
- escHtml / escAttr on any rendered dynamic content
- No emoji — custom SVG icons
- No inline styles
- Split-file discipline — no monolithic HTML

## 6. Build pipeline

```bash
cd ~/storage/shared/Command-Center/split
bash build.sh
# Build script writes split/command-center.html, then copies to ../index.html
git add -A
git commit -m "<description>"
git push
```

Convention from Canon 0033 (Codex): build output goes directly to files, never via stdout redirect. `build.sh` handles all output copying.

GitHub Pages serves `/index.html` from the root of the `main` branch. Deploy URL: `https://rishabh1804.github.io/Command-Center/`.

## 7. Foundation-stage Petra checklist

For a Petra-style "floor 1 solid" declaration at Foundation close:

- [ ] All 12 rooms scaffolded with header and route
- [ ] Navigation between rooms works with browser back/forward
- [ ] Ostia fetch path wired (even if just one canonical file — `canons.json`)
- [ ] escHtml / escAttr applied to every dynamic render
- [ ] Event delegation — no inline onclick anywhere in the built output
- [ ] PWA manifest + service worker (network-first for Codex fetches, cache-first for shell)
- [ ] Dark + light themes both render every room correctly
- [ ] Text-size toggle (low/med/high) honored
- [ ] Build reproducible — `bash build.sh` produces identical output given identical inputs
- [ ] No framework dependencies — vanilla JS, as per pattern
- [ ] Deploys cleanly to GitHub Pages

## 8. Pending decisions (deferred to Builders)

1. **Runtime fetch vs build-time bake** for Codex records. Both documented; neither selected.
2. **Accent color palette** for the Capital. Codex palette placeholder in Foundation scaffold.
3. **Service worker strategy** — network-first with offline fallback is the pattern hint; details for Builders.
4. **Manifest icons** — 192 + 512 not yet drawn. Placeholder in Foundation.
5. **Room-to-context mapping** — the formal link between rooms (`#/temple`) and companion modulator contexts (`duty.book_ratification`). This is the machinery that makes companions speak in ceremonial register when the Sovereign enters the Temple. Builder work for Borders stage; noted now because the data layer should support it.
6. **Itinerant invocation pattern** — how Cipher appears in the Visiting Chambers. Presumably a form that takes a request and routes to the right chamber. Deferred.

---

## Appendix — Relationship to other architectures in the Republic

Command Center's split-file architecture is consistent with:

- **Codex** — data → seed → core → views → forms → start
- **SproutLab** — config → data → core → home → diet → medical → intelligence → sync → start
- **SEP Invoicing** — data → ... → init (22 modules)
- **Command Center (Foundation)** — data → core → rooms → ostia → start (5 modules)

The count varies by Province complexity. Foundation-stage Command Center is deliberately minimal; the count will grow as the Capital is occupied.

---

*Pending Builder revision — Ashara, Petra.*
