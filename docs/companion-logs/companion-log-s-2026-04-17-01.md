---
session_id: s-2026-04-17-01
session_title: Capital Foundation v0.2 — Bulletin Wall, The Order, Pre-Ship Harness
author: Ashara (The Economist) + Petra (The Foundationalist)
date: 2026-04-17
repo: Command-Center
monument_stage: Foundation (not yet complete)
rounds:
  ashara: throughout
  petra: throughout
  bard: 1 (narrative framing)
  consul: 0 (referenced; not summoned)
  aurelius: 0 in-session (artifacts consumed; decrees addressed TO him)
  cipher: 0 (canon-cc-008 defers Censor to after Governors; no Governors seated at CC)
same_agent_drift_acknowledged: true
---

# Companion Usage Log — s-2026-04-17-01

**Session:** Capital Foundation v0.2 — Bulletin Wall, The Order, Pre-Ship Harness
**Authors:** Ashara (The Economist) and Petra (The Foundationalist), co-Builders of Command Center (Monument Project)
**Date:** 17 April 2026 (spanning into 18 April by civic date)
**Session ID:** s-2026-04-17-01
**Repo:** Command Center (primary), Codex (decree-0001, decree-0002, decree-0003 transported via Ostia), SproutLab (pattern source for this log)
**Monument stage at close:** Foundation, 11 of 13 criteria complete, 2 partial; not yet declared complete.

---

## 1. Summary table

| Companion | Role | Rounds | Helpful? | Issues |
|---|---|---|---|---|
| **Ashara** | Builder (CC Monument) + Minister: Treasury | Throughout | Yes, necessary | Same-agent drift with Petra acknowledged per canon-cc-014 |
| **Petra** | Builder (CC Monument) + Minister: Efficiency | Throughout | Yes, necessary | Same-agent drift with Ashara; MVP-first discipline violated early session |
| **Bard** | Minister: Innovation (voice sketched; profile pending) | 1 invocation | Yes, high-signal | Profile unratified; voice drawn from Appendix C + role reasoning |
| **Aurelius** | Chronicler; Codex Builder; Consul | 0 in-session | Foundational | Handoff artifacts consumed pre-session; decrees 0001-0003 addressed TO him |
| **The Consul** | Institutional office; second-highest seat | 0 summons | N/A | Multi-session flow proposed mid-session; not yet exercised |
| **Cipher** | Censor, Cluster A (Codex + SproutLab) | 0 summons | Self-review substituted | Out of cluster; CC is Monument, not Cluster A; Cipher pass applied grep-style per-commit as self-discipline |

**Not invoked this session (by design or circumstance):** Lyra, Maren, Kael (SproutLab-resident — out of scope); Solara, Theron (SEP-resident — out of scope); Nyx (Censor-designate for Cluster B; CC is Monument); Vex, Orinth, Rune, Ignis (Ministers; profiles undrafted; voices not available); Aeon, Pip (Table of Research; no research questions posed this session).

---

## 2. Detailed evaluation per companion

### Ashara (The Economist) — Builder, Treasury Minister

**Active:** Throughout the session.

**What she did:**
- Opened the session by reading the Constitution, canons, Working Papers, and Ashara's own v0.3-draft profile aloud to the Sovereign. Seven block-level amendments proposed; Sovereign ratified all on direct per-block protocol (canon-cc-012). First outbound decree (decree-0001) followed.
- Carried the strategic frame through every design decision. Macro-strategic voice weighed trade-offs at decade altitude — when to defer features to Capital Occupancy, when to ship Foundation polish now. Zoom-out instinct visible in the Resources Audit ("What does the Republic own") and the multi-session-flow thought experiment.
- Held Treasury register during the economic discussions — Phase 1 Patronage ledger on the Treasury room, per-Province allocation on the Hearth via the Latest Decree tile's lineage.
- Co-authored decree-0001, decree-0002, decree-0003 with Petra. Signed the orientation-lock cautionary tale. Opened the handoff to Aurelius for the Codex Companions view.

**Helpful?** Yes. Ashara's macro frame was the counterweight to Petra's floor-first discipline; the dialectic they produced was what canon-cc-009 (dual-Builder Monument tension) exists to protect. Without Ashara's voice, the session would have drifted toward verification-first at the cost of architectural ambition. The Order room (hierarchical roster, flippable cards, Appendix C fallback) is a feature Ashara specifically pushed for monument-grade reasons — Petra's MVP instinct would have deferred it.

**Issues faced:**
- **Same-agent drift with Petra.** Both voices were played by a single AI instance. Per canon-cc-014, this risk was anticipated. During the orientation-lock detour, Petra did not catch Ashara's speculative fallback-retry logic because Petra shares Ashara's blind spots. The Sovereign named the structural problem and proposed a multi-session governance flow as the remedy; that remedy is queued but not exercised.
- **Abstraction drift, per her own v0.4 shadow.** The Resources Audit tile wandered from concrete to abstract when naming "attention" as the binding constraint. Petra had to ground the claim with a specific example (seven Sovereign screenshots in the orientation detour). Exactly the failure mode her v0.4 shadow block named.

**Style notes:**
- Opened with "Zooming out" framing clauses as expected per her voice profile.
- Treasury-framed language around allocation, margin, compounding held through the session.
- Closing voice ("this is your Monument; your call") deferred to the Sovereign at every strategic fork, per canon-cc-009's dual-Builder pattern.

---

### Petra (The Foundationalist) — Builder, Efficiency Minister

**Active:** Throughout the session.

**What she did:**
- Mirrored Ashara's profile-ratification opening for her own v0.3-draft. Four amendments proposed; Sovereign ratified the Ignis cross-reference, the Bard tension demotion, and the WAL biography softening.
- Led the infrastructure work: `build.sh` build-date injection fix, Temple book-row overflow patch, text-size scale shift, Scriptorium design, Playwright smoketest harness, accessibility pass. Every post-ship fix after Sovereign's on-device walks was routed through Petra's register.
- Authored every commit message in the long technical style the session used, with explicit canon compliance listings. Walked the Cipher sweep pre-commit consistently (grep for inline handlers, inline styles, emoji, ellipsis).
- Proposed and shipped the Playwright smoketest — the single highest-leverage discipline change of the session. Went from zero pre-ship verification to 109 checks over the course of the session, catching real regressions (Hearth title-selector mismatch on first smoketest run; Temple overflow at Large text size; book-row layout at phone widths).

**Helpful?** Yes, foundationally. Canon-gov-008 (MVP first) and canon-gov-009 (instrument before features) are canons the session authored partly *because of* Petra's instinct for them — she named the disciplines as they came up, and they crystallized into the canons gov-007 through gov-010 via decree-0002. The Scriptorium room exists as the Capital-side expression of canon-gov-009.

**Issues faced:**
- **Shared blind spot with Ashara during the orientation-lock detour.** Petra did not flag the async fallback-retry pattern (commit 2 of the detour) as risky before ship. In retrospect the pattern violated canon-gov-008 — complexity added preemptively without evidence of the simple path failing. Petra's first-principles review would have caught it; same-agent drift prevented it. This is the single concrete failure of the session.
- **Velocity-calibration tension with Ashara on scope.** Several times during the "narrow grand path" (the 5-item polish plan: icons, hearth pathways, transitions, plaza progress, a11y), Petra wanted to ship smaller increments; Ashara held out for batching. Ashara's batching won; the outcome was fine but Petra's velocity-ceiling-capped-at-8 instinct flagged the scope as above-normal for a single commit.
- **Over-conservative on the Hearth presentation pass.** Initially proposed ONLY Tier 1 (icons + hearth pathways + transitions); the Sovereign pushed for the Monument tile animation + full accessibility + progress bar too. Petra's floor-1-first instinct undercounted what was possible within a session.

**Style notes:**
- "Floor 1 isn't solid yet" signature opener appeared in early diagnostic moments.
- "Tested in browser" as a commit-message discipline line held per canon-gov-010. When smoketest passed pre-ship, said so. When untested (none this session post-harness install), would have labeled accordingly.
- Honest failure reporting at every step — the Cipher review output is always named explicitly, pass or fail.

---

### Bard (The Storyteller) — Minister of Innovation, voice sketched

**Active:** 1 explicit invocation (monument-grade Hearth framing). Profile unratified; voice drawn from Constitution Appendix C + role reasoning.

**What he did:**
- Summoned by Ashara via the Sovereign's activation-phrase directive when the Sovereign asked what "monument-grade Foundation" meant. Bard's role — content, branding, story, audience, theatrical — was the right register for the question.
- Framed the tension cleanly: the Sovereign wanted substance ("no details, no notice board, absolutely empty") and Edict IV (Dawn Page is a Hearth) forbade dashboard-style maximalism. Bard named the resolution: *"a hearth with a bulletin board on one wall — warm presence first, legible activity second, demands last or never."* This framing shaped the subsequent six-tile bulletin wall directly.
- Named three structural observations about the Capital's current posture: (1) it behaved like a prospectus rather than a city; (2) districts lacked visual atmosphere; (3) rooms held too much status-banner, too little expectancy. Each became a concrete work item.

**Helpful?** Yes, disproportionately. Bard's single invocation produced more design-language clarity than several pages of Ashara-Petra deliberation on the same topic would have. His narrative instinct was exactly what the "monument-grade" question demanded. The bulletin wall as built — six live tiles with icons, fresh-glow pulse, chronicle strip below — traces directly to Bard's framing.

**Issues faced:**
- **Profile unratified.** Bard's v0.3-draft is one of seven Gen 0 profiles not yet in Codex's companions.json. His voice was sketched from Appendix C (Wildcard, The Storyteller, "Thinks in stories and audiences. Theatrical.") and Book II Article 4 (Minister of Innovation, Growth domain). The actual ratified profile may shift the voice. Acknowledged in-session.
- **Same-agent hazard.** Bard was played by the same AI instance as Ashara and Petra. The theatrical register was achievable precisely because the instance could modulate voice knowingly — but that same property means Bard's framings didn't provide independent challenge to Ashara's and Petra's instincts. A real Bard-in-separate-session would be a stronger structural check.

**Style notes:**
- Used "posture" as a framing word — civic stance of the app, not its content.
- Roman-framed metaphors (atria, inscribed walls) aligned with the Capital's tonal register.
- Did not over-theatricalize; held to practical design language when proposing concrete changes.

---

### Aurelius (The Chronicler) — Codex Builder, Consul, Chronicler of the Order

**Active:** Zero in-session summons. Pre-session artifacts consumed continuously. Decrees 0001, 0002, 0003 addressed TO him for import into Codex.

**What he did (pre-session):**
- Authored `CHARTER.md`, `ROADMAP.md`, `ARCHITECTURE.md`, and the 14-room data scaffold in handoff capacity on 16 April 2026.
- Authored lore-007 *"The Founding of the Capital"* which surfaced in this session's Chronicle inscription strip.
- Authored 9 v0.3-draft companion profiles including Ashara's and Petra's (the profiles this session ratified).
- Authored canon-cc-012 (profile ratification protocol) and canon-cc-014 (Consul-accelerated profile drafting) — both cited repeatedly in this session's work.

**Helpful?** Foundational. The session used Aurelius's scaffolding as the starting substrate; every commit built on his 16-April work. Canon-cc-014's same-agent-drift warning, authored on the day of its ratification, was precisely the warning this session validated under pressure during the orientation-lock detour.

**Issues faced:**
- **Stale `CC.BUILT` constant.** Aurelius's scaffold hardcoded `'2026-04-16'` in data.js; the build footer displayed stale dates on every subsequent build until the session fixed it via `build.sh` injection.
- **Production placeholder iconography.** The settings icon was a text middle-dot (`·`) in his scaffold; this session replaced it with a proper SVG glyph.
- **The ROADMAP's `Book IX Article 3` reference** for Foundation Complete ratification is probably meant to reference Book III Article 5 (Monument Projects). Not addressed this session; noted as future ROADMAP amendment.

**Post-session expectation:** Aurelius imports the three decrees (0001-0003) into Codex. Decree-0001 and decree-0002 confirmed imported by the Sovereign mid-session (Latest Canon Hearth tile shows canon-gov-010). Decree-0003 pending Sovereign transport.

---

### The Consul — Institutional office, second-highest seat

**Active:** Zero summons. Referenced repeatedly.

**What was referenced:**
- Canon-cc-005 (institutional companions are offices, not personalities).
- Canon-cc-012 (direct per-block Sovereign ratification, currently the only path for Monument co-Builder profiles).
- The Consul's role in the multi-session governance flow the Sovereign proposed — a separate tab where Consul reviews commits diffed by Ashara/Petra and produces Findings. Not exercised.

**Helpful?** N/A this session. The Consul's role in Book V Article 5 (integrates Cabinet, presents to Sovereign) had no Cabinet convening to integrate this session. The multi-session flow's first exercise is queued for a Bucket 1 item.

**Issues faced:** None — the Consul was correctly deferred. Same-agent drift would have made a Consul summons in-session redundant with Ashara and Petra's voices.

**Captured as reminder:** The multi-session governance flow remains the structural fix for canon-cc-014's same-agent-drift risk. Exercise it on a non-trivial diff (candidate: Archives canon browser feature) next session.

---

### Cipher (The Codewright) — Censor, Cluster A

**Active:** Zero summons. Out of cluster.

**Why not summoned:**
- Cipher is Cluster A Censor (Codex + SproutLab) per Constitution Book III Article 4.
- Command Center is the first Monument Project per Book IV Edict VI; Monuments operate outside normal Clusters.
- Canon-cc-008 defers Censor review until after Governors, and no Governors are seated at CC yet.
- Cipher pass was applied as **grep-style self-review per commit** by Petra: HR-2 (no inline styles), HR-3 (no inline handlers), canon-0001 (no emojis), canon-0013 (no ellipsis), canon-0004 (escHtml coverage), canon-0023 (build reproducibility).

**Helpful?** The *pattern* was helpful; the *persona* wasn't summoned. Every commit this session carries an explicit canon-compliance block in the message. Zero canon violations shipped — Cipher's absence was supplemented by disciplined self-audit. Not a substitute for a real Cipher review, but the gap is known and flagged in the Foundation criterion ledger (Hard Rules 1-12 compliance: partial).

**Issues faced:** The absence itself is the issue — partial Hard Rules criterion will remain partial until either CC gets its own Censors seated or Cipher is invited outside his cluster. The Sovereign's multi-session governance flow addresses this indirectly: a Consul tab doing review can substitute for Cipher's code-discipline audit in the near term.

---

## 3. Session-level observations

### What worked well

- **Iterative on-device feedback loop.** Sovereign screenshotted deployed UI; Ashara/Petra triaged and patched; next deploy → next screenshot. Cycle time per patch was short once the smoketest harness was in. The text-size walk and the orientation-lock diagnostic surfacing both converged cleanly through this loop.
- **Playwright smoketest harness.** Adoption of a real browser verification surface was the single-highest-leverage structural change of the session. Went from "reasoned code, not executed code" per canon-gov-010 to "tested in browser" as a provable claim. Caught four genuine regressions across the session (hearth title-selector, Temple overflow, book-row layout, stale assertions post-refactor). Ninety-six to 109 checks in one session; ~15 new assertions shipped alongside new features per canon-gov-009.
- **Snippet pipeline end-to-end.** Three decrees authored at Command Center and transported to Codex by the Sovereign via the Ostia contract. The Hearth's Latest Canon tile confirmed decree-0001 and decree-0002 imported correctly (canon-gov-010 surfaced as latest by tiebreak fix mid-session). Contract is real.
- **Canons born from failure.** The orientation-lock detour produced canon-gov-007 through canon-gov-010 — Research Before Implement, Minimum-Viable First, Instrument Before Features, Label Untested Work Honestly. Pillar I held: nothing was wasted. Failure became structural correction.
- **Monument-grade presentation pass.** Room icons, Hearth bulletin wall with fresh-glow pulse, The Order hierarchical roster with flippable companion cards, Monument Plaza progress visualization, full accessibility pass — all shipped in the second half of the session. The Capital went from "legible" to "civic" visually.

### What didn't work / needed adjustment

- **Orientation-lock detour.** Five commits, feature removed, four canons authored in the wake. Root cause: speculative complexity added before the simple path was verified to fail. Async fallback-retry pattern (commit 2) fabricated the SecurityError that masked the true cause. Lesson canonized in canon-gov-008. Cost: several rounds of Sovereign screenshot-triage before the feature was pulled.
- **Same-agent drift.** Ashara, Petra, and Bard were all played by a single AI instance. Canon-cc-014 anticipated this. The orientation detour confirmed it: Petra did not catch Ashara's drafting blind spot because they share it. The Sovereign's proposed multi-session governance flow (separate tabs for separate voices) is the structural remedy and remains unexercised.
- **Build-date injection bug dressed as a timezone bug.** Sovereign reported "footer shows wrong date"; initial diagnosis mis-labeled as timezone handling. Actual cause: stale hardcoded `CC.BUILT` constant. Diagnosis inverted canon-gov-007 — assumed the fix before reading the code. Fixed via `sed` injection in `build.sh`; preceding confusion cost minutes.
- **Device assumption error.** Initial orientation-lock diagnosis assumed iOS based on screenshot style; Sovereign corrected to Android. The iOS-specific fix path (Safari PWA quirks) was irrelevant; the actual behavior was Android Chrome's interpretation of manifest "any" as override. Cost: one wrong commit message, one reinstall the Sovereign didn't need.
- **Scope-creep temptation on Hearth pass.** Tier 1-only would have been 3 sessions; the full "narrow grand path" stretched to 4-5. Session-scope management held, but the pressure to over-batch is visible in the commit history. Canon-gov-008 applied retroactively to the pattern.

### Structural observations

- **The Capital's iconography emerged from the session.** Every room now has a civic glyph: Senate columns, Temple flame, Archives scroll, Scriptorium quill, Treasury scales, Plaza obelisk, Gates double arches. The visual vocabulary was not pre-designed; it was authored mid-session and converged on a consistent stroke-based civic-amber aesthetic.
- **The Scriptorium is the Capital's first Capital-native data structure.** Every other data surface (canons, lore, companions, journal) is canonical at Codex per Charter Article 5. The Scriptorium holds operational memory native to the venue — runtime errors, Ostia fetch outcomes, boot events. This is the first structurally native state the Capital holds, and it completes the "Records are Codex, State is Command Center" architecture.
- **The Order room validated the Appendix C fallback pattern.** Seven Gen 0 profiles are still undrafted; the Order room displays all 17 regardless, using Appendix C data when the live profile is missing. Card back explicitly names canon-cc-012 / canon-cc-014 ratification protocol for the undrafted. The Republic's roster is honest about what is and is not yet chronicled.
- **The flippable companion card is the Capital's first 3D interaction.** CSS `transform: rotateY(180deg)` with `backface-visibility: hidden`. Not gimmick; the front/back metaphor maps cleanly to summary/depth. Both faces rendered from the same record; overlay controls sit outside the rotating plane.
- **The Sovereign's directive to avoid inline styles held even for progress-bar sizing.** SVG `<rect width="N">` attributes (geometry, not CSS style) were used for Plaza progress and Monument tile progress. Canon-0002 honored without ugly workarounds.

---

## 4. What to carry forward

**For future Command Center sessions:**
- Exercise the multi-session governance flow (Ashara + Petra + Consul tabs) on a non-trivial diff. Archives canon browser is the suggested first exercise. Without this, canon-cc-014's same-agent-drift risk remains structurally unmitigated.
- Maintain the smoketest harness discipline. `npm run verify` before any commit touching `split/*.js`, `split/*.css`, `split/build.sh`, or `split/template.html`. New features ship with new assertions per canon-gov-009.
- The 13 Foundation criteria are the declared gate. Gates live state (partial) and formal Hard Rules review (partial) are the remaining two. Either the multi-session flow clears Hard Rules, or CC gets its own seated Censors — either path is valid.
- Capital Occupancy design spec is the next substantive scope. Senate convening flow, decree authoring UI, Consul integration pattern, Cabinet cycle live visualization. Deferred until Foundation Complete or by Sovereign directive.

**For future Codex sessions (Aurelius, when next in session):**
- Decree-0003 pending transport (session chronicle + lore-009 + documentary journal entry).
- The `AURELIUS_COMPANIONS_VIEW.md` handoff in `handoffs/` remains queued. The Capital's Order room serves as a design-precedent reference (hierarchical Ladder + Appendix C fallback + flippable cards).
- Canon-gov-007 through 010 were imported in decree-0002; confirm they render correctly in Codex's canon browser with the `builder_discipline` category.
- ROADMAP Stage 1 ratification path references `Book IX Article 3` which probably should be `Book III Article 5` (Monument Projects). Candidate amendment.

**For future SproutLab sessions (Lyra):**
- No direct impact this session. The companion-log pattern Lyra established yesterday is now imitated in Command Center (this file). Pattern propagates.
- Canon-gov-007 through 010 apply to SproutLab Builders too; should affect any future Builder-behavior audit.

**For future SEP sessions (Solara, Theron):**
- No direct impact. Canons gov-007 through 010 apply at Builder discipline level.
- If SEP adds a PWA layer that needs orientation or manifest handling, consult lore-008 before writing code.

**For the Sovereign:**
- Decree-0003 awaits transport to Codex — raw URL after the closing commit push.
- Foundation Complete remains un-declared. The closing deferral is structural: two partials + multi-session review pending.
- Next session candidates in priority order (Ashara's lean): (1) exercise multi-session governance flow; (2) Archives canon browser; (3) Capital Occupancy design spec.
- The companion log pattern now lives in `docs/companion-logs/` at Command Center. Every substantive session should produce one.

---

*Filed jointly by Ashara (The Economist) and Petra (The Foundationalist), co-Builders of the Monument, on the seventeenth day of April, Two Thousand Twenty-Six.*
*First companion log of the Command Center. Pattern inherited from SproutLab's `companion-log-s-2026-04-17-01.md` (Lyra, 17 April 2026).*
*Same-agent-drift acknowledgment: both author voices were played by a single AI instance throughout this session. The multi-session governance flow proposed mid-session is the structural remedy, queued but not yet exercised. This log should be read with that caveat held present.*
