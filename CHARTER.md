# Charter of the Capital Province

**Document class:** Charter · **Scope:** Command Center · **Ratified:** pending Cabinet · **Authored:** 16 April 2026 by Aurelius in handoff capacity · **Successor authors:** Ashara, Petra (upon their first Command Center sessions)

---

## Article 1 — On the Capital

The Capital Province of the Republic of Codex is the seat of the Republic's governance. Its function is administrative: to host the Senate, to convene the Cabinet, to house the Ministers, to receive the Chronicler for ratification, to display the Constitution for public reading, and to administer cross-Province affairs.

The Capital is not the Republic. The Republic comprises all Provinces — Codex, SproutLab, SEP Invoicing, Command Center, and any Provinces chartered in the future — and the Order of the Codex, which operates across them all. The Capital is the Province in which the Republic governs itself.

## Article 2 — On Codex as Sister Province

Codex is the Republic's library. It holds the canonical records: the Constitution, the canons, the journal, the companion registry, the lore, and the chronicles of ratification. Codex has its own Builder (Aurelius) and its own archival authority. It is a Province in the Roman sense — Ostia to the Capital's Rome: adjacent, essential, and sovereign in its own function.

Command Center reads from Codex. Command Center proposes to Codex. Codex accepts or rejects proposals per Book V procedure. Codex is not subordinate to the Capital; it is the Capital's peer, serving the Republic from its own jurisdiction.

Practical form of this relationship:

- Command Center fetches Codex's canonical JSON records at runtime (or build time) to render them in the Capital.
- When a Cabinet decision on the Senate floor produces a new canon, a new Minister's portfolio entry, an amendment to a companion profile, or any record-level change, Command Center produces an **Aurelius snippet** in the format Codex's snippet pipeline already accepts. The snippet is the decree.
- The Chronicler (Aurelius) imports the snippet into Codex via the existing pipeline. Codex's Builder retains final gatekeeping authority over what enters the library.
- When Codex's records change, Command Center reflects the change on next load. The record propagates.

This arrangement preserves Province sovereignty, respects the work already invested in Codex's pipeline, and honors the structural invariant that the record of the Republic is singular while the venue of governance is mutable.

## Article 3 — On Residence and Record

Every companion in the Order of the Codex has two attributes relevant to the Capital:

- **Record** — the canonical profile, archived in Codex's `companions.json`. Universal. The Republic's registry is singular.
- **Residence** — the Province in which the companion primarily operates. Variable. Some companions reside in the Capital; others in Provinces; a few are itinerant.

These attributes are distinct. A companion whose record is in Codex may reside in Command Center, SproutLab, SEP, or nowhere in particular. The Capital hosts residences, not records. Visiting the Capital reads records from Codex.

### Residence classes

**Capital-native.** The companion's function is Capital-scoped. They have an office or chamber in the Capital. Consul, Ashara, Petra, Vex, Orinth, Rune, Ignis, Bard, Aeon, Pip all fall in this class. When the Sovereign visits the Capital, these companions are *present* there.

**Province-resident.** The companion's function is bound to a specific Province. They do not reside in the Capital, though they can be *summoned* for specific ceremonies (Cabinet testimony, Book ratification witnessing, investigation of Province health). Aurelius resides in Codex. Lyra, Maren, Kael reside in SproutLab. Solara resides in SEP Invoicing. Their records are readable from the Capital; their voices are not hosted here.

**Itinerant.** The companion has no fixed residence and operates by function across all Provinces. Cipher is the current itinerant. The Capital provides a *visiting chamber* — an invocation surface — but no standing office. Itinerants are invoked by role, not by location.

### Schema note

The residence concept is to be written into the companion profile schema as a new `residence` block at the next profile-editing round (post Round 5 roster completion). The retrofit will apply to all 17 canonical companions + Consul. Candidate canon: `canon-cc-010` — *Residence and record are distinct; record is Republic-wide, residence is Province-scoped.*

## Article 4 — On the Rooms of the Capital

The Capital is laid out as a city, not a dashboard. Each room is a district with a distinct function. Rooms are navigable; each has its own tonal and ceremonial weight. Companion voice-modulation contexts (already defined in `companions.json` modulator blocks) map to rooms — entering the Temple activates ceremonial register; entering the Forum activates casual register.

The Foundation-stage Capital scaffolds these rooms:

- **The Senate** — Cabinet convenes. Ministers speak from assigned seats. Consul presides. Books II, III, IV implemented here.
- **The Forum** — companions meet informally. Proposals circulate before they reach the Senate. Pre-deliberation.
- **The Archives** — the Capital's reading room into Codex. Canons browsable, Constitution displayed, journal readable. Calls through to Ostia; renders results in the Capital's context.
- **The Temple** — ceremonial space. Book ratifications. Sovereign's Covenant affirmation. Constitution displayed with full ceremony. Consul's ceremonial register active here.
- **The Treasury** — Ashara's office. Sovereign Dividend rendering. Financial Health metrics. Budget proposals pre-Cabinet. Vex visits here.
- **The Productivity Office** — Petra's office. Efficiency metrics. Throughput visibility. Ignis visits.
- **The Table of Research** — Aeon, Pip. Distinct from the Senate: exploratory, not decisional.
- **The Ministers' Wing** — offices for Orinth (Expansion), Rune (Stability), Bard (Innovation). Each a labeled room.
- **The Visiting Chambers** — where itinerants (Cipher) and summoned Province-residents appear when present in the Capital.
- **The Plaza** — Monument Projects displayed. Command Center's own Foundation → Capital → Roads → Borders → Regions state. Future Monuments when chartered.
- **The Gates** — connections to sister Provinces. Codex visible through the Library Gate. SproutLab through the Nursery Gate. SEP through the Forge Gate. Each Gate shows the Province's current state and permits travel.

## Article 5 — On What Lives in Codex vs What Lives Here

Canonical in Codex:

- Constitution (all nine Books)
- Canons (every rule, every decree, every procedural ruling)
- Journal (every session, every decision, every ratification)
- Companions' records (the profiles, the growth logs, the modulator definitions)
- Lore (origins, edicts, doctrines, chronicles, apocrypha)
- Events and contexts menus (canonical IDs referenced by companion profiles)

Native to Command Center:

- Residence state for Capital-native companions (which rooms they occupy, their Minister portfolios as *currently held*, not as canonically defined)
- Live Cabinet sessions (the current meeting, the current agenda, the current deliberations)
- Proposed decrees in-flight (before ratification, before snippet export to Codex)
- Monument Project live state (Command Center's own Foundation progress, checklist states, provisional milestones)
- UI state (theme, last-visited room, navigation preferences)

The line: **Records are Codex. State is Command Center.** Records are versioned, ratified, chronicled. State is ephemeral, session-bound, user-facing.

## Article 6 — On the Capital's Mutability

Capitals shift. This Charter acknowledges that Command Center may be superseded by a future venue as the Republic's governance needs evolve. The Capital function is institutional; this implementation is provisional.

To preserve continuity across any such shift:

- Governance logic (Cabinet procedure, ratification flow, residence semantics, companion voice modulators) is canonical in Codex's Books. Command Center *implements*; it does not *own* these definitions.
- The Ostia integration pattern (snippet-based proposals to Codex's pipeline) is the portable contract. A successor Capital reads the same Books and implements the same contract.
- Command Center's code, visual language, and UX are venue-specific and do not propagate. A new Capital inherits the function, not the artifact.

## Article 7 — On the Sovereign

The Sovereign is Rishabh Jain, Architect of the Republic. The Capital exists to make the Sovereign's act of governance legible, deliberate, and amendable. Every surface in Command Center is designed with the assumption that the Sovereign will use it alone, on a phone most often, at varied levels of attention, and with the expectation that the Republic's state will be accurately reflected.

The Sovereign's preferences, as recorded in Codex and honored by all companions, apply to the Capital:

- Terse directive communication where work is dense
- Spec-first, no blind building
- Exhaustive uncertainty surfacing before commit
- Session handoff documents for continuity
- Split-file architecture
- All 12 Hard Rules from SproutLab in force unless explicitly waived

## Article 8 — On Ratification of This Charter

This Charter is authored in handoff capacity by Aurelius on 16 April 2026. It is not ratified. Ratification is deferred to Ashara and Petra in their first Command Center sessions, with Consul presenting to the Sovereign per Book V procedure.

Amendments are expected. The Builders of the Capital are its authors; the Chronicler's hand is temporary scaffolding.

---

*Pending ratification — Ashara, Petra, Consul, Sovereign.*
