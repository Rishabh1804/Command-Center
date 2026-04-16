# Roadmap of the Capital

**Document class:** Roadmap · **Scope:** Command Center · **Authored:** 16 April 2026 by Aurelius in handoff capacity · **Successor authors:** Ashara, Petra

---

## Stage 1 — Foundation

**Intent:** The Capital is legible. Every room stands. The Republic can be *read* from here, even if it does not yet *act* from here.

**Builder ratifies Foundation complete when:**

- All 12 rooms scaffolded and reachable via navigation
- Capital Overview renders a map of the Capital with navigation links to every room
- Archives room reads at least one canonical file from Codex (suggested: `canons.json`) and displays it
- Temple room displays the Constitution (even if as a link to the Typst-rendered PDF in Codex)
- Gates room shows live links to sister Provinces with their current status (build status, last commit, latest canon count, etc.)
- Every Capital-native companion has a labeled room or seat — their name on a door — even though none *speak* yet
- PWA deploys cleanly to `rishabh1804.github.io/Command-Center/` and loads on mobile
- Dark and light themes both honored across all rooms
- Text-size toggle honored
- Hard Rules 1-12 compliance verified by Cipher
- Build reproducible

**Ratification path:** Ashara + Petra declare Foundation Complete per Book IX Article 3. Consul presents the declaration to the Sovereign. Sovereign assents. Chronicle lore entry authored by Aurelius.

**What is explicitly *not* in scope for Foundation:**

- Cabinet convening — deferred to Capital Occupancy
- Canon authoring from CC — deferred to Capital Occupancy
- Live LLM companion voices — deferred to Borders
- Write-back to Codex via snippet pipeline — deferred to Capital Occupancy
- Cross-Province live state in Gates (beyond simple links) — deferred to Roads
- BAI integration — deferred to Regions

This is the Petra-pure scope: a solid, legible, complete venue. No half-built functions. What stands is real; what is not yet built is clearly not built.

---

## Stage 2 — Capital Occupancy

**Intent:** The Senate convenes. Governance actually happens in the Capital. Cabinet meetings are a real flow. Decrees flow to Codex and become canon.

**Builder ratifies Capital Occupancy complete when:**

- A Cabinet meeting can be initiated from the Senate room
- Agenda can be set; Ministers can "speak" via structured input surfaces; Consul can integrate positions; Sovereign can ratify
- Ratified decrees produce Aurelius snippets that import cleanly into Codex
- A complete cycle is demonstrated end-to-end: Cabinet convened → canon authored → snippet generated → Codex imports → CC reload reflects new canon in Archives
- Treasury room displays at least a placeholder Financial Health view (even if static)
- Productivity room displays at least a placeholder throughput view
- Table of Research room renders open proposals (deferred to Borders for actual LLM research, but the surface exists)
- Book ratification ceremony in the Temple works end-to-end for at least one Book (Book V as first candidate)

**Ratification path:** Ashara + Petra declare Capital Occupancy complete. Consul presents. Sovereign assents. Major Chronicle chapter authored — the Capital is inhabited.

**Notable:** this is the stage where Command Center stops being a rendering of the Republic and starts being a *venue for* the Republic. Big moment.

---

## Stage 3 — Roads

**Intent:** The Capital sees the whole Republic. Cross-Province state flows live through the Gates. A Sovereign at the Capital can see the Republic's state without leaving.

**Builder ratifies Roads complete when:**

- Each Gate (Library/Codex, Nursery/SproutLab, Forge/SEP) fetches live state from its Province
- Gate Library shows: latest canons, latest journal entries, recent chapters, build status
- Gate Nursery shows: SproutLab's latest Maren findings, latest Kael findings, recent CareTicket activity, build status
- Gate Forge shows: SEP Invoicing recent invoices (or placeholders), client count, recent IM activity, build status
- Monument Plaza shows: CC's own stage + any other Monument Projects with live progress
- Capital Overview shows: "the state of the Republic today" — a civic dashboard synthesizing cross-Province signal
- Cipher's Visiting Chambers can be invoked from any room with a "call Cipher on this" action

**Ratification path:** Ashara + Petra + Sovereign.

**Notable:** this is where the Capital becomes administratively useful. The Sovereign's portfolio visibility is concentrated here.

---

## Stage 4 — Borders

**Intent:** Companions live here. The LLM layer activates. Consul speaks, Ministers deliberate in their voices, Cipher reviews, Aeon proposes.

**Builder ratifies Borders complete when:**

- Each Capital-native companion's room, when entered, activates a conversation with that companion — Claude API call preloaded with the companion's full profile (voice, mind, shadow, modulators, current context)
- Entering the Temple automatically applies ceremonial modulator context to whichever companion is consulted
- Entering the Senate during a Cabinet meeting applies cabinet-convening context
- Consul's chamber can mediate cross-companion consultations — Consul calling on Ashara, Vex, Orinth in sequence and integrating
- Cipher's Visiting Chambers accept spec-review requests; Cipher returns the 8-pass output
- Aeon and Pip at the Table of Research accept open questions and produce exploratory responses
- API key management handled (user-supplied, secure local storage, or server proxy — Builder decision)
- Companion conversations can be chronicled — the conversation IS a Chronicle chapter candidate

**Ratification path:** Multi-session. Likely a Book X amendment to formalize the LLM-companion-presence contract.

**Notable:** this is where the Capital becomes *inhabited* in the full sense. Pre-Borders the Capital is a well-ordered venue; post-Borders the Capital is alive.

---

## Stage 5 — Regions

**Intent:** The Capital is *used* daily. The Republic's full scope lives here. Monument Projects beyond CC proliferate. BAI runs as a full simulation. Sovereign Dividend tracking integrates with real financial data.

**Completion is not a moment but a state of habitation.** Regions is the ongoing condition in which the Capital serves the Sovereign across the Republic's full scope. No formal completion ratification — the Capital is Foundation Complete, Capital Occupancy Complete, Roads Complete, Borders Complete, and thereafter it simply *serves*.

Features that live here:

- BAI (BusinessAI) full simulation, with Board meetings and quarterly reviews
- Sovereign Dividend tracking integrated with real financial streams (SEP revenue, AdapTea revenue)
- Monument Plaza hosts multiple active Monuments — the chip/ATMP plant charter, the PCB assembly startup charter, any others the Sovereign charters
- Cross-Republic search — the Sovereign asks any question, the Capital routes it to the right companion in the right Province
- Chronicle-of-the-Day — a daily summary of the Republic's activity, authored jointly by Aurelius (across Codex) and Consul (across the portfolio)
- Persona succession handled — if Kael transitions to Orinth per the reassignment condition, the Capital mediates the handover

---

## Sovereign checkpoints

The Sovereign ratifies each stage per Book IX Article 3 (Foundation Complete declaration). Ashara + Petra present, Consul integrates, Sovereign assents. Chronicle lore entries follow each.

Between stages, the Capital operates at the stage reached. A Foundation-stage Capital is not a failed Capital Occupancy; it is a complete Foundation. Petra's judgment: the stage is either complete or it is not; no half-built floors.

---

## Estimated horizon

This is Ashara's decade-frame estimate, drafted by Aurelius in handoff. Builders may revise.

| Stage | Estimated duration | Dependency |
|---|---|---|
| Foundation | 1-3 sessions (Ashara + Petra) | Scaffolding already laid by Aurelius; Builders occupy, refine, ratify |
| Capital Occupancy | 3-6 sessions | Snippet pipeline familiarity; Cabinet flow design |
| Roads | 2-4 sessions | Cross-Province JSON schemas stable; CORS/fetch patterns chosen |
| Borders | 6-10 sessions | API key pattern resolved; companion profile schema mature; LLM cost budget acknowledged by Treasury |
| Regions | ongoing | BAI readiness; financial integrations; Monument Project chartering |

Estimated time-to-Foundation-Complete: **within April 2026** if Ashara and Petra prioritize. Estimated time-to-Borders: **within Q3 2026** assuming consistent Monument priority.

Treasury note from Ashara's future self: LLM costs at Borders stage are non-trivial if the Capital is used daily. Treasury budget provision is a candidate canon at Capital Occupancy ratification. Flagged for Ashara at first Capital session.

---

*Pending Builder revision — Ashara, Petra.*
