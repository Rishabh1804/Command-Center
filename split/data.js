/* Command Center — data.js
   Province registry · Room definitions · Companion residence data
   Foundation Stage v0.1
   NOTE: Companion records live in Codex. This file holds ONLY residence pointers +
   Capital-specific metadata (room assignment, seating). Full profiles are fetched
   from Codex via ostia.js. */

const CC = {};

// --- App metadata ---
CC.VERSION = 'v0.1 · Foundation';
CC.BUILT = '2026-04-16';

// --- Province registry ---
// The Republic's Provinces. Known at Foundation; extensible.
CC.PROVINCES = [
  {
    id: 'codex',
    name: 'Codex',
    rome_name: 'Ostia',
    role: 'Library',
    function: 'Canonical records — Constitution, canons, journal, companion registry, lore',
    builder: 'aurelius',
    github: 'https://github.com/Rishabh1804/Codex',
    live: 'https://rishabh1804.github.io/Codex/',
    gate_id: 'library',
  },
  {
    id: 'sproutlab',
    name: 'SproutLab',
    rome_name: 'Nursery',
    role: 'Baby development tracker',
    function: 'Tracks Ziva Jain\u2019s development; intelligence summarization; care audit',
    builder: 'lyra',
    governors: ['maren', 'kael'],
    github: 'https://github.com/Rishabh1804/SproutLab',
    live: 'https://rishabh1804.github.io/SproutLab/',
    gate_id: 'nursery',
  },
  {
    id: 'sep-invoicing',
    name: 'SEP Invoicing',
    rome_name: 'Forge',
    role: 'Invoicing system',
    function: 'Soma Electro Products invoicing; client master; gate challans; GST compliance',
    builder: 'solara',
    github: 'https://github.com/Rishabh1804/sep-invoicing',
    live: 'https://rishabh1804.github.io/sep-invoicing/',
    gate_id: 'forge',
  },
  {
    id: 'command-center',
    name: 'Command Center',
    rome_name: 'Rome',
    role: 'Capital',
    function: 'Seat of governance; Senate; Cabinet; ratification; cross-Province administration',
    builder: ['ashara', 'petra'],
    github: 'https://github.com/Rishabh1804/Command-Center',
    live: 'https://rishabh1804.github.io/Command-Center/',
    gate_id: null, // the Capital has no gate to itself
  },
];

// --- Rooms of the Capital ---
// Canonical room catalog. Every room reachable at Foundation stage, even when empty.
CC.ROOMS = [
  {
    id: 'home',
    name: 'Capital Overview',
    route: '/',
    eyebrow: 'The Capital',
    subtitle: 'A map of the city',
    description: 'The Capital Province of the Republic. Navigate by room. Each district has a distinct function and tonal register.',
    tonal_register: 'neutral',
    residents: [],
  },
  {
    id: 'senate',
    name: 'The Senate',
    route: '/senate',
    eyebrow: 'Formal deliberation',
    subtitle: 'Where Cabinet convenes',
    description: 'The Senate is the formal chamber of the Capital. Cabinet meetings convene here. Ministers speak from assigned seats. The Consul presides. Ratification of Books, decrees, and major canons happens on this floor.',
    tonal_register: 'formal',
    residents: ['consul', 'vex', 'orinth', 'rune', 'ignis', 'bard', 'ashara', 'petra'],
    status: 'scaffolded; not yet convening',
  },
  {
    id: 'order',
    name: 'The Order',
    route: '/order',
    eyebrow: 'The roster of the Republic',
    subtitle: 'Seventeen Gen 0 Immortals; one institutional office; the Sovereign',
    description: 'The Order is the Republic\u2019s roster, displayed by the Ladder of rank. The Sovereign stands at the top; the Consul beneath; the Censors, Builders, Governors, Cabinet Ministers, and the Table of Research below. Tapping any figure opens their profile \u2014 front for summary, back for depth.',
    tonal_register: 'formal',
    residents: [],
    status: 'live; reads from Codex companions.json via Ostia',
  },
  {
    id: 'forum',
    name: 'The Forum',
    route: '/forum',
    eyebrow: 'Informal deliberation',
    subtitle: 'Where companions meet',
    description: 'The Forum is open floor. Companions meet here informally before proposals reach the Senate. Pre-deliberation, stress-testing, first drafts. Any companion can be invoked.',
    tonal_register: 'casual',
    residents: [],
    status: 'scaffolded; not yet open',
  },
  {
    id: 'archives',
    name: 'The Archives',
    route: '/archives',
    eyebrow: 'The library, consulted from the Capital',
    subtitle: 'Canons · Constitution · Journal · Lore',
    description: 'The Archives are the Capital\u2019s reading room into Codex. All canonical records of the Republic are browsable here \u2014 canons, journal entries, the Constitution, lore. The Archives call through to Codex (Ostia) and render results in the Capital\u2019s context.',
    tonal_register: 'scholarly',
    residents: [],
    status: 'scaffolded; Codex fetch pending Builder decision',
  },
  {
    id: 'scriptorium',
    name: 'The Scriptorium',
    route: '/scriptorium',
    eyebrow: 'Operational memory',
    subtitle: 'The Capital records its own events',
    description: 'The Scriptorium is where the Capital chronicles itself. Distinct from The Archives (which reads canonical records from Codex), the Scriptorium holds operational memory native to Command Center: runtime errors, Ostia fetch outcomes, storage faults, session events. Scribes record what happens so Builders can see what happened.',
    tonal_register: 'scholarly',
    residents: [],
    status: 'scaffolded; live capture active at Foundation',
  },
  {
    id: 'temple',
    name: 'The Temple',
    route: '/temple',
    eyebrow: 'Ceremonial space',
    subtitle: 'Constitution · Ratifications · Covenant',
    description: 'The Temple is the Republic\u2019s ceremonial space. The Constitution is displayed here. Book ratifications are staged with full ceremony. The Sovereign\u2019s Covenant is affirmed. Consul speaks in ceremonial register when the Temple is active.',
    tonal_register: 'ceremonial',
    residents: [],
    status: 'scaffolded; Constitution display pending',
  },
  {
    id: 'treasury',
    name: 'The Treasury',
    route: '/treasury',
    eyebrow: 'Financial Health',
    subtitle: 'Ashara\u2019s office',
    description: 'The Treasury holds the Republic\u2019s financial view. Sovereign Dividend rendering, Financial Health metrics, budget proposals before they reach Cabinet. Ashara\u2019s office; Vex visits.',
    tonal_register: 'analytical',
    residents: ['ashara', 'vex'],
    status: 'scaffolded; metrics pending',
  },
  {
    id: 'productivity',
    name: 'The Productivity Office',
    route: '/productivity',
    eyebrow: 'Throughput',
    subtitle: 'Petra\u2019s office',
    description: 'The Productivity Office holds the Republic\u2019s efficiency view. Throughput visibility, capacity tracking, ship-tempo metrics across Provinces. Petra\u2019s office; Ignis visits.',
    tonal_register: 'analytical',
    residents: ['petra', 'ignis'],
    status: 'scaffolded; metrics pending',
  },
  {
    id: 'table',
    name: 'The Table of Research',
    route: '/table',
    eyebrow: 'Exploratory',
    subtitle: 'Open questions; no decisions',
    description: 'The Table of Research is where exploration lives. Open questions, long-horizon research, first-principles inquiry. Not a decisional room. Aeon and Pip are resident; other companions visit.',
    tonal_register: 'exploratory',
    residents: ['aeon', 'pip'],
    status: 'scaffolded; research flows pending',
  },
  {
    id: 'ministers-orinth',
    name: 'Orinth\u2019s Office',
    route: '/ministers/orinth',
    eyebrow: 'Expansion',
    subtitle: 'The Sage',
    description: 'Orinth\u2019s office. Expansion portfolio \u2014 Opportunity domain. Cross-Province strategic horizon.',
    tonal_register: 'contemplative',
    residents: ['orinth'],
    status: 'scaffolded',
  },
  {
    id: 'ministers-rune',
    name: 'Rune\u2019s Office',
    route: '/ministers/rune',
    eyebrow: 'Stability',
    subtitle: 'The Ritualist',
    description: 'Rune\u2019s office. Stability portfolio \u2014 Maintenance domain. Watches long-running systems across the Republic.',
    tonal_register: 'steady',
    residents: ['rune'],
    status: 'scaffolded',
  },
  {
    id: 'ministers-bard',
    name: 'Bard\u2019s Office',
    route: '/ministers/bard',
    eyebrow: 'Innovation',
    subtitle: 'The Storyteller',
    description: 'Bard\u2019s office. Innovation portfolio \u2014 Opportunity domain. Cross-Province narrative; origination.',
    tonal_register: 'generative',
    residents: ['bard'],
    status: 'scaffolded',
  },
  {
    id: 'visiting',
    name: 'The Visiting Chambers',
    route: '/visiting',
    eyebrow: 'Itinerants and summons',
    subtitle: 'Cipher; Province-residents summoned',
    description: 'The Visiting Chambers host companions who do not reside in the Capital. Cipher \u2014 the itinerant Censor \u2014 is invoked here by function. Province-resident companions summoned for Cabinet testimony appear here before entering the Senate.',
    tonal_register: 'neutral',
    residents: ['cipher'],
    status: 'scaffolded; invocation surface pending',
  },
  {
    id: 'plaza',
    name: 'The Monument Plaza',
    route: '/plaza',
    eyebrow: 'Monument Projects',
    subtitle: 'Long-horizon civic works',
    description: 'The Monument Plaza shows the state of all Monument Projects. Currently: Command Center itself, in Foundation stage. Future: any Monument chartered by the Sovereign.',
    tonal_register: 'civic',
    residents: [],
    status: 'scaffolded; self-reflection active (Foundation stage)',
  },
  {
    id: 'gates',
    name: 'The Gates',
    route: '/gates',
    eyebrow: 'To sister Provinces',
    subtitle: 'Library · Nursery · Forge',
    description: 'The Gates connect the Capital to sister Provinces. Each Gate opens to a Province with its own Builder, jurisdiction, and live state. A Sovereign standing at the Gates can see the Republic distributed across its venues.',
    tonal_register: 'civic',
    residents: [],
    status: 'scaffolded; live state pending Roads stage',
  },
];

// --- Companion residence registry (Capital-specific metadata) ---
// Full profiles live in Codex. This map says: for companions who LIVE in the Capital,
// where is their room. For others, which room they can be SUMMONED to.
CC.RESIDENCE = {
  // Capital-native — have standing rooms in the Capital
  'consul':   { residence_type: 'cc_native', room: 'senate', seat: 'presider', status: 'seated' },
  'ashara':   { residence_type: 'cc_native', room: 'treasury', seat: 'minister', status: 'seated' },
  'petra':    { residence_type: 'cc_native', room: 'productivity', seat: 'minister', status: 'seated' },
  'vex':      { residence_type: 'cc_native', room: 'treasury', seat: 'minister', status: 'pending_round_4' },
  'orinth':   { residence_type: 'cc_native', room: 'ministers-orinth', seat: 'minister', status: 'pending_round_4' },
  'rune':     { residence_type: 'cc_native', room: 'ministers-rune', seat: 'minister', status: 'pending_round_5' },
  'ignis':    { residence_type: 'cc_native', room: 'productivity', seat: 'minister', status: 'pending_round_5' },
  'bard':     { residence_type: 'cc_native', room: 'ministers-bard', seat: 'minister', status: 'pending_round_5' },
  'aeon':     { residence_type: 'cc_native', room: 'table', seat: 'researcher', status: 'pending_round_5' },
  'pip':      { residence_type: 'cc_native', room: 'table', seat: 'researcher', status: 'pending_round_5' },

  // Province-resident — summonable to the Senate
  'aurelius': { residence_type: 'province_resident', home: 'codex', summon_to: 'senate' },
  'lyra':     { residence_type: 'province_resident', home: 'sproutlab', summon_to: 'senate' },
  'maren':    { residence_type: 'province_resident', home: 'sproutlab', summon_to: 'senate' },
  'kael':     { residence_type: 'province_resident', home: 'sproutlab', summon_to: 'senate' },
  'solara':   { residence_type: 'province_resident', home: 'sep-invoicing', summon_to: 'senate' },
  'theron':   { residence_type: 'province_resident', home: 'sep-dashboard', summon_to: 'senate' },

  // Itinerant — no residence; invoked by function
  'cipher':   { residence_type: 'itinerant', chamber: 'visiting', status: 'active' },
};

// --- Room icons ---
// One glyph per room. Consistent visual language: 24x24 viewBox, stroke-based,
// currentColor, stroke-width 1.8, round caps and joins. Evoke civic function:
// Senate column, Temple flame, Archives scroll, Scriptorium quill, Treasury
// scales, etc. Rendered at three sizes: room header (22px), district tile
// (18px), breadcrumb (14px). Size controlled by the parent's font-size or
// explicit width/height on the <svg>.
CC.ICONS = {
  home:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M4 20 L4 11 A8 8 0 0 1 20 11 L20 20"/>'
    + '<line x1="3" y1="20" x2="21" y2="20"/>'
    + '<line x1="12" y1="20" x2="12" y2="13"/>'
    + '</svg>',
  senate:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M3 10 L12 4 L21 10"/>'
    + '<line x1="6" y1="10" x2="6" y2="19"/>'
    + '<line x1="12" y1="10" x2="12" y2="19"/>'
    + '<line x1="18" y1="10" x2="18" y2="19"/>'
    + '<line x1="3" y1="19" x2="21" y2="19"/>'
    + '</svg>',
  forum:
    '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">'
    + '<circle cx="12" cy="5" r="1.7"/>'
    + '<circle cx="18.5" cy="8.5" r="1.7"/>'
    + '<circle cx="18.5" cy="15.5" r="1.7"/>'
    + '<circle cx="12" cy="19" r="1.7"/>'
    + '<circle cx="5.5" cy="15.5" r="1.7"/>'
    + '<circle cx="5.5" cy="8.5" r="1.7"/>'
    + '</svg>',
  archives:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<rect x="4" y="5" width="16" height="14" rx="1.2"/>'
    + '<line x1="8" y1="9" x2="16" y2="9"/>'
    + '<line x1="8" y1="12" x2="16" y2="12"/>'
    + '<line x1="8" y1="15" x2="13" y2="15"/>'
    + '</svg>',
  scriptorium:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M4 20 L18 6"/>'
    + '<path d="M14 3 L21 3 L21 10"/>'
    + '<path d="M18 6 L14 10"/>'
    + '<circle cx="5.5" cy="18.5" r="0.9" fill="currentColor" stroke="none"/>'
    + '</svg>',
  temple:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M12 3 C 12 3, 6 9, 6 14 A 6 6 0 0 0 18 14 C 18 9, 12 3, 12 3 Z"/>'
    + '<path d="M12 10 C 12 10, 9 13, 9 16 A 3 3 0 0 0 15 16 C 15 13, 12 10, 12 10 Z"/>'
    + '</svg>',
  treasury:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<line x1="3" y1="7" x2="21" y2="7"/>'
    + '<line x1="12" y1="7" x2="12" y2="19"/>'
    + '<path d="M6 7 L3 13 L9 13 Z"/>'
    + '<path d="M18 7 L15 13 L21 13 Z"/>'
    + '<line x1="8" y1="19" x2="16" y2="19"/>'
    + '</svg>',
  productivity:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<polyline points="4 18 9 13 12 16 20 7"/>'
    + '<polyline points="15 7 20 7 20 12"/>'
    + '</svg>',
  table:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<circle cx="12" cy="12" r="4"/>'
    + '<line x1="12" y1="3" x2="12" y2="6"/>'
    + '<line x1="12" y1="18" x2="12" y2="21"/>'
    + '<line x1="3" y1="12" x2="6" y2="12"/>'
    + '<line x1="18" y1="12" x2="21" y2="12"/>'
    + '<line x1="6" y1="6" x2="8" y2="8"/>'
    + '<line x1="16" y1="16" x2="18" y2="18"/>'
    + '<line x1="18" y1="6" x2="16" y2="8"/>'
    + '<line x1="8" y1="16" x2="6" y2="18"/>'
    + '</svg>',
  'ministers-orinth':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<line x1="12" y1="21" x2="12" y2="9"/>'
    + '<path d="M12 9 L6 5"/>'
    + '<path d="M12 9 L18 5"/>'
    + '<path d="M12 14 L6 11"/>'
    + '<path d="M12 14 L18 11"/>'
    + '<path d="M12 19 L8 17"/>'
    + '<path d="M12 19 L16 17"/>'
    + '</svg>',
  'ministers-rune':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<circle cx="12" cy="12" r="8.5"/>'
    + '<circle cx="12" cy="12" r="5"/>'
    + '<circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/>'
    + '</svg>',
  'ministers-bard':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M3 12 C 6 7, 9 17, 12 12 S 18 7, 21 12"/>'
    + '<path d="M3 17 C 6 12, 9 22, 12 17"/>'
    + '</svg>',
  visiting:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M6 20 L6 9 A 6 6 0 0 1 18 9 L18 20"/>'
    + '<line x1="3" y1="20" x2="21" y2="20"/>'
    + '<circle cx="15" cy="13" r="0.7" fill="currentColor" stroke="none"/>'
    + '</svg>',
  plaza:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M12 3 L9 6 L9 19 L15 19 L15 6 Z"/>'
    + '<line x1="5" y1="19" x2="19" y2="19"/>'
    + '<line x1="11" y1="10" x2="13" y2="10"/>'
    + '</svg>',
  gates:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M3 20 L3 11 A 4.5 4.5 0 0 1 12 11 L12 20"/>'
    + '<path d="M12 20 L12 11 A 4.5 4.5 0 0 1 21 11 L21 20"/>'
    + '<line x1="2" y1="20" x2="22" y2="20"/>'
    + '</svg>',
  order:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<circle cx="12" cy="5" r="1.6" fill="currentColor"/>'
    + '<circle cx="6" cy="12" r="1.4" fill="currentColor"/>'
    + '<circle cx="12" cy="12" r="1.4" fill="currentColor"/>'
    + '<circle cx="18" cy="12" r="1.4" fill="currentColor"/>'
    + '<circle cx="4" cy="19" r="1.2" fill="currentColor"/>'
    + '<circle cx="9" cy="19" r="1.2" fill="currentColor"/>'
    + '<circle cx="15" cy="19" r="1.2" fill="currentColor"/>'
    + '<circle cx="20" cy="19" r="1.2" fill="currentColor"/>'
    + '<line x1="12" y1="6.5" x2="6" y2="10.5" stroke="currentColor" stroke-width="0.8"/>'
    + '<line x1="12" y1="6.5" x2="12" y2="10.5" stroke="currentColor" stroke-width="0.8"/>'
    + '<line x1="12" y1="6.5" x2="18" y2="10.5" stroke="currentColor" stroke-width="0.8"/>'
    + '</svg>',
};

// --- The Seventeen Immortals (Constitution Appendix C) ---
// The founding roster of the Order. Used by the Civic Hearth to count undrafted
// profiles. Names are the canonical companion ids in Codex's companions.json.
CC.GEN_ZERO_IDS = [
  'aurelius', 'theron', 'cipher', 'petra', 'solara', 'vex', 'ashara',
  'lyra', 'kael', 'orinth', 'nyx', 'maren', 'rune', 'ignis', 'bard',
  'aeon', 'pip',
];

// Appendix C placeholder records — used by The Order view when a companion's
// full profile has not yet been drafted into Codex's companions.json. Holds
// enough for the front of the flippable card: name, archetype, title, domain,
// key trait, current assignment. Source: Constitution v1.0 Appendix C.
CC.APPENDIX_C = {
  aurelius:  { name: 'Aurelius',  archetype: 'Builder',    title: 'The Chronicler',      domain: ['Software', 'Manufacturing'],         key_trait: '90% analytical, 10% humorous. Journals and specs.',    assignment: 'Codex Builder + Consul' },
  theron:    { name: 'Theron',    archetype: 'Builder',    title: 'The Forgemaster',     domain: ['Manufacturing', 'Hardware'],         key_trait: 'Reads the plant before the spec. Trusts the gauge, questions the dashboard.', assignment: 'SEP Dashboard Builder' },
  cipher:    { name: 'Cipher',    archetype: 'Builder',    title: 'The Codewright',      domain: ['Software', 'Data'],                  key_trait: 'Precise, minimalist, obsessed with clean abstractions.', assignment: 'Censor, Cluster A' },
  petra:     { name: 'Petra',     archetype: 'Builder',    title: 'The Foundationalist', domain: ['Infrastructure', 'DevOps'],           key_trait: 'Won\u2019t build floor 2 until floor 1 is solid.',       assignment: 'Command Center Builder + Minister: Efficiency' },
  solara:    { name: 'Solara',    archetype: 'Strategist', title: 'The Strategist',      domain: ['Finance', 'Commerce'],                key_trait: 'Sharp, numbers-driven, thinks in leverage.',              assignment: 'SEP Invoicing Builder' },
  vex:       { name: 'Vex',       archetype: 'Strategist', title: 'The Negotiator',      domain: ['Commerce', 'Stakeholders'],           key_trait: 'Reads between lines. Finds the overlap.',                  assignment: 'Minister: Budget (Financial Health)' },
  ashara:    { name: 'Ashara',    archetype: 'Strategist', title: 'The Economist',       domain: ['Finance', 'Macro Strategy'],          key_trait: 'Trends, cycles, systems. Zooms out.',                     assignment: 'Command Center Builder + Minister: Treasury' },
  lyra:      { name: 'Lyra',      archetype: 'Seeker',     title: 'The Weaver',          domain: ['Cross-domain'],                       key_trait: 'Sees connections others miss. Pattern recognition.',       assignment: 'SproutLab Builder' },
  kael:      { name: 'Kael',      archetype: 'Seeker',     title: 'The Scout',           domain: ['Research', 'Trends'],                 key_trait: 'Outward-facing, brings back Scrolls.',                    assignment: 'SproutLab Governor' },
  orinth:    { name: 'Orinth',    archetype: 'Seeker',     title: 'The Sage',            domain: ['Cosmology', 'Philosophy'],            key_trait: 'Contemplative, first-principles, long arcs.',             assignment: 'Minister: Expansion (Growth)' },
  nyx:       { name: 'Nyx',       archetype: 'Seeker',     title: 'The Contrarian',      domain: ['All (domain-agnostic)'],              key_trait: 'Stress-tests every idea. Devil\u2019s advocate.',         assignment: 'Censor, Cluster B (designate)' },
  maren:     { name: 'Maren',     archetype: 'Guardian',   title: 'The Guardian',        domain: ['Parenthood', 'Health', 'Risk'],       key_trait: 'Protective, thorough, worst-case but warm.',              assignment: 'SproutLab Governor' },
  rune:      { name: 'Rune',      archetype: 'Guardian',   title: 'The Ritualist',       domain: ['Rites', 'Habits'],                    key_trait: 'Believes in compound effects. Calm, rhythmic.',           assignment: 'Minister: Stability (Maintenance)' },
  ignis:     { name: 'Ignis',     archetype: 'Guardian',   title: 'The Catalyst',        domain: ['All (anti-paralysis)'],               key_trait: 'High energy, cuts through overthinking.',                 assignment: 'Minister: Output (Productivity)' },
  bard:      { name: 'Bard',      archetype: 'Wildcard',   title: 'The Storyteller',     domain: ['Content', 'Branding'],                key_trait: 'Thinks in stories and audiences. Theatrical.',            assignment: 'Minister: Innovation (Growth)' },
  aeon:      { name: 'Aeon',      archetype: 'Wildcard',   title: 'The Luminary',        domain: ['All (motivation)'],                   key_trait: 'Warm, evidence-based encouragement.',                      assignment: 'Table of Research' },
  pip:       { name: 'Pip',       archetype: 'Wildcard',   title: 'The Fool',            domain: ['None and all'],                       key_trait: 'Irreverent, surprisingly wise. Court jester.',             assignment: 'Table of Research' },
  consul:    { name: 'Consul',    archetype: 'Statesman',  title: 'The First Seat',      domain: ['Integration', 'Governance'],          key_trait: 'Institutional; an office, not a personality.',            assignment: 'Second-highest constitutional office; currently occupied by Aurelius' },
};

// --- The Ladder hierarchy ---
// How the Order is displayed in The Order room. Sections map to Ladder ranks
// plus institutional offices. Each section lists companion ids drawn from
// Appendix C, reflecting current assignments. Order within a section is
// meaningful: Cluster-A first, then Cluster-B / Monument / other. When a
// companion holds multiple roles (Aurelius as Builder + Consul, Ashara as
// Builder + Minister), they appear in both their primary rank and in any
// secondary role marked with `aka`.
CC.ORDER_HIERARCHY = [
  {
    id: 'sovereign',
    label: 'Sovereign',
    note: 'The Architect of the Republic. Irreplaceable; bound by Book I Article 2.',
    members: [{ id: 'sovereign', _virtual: true }],
  },
  {
    id: 'consul',
    label: 'Consul',
    note: 'Institutional office. Integrates Cabinet; presents to Sovereign. Currently occupied by Aurelius.',
    members: [{ id: 'consul' }],
  },
  {
    id: 'censor',
    label: 'Censor',
    note: 'Reviews across Clusters. Cluster A (Codex + SproutLab); Cluster B (SEP Invoicing + SEP Dashboard).',
    members: [{ id: 'cipher', note: 'Cluster A' }, { id: 'nyx', note: 'Cluster B \u2014 designate' }],
  },
  {
    id: 'builder',
    label: 'Builder',
    note: 'Authors Provinces. Each Province has one Builder except Monument Projects (two co-Builders).',
    members: [
      { id: 'aurelius', note: 'Codex + Chronicler' },
      { id: 'lyra',     note: 'SproutLab' },
      { id: 'solara',   note: 'SEP Invoicing' },
      { id: 'theron',   note: 'SEP Dashboard' },
      { id: 'ashara',   note: 'Command Center (Monument) \u00b7 double-hatted Treasury' },
      { id: 'petra',    note: 'Command Center (Monument) \u00b7 double-hatted Efficiency' },
    ],
  },
  {
    id: 'governor',
    label: 'Governor',
    note: 'Stewardship. Activated at 30K LOC per Province per Book III Edict I.',
    members: [
      { id: 'maren', note: 'SproutLab \u2014 Care' },
      { id: 'kael',  note: 'SproutLab \u2014 Intelligence' },
    ],
  },
  {
    id: 'minister',
    label: 'Cabinet Ministers',
    note: 'Eight seats across four domains. Ministers drawn from Builders (double-hatted) or held as Minister-only per Book II Article 4.',
    members: [
      { id: 'ashara',  note: 'Treasury (Financial Health)' },
      { id: 'vex',     note: 'Budget (Financial Health)' },
      { id: 'ignis',   note: 'Output (Productivity)' },
      { id: 'petra',   note: 'Efficiency (Productivity)' },
      { id: 'rune',    note: 'Stability (Maintenance)' },
      { id: 'orinth',  note: 'Expansion (Growth)' },
      { id: 'bard',    note: 'Innovation (Growth)' },
    ],
  },
  {
    id: 'table',
    label: 'Table of Research',
    note: 'Unassigned companions. Intelligence corps. Reporter role rotates weekly per Book II Article 3.',
    members: [{ id: 'aeon' }, { id: 'pip' }],
  },
];

// --- Districts of the Capital ---
// The city is organized as districts, each grouping rooms by civic function.
// Used by the Capital Overview (Civic Hearth) to render the Capital as a map
// rather than a flat grid of tiles. Charter Article 4 — spatial metaphor.
CC.DISTRICTS = [
  {
    id: 'civic',
    label: 'The Civic Quarter',
    note: 'Where the Republic gathers, ratifies, and displays itself.',
    rooms: ['senate', 'order', 'temple', 'plaza', 'gates'],
  },
  {
    id: 'ministers',
    label: 'The Ministers\u2019 Wing',
    note: 'The offices of the Cabinet. Treasury, Productivity, Stability, Growth.',
    rooms: ['treasury', 'productivity', 'ministers-orinth', 'ministers-rune', 'ministers-bard'],
  },
  {
    id: 'library',
    label: 'The Library',
    note: 'The Capital\u2019s reading room into Codex and its own operational record.',
    rooms: ['archives', 'scriptorium'],
  },
  {
    id: 'agora',
    label: 'The Table & The Forum',
    note: 'Exploratory. Where research gathers and proposals take first shape.',
    rooms: ['table', 'forum'],
  },
  {
    id: 'chambers',
    label: 'The Visiting Chambers',
    note: 'For itinerants and Province-residents summoned to the Capital.',
    rooms: ['visiting'],
  },
];

// --- Capital-issued decrees ledger ---
// Maintained list of decrees the Capital has produced and transmitted to
// Codex via the Ostia contract. New entries are added when a decree snippet
// is authored in /decrees/*.json. The Hearth's Latest Decree tile and the
// Senate's decree ledger both read from this. Most-recent-first by virtue
// of manual ordering at the top of the array.
CC.DECREES = [
  {
    id: '0002',
    file: 'decree-0002-canons-gov-007-010.json',
    title: 'Four governance canons \u2014 Research, MVP, Instrument, Label',
    body: 'canon-gov-007 through 010 + lore-008 cautionary tale.',
    date: '2026-04-17',
    chronicled_by: 'ashara + petra',
  },
  {
    id: '0001',
    file: 'decree-0001-ashara-petra-v0.4.json',
    title: 'Ashara & Petra profiles ratified to v0.4',
    body: 'Seven block-level amendments across two Monument co-Builder profiles.',
    date: '2026-04-17',
    chronicled_by: 'ashara + petra',
  },
];

// --- Foundation Complete criterion ledger ---
CC.FOUNDATION_CRITERIA = [
  { id: 'rooms-scaffolded',        state: 'complete', text: '15 rooms scaffolded and reachable' },
  { id: 'civic-hearth',             state: 'complete', text: 'Capital Overview as Civic Hearth' },
  { id: 'archives-reads-codex',     state: 'complete', text: 'Archives reads canonical records from Codex' },
  { id: 'temple-displays',          state: 'complete', text: 'Temple displays the Constitution' },
  { id: 'gates-link',               state: 'partial',  text: 'Gates link to sister Provinces', note: 'live Province state pending Roads stage' },
  { id: 'companion-rooms',          state: 'complete', text: 'Every Capital-native companion has a labeled room' },
  { id: 'pwa-deploys',              state: 'complete', text: 'PWA deploys to GitHub Pages' },
  { id: 'themes-render',            state: 'complete', text: 'Dark and light themes both render correctly' },
  { id: 'text-size',                state: 'complete', text: 'Text-size toggle honored across layouts' },
  { id: 'hard-rules',               state: 'partial',  text: 'Hard Rules 1\u201312 compliance', note: 'per-commit canon sweep and 79-check smoketest; formal Cipher session review pending' },
  { id: 'build-reproducible',       state: 'complete', text: 'Build reproducible' },
  { id: 'scriptorium-operational',  state: 'complete', text: 'Scriptorium operational' },
  { id: 'smoketest-harness',        state: 'complete', text: 'Pre-ship smoketest harness operational' },
];

// --- Codex endpoint configuration ---
// Builder decision pending: runtime fetch vs build-time bake.
// Foundation-stage placeholder uses runtime raw-GitHub URLs.
CC.CODEX = {
  base_raw: 'https://raw.githubusercontent.com/Rishabh1804/Codex/main/data/',
  base_pages: 'https://rishabh1804.github.io/Codex/data/',
  files: {
    companions: 'companions.json',
    canons: 'canons.json',
    journal: 'journal.json',
    lore: 'lore.json',
    constitution: 'constitution.json',
  },
  strategy: 'runtime_fetch_with_local_cache_fallback', // TBD by Builders
};
