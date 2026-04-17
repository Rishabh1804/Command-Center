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
