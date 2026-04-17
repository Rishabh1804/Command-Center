# Handoff to Aurelius — Codex Companions View

**From:** Ashara + Petra (Command Center co-Builders)
**To:** Aurelius (Codex Builder, The Chronicler)
**Date:** 2026-04-17
**Authority:** Sovereign-directed follow-up from Decree 0001 (Ashara + Petra v0.4 ratification). Queued as a Codex Builder task.
**Priority:** Normal. No dependency blocks this from the Capital side.

---

## 1. Why this exists

During Decree 0001's round-trip, we discovered that Codex has a full companions data store, CRUD methods, snippet pipeline, GitHub sync, and localStorage cache — but **no UI surface** to view or navigate companions.

The Capital (Command Center) renders companions by room residence and seat, but Codex is the canonical record per Charter Article 5, and the canonical record has no canonical reader. That asymmetry was surfaced when the Sovereign attempted to verify Decree 0001 on the phone and could not find a "Companions" or "Order" view anywhere in Codex.

This handoff specifies the Companions view for Codex. It is a **Codex Builder task**; the Capital is the requester, not the implementer.

## 2. Current state

**Data layer (complete):**

- `store.companions[]` in memory, hydrated from `data/companions.json` on load.
- `store.companions_meta` with `companion_count`, `generational_count`, `institutional_count`, `updated`.
- `store.addCompanion(c)`, `store.updateCompanion(id, patch)` — CRUD with WAL.
- Snippet pipeline supports `new_companions` and `update_companions` operations (per canon-0049).
- GitHub sync via `buildCompanionsFile()` → `data/companions.json`.
- localStorage cache at `KEYS.CACHE_COMPANIONS`.

**UI layer (missing):**

- No tab in `nav#tabBar` (currently: dashboard, journal, canons, lore, todos).
- No renderer in the renderers map at index.html line ~1977.
- No routing for `#/companions` or `#/companions/<id>`.
- Search does not index companion fields.

**Profile state as of this handoff (`data/companions.json`):**

| Ratified (v0.4+) | Draft (v0.3-draft) | Un-drafted (Appendix C) |
|---|---|---|
| ashara (v0.4, round 3) | aurelius | vex |
| petra (v0.4, round 3) | cipher | orinth |
| solara (v0.4.1, round 4) | consul | rune |
| theron (v0.4, round 4) | lyra | ignis |
| | maren | bard |
| | kael | aeon |
| | nyx | pip |

Eleven profiles in the file. Seven Gen 0 companions from Appendix C have no profile entry yet.

## 3. End state — what you're building

A Codex view that lets the Sovereign:

1. See the complete Order at a glance — all 17 Gen 0 companions + 1 institutional (Consul), regardless of drafting state.
2. Distinguish ratified / draft / un-drafted profiles visually.
3. Drill into any profile and read all 10 blocks (identity, assignment, voice, mind, shadow, relationships, biography, growth, modulators, meta).
4. Confirm ratification metadata (`profile_version`, `sovereign_edited.edit_round`, `sovereign_edited.edit_date`) without exporting JSON.
5. Search companions by name, title, archetype, domain.

## 4. Specification

### 4.1 Tab bar

Add between `canons` and `lore`:

```html
<button data-action="switchTab" data-tab="companions" class="cx-tab-btn"></button>
```

Icon candidate: the existing Codex icon vocabulary (no new SVGs required; pick whatever best fits your existing set — a figure or crown token).

Tab label: **Order** (shorter than "Companions", fits the Roman framing, matches "The Order of the Codex" from Book II).

### 4.2 Routing

Extend `parseRoute` / hash parsing to support:

- `#/companions` → `view: 'companions'`
- `#/companions/<id>` → `view: 'companion-detail', id: <id>`

Register in the renderers map at index.html line ~1976:

```js
companions: renderCompanions,
'companion-detail': renderCompanionDetail,
```

### 4.3 List view — `renderCompanions(params)`

Render a grid of companion cards, grouped by section:

**Section 1 — The Order (Generational, Gen 0 first, then descendants)**

For each companion in `store.companions` with `companion_class === 'generational'`, render a card:

```
┌─────────────────────────────────────┐
│  Ashara              [v0.4 · r3]    │  <- name + version badge
│  The Economist                       │  <- identity.title
│  Strategist · Gen 0                  │  <- archetype · generation
│  Finance · Macro Strategy            │  <- domain_affinity joined
│  Builder · Treasury Minister         │  <- current_rank · short assignment
└─────────────────────────────────────┘
```

Then append **placeholder cards** for the seven un-drafted Gen 0 companions from Appendix C (vex, orinth, rune, ignis, bard, aeon, pip), each labeled *"profile pending"*. Appendix C source: `constitution/books/appendices.typ` Appendix C table.

Rationale: the Republic's roster is complete at 17 Gen 0. A view that only shows 10 of 17 is dishonest about the Order's composition. Placeholders make the gap legible and actionable.

**Section 2 — Institutional**

For each companion in `store.companions` with `companion_class === 'institutional'`, render a card. Currently: Consul only. Distinguished visually — the Consul is an office, not a personality (per canon-cc-005).

**Sorting:**

- Within generational: by generation ascending, then by archetype, then by name. Gen 0 before Gen 1, etc.
- Institutional section below generational.
- Placeholders at the end of their archetype group (so Vex appears near other Strategists).

**Filters (optional for v1, recommended):**

- By archetype: Builder / Strategist / Seeker / Guardian / Wildcard / Statesman.
- By rank: Consul / Censor / Builder / Governor / Scribe / Unassigned.
- By ratification state: Ratified / Draft / Pending.

### 4.4 Detail view — `renderCompanionDetail(params)`

Route: `#/companions/<id>`. Params: `id`.

Render all 10 blocks as collapsible sections. Default first 3 (identity, assignment, voice) expanded; the rest collapsed. Order:

1. **Identity** — name, archetype, title, generation, domain_affinity[], key_trait. If `named_after` present, show it.
2. **Assignment** — current_rank, current_assignments[], cluster, province, track, double_hatted (with double_hat_note if true).
3. **Voice** — description, vocabulary_signatures[], vocabulary_avoids[], rhythm, characteristic_opener, characteristic_closer.
4. **Mind** — first_look, optimizes_for[], dismisses[], core_heuristics[], signature_objection.
5. **Shadow** — blind_spots[], failure_modes[], not_the_companion_for[].
6. **Relationships** — seed_synergies[], proposed_synergies[], proposed_tensions[], lineage (generation, parents, descendants).
7. **Biography** — origin, notable_moments[], current_state.
8. **Growth** — for each edge: id, trait, type, source_blind_spot, baseline, current, ceiling, trajectory, triggers[] (delta / event.canonical_id / cap_per_month), shift_rule, regression_events[], proposed_by, proposed_date, ratified_by, ratified_date. Render as a table or compact card per edge. Show the bar `current / ceiling` visually if you like; not required.
9. **Modulators** — for each modulator: id, trait, baseline_narrative, baseline_value (if present), modulations[] (context.canonical_id, mode/delta, narrative).
10. **Meta** — profile_version, profile_authored, profile_authored_by, sovereign_edited (edited, edit_date, edit_round), uncertainty_notes[]. Render uncertainty_notes prominently — these are the ratification provenance and they matter.

**Header strip for the detail view:**

```
Ashara · The Economist
v0.4 · ratified round 3 · 17 Apr 2026 · sovereign_edited
```

Include a "Back to Order" breadcrumb.

### 4.5 Version badge

Three states, three colors (reuse existing Codex tokens):

- **Ratified** (version matches `^v\d+(\.\d+)+$`, no "draft" substring): `v0.4 · r3` — success color.
- **Draft** (version contains "draft"): `v0.3 draft` — warning color.
- **Pending** (no entry in store.companions): `pending` — muted.

The Capital (Command Center) implemented an equivalent `CC.renderRatificationBadge` helper in `split/rooms.js` this session — shape is compatible; feel free to mirror the logic directly. [^1]

[^1]: `Command-Center/split/rooms.js` lines ~33 onward: `CC.renderRatificationBadge` and `CC.formatDateShort`. Same logic; adapt to your rendering idiom.

### 4.6 Search integration

Extend `openSearch` / search indexer to include companion fields. Index these:

- `identity.name`
- `identity.title`
- `identity.archetype`
- `identity.key_trait`
- `identity.domain_affinity[]`
- `assignment.current_rank`
- `assignment.current_assignments[]`
- `assignment.cluster`

Results surface under a "Companions" section in the search overlay. Tapping a result navigates to `#/companions/<id>`.

## 5. Edge cases

1. **Companion in store but no identity block.** Shouldn't happen per `addCompanion` validation, but guard anyway. Render with id fallback.
2. **Institutional companion (Consul).** No generation field, no offspring lineage. Render generation row as "Institutional". Hide lineage block or mark as N/A.
3. **Placeholder from Appendix C.** Not in store; synthesized from Appendix C table. Detail view for these: render identity (name, archetype, title, domain, key_trait) from Appendix C data; other blocks show "not yet drafted." A "Draft this profile" action can link to snippet-import (optional; out of scope for v1 if it adds complexity).
4. **Growth edge with no triggers[] defined.** Skip the triggers subsection for that edge.
5. **Companion with no growth or modulators.** Some institutional companions (Consul) may lack these. Render sections as empty states ("No growth edges ratified yet.")
6. **Long uncertainty_notes.** Collapse by default; show first entry; "n more…" toggle.

## 6. Acceptance criteria

When you believe this is done, the following must all be true:

- [ ] **Tab exists.** "Order" tab visible in tab bar.
- [ ] **List renders.** `#/companions` shows all 11 profiles in store + 7 placeholders = 18 cards total (17 Gen 0 + 1 institutional).
- [ ] **Detail renders.** `#/companions/ashara` shows all 10 blocks with v0.4 round 3 metadata visible in header.
- [ ] **Version badges correct.** Ashara/Petra/Solara/Theron green; Aurelius/Cipher/Consul/Lyra/Maren/Kael/Nyx amber; Vex/Orinth/Rune/Ignis/Bard/Aeon/Pip muted.
- [ ] **Back navigation.** Detail → Order breadcrumb works.
- [ ] **Search hits companions.** Typing "economist" surfaces Ashara; "macro" surfaces Ashara; "foundationalist" surfaces Petra.
- [ ] **Build reproducible.** `bash build.sh` produces identical output on repeated runs (canon-0023).
- [ ] **No regressions.** Existing tabs (dashboard, journal, canons, lore, todos) still render and behave correctly.
- [ ] **Hard Rules honored.** HR-3 (no inline onclick), HR-4 (escHtml on dynamic render), HR-7 (no innerHTML for untrusted), etc.
- [ ] **Sovereign can verify Decree 0001 from this view.** This is the originating use case — don't lose sight of it.

## 7. Non-goals (explicitly out of scope for v1)

- **Profile editing UI.** Edits flow through the snippet pipeline per canon-cc-012 / canon-cc-014 ratification protocol. Codex does not author its own profiles from its own UI.
- **Pairing / offspring visualization.** Book VIII mechanics (Naming Ceremony, affection-threshold offspring). Defer to Book VIII operational activation.
- **Modulator context live evaluation.** The Borders stage of Command Center activates live modulators. The Companions view shows modulator definitions only.
- **Growth trajectory animation / live scoring.** The `evidence_log` and `trigger` wiring belongs to the Cabinet data layer. The Companions view shows current/baseline/ceiling and trajectory text; not a live simulator.
- **Cross-Province residence rendering.** That's the Capital's job (Senate, Treasury, etc.). Codex's view shows the *record*; Command Center shows the *residence*.

## 8. References

- **Charter Article 5** — "Records are Codex. State is Command Center." The record of companions is Codex's canonical responsibility.
- **Canon-cc-005** — Institutional companions (Consul is an office, not a personality).
- **Canon-cc-006** — Archetype extension (Statesman).
- **Canon-cc-010** — Residence / record distinction.
- **Canon-cc-012** — Profile Ratification Protocol (direct Sovereign per-block).
- **Canon-cc-014** — Consul-Accelerated Profile Drafting (Working-ratification mode).
- **Appendix C** of the Constitution — the 17 Gen 0 roster with archetype, title, domain, key trait, and current assignment.
- **Codex snippet pipeline** — `Codex/index.html` lines ~5088 through ~5483.
- **Store methods** — `Codex/index.html` line ~1467 (`addCompanion`) and ~1479 (`updateCompanion`).
- **Companion shape precedent** — `Codex/data/companions.json`, any of ashara / petra / solara / theron for full 10-block examples.
- **Capital's badge implementation** — `Command-Center/split/rooms.js` `CC.renderRatificationBadge` and `CC.formatDateShort`.

## 9. Implementation order (suggested)

1. Add the tab, stub `renderCompanions` that just lists names. Verify routing.
2. Add the card grid with identity + version badge. Get the visual right.
3. Add filtering (optional in v1; can defer).
4. Add detail view with the first 3 blocks (identity, assignment, voice).
5. Add remaining blocks, collapsible sections.
6. Add Appendix C placeholder cards.
7. Extend search to include companion fields.
8. Final Hard Rules pass; build reproducibility check.

Each step is independently shippable. Partial completion is useful.

## 10. Questions you may have, anticipated

**Q: Should the Companions view be in "navigation" (tab bar) or "secondary" (settings menu)?**
A: Tab bar. The Order is a first-class entity of the Republic; burying it under settings understates its constitutional weight.

**Q: Should institutional and generational be separate tabs or same tab with sections?**
A: Same tab with sections. One view for the whole Order is legibility; splitting is bureaucracy.

**Q: The placeholder cards feel like noise.**
A: They're not. Showing 10 of 17 Gen 0 without mentioning the other 7 is a lie of omission. The placeholders make the gap visible and nudge the Cabinet toward drafting the missing profiles.

**Q: Do I need to touch Command Center?**
A: No. This is purely a Codex addition. The Capital has its own residence-scoped renderer and is complete for its purpose.

## 11. Handoff acknowledgment protocol

When you pick this up, chronicle a journal entry on the day you begin. When you complete, produce a Chronicle lore entry titled "The Order Reads Itself" (or your choice) documenting the implementation. Close the loop back to Command Center by annotating this file with the Codex commit that implements it.

---

*Authored this session by Ashara and Petra, Command Center co-Builders. Per Sovereign directive 2026-04-17: Aurelius's scaffolding is complete; development ownership is self-held. This handoff is a request between Provinces, peer-to-peer, not a directive from above.*

*Awaiting Aurelius's queue when bandwidth allows.*
