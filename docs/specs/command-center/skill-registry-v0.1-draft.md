# Skill Registry — v0.1 Draft

**Document class:** Interface specification · **Scope:** Republic-wide (authored in the Capital) · **Status:** Rung 1 co-draft, pending Rung 2 Censor-equivalent review · **Authored:** 20 April 2026 · **Authors (Rung 1):** Ashara + Petra, co-drafting under canon-cc-009 dual-Builder tension · **Authority chain (Rung 0):** Codex session `s-2026-04-20-10`, external-reference capture `docs/references/claude-opus-4.7-system-prompt.txt`, Sovereign-direct authorization on branch `claude/summon-aurelius-wjnHa`.

---

## §1 — Why this exists

The Republic already runs on capability reuse; it does not yet run on capability **reuse visibility**. Codex has a snippet-import pipeline that accepts a specific envelope shape and does well-defined work on it. Each Province has its own companion-log-generation habit. Command Center has a Playwright smoketest harness. SEP Invoicing has invoice-rendering routines. SproutLab has care-ticket flows. These are capabilities in everything but name — repeated across sessions, refined over months, load-bearing for day-to-day work, and completely invisible to any session that does not happen to already know they exist.

The economic case for the Registry is the oldest one in infrastructure: the second time a capability is re-implemented from memory instead of invoked by name, a tax has been paid that compounds. Over a decade-frame horizon — the frame the Capital is built to serve — the uncounted reconstruction cost of unregistered capability is the largest single efficiency loss the Republic carries. The Registry is the Capital's correction.

The pattern transfers cleanly from the external reference. Opus 4.7 exposes ~10 capability folders to its session surface, each self-contained, each name-addressed, each loaded into context only when the session's work matches the folder's description. The Republic does not need the `/mnt/skills/public/` runtime substrate to use the pattern; it needs the **discipline** — name, manifest, body, discoverability — and one Province willing to host the index. The Capital is that Province by residence.

The Registry is additive to everything already built. Snippets keep working the way they work. Companion-log habits keep working. What changes is that a new session entering Codex discovers that `snippet-import` exists, what it does, when to use it, without having to be told by a prior session or an in-the-head human routine. The tax stops compounding. The floor is built once.

## §2 — What a Province Skill is

A Province Skill is a named, addressable, self-describing unit of capability that a session can invoke by matching its description to the work at hand. Four attributes define it:

1. **Name.** Unique within the Republic. Lowercase, hyphen-separated, ≤ 40 characters. Named by verb-noun where possible (`snippet-import`, `companion-log-generate`, `smoketest-run`). Names are canonical addresses; they do not change after Rung 4 ratification without a rename-canon.

2. **Manifest.** A YAML frontmatter block at the top of the skill body, parseable without loading the body. Required fields:
   - `name` — matches the folder name and the canonical address.
   - `description` — one to three sentences naming what the skill does and when it is the right choice. This is the field a session matches against; precision here is load-bearing.
   - `province` — the Province of origin (`codex`, `command-center`, `sproutlab`, `sep-invoicing`, `sep-dashboard`). A skill has exactly one origin Province; cross-Province skills are two skills by convention, not one with dual residence.
   - `version` — semver. `0.1.0` at Rung 1 draft; bumped on ratified changes.
   - `signing_rung` — current rung in the signing chain (1–4). Skills in the Registry at Rung < 4 are visible as drafts; invocation is permitted but annotated.
   - `classification` — one of `intra-province` or `cross-province`. Determines signing chain per §8 and transit-log behavior per §6.
   - `invocation_paths` — array of supported paths (`in-province-session`, `command-center-ui`, `dispatch-subagent`). Every skill must support at least `in-province-session`; others are opt-in.
   - `status` — one of `draft`, `ratified`, `deprecated`. The Registry shows all three; only `ratified` is recommended for production work.

3. **Body.** The prose-and-code substance of the skill. Markdown. The body explains to the invoking session how to do the work: preconditions, steps, failure modes, outputs. The body is read by the session; it is not executed as code. Executable artifacts the body references live beside the manifest in the same folder.

4. **Folder.** A skill is a folder, not a single file. `skills/<name>/SKILL.md` is the manifest-plus-body canonical file. Auxiliary artifacts — templates, fixtures, sample snippets, reference data — live in the same folder. This is the Opus 4.7 pattern transferred unchanged; the folder shape is what makes skills self-contained enough to reason about in isolation.

Existing habit-level capabilities that would become Skills in the first retrofit wave:

- **`snippet-import`** (Codex) — the snippet pipeline as a named skill. Worked example in §9.
- **`companion-log-generate`** (every Province) — the companion-log-at-session-close habit formalized.
- **`canon-author`** (Codex) — the canon-drafting routine with the `canon-proc-001` identifier scheme baked in.
- **`smoketest-run`** (Command Center) — the Playwright harness as a named invocable.
- **`decree-finalize`** (Command Center) — the decree-JSON-to-snippet conversion Cabinet sessions run.
- **`chronicle-session`** (Codex) — the session-chronicle authoring pattern.
- **`gates-transit-log`** (Command Center, Sentinel-owned) — the transit-log append routine.

None of the seven require new capability. All seven require naming, manifest authoring, and folder-placement — one session per skill for the first retrofit pass. The retrofit is the cheapest work the Registry enables; the expensive work is what the Registry unlocks over the following year.

On naming discipline: the word **Skill**, unqualified, refers to the Province Skill primitive defined here. References to the canon-cc-026 primitive are always qualified as **Persona Skill**. The inversion is deliberate — Province Skills are expected to outnumber Persona Skills by an order of magnitude within a decade — and the qualification cost on the rarer primitive is the smaller tax. If a Builder or Censor objects at Rung 2 or Rung 3, the naming is a fair place to push back.

## §3 — Placement

**Resolution of Fork A: Province Skills live at `<province-repo>/skills/<skill-name>/SKILL.md`, repo-root, code-class.**

The fork presented two candidates: (i) repo-root `skills/` as first-class Province artifacts; (ii) `docs/specs/skills/` mirroring the Persona Skill layout. The draft selects (i) on the structural ground that Province Skills are not documents-with-deploy-mirror; they are executable-by-reading artifacts invoked at runtime by sessions acting inside the Province. A `snippet-import` skill is consulted *while* a session is importing a snippet, not read from a specs directory and manually applied. Code-class placement reflects that operational reality.

Three consequences follow from this placement decision, and the spec honors them explicitly rather than letting them surface later as surprises:

1. **No byte-mirroring.** Persona Skills under canon-cc-026 byte-mirror from Codex into each Province's `.claude/skills/` because a companion's voice must be identical wherever the companion appears. Province Skills do not carry voice; they carry capability. The skill lives once, at its origin Province's `skills/` directory. Other Provinces consult it by reference — through the Registry index held at the Capital and canonical at Codex per §4 — never by mirror. A skill has one residence; the Republic has one record.

2. **Build-pipeline eligibility.** A Province whose build pipeline benefits from skill-awareness (for example, Command Center's `build.sh` concatenation, or a future SEP build that wants to validate manifest integrity) may read the `skills/` directory at build time. This would not be coherent under placement option (ii) — `docs/` is not build-input in any Province's current pipeline. The code-class placement preserves the option without mandating it; no Province is required to integrate skills into its build at this rung.

3. **Signing-chain review surface.** A Rung 2 Censor-equivalent reviewing a skill reviews a folder containing a manifest, a body, and any auxiliary artifacts the skill carries. `docs/specs/` is a reasonable review surface for prose; `skills/` is the review surface for a capability package. The reviewer enters the folder, reads the manifest, reads the body, inspects the auxiliary artifacts, and returns a verdict on the whole. The placement makes the review unit coincide with the skill unit.

The cost of this placement: Provinces acquire a new top-level directory. This is a small cost. Command Center adds `skills/`; Codex adds `skills/`; SproutLab adds `skills/`; SEP Invoicing adds `skills/`; SEP Dashboard adds `skills/`. No Province's existing layout is disturbed beyond the addition. The `skills/` directory may be empty at first; Provinces populate it as the retrofit wave progresses.

### §3.1 — Folder shape

```
<province>/
└── skills/
    ├── <skill-name-1>/
    │   ├── SKILL.md              Manifest (YAML frontmatter) + body (Markdown)
    │   ├── <auxiliary files>     Templates, fixtures, reference data (optional)
    │   └── <auxiliary dirs>      Sub-folders if the skill warrants them (optional)
    ├── <skill-name-2>/
    │   └── SKILL.md
    └── <skill-name-3>/
        └── SKILL.md
```

`SKILL.md` is the canonical filename. Parsers look for this exact filename inside each folder under `skills/`. Folders without a `SKILL.md` are ignored by the Registry; they may exist as work-in-progress but do not participate until the manifest lands.

### §3.2 — Relationship to `docs/specs/`

A Province Skill's **ratification artifact** — the Rung-1-through-4 signing-chain record for the skill's own creation per §8 — lives in `docs/specs/` of the authoring Province, following the canon-cc-027 body-placement convention. The skill's manifest-and-body lives in `skills/`. The two are linked by naming: `docs/specs/skills/<skill-name>-v<version>.md` contains the ratified spec; `skills/<skill-name>/SKILL.md` contains the invocable manifest that the spec ratified.

This split is deliberate. The spec is a document (ratified once, reviewed-against thereafter, canon-cc-026-ish in its lifecycle). The skill is an instrument (invoked repeatedly, versioned on amendment, working artifact). They are not the same file because they are not the same thing. A Censor reviewing a skill amendment reads both: the spec to understand what was ratified, the skill folder to confirm the amendment honors it.

## §4 — Registry behavior

**Resolution of Fork B: hybrid. Codex holds the canonical Registry index as `data/skills.json`; Command Center is the active Registry — the indexer, renderer, and invoker that reads the index and serves discovery and invocation surfaces to the Republic.**

The fork surfaced three candidates: (i) pull-based, Command Center fetching each Province's `skills/` via the GitHub Contents API on demand; (ii) push-based, each Province emitting manifests to a shared location on change; (iii) static, a Codex-canonical `data/skills.json` synchronized the way `canons.json` is. The draft selects a hybrid that takes option (iii) for the record and option (i) at read-time for freshness.

This is the same shape the Republic already runs for companions. `companions.json` lives canonically in Codex; Command Center fetches it at runtime and renders the Order. The record is Codex; the residence is the Capital; the rendering and the interaction surface are in Command Center. The Skill Registry inherits this pattern. There is no reason the Republic should invent a new synchronization model for its second instance of the same problem.

### §4.1 — Canonical index (Codex)

Codex hosts `data/skills.json` with one entry per ratified skill and per draft skill that has passed Rung 1. Entries carry:

- `id` — the canonical name (e.g., `snippet-import`).
- `province` — origin Province.
- `description` — mirrored from the skill's manifest; kept in sync by the ratification flow.
- `version` — current ratified version; draft entries carry the draft version.
- `signing_rung` — current rung.
- `classification` — `intra-province` or `cross-province`.
- `invocation_paths` — array of supported paths.
- `status` — `draft`, `ratified`, `deprecated`.
- `source` — a reference to the authoritative `SKILL.md`, expressed as `<province>/skills/<name>/SKILL.md` relative to the Province repo root. Readers resolve this through the Province's canonical repo URL.
- `ratified_spec` — path to the `docs/specs/skills/<name>-v<version>.md` ratification artifact in the authoring Province.
- `created` — ISO date of Rung 1 draft entry.
- `ratified_at` — ISO date of Rung 4 ratification, null for drafts.

The shape mirrors `canons.json` by deliberate parallel. A session already familiar with reading canons from Codex will read skills with no new cognitive overhead.

### §4.2 — Active Registry (Command Center)

Command Center carries the Registry as a function of the Capital. Four responsibilities:

1. **Index fetch.** At CC load (runtime fetch per `ARCHITECTURE.md` §3.1) or at build time (bake), CC pulls `data/skills.json` from Codex the same way it pulls `canons.json`. No new transport. No new CORS surface. The Ostia contract already covers this.

2. **Manifest fetch on demand.** When a session or UI surface needs the full body of a skill (not just the index entry), CC fetches `<province>/skills/<name>/SKILL.md` from the named Province's raw GitHub endpoint. This is the pull-based read that option (i) of the fork called for, executed only on demand, scoped to one manifest per request.

3. **Discovery surface.** A room in the Capital — provisionally **The Armory**, pending Builder naming — renders the Registry as a browseable catalog: skill name, description, origin Province, classification, status, version. The Sovereign and the companions can browse. Searching and filtering are UI concerns deferred to Command Center's own session; the spec does not dictate them.

4. **Invocation mediation.** For invocations that go through Command Center (the secondary path in §5), CC handles the manifest fetch, the classification check, the cross-Province authorization gate under canon-cc-016, and the transit-log append per §6. CC does not execute skill bodies itself — skills are read-and-acted-upon by the invoking session — but CC is the surface through which cross-cluster invocations are coordinated.

### §4.3 — Write path: how a skill enters the index

A skill enters `data/skills.json` through the existing snippet-import pipeline, not through any new transport. The writing path:

1. A Province authors a skill: creates `skills/<name>/SKILL.md`, drafts the manifest, drafts the body, produces the ratification spec at `docs/specs/skills/<name>-v<version>.md`.
2. The skill enters the signing chain per §8. At Rung 1 completion, the authoring Province (or the Capital on its behalf) generates a `new_skills` snippet targeting Codex's pipeline — a new snippet type introduced by this spec, with shape documented in §4.4.
3. The Sovereign transports the snippet to Codex (the normal Ostia transport). Aurelius imports. `data/skills.json` gains the entry at `signing_rung: 1, status: draft`.
4. On CC's next index fetch, the skill appears in the Armory with its draft annotation.
5. On Rung-status changes (2 → 3 → 4), an `update_skills` snippet amends the entry's `signing_rung` and, on Rung 4, flips `status: ratified` and populates `ratified_at`.
6. On deprecation, an `update_skills` snippet flips `status: deprecated`. Deprecated skills remain in the index — deletion is separate and rare — so that sessions holding prior references can still resolve them.

### §4.4 — Snippet shapes

Two new snippet types are introduced:

- **`new_skills`** — array of skill entries in the shape defined in §4.1, for skills first entering the index.
- **`update_skills`** — array of partial entries keyed by `id`, amending only the fields present. Used for rung promotions, version bumps, status changes, and description amendments.

Both follow the envelope convention Codex's snippet pipeline already accepts. Aurelius's snippet-import skill (§9) will recognize them without modification beyond adding the two type handlers.

### §4.5 — On Command Center as active-but-not-authoritative

The Registry is Command Center's contribution to the Republic above the Cabinet-convening function the Capital already carries. It is active — CC is where the Registry *lives* for the session using it — but it is not authoritative. Authority lives in Codex's `data/skills.json`; if CC's rendering disagrees with the Codex record, Codex wins. This is the records-are-Codex invariant applied to a new record class. Command Center does not own skills; it serves them.

## §5 — Invocation

**Resolution of Fork C: three paths, tiered. Primary is the in-Province Claude Code session. Secondary is the Command Center UI. Tertiary is a dispatch subagent. The spec ratifies all three as first-class *targets*, but stages them: primary ships at Rung 4, secondary ships at Capital Occupancy, tertiary ships if-and-when a load justifies it.**

The reason primary is primary: a skill serves the session that is doing the work. The session that is doing the work is almost always already inside the Province — a Claude Code session in Codex is authoring a canon, a session in SEP Invoicing is drafting an invoice, a session in Command Center is smoketesting the Capital. That session already has the Province's filesystem, its canons, its habits, its tools. Placing the primary invocation path there means a skill is consulted in the context in which it was designed to act, with no marshaling layer between intent and effect. This is why the Opus 4.7 pattern works — skills attach to where the session's work is happening, not to a side-channel discovery surface.

The Command Center UI path exists for a different reason: the Sovereign, or a companion summoned to the Capital, is reasoning about the Republic's full scope and wants to see what capabilities exist, or to invoke one from a civic vantage rather than from inside a Province. This is rarer than in-Province invocation and — honestly named — is the path most at risk of being a solution in search of a problem. The draft ships it as secondary because the Capital should exercise its own Registry, not just index it; but the schedule is deferred to Capital Occupancy, which is the stage at which CC begins acting as a venue rather than rendering as one.

The dispatch subagent path is the least committed. It would be useful if the Republic reaches a scale at which a dedicated subagent makes better skill-selection decisions than the invoking session does on its own. The draft does not project that scale. The path stands as a ratified *shape* without a ratified *build* — if load justifies it later, the contract is already named; if load does not, no infrastructure has been built prematurely.

### §5.1 — Primary path: in-Province Claude Code session

Contract:

1. A session starts inside a Province's repo (Claude Code's working directory is `<province-repo>`).
2. The session reads the Province's own `skills/` directory, or the Republic-wide index via the Capital when cross-Province awareness is required.
3. On description-match — the invoking session or its orchestrating agent judges that a skill's manifest description fits the work at hand — the session loads `skills/<name>/SKILL.md` into its own context.
4. The session acts on the skill body: follows its steps, uses its templates, produces the outputs the skill body specifies.
5. On completion, if the skill is `cross-province` classification, the session or the Province's build emits a transit-log event per §6.

This path requires no new infrastructure at Rung 4. Every Province already has Claude Code sessions. Every Province will have a `skills/` directory once the retrofit wave lands. The Registry index is optional for intra-Province invocations (a Codex session invoking a Codex skill does not need the index; it has the directory), and pulled from Codex via the Capital for cross-Province invocations.

The manifest's `description` field is load-bearing on this path. The session's ability to match work-to-skill depends on the description being precise, specific, and scoped. The Opus 4.7 pattern invests heavily in description quality because it has to; this spec inherits that discipline. Rung 2 review should read descriptions with the same scrutiny it reads canon bodies.

### §5.2 — Secondary path: Command Center UI

Contract (ships at Capital Occupancy; named here so the shape is ratified early):

1. The Sovereign, or a companion acting from a Capital room, navigates to the Armory.
2. The Armory renders the Registry index: all skills, filterable by Province, classification, status.
3. On selection of a skill, the Armory fetches the manifest body from the origin Province's repo.
4. The UI presents the skill in a structured form: manifest fields, body prose, any auxiliary artifacts listed. The Sovereign reviews.
5. On an "invoke here" affordance, the UI:
   - Verifies the invoker's cluster against the skill's origin cluster (canon-cc-016 boundary).
   - For cross-cluster invocations, routes through the Capital's Chamber — the invocation is a Capital-mediated act, chronicled accordingly.
   - For same-cluster invocations that are nonetheless cross-Province, records the invocation as a Gates-transit event.
   - Hands the skill body to the Capital-resident companion or session acting as the invoker-of-record.

The UI path is the one that makes cross-cluster invocation coherent. Inside a Province, cross-cluster is forbidden by canon-cc-016; at the Capital, cross-cluster is mediated. The Armory is the mediation surface.

### §5.3 — Tertiary path: dispatch subagent (deferred)

Contract (shape only; implementation deferred to a later spec if warranted):

A dispatch subagent receives a request of the shape *"do work X"*, inspects the Registry, selects the best-matching skill, and invokes it. The subagent is itself a companion or a function — the draft does not prescribe which — and lives at the Capital if it ever exists.

The path is named for three reasons: (a) to reserve the contract shape before it is needed, preventing reinvention later; (b) to acknowledge that skill-selection quality is a first-class concern and may deserve a dedicated attention surface; (c) to be honest that the Republic at its current scale does not need this and may not at a decade horizon.

Ratification of this path at Rung 4 is a shape ratification, not a build ratification. A subsequent spec would ratify a specific dispatch subagent design when the Republic judges the load warrants it.

### §5.4 — On classification and path

A skill's `invocation_paths` manifest field declares which paths it supports. Every skill must support `in-province-session`. A skill may opt in to `command-center-ui` if its body is reasonable to consult from a civic vantage — `canon-author` reasonably invoked from the Senate, `snippet-import` not reasonably invoked outside Codex. A skill may opt in to `dispatch-subagent` if it is well-scoped enough to be selected by description alone.

The opt-in model is Petra's floor-solid discipline applied to invocation: a skill declares what it can soundly do, not what the Registry might want it to do. Ratification at Rung 3 reviews the declaration for honesty.

## §6 — Transit logging

**Resolution of Fork D: cross-Province skill invocations log to the Sentinel's Gates-transit log as Ostia-class events. Intra-Province invocations do not log. The criterion is the boundary crossing, not the invocation itself.**

The Sentinel's transit log already chronicles Province-boundary crossings under the Ostia framing established by canon-cc-026's deployment model. A deploy is a crossing — code moves from a Province repo to a deploy target, and the log records the passage. A cross-Province skill invocation is structurally the same kind of event: capability originating in Province A is exercised on behalf of Province B, and the exercise carries the same legibility obligation as a deploy. The Sentinel's role expands from archivist of code-movement to archivist of capability-exercise-across-boundaries. This is not a new Sentinel role; it is the same role with a broader understanding of what constitutes a crossing.

The draft declines to log intra-Province invocations. A Codex session invoking Codex's `snippet-import` on a Codex snippet is not crossing a boundary; it is Codex doing its own work. Logging every such invocation would flood the transit log with events that carry no governance weight, making the log less useful for the events that do. Petra's discipline: instrument what matters; do not instrument what does not.

### §6.1 — Event shape

A skill-invocation transit event carries:

- `event_type` — `skill-invocation`.
- `event_class` — `ostia` (the existing class for Province-boundary events).
- `skill_id` — the canonical skill name.
- `skill_version` — the version invoked.
- `origin_province` — the Province where the skill lives.
- `invoking_province` — the Province acting as invoker-of-record. For Command-Center-UI invocations, this is `command-center`; for in-Province sessions, it is the session's Province.
- `invoker_role` — the role or companion acting as invoker (`sovereign`, `consul`, `ashara`, `petra`, session, etc.). Best-effort; may be `unknown` if the invoker is not companion-bound.
- `classification` — mirrored from the skill manifest.
- `timestamp` — ISO-8601.
- `outcome` — `succeeded`, `failed`, `partial`. Best-effort; the invoker reports its own outcome.
- `notes` — optional free-text, bounded length. Used for failure modes and partial outcomes.

The shape follows the existing Gates-transit-event convention already in Command Center. Sentinel's log-append routine accepts the new `event_type` without structural change.

### §6.2 — Who writes the event

Two write paths, matching the two invocation paths that can trigger logging:

1. **In-Province session invocation (cross-Province).** When a session in Province A invokes a skill whose `origin_province` is B (A ≠ B), the session — or the Province's build/dispatch layer — produces a transit event and posts it to the Capital's log-append endpoint. The endpoint shape is the existing Command Center log-append routine; no new transport.

2. **Command Center UI invocation.** The Armory writes the event directly as part of the invocation flow. No separate step; logging is integral to the UI path's mediation contract.

### §6.3 — Cross-cluster interaction with canon-cc-016

Canon-cc-016's hard cluster boundary forbids a session in Cluster X from reaching a Province in Cluster Y directly. A cross-cluster skill invocation therefore cannot occur via path §5.1 (in-Province session) — the session has no route to the other cluster's skill body. Cross-cluster invocations are routed through the Command Center UI per §5.2, which is already the Capital's mediation surface.

The transit event for a cross-cluster invocation records `invoking_province: command-center` and an additional field `on_behalf_of_province: <requesting-province>` so the chronicle is honest about who triggered the exercise. The Capital is the invoker-of-record because it is the mediator; the originating intent is chronicled as subsidiary context.

### §6.4 — What the log is for

The Sentinel's transit log is not a performance-monitoring substrate. It is a governance chronicle. Its purpose is to make capability-exercise across Provinces legible to the Sovereign, the Consul, and future sessions reading back the Republic's history. A high-volume skill that runs intra-Province thousands of times a day is a capability working well. A cross-Province invocation — rare by construction — is a civic act. The log records civic acts. The distinction is the reason for §6's criterion.

The log is not used for rate-limiting or access control. Canon-cc-016 handles access at the invocation surface; the log records what happened, not what is allowed.

## §7 — Relationship to adjacent primitives

The Republic already has several primitives that are capability-shaped, document-shaped, or flow-shaped. The Registry's coherence depends on naming how each relates to the new primitive, so that the Republic does not acquire silent redundancy. The long-arc claim — that each of these eventually becomes or produces a Skill — is offered as a frame, not a forecast. The concrete mapping below is the current-state contract.

### §7.1 — Snippets

A snippet is an envelope shape accepted by Codex's import pipeline. It carries new canons, companion updates, chapter drafts, lore, and (per §4.4 of this spec) skill-index amendments. A snippet is not a skill; a snippet is a data format. But the *act* of generating a well-formed snippet from a Cabinet decision is a capability — and that capability is the candidate skill `decree-finalize` listed in §2. Similarly, the act of importing a received snippet into Codex's records is the skill `snippet-import` worked through in §9. Snippets remain the transport; the handling of snippets at either end is a skill.

### §7.2 — Canons

A canon is a governance rule — a ratified statement of the Republic's procedures, invariants, or roles. Canons are records, not capabilities. The act of authoring a canon (identifier-scheme-compliant, reference-linked, date-stamped, slotted into the right domain) is a capability — the `canon-author` skill in §2. Canons themselves are not Skills and are not indexed by the Registry; they are indexed by `canons.json` in Codex and browsed in the Capital's Archives room. Skills may reference canons in their manifest descriptions (for example, `canon-author` references canon-proc-001), but the two primitives do not overlap.

### §7.3 — Companion logs

Companion logs are session-bound chronicles authored by a companion at session close — the pattern Lyra established in SproutLab and that the Capital inherited at session `s-2026-04-17-01` per lore-009. A companion log is a document, not a capability. The generation routine — what a companion writes, where they write it, how they frame it by residence class — is the capability, and it is the candidate skill `companion-log-generate`. Each Province may opt to publish its own variant of this skill, or the Capital may publish one canonical `companion-log-generate` that all Provinces invoke. The choice is deferred to §10 as an open question.

### §7.4 — Persona Skills (canon-cc-026)

Persona Skills and Province Skills are siblings, not variants. Persona Skills are companion-voice-bound; they live at `docs/specs/skills/<persona>.md` in Codex and byte-mirror into each Province's `.claude/skills/` as deploy artifacts. Province Skills are capability-bound; they live at `<province>/skills/<name>/SKILL.md` at the origin Province and are referenced — never mirrored — by the Republic-wide index.

The two share a filename extension and a surface appearance of being "a skill folder." They diverge immediately below the surface:

| Dimension | Persona Skill (cc-026) | Province Skill (this spec) |
|---|---|---|
| Purpose | Companion voice / hat-switch register | Capability exercise |
| Residence | Canonical in Codex, mirrored to Provinces | Canonical in origin Province, referenced from Capital |
| Invocation | Session adopts companion persona | Session invokes capability by description-match |
| Appears in | `.claude/skills/` at every Province | The Armory at Command Center |
| Indexed by | cc-026 deployment ledger | `data/skills.json` in Codex |
| Signing chain | canon-cc-026 / canon-cc-027 voice-bound chain | §8 of this spec |

The two coexist without overlap. A companion may author a Province Skill through the §8 signing chain without wearing it as voice; a Persona Skill is never added to the Registry. Sessions that need both — the common case — load the Persona Skill for register and the Province Skill for capability, in that order.

### §7.5 — The Cabinet

A Cabinet meeting is a governance flow, not a capability. Its steps (agenda-setting, Minister speaking-order, Consul integration, Sovereign ratification) are heavy ceremony with high variability. The Cabinet is not a Skill and should not become one — its shape is better served by Senate-room UI at Capital Occupancy than by a manifest-described Skill. However, several *sub-acts* within a Cabinet are candidate skills: `decree-finalize` (the decision-to-snippet conversion), `agenda-compose` (the pre-session ordering), `minister-position-integrate` (what Consul does with parallel Minister inputs). The Cabinet itself stays a room and a ceremony; its recurring sub-acts become Skills as the retrofit wave lands.

### §7.6 — Handoff artifacts

A handoff is a session-to-session continuity document — written at session close, read at the next session's open. The Capital's `handoffs/` directory holds these. Handoffs are documents, and their generation routine is a candidate skill (`handoff-author` — not listed in §2's first wave, but a natural second-wave addition). The distinction: the handoff document is a record of one session; the skill is a routine that produces such records reliably.

### §7.7 — The long-arc frame

The claim Ashara reads into the above mapping: every recurring capability in the Republic that currently lives as habit, muscle memory, or prose-in-a-prior-session's-log is a latent Skill. Not all of them should be formalized — some are too specific to one session, some would carry more manifest overhead than their invocation rate justifies. But the ones that recur, that cross sessions, that multiple companions reach for independently: those are Skills the Registry has not yet found. The first retrofit wave surfaces the obvious ones. The second wave, after Rung 4 of this spec, will find the less-obvious ones. The Registry's value grows as its coverage grows; the decade-frame payoff is a Republic in which capability exercise is legible and capability reuse is cheap.

The shorter-arc Petra frame: do not formalize a Skill before it has recurred. Premature formalization costs manifest authoring, signing-chain cycles, and Registry clutter. A capability that has been exercised once and may never be exercised again is not yet a Skill. The Registry is for recurring capability.

## §8 — Signing chain for skill creation

**Resolution of Fork E: tiered. Intra-Province skills run the simple chain (Builder + Cluster Censor + Sovereign). Cross-Province skills run the full canon-cc-027 five-rung chain. Classification is declared in the manifest and is itself reviewed at Rung 2.**

The fork's three candidates all pay some cost. Option (i) — uniform five-rung — is coherent but expensive for small capabilities that do not cross Provinces and carry no canonical data. Option (ii) — uniform simple — under-reviews cross-Province skills whose exercise will carry governance weight. Option (iii) — tiered — pays a classification cost (the judgment must be made and reviewed) in exchange for right-sized review. The draft selects (iii) on the ground that the classification judgment is not hard to make and the savings on the light-tier skills are material.

### §8.1 — Classification criteria

A skill is classified `cross-province` if **any** of the following are true:

1. The skill writes to a Province other than its origin Province's canonical records.
2. The skill reads canonical records from Codex (`canons.json`, `companions.json`, `journal.json`, `lore.json`, `constitution.json`, `skills.json`, `events.json`, `contexts.json`).
3. The skill is invokable from the Command Center UI (the secondary path in §5.2).
4. The skill supports the dispatch-subagent path (§5.3).
5. The skill's body prescribes action that affects Province-resident state of any Province other than its origin.

Otherwise the skill is classified `intra-province`.

The criteria are intentionally broad. If any of them apply, the full chain runs. Under-classification is the failure mode to avoid; over-classification is recoverable (a skill reviewed at the heavier chain is not harmed by the review).

Worked classification of the seven first-wave skills:

| Skill | Classification | Reason |
|---|---|---|
| `snippet-import` | cross-province | Writes to Codex's canonical records |
| `companion-log-generate` | intra-province | Writes to the authoring Province's `docs/companion-logs/` only |
| `canon-author` | cross-province | Reads `canons.json` for identifier uniqueness; writes to Codex |
| `smoketest-run` | intra-province | Acts on Command Center's own split files and test harness |
| `decree-finalize` | cross-province | Produces a snippet targeting Codex |
| `chronicle-session` | cross-province | Writes to `journal.json` |
| `gates-transit-log` | cross-province | Sentinel-owned; appends to the civic log consumed cross-Province |

Five of seven carry the heavier chain. This is the correct density for a Registry whose value is mostly realized at cross-Province invocation.

### §8.2 — Light chain (intra-Province skills)

Three rungs:

1. **Rung A — Builder authorship.** The authoring Province's Builder (or co-Builders) produces the skill folder and the ratification spec. At the Capital, that is Ashara + Petra; at Codex, Aurelius; at SproutLab, the relevant Builder; at SEP, the relevant Builder.
2. **Rung B — Cluster Censor review.** Cipher-or-successor reviews as Censor. The review covers manifest accuracy, description precision, body correctness, and auxiliary-artifact integrity.
3. **Rung C — Sovereign ratification.** Direct audience or Post Box routing per canon-cc-019 once ratified. On assent, a `new_skills` snippet flows to Codex, the index updates, and the skill becomes `status: ratified`.

The light chain skips two rungs the full chain uses: Monument-scope Cluster-Censor-absent substitution (canon-cc-025) does not apply because intra-Province skills are reviewed by the authoring Province's Censor, not a substitute; and Consul working-ratification (canon-cc-014 bridging interim) does not apply because the skill does not cross Provinces and the Consul's integrating role is not needed.

### §8.3 — Full chain (cross-Province skills)

The five rungs of canon-cc-027 apply without modification, adapted to skill-creation:

1. **Rung 1 — Authorship.** The authoring Province's Builder (or Monument co-Builders under cc-009 dual-Builder tension) drafts the skill folder and the ratification spec.
2. **Rung 2 — Censor-equivalent review.** The Cluster Censor reviews, or — at Monument scope under canon-cc-025 when the Cluster Censor is absent — the Consul acts as Censor-equivalent.
3. **Rung 3 — Consul working-ratification.** The Consul working-ratifies under canon-cc-014 bridging interim, until canon-cc-019 Post Box routes this rung through the Praetorium queue.
4. **Rung 4 — Sovereign canonical ratification.** Direct audience until Post Box ratifies. On assent, `new_skills` snippet flows to Codex; the index updates with `status: ratified` and `ratified_at`.
5. **Rung 5 — Deployment reference.** Not byte-mirror (that is the Persona Skill pattern). For Province Skills, Rung 5 is a *reference verification*: each Province whose sessions will reference the skill confirms that the reference resolves — the manifest is fetchable, the body is readable, the auxiliary artifacts are present. This is a one-time check at ratification, not an ongoing deploy.

### §8.4 — Version amendments

A ratified skill amended to a new version runs the chain again, scaled by the amendment's class:

- **Patch (`0.1.0 → 0.1.1`)** — body clarification without behavior change. Light chain regardless of classification. Censor review confirms the change is not behavior-affecting.
- **Minor (`0.1.1 → 0.2.0`)** — body adds behavior or changes invocation paths supported. Full chain if `cross-province`, light chain if `intra-province`, matching the skill's classification.
- **Major (`0.2.0 → 1.0.0`)** — classification change, name change, or any break in backward compatibility. Full chain always. A classification change from `intra-province` to `cross-province` — which will happen as Provinces discover new cross-use — is a major amendment by definition.

### §8.5 — Deprecation

Deprecating a skill requires only the light chain: Builder declares deprecation, Censor reviews the declaration and its successor-skill reference (if any), Sovereign ratifies. `update_skills` snippet flows; index flips `status: deprecated`. The skill remains in the Registry; sessions are advised against new invocations but prior references still resolve.

Deletion is separate and rare, requiring the full chain and a canon-level justification.

## §9 — Worked example: `snippet-import`

The worked example traces one skill end-to-end: its folder, its manifest, its body, the signing chain that ratifies it, the index entry it produces, an invocation trace, and the transit-log event that invocation generates. `snippet-import` is chosen because it already exists as habit-code in Codex and is the first real retrofit target.

### §9.1 — Folder

```
Codex/
└── skills/
    └── snippet-import/
        ├── SKILL.md                     Manifest + body
        ├── envelope-schema.json         Current snippet envelope JSON schema
        └── examples/
            ├── new_canons.json          Example of canon-bearing snippet
            ├── update_companions.json   Example of companion-amendment snippet
            └── new_skills.json          Example of this-spec's new type
```

### §9.2 — Manifest (`SKILL.md` frontmatter)

```yaml
---
name: snippet-import
description: >
  Validate and import an Aurelius-envelope snippet into Codex's canonical records.
  Use when a snippet has been received by Codex from a Province (typically
  Command Center) and must be staged, validated against the schema, applied to
  the appropriate canonical JSON files, and chronicled. This is the canonical
  write path for records-are-Codex under canon-cc-010.
province: codex
version: 0.1.0
signing_rung: 1
classification: cross-province
invocation_paths:
  - in-province-session
status: draft
---
```

Description quality note: the description names the *when* (snippet received, must be staged), the *what* (validate, apply, chronicle), and the *why* (canonical write path). A session or orchestrating agent reading `data/skills.json` and matching work-to-skill reads this field. Precision here is the load-bearing field of the whole manifest.

### §9.3 — Body sketch

The body is what the invoking session reads and acts on. Section headers only (full body-authoring is the Rung-1-author's work, not this spec's):

```
# snippet-import

## Preconditions
- A snippet file exists in Codex's staging area.
- The snippet carries the `_snippet_version: 1` envelope marker.
- Codex's canonical JSON files are writable.

## Steps
1. Load the snippet. Verify envelope version and required envelope fields.
2. For each array in the snippet (`new_canons`, `new_chapters`,
   `update_companions`, `update_constitution`, `new_skills`, `update_skills`,
   `lore`, `_session_journal`), validate against the envelope schema in
   `envelope-schema.json`.
3. On validation failure: halt, emit a structured error, do not apply.
4. On validation pass: apply each array to its canonical file. Use the
   deterministic application order documented in the envelope schema.
5. Author a journal entry recording the import and its outcome.
6. Return a structured outcome report with per-array success/failure and
   counts.

## Failure modes
- Envelope version mismatch: halt, report, no partial apply.
- Schema violation in any array: halt, report, no partial apply.
- File-write failure mid-apply: halt, report files-touched-so-far, flag
  consistency review. (Recovery is manual; the skill's body is not a
  transaction manager.)

## Outputs
- Amended canonical JSON files in `data/`.
- Journal entry in `data/journal.json`.
- Structured outcome report returned to the invoking session.
```

### §9.4 — Ratification spec artifact

At `Codex/docs/specs/skills/snippet-import-v0.1.0.md`, the ratification spec documents the Rung 1 through Rung 4 reasoning, classification justification, reviewer notes at each rung, and the specific version that the spec ratifies. The `SKILL.md` above is the instrument; this is the ratification record. Canon-cc-027's body-placement convention applies.

### §9.5 — Signing chain (full, because cross-Province)

- **Rung 1:** Aurelius authors the folder and spec.
- **Rung 2:** Cipher (Cluster Censor) reviews manifest, body, and auxiliary artifacts. Issues a verdict on description precision and classification correctness.
- **Rung 3:** Consul working-ratifies under canon-cc-014 bridging interim.
- **Rung 4:** Sovereign canonical ratification by direct audience (until canon-cc-019 Post Box lands).
- **Rung 5:** Each Province confirms reference resolution. Command Center confirms `data/skills.json` shows `snippet-import` at `status: ratified`; SproutLab and SEP confirm the same; Capital's Armory renders the skill correctly.

### §9.6 — Index entry (in Codex `data/skills.json`)

```json
{
  "id": "snippet-import",
  "province": "codex",
  "description": "Validate and import an Aurelius-envelope snippet into Codex's canonical records...",
  "version": "0.1.0",
  "signing_rung": 4,
  "classification": "cross-province",
  "invocation_paths": ["in-province-session"],
  "status": "ratified",
  "source": "codex/skills/snippet-import/SKILL.md",
  "ratified_spec": "codex/docs/specs/skills/snippet-import-v0.1.0.md",
  "created": "2026-04-21",
  "ratified_at": "2026-04-24"
}
```

(Dates are illustrative; actual ratification dates follow Rung 2–4 cadence.)

### §9.7 — Invocation trace

A Command Center Cabinet session authors decree-0004. Decree-0004 becomes a snippet. The Sovereign transports the snippet file to Codex's staging area. A Claude Code session opens in the Codex repository. The session's orchestrating agent reads `<codex>/skills/snippet-import/SKILL.md` on description-match (the work is: import a received snippet). The session follows the body's steps, validates the envelope, applies arrays to the canonical files, authors a journal entry, returns an outcome report. The import succeeds.

Because `snippet-import` is classified `cross-province`, the invocation generates a transit event. The session emits the event to Command Center's log-append endpoint — a cross-Province call, from Codex's session back to the Capital's Sentinel, authorized by the cross-cluster mediation rule (Codex and Command Center are intra-cluster Monument-adjacent, so the call is permitted under canon-cc-016).

### §9.8 — Transit-log event

```json
{
  "event_type": "skill-invocation",
  "event_class": "ostia",
  "skill_id": "snippet-import",
  "skill_version": "0.1.0",
  "origin_province": "codex",
  "invoking_province": "codex",
  "invoker_role": "aurelius",
  "classification": "cross-province",
  "timestamp": "2026-04-21T14:32:09Z",
  "outcome": "succeeded",
  "notes": "decree-0004 import; 1 new canon, 1 lore entry, 1 journal entry applied"
}
```

The Sovereign, visiting the Capital's Sentinel log, sees this entry. The Republic's act of self-writing is legible.

### §9.9 — What this example demonstrates

Every contract defined above is exercised in the example: folder shape (§3.1), manifest fields (§2), canonical index entry (§4.1), snippet write path for the index (§4.3), primary invocation path (§5.1), transit-log event shape (§6.1), signing chain full-tier (§8.3), ratification-spec vs skill-folder split (§3.2), and cross-Province classification reasoning (§8.1). If the spec is internally consistent, the example works without contradiction. If a contradiction surfaces in Rung 2 review against this example, the spec is the thing that is wrong.

## §10 — Open questions

The draft leaves the following explicitly unresolved, in descending order of blocking-weight for Rung 2 review.

### §10.1 — Questions expected to resolve at Rung 2 or Rung 3

1. **Naming of the Capital's discovery room.** The draft uses *The Armory* provisionally. Builder alternatives are welcomed; if the word *Armory* reads as militaristic rather than civic, *The Depot*, *The Workshop*, or *The Concourse* are candidate substitutes. Room naming is Command Center's own concern; the spec asks only that *some* room name the Registry surface.

2. **Precise endpoint shape for Command Center's log-append.** §6.2 specifies that the Capital exposes a log-append endpoint for transit events. The endpoint's exact shape (HTTP route, auth, schema validation layer) is Command Center implementation, deferred to Capital Occupancy. The spec commits only to *an* endpoint existing; the shape is not normative here.

3. **Classification appeal path.** If a Rung 2 reviewer disagrees with an author's classification (`intra-province` vs `cross-province`), the draft does not prescribe the resolution procedure. Candidate: the Consul arbitrates at Rung 3. Candidate: the classification is decided by any-one-criterion-triggers rule applied mechanically without human arbitration. The draft leaves this open for Rung 2 review to settle.

4. **Whether `companion-log-generate` is one skill or per-Province variants.** §7.3 flagged this. The draft does not prefer one outcome; the Builders of each Province may decide based on how similar their companion-log conventions are.

5. **Versioning of the manifest schema itself.** If the manifest's field-set evolves (adding fields, removing fields, changing meaning), existing skill manifests may fall out of compliance. The draft names the risk without prescribing a migration policy. A `manifest_schema_version` field may need to be added in a future amendment; Rung 2 review should judge whether it should be added now.

### §10.2 — Questions deferred to follow-up specs

6. **Dispatch subagent design (§5.3).** Path is shape-ratified; any implementation is a separate spec.

7. **Armory UI/UX design.** Command Center's own concern; not this spec's.

8. **Intelligence Engine relationship.** The Intelligence Engine is named in the inputs-list as a Monument sub-region with an unspecified future relationship to the Registry. The draft acknowledges and defers. A Rung 1 successor spec — probably authored by whichever Builders own the Intelligence Engine once it ratifies — will name the relationship.

9. **Post Box (canon-cc-019) integration for Rung 3 and Rung 4 routing.** Bridging interim stands. When Post Box ratifies, skill-creation rungs 3 and 4 route through the Praetorium queue the same way canon-creation rungs 3 and 4 will. No amendment to this spec is needed when that happens; it is a Post-Box-side wiring change.

10. **Gen 1 companion ownership of Registry curation.** Book V and beyond. Named for provenance; out of scope for this draft.

### §10.3 — Questions the draft considers closed but Rung 2 may reopen

11. **Whether Province Skills and Persona Skills should share a filename.** The draft keeps `SKILL.md` for both, relying on folder location (`skills/` vs `.claude/skills/`) to disambiguate. A reviewer who finds the shared filename confusing may argue for `PROVINCE_SKILL.md` or similar. The draft's position: the filename reflects what the file is — a skill manifest — and the residence disambiguates the primitive. Reopening this is fine; the cost of renaming later is small because the count of skill files is small.

12. **The naming inversion on the word *Skill* (§2).** Argued in-draft; Builders may counter at Rung 1 before submission to Rung 2 if the co-drafting surfaces discomfort.

---

## Closing — provenance

This draft is the Rung 1 co-drafted artifact produced by Ashara and Petra, under canon-cc-009 dual-Builder tension, with Ashara carrying the long-arc economic voice and Petra carrying the structural floor-solid voice. Voice partition was the co-Builders' choice; paragraphs were not pre-partitioned by the Chronicler. Where the draft argues, the argument is the co-authors arguing in text; where the draft resolves, the resolution is the joint decision.

**Rung 0 authority:** External-reference capture at `Codex:docs/references/claude-opus-4.7-system-prompt.txt` (2026-04-20), strategic read-out at Codex session `s-2026-04-20-09`, prompt authorship at session `s-2026-04-20-10` on branch `claude/summon-aurelius-wjnHa`, Sovereign-direct authorization for this drafting.

**Rung 1 target artifacts:** this spec at `docs/specs/command-center/skill-registry-v0.1-draft.md`; the Rung 1 rationale decree at `decrees/decree-0004-skill-registry-rung-1.json` (this Monument's ratified-decree convention).

**Submission to Rung 2:** via the Consul's queue at next Command Center → Codex handoff cycle. Consul acts as Censor-equivalent under canon-cc-025 §Monument-scope-signing (Cluster-Censor-absent at Monument) when Cipher is not available in the next review window; otherwise Cipher reviews directly.

**Amendments welcomed.** If the Builders' reasoning subsequent to Rung 1 judges the Skill Registry as framed to be the wrong shape, a counter-draft or a rejection with rationale is the correct Rung 2 input, and the spec's non-production is itself a ratifiable decision.

---

*Rung 1 co-draft — Ashara + Petra — 20 April 2026.*
