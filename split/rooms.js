/* Command Center — rooms.js
   Room renderers. One function per room; dispatched by id.
   Foundation Stage v0.1 — every room stands, none yet convenes. */

CC.renderRoom = function(room) {
  const root = CC.$('#roomContainer');
  if (!root || !room) return;

  // Dispatch by id; fall through to generic renderer
  const fn = CC.roomRenderers[room.id] || CC.roomRenderers['_generic'];
  root.innerHTML = fn(room);
};

CC.roomRenderers = {};

// --- Shared renderers ---

// Icon rendering helper. Returns the SVG markup for a given room id wrapped
// in a size-scoped span. The underlying SVG uses currentColor so it inherits
// from the enclosing context (room header accent, tile text, breadcrumb fg).
CC.renderIcon = function(roomId, sizeClass) {
  var svg = (CC.ICONS && CC.ICONS[roomId]) || (CC.ICONS && CC.ICONS.home) || '';
  if (!svg) return '';
  var cls = 'cc-room-icon ' + (sizeClass || 'cc-room-icon-md');
  return '<span class="' + cls + '" aria-hidden="true">' + svg + '</span>';
};

// Timezone-safe short date formatting (canon-0012). Parses YYYY-MM-DD strings
// directly; never constructs a Date from a date-only string.
CC.formatDateShort = function(dateStr) {
  if (!dateStr) return '';
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateStr));
  if (!m) return String(dateStr);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var idx = parseInt(m[2], 10) - 1;
  if (idx < 0 || idx > 11) return dateStr;
  return String(parseInt(m[3], 10)) + ' ' + months[idx] + ' ' + m[1];
};

// Ratification badge — surfaces profile_version and sovereign_edited state
// on companion cards. Three states: ratified (v0.4+), draft (v0.3-draft),
// pending (no profile fetched from Codex yet).
CC.renderRatificationBadge = function(rec) {
  if (!rec || rec._placeholder) {
    return '<div class="cc-resident-ratification cc-ratification-pending">profile pending</div>';
  }
  var meta = rec.meta || {};
  var version = meta.profile_version || '';
  if (!version) {
    return '<div class="cc-resident-ratification cc-ratification-pending">profile pending</div>';
  }
  if (version.indexOf('draft') !== -1) {
    return '<div class="cc-resident-ratification cc-ratification-draft">'
      + CC.escHtml(version) + ' \u00b7 awaiting ratification</div>';
  }
  var edit = meta.sovereign_edited || {};
  var parts = [CC.escHtml(version)];
  if (edit.edit_round) parts.push('round ' + CC.escHtml(String(edit.edit_round)));
  if (edit.edit_date) parts.push(CC.escHtml(CC.formatDateShort(edit.edit_date)));
  return '<div class="cc-resident-ratification cc-ratification-ratified">'
    + parts.join(' \u00b7 ') + '</div>';
};

CC.renderRoomHeader = function(room) {
  return [
    '<header class="cc-room-header">',
    '<div class="cc-room-eyebrow">' + CC.escHtml(room.eyebrow || '') + '</div>',
    '<h1 class="cc-room-title">',
    CC.renderIcon(room.id, 'cc-room-icon-lg'),
    '<span class="cc-room-title-text">' + CC.escHtml(room.name) + '</span>',
    '</h1>',
    room.subtitle ? '<p class="cc-room-subtitle">' + CC.escHtml(room.subtitle) + '</p>' : '',
    room.description ? '<p class="cc-room-description">' + CC.escHtml(room.description) + '</p>' : '',
    '</header>',
  ].join('');
};

CC.renderFoundationBanner = function(message) {
  const msg = message || 'Foundation stage \u2014 scaffolding only. This room does not yet convene.';
  return '<div class="cc-status-banner">' + CC.escHtml(msg) + '</div>';
};

CC.renderResidentList = function(roomId) {
  const residentIds = CC.residentsOfRoom(roomId);
  if (residentIds.length === 0) {
    return '<p class="cc-muted cc-small cc-mt-16"><em>No standing residents.</em></p>';
  }
  const cards = residentIds.map(function(cid) {
    const rec = CC.companionRecord(cid);
    const residence = CC.RESIDENCE[cid] || {};
    const status = residence.status || 'scaffolded';
    const statusLabel = status.replace(/_/g, ' ');
    const name = (rec.identity && rec.identity.name) || cid;
    const title = (rec.identity && rec.identity.title) || '';
    const trait = (rec.identity && rec.identity.key_trait) || '';
    return [
      '<article class="cc-resident-card">',
      '<div class="cc-resident-name">' + CC.escHtml(name) + '</div>',
      title ? '<div class="cc-resident-title">' + CC.escHtml(title) + '</div>' : '',
      trait ? '<div class="cc-resident-trait">' + CC.escHtml(trait) + '</div>' : '',
      CC.renderRatificationBadge(rec),
      '<span class="cc-resident-status" data-status="' + CC.escAttr(status) + '">' + CC.escHtml(statusLabel) + '</span>',
      '</article>',
    ].join('');
  }).join('');
  return [
    '<h3 class="cc-mt-16">Residents</h3>',
    '<div class="cc-resident-list">' + cards + '</div>',
  ].join('');
};

CC.renderSeatList = function(roomId, labelOverride) {
  const seatIds = CC.seatsInRoom(roomId);
  if (seatIds.length === 0) {
    return '<p class="cc-muted cc-small cc-mt-16"><em>No seats assigned.</em></p>';
  }
  const cards = seatIds.map(function(cid) {
    const rec = CC.companionRecord(cid);
    const residence = CC.RESIDENCE[cid] || {};
    const status = residence.status || 'scaffolded';
    const statusLabel = status.replace(/_/g, ' ');
    const name = (rec.identity && rec.identity.name) || cid.charAt(0).toUpperCase() + cid.slice(1);
    const title = (rec.identity && rec.identity.title) || '';
    const trait = (rec.identity && rec.identity.key_trait) || '';
    const seatNote = residence.seat ? 'Seat: ' + residence.seat : '';
    return [
      '<article class="cc-resident-card">',
      '<div class="cc-resident-name">' + CC.escHtml(name) + '</div>',
      title ? '<div class="cc-resident-title">' + CC.escHtml(title) + '</div>' : '',
      trait ? '<div class="cc-resident-trait">' + CC.escHtml(trait) + '</div>' : '',
      seatNote ? '<div class="cc-resident-trait cc-small cc-muted">' + CC.escHtml(seatNote) + '</div>' : '',
      CC.renderRatificationBadge(rec),
      '<span class="cc-resident-status" data-status="' + CC.escAttr(status) + '">' + CC.escHtml(statusLabel) + '</span>',
      '</article>',
    ].join('');
  }).join('');
  return [
    '<h3 class="cc-mt-16">' + CC.escHtml(labelOverride || 'Seated') + '</h3>',
    '<div class="cc-resident-list">' + cards + '</div>',
  ].join('');
};

// --- Civic date — spelled-out ordinal form ---
// "The Seventeenth Day of April, Two Thousand Twenty-Six"
// Uses local date (the Sovereign's timezone). Canon-0012 compliant: does not
// attempt cross-timezone normalization; the Capital's calendar is civic.
CC.ORDINAL_DAYS = [
  'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh',
  'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth',
  'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth',
  'Nineteenth', 'Twentieth', 'Twenty-First', 'Twenty-Second',
  'Twenty-Third', 'Twenty-Fourth', 'Twenty-Fifth', 'Twenty-Sixth',
  'Twenty-Seventh', 'Twenty-Eighth', 'Twenty-Ninth', 'Thirtieth',
  'Thirty-First',
];
CC.MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
CC.YEAR_WORDS = {
  2026: 'Two Thousand Twenty-Six',
  2027: 'Two Thousand Twenty-Seven',
  2028: 'Two Thousand Twenty-Eight',
  2029: 'Two Thousand Twenty-Nine',
  2030: 'Two Thousand Thirty',
};
CC.formatCivicDate = function(d) {
  var date = d || new Date();
  var dayIdx = date.getDate() - 1;
  var day = CC.ORDINAL_DAYS[dayIdx] || String(date.getDate());
  var month = CC.MONTH_NAMES[date.getMonth()] || '';
  var year = CC.YEAR_WORDS[date.getFullYear()] || String(date.getFullYear());
  return 'The ' + day + ' Day of ' + month + ', ' + year;
};

// Render the civic date with the year wrapped in a nowrap span so the four-word
// year ("Two Thousand Twenty-Six") never breaks mid-phrase on narrow viewports.
CC.renderCivicDateHTML = function() {
  var date = new Date();
  var dayIdx = date.getDate() - 1;
  var day = CC.ORDINAL_DAYS[dayIdx] || String(date.getDate());
  var month = CC.MONTH_NAMES[date.getMonth()] || '';
  var year = CC.YEAR_WORDS[date.getFullYear()] || String(date.getFullYear());
  return 'The ' + CC.escHtml(day) + ' Day of ' + CC.escHtml(month) + ', '
    + '<span class="cc-nowrap">' + CC.escHtml(year) + '</span>';
};

// --- Civic Hearth — the Dawn Page of the Capital, per Edict IV ---
// Warm, quiet, inviting. Presence first, activity second, demands never.
// A hearth with an inscribed wall.

// Small indicator under the Hearth header when the Scriptorium holds
// unresolved errors or warnings. Subtle, not alarmist. Tapping navigates to
// the Scriptorium. Rendered only when something warrants attention.
CC.renderScriptoriumIndicator = function() {
  if (!CC.readLog) return '';
  var entries = CC.readLog();
  var errs = 0, warns = 0;
  entries.forEach(function(e) {
    if (e.level === 'error') errs++;
    else if (e.level === 'warn') warns++;
  });
  if (errs === 0 && warns === 0) return '';
  var parts = [];
  if (errs) parts.push(errs + ' error' + (errs === 1 ? '' : 's'));
  if (warns) parts.push(warns + ' warning' + (warns === 1 ? '' : 's'));
  var label = parts.join(' \u00b7 ') + ' \u00b7 see the Scriptorium';
  return '<button class="cc-hearth-indicator" data-action="navRoom" data-room="scriptorium">'
    + CC.escHtml(label) + '</button>';
};

CC.renderHearthHeader = function() {
  return [
    '<header class="cc-hearth-header">',
    '<div class="cc-hearth-eyebrow">The Capital Stands</div>',
    '<div class="cc-hearth-date">' + CC.renderCivicDateHTML() + '</div>',
    '<p class="cc-hearth-stage">',
    'The Capital is at Foundation. The Senate is scaffolded but does not yet convene. ',
    'The Ministers hold their offices. The Gates are open. The Library is within reach.',
    '</p>',
    CC.renderScriptoriumIndicator(),
    '</header>',
  ].join('');
};

// Living cards: latest decree, latest canon, undrafted profile count.
// Each card is presence, not telemetry. Nothing blinks. Nothing demands.
// Returns true if an ISO date string (YYYY-MM-DD) is within N days of today.
// Used to mark Hearth tiles as "fresh" so recent activity gets a subtle
// accent highlight, honoring the Sovereign's directive that the Hearth feel
// alive rather than static.
CC.isRecent = function(dateStr, days) {
  if (!dateStr) return false;
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateStr));
  if (!m) return false;
  var then = new Date(
    parseInt(m[1], 10),
    parseInt(m[2], 10) - 1,
    parseInt(m[3], 10)
  );
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var diffMs = today.getTime() - then.getTime();
  var diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= -1 && diffDays <= (days || 1);
};

// Hearth tile builder. Each tile is a tappable civic bulletin with icon,
// label, body, and meta. Optional `fresh` flag enables the accent glow.
// Icons are small inline SVGs so tiles stand on their own visual weight.
CC.HEARTH_TILE_ICONS = {
  monument:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 L9 6 L9 19 L15 19 L15 6 Z"/><line x1="5" y1="19" x2="19" y2="19"/></svg>',
  decree:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="1"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>',
  canon:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5 L4 19 A 2 2 0 0 0 6 21 L20 21 L20 7 A 2 2 0 0 0 18 5 Z"/><line x1="4" y1="5" x2="15" y2="5"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="16" y2="15"/></svg>',
  chronicle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4 C 4 4, 4 8, 6 8 L 18 8 C 20 8, 20 4, 18 4 Z"/><path d="M6 8 L6 20 L18 20 L18 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="16" x2="13" y2="16"/></svg>',
  order:     '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="6" r="1.6"/><circle cx="18.5" cy="9.5" r="1.6"/><circle cx="18.5" cy="15.5" r="1.6"/><circle cx="12" cy="19.5" r="1.6"/><circle cx="5.5" cy="15.5" r="1.6"/><circle cx="5.5" cy="9.5" r="1.6"/><circle cx="12" cy="12.5" r="1.4"/></svg>',
  scriptorium:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none"/></svg>',
};

CC.renderHearthTile = function(opts) {
  if (!opts) return '';
  var iconSvg = CC.HEARTH_TILE_ICONS[opts.icon] || '';
  var classes = ['cc-hearth-tile'];
  if (opts.fresh) classes.push('cc-hearth-tile-fresh');
  if (opts.tone) classes.push('cc-hearth-tile-' + opts.tone);
  var action = opts.route
    ? ' data-action="nav" data-target="' + CC.escAttr(opts.route) + '"'
    : '';
  var ariaLabel = opts.ariaLabel || (opts.label + ': ' + opts.bodyText);
  return [
    '<button class="' + classes.join(' ') + '"' + action
      + ' aria-label="' + CC.escAttr(ariaLabel) + '">',
    '<span class="cc-hearth-tile-head">',
    '<span class="cc-hearth-tile-icon" aria-hidden="true">' + iconSvg + '</span>',
    '<span class="cc-hearth-tile-label">' + CC.escHtml(opts.label) + '</span>',
    opts.fresh ? '<span class="cc-hearth-tile-fresh-dot" aria-label="fresh">\u25CF</span>' : '',
    '</span>',
    '<span class="cc-hearth-tile-body">' + (opts.bodyHtml || CC.escHtml(opts.bodyText || '')) + '</span>',
    opts.meta ? '<span class="cc-hearth-tile-meta">' + CC.escHtml(opts.meta) + '</span>' : '',
    opts.extraHtml || '',
    '</button>',
  ].join('');
};

// --- Individual tile builders ----------------------------------------------

CC.buildHearthTile_monument = function() {
  var complete = 0, partial = 0;
  var total = (CC.FOUNDATION_CRITERIA || []).length;
  (CC.FOUNDATION_CRITERIA || []).forEach(function(c) {
    if (c.state === 'complete') complete++;
    else if (c.state === 'partial') partial++;
  });
  var bar = CC.renderProgressBar
    ? CC.renderProgressBar(complete, partial, total)
    : '';
  return CC.renderHearthTile({
    label: 'Monument',
    icon: 'monument',
    bodyText: 'Foundation \u00b7 ' + complete + ' of ' + total + ' complete'
      + (partial ? ', ' + partial + ' partial' : ''),
    meta: 'Command Center',
    extraHtml: '<span class="cc-hearth-tile-progress">' + bar + '</span>',
    route: '/plaza',
    ariaLabel: 'Monument \u2014 open the Plaza',
  });
};

CC.buildHearthTile_latestDecree = function() {
  var list = (CC.DECREES || []);
  if (list.length === 0) {
    return CC.renderHearthTile({
      label: 'Latest Decree',
      icon: 'decree',
      bodyText: 'No decrees yet.',
      meta: 'The ledger is empty',
      route: '/senate',
      ariaLabel: 'Decree ledger \u2014 open the Senate',
    });
  }
  var latest = list[0];
  return CC.renderHearthTile({
    label: 'Latest Decree',
    icon: 'decree',
    bodyText: 'Decree ' + latest.id + ' \u2014 ' + (latest.title || ''),
    meta: (latest.body || '') + ' \u00b7 Chronicled ' + CC.formatDateShort(latest.date || ''),
    route: '/senate',
    ariaLabel: 'Latest Decree \u2014 open the Senate',
    fresh: CC.isRecent(latest.date, 1),
  });
};

CC.buildHearthTile_latestCanon = function() {
  var canonsData = (CC.state.cache && CC.state.cache.canons) || null;
  if (!canonsData || !Array.isArray(canonsData.canons) || canonsData.canons.length === 0) {
    return CC.renderHearthTile({
      label: 'Latest Canon',
      icon: 'canon',
      bodyHtml: '<em>Fetching from the Library.</em>',
      meta: 'Consulted via Ostia',
      route: '/archives',
      ariaLabel: 'Latest Canon \u2014 open the Archives',
    });
  }
  var latest = null;
  var maxDate = '';
  canonsData.canons.forEach(function(c) {
    if (!c || c._deleted) return;
    var d = c.created ? String(c.created) : '';
    if (d >= maxDate) { maxDate = d; latest = c; }
  });
  if (!latest) latest = canonsData.canons[canonsData.canons.length - 1];
  var title = latest.title || latest.rule || latest.id || '(untitled)';
  var metaParts = [];
  if (latest.id) metaParts.push(latest.id);
  if (latest.created) metaParts.push('ratified ' + CC.formatDateShort(latest.created));
  return CC.renderHearthTile({
    label: 'Latest Canon',
    icon: 'canon',
    bodyText: title,
    meta: metaParts.join(' \u00b7 '),
    route: '/archives',
    ariaLabel: 'Latest Canon \u2014 open the Archives',
    fresh: CC.isRecent(latest.created, 1),
  });
};

CC.buildHearthTile_latestChronicle = function() {
  var canonsData = (CC.state.cache && CC.state.cache.canons) || null;
  if (!canonsData || !Array.isArray(canonsData.lore)) {
    return CC.renderHearthTile({
      label: 'Latest Chronicle',
      icon: 'chronicle',
      bodyHtml: '<em>Fetching from the Library.</em>',
      meta: 'Consulted via Ostia',
      route: '/archives',
      ariaLabel: 'Latest Chronicle \u2014 open the Archives',
    });
  }
  var candidates = canonsData.lore.filter(function(l) {
    return l && !l._deleted && l.title
      && (l.category === 'chronicles' || l.category === 'cautionary_tales' || l.category === 'doctrines');
  });
  if (candidates.length === 0) return null;
  var latest = null;
  var maxDate = '';
  candidates.forEach(function(l) {
    var d = l.created ? String(l.created) : (l.date ? String(l.date) : '');
    if (d >= maxDate) { maxDate = d; latest = l; }
  });
  if (!latest) return null;
  var catLabel = latest.category === 'chronicles' ? 'Chronicle'
    : latest.category === 'cautionary_tales' ? 'Cautionary Tale'
    : latest.category === 'doctrines' ? 'Doctrine'
    : 'Lore';
  var metaParts = [catLabel];
  if (latest.created) metaParts.push('chronicled ' + CC.formatDateShort(latest.created));
  return CC.renderHearthTile({
    label: 'Latest Chronicle',
    icon: 'chronicle',
    bodyText: latest.title,
    meta: metaParts.join(' \u00b7 '),
    route: '/archives',
    ariaLabel: 'Latest Chronicle \u2014 ' + latest.title + ' \u2014 open the Archives',
    fresh: CC.isRecent(latest.created, 1),
  });
};

CC.buildHearthTile_order = function() {
  var companionsData = (CC.state.cache && CC.state.cache.companions) || null;
  var drafted = 0;
  var total = (CC.GEN_ZERO_IDS || []).length;
  if (companionsData && Array.isArray(companionsData.companions)) {
    companionsData.companions.forEach(function(c) {
      if (CC.GEN_ZERO_IDS.indexOf(c.id) !== -1) drafted++;
    });
  }
  var undrafted = total - drafted;
  var body = undrafted === 0
    ? 'The Order is fully profiled.'
    : undrafted + ' of ' + total + ' Gen 0 companions await profile drafting.';
  var meta = total > 0
    ? drafted + ' of ' + total + ' profiles present in Codex'
    : 'Awaiting Ostia fetch';
  return CC.renderHearthTile({
    label: 'The Order',
    icon: 'order',
    bodyText: body,
    meta: meta,
    route: '/senate',
    ariaLabel: 'The Order \u2014 open the Senate',
  });
};

CC.buildHearthTile_scriptorium = function() {
  if (!CC.readLog) return null;
  var entries = CC.readLog();
  var errs = 0, warns = 0;
  entries.forEach(function(e) {
    if (e.level === 'error') errs++;
    else if (e.level === 'warn') warns++;
  });
  if (errs === 0 && warns === 0) return null;  // Silent when clean.
  var parts = [];
  if (errs) parts.push(errs + ' error' + (errs === 1 ? '' : 's'));
  if (warns) parts.push(warns + ' warning' + (warns === 1 ? '' : 's'));
  return CC.renderHearthTile({
    label: 'Scriptorium',
    icon: 'scriptorium',
    bodyText: parts.join(' \u00b7 '),
    meta: 'Operational capture live',
    route: '/scriptorium',
    ariaLabel: 'Scriptorium \u2014 open the operational log',
    tone: 'warn',
  });
};

CC.renderHearthCards = function() {
  var tiles = [
    CC.buildHearthTile_monument(),
    CC.buildHearthTile_latestDecree(),
    CC.buildHearthTile_latestCanon(),
    CC.buildHearthTile_latestChronicle(),
    CC.buildHearthTile_order(),
    CC.buildHearthTile_scriptorium(),
  ].filter(Boolean);
  return '<div class="cc-hearth-tiles">' + tiles.join('') + '</div>';
};

// City map — rooms as districts. Charter Art. 4: the Capital is a city.
// When a room has no residents, the residents line is omitted rather than
// repeating "No standing residents" across every empty civic tile. Empty
// cards read cleaner than cards labeled with their own absence.
CC.renderRoomTileCard = function(r) {
  var residents = CC.residentsOfRoom(r.id);
  var residentText = residents.length
    ? residents.map(function(id) { return id.charAt(0).toUpperCase() + id.slice(1); }).join(', ')
    : '';
  return [
    '<button class="cc-room-card" data-action="navRoom" data-room="' + CC.escAttr(r.id) + '">',
    '<div class="cc-room-card-header">',
    CC.renderIcon(r.id, 'cc-room-icon-md'),
    '<div class="cc-room-card-name">' + CC.escHtml(r.name) + '</div>',
    '</div>',
    '<div class="cc-room-card-function">' + CC.escHtml(r.subtitle || '') + '</div>',
    residentText ? '<div class="cc-room-card-residents">' + CC.escHtml(residentText) + '</div>' : '',
    '</button>',
  ].join('');
};

CC.renderCityMap = function() {
  var roomById = {};
  CC.ROOMS.forEach(function(r) { roomById[r.id] = r; });

  var districtBlocks = (CC.DISTRICTS || []).map(function(d) {
    var tiles = (d.rooms || []).map(function(id) {
      var r = roomById[id];
      return r ? CC.renderRoomTileCard(r) : '';
    }).join('');
    return [
      '<section class="cc-district" data-district="' + CC.escAttr(d.id) + '">',
      '<div class="cc-district-header">',
      '<h2 class="cc-district-label">' + CC.escHtml(d.label) + '</h2>',
      d.note ? '<p class="cc-district-note">' + CC.escHtml(d.note) + '</p>' : '',
      '</div>',
      '<div class="cc-district-rooms">' + tiles + '</div>',
      '</section>',
    ].join('');
  }).join('');

  return '<div class="cc-city-map">' + districtBlocks + '</div>';
};

// Chronicle inscription strip — one line from the Republic's memory.
// Drawn from canons.json's lore[], filtered to 'chronicles' category.
// Bard's note #3: the Capital should speak without shouting.
CC.renderChronicleStrip = function() {
  var canonsData = (CC.state.cache && CC.state.cache.canons) || null;
  var inscription = null;
  var source = null;
  var sourceDate = null;
  if (canonsData && Array.isArray(canonsData.lore)) {
    var chronicles = canonsData.lore.filter(function(l) {
      return l && l.category === 'chronicles' && !l._deleted && l.title;
    });
    if (chronicles.length > 0) {
      // Pick by (today's date + day-of-year) parity for a stable daily rotation.
      // Not random; not ticker; one chronicle per day of the Capital's life.
      var now = new Date();
      var dayOfYear = Math.floor(
        (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
      );
      var pick = chronicles[dayOfYear % chronicles.length];
      if (pick) {
        inscription = pick.title;
        source = pick.id || '';
        sourceDate = pick.created || '';
      }
    }
  }

  if (!inscription) {
    // Graceful Dawn: before the Library responds, the Hearth speaks for itself.
    inscription = 'The Republic is not a thing, but a relation. These Provinces hold that relation for us.';
    source = 'The Capital';
    sourceDate = '';
  }

  var sourceLine = '';
  if (source) {
    var parts = [];
    parts.push(CC.escHtml(source));
    if (sourceDate) parts.push(CC.escHtml(CC.formatDateShort(sourceDate)));
    sourceLine = '<span class="cc-chronicle-source">' + parts.join(' \u00b7 ') + '</span>';
  }

  return [
    '<aside class="cc-chronicle-strip" aria-label="Chronicle inscription">',
    '\u201C' + CC.escHtml(inscription) + '\u201D',
    sourceLine,
    '</aside>',
  ].join('');
};

// --- Capital Overview (home) — the Civic Hearth ---
CC.roomRenderers['home'] = function(room) {
  return [
    '<section class="cc-room cc-hearth">',
    CC.renderHearthHeader(),
    CC.renderHearthCards(),
    CC.renderCityMap(),
    CC.renderChronicleStrip(),
    CC.renderFoundationBanner('The Capital is in Foundation stage. The Hearth is set; the rooms are scaffolded; the Senate awaits its first convening. Ashara and Petra hold the Builder seats.'),
    '</section>',
  ].join('');
};

// --- Senate ---
CC.roomRenderers['senate'] = function(room) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<article class="cc-card">',
    '<div class="cc-card-title">The Senate floor</div>',
    '<p class="cc-small cc-muted">Cabinet convenes here. Ministers speak from assigned seats. Consul presides. Book ratifications are staged on the floor.</p>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">The Cabinet\u2019s next convening</div>',
    '<p class="cc-small cc-muted">No convening scheduled. The Cabinet has not yet been formally seated; the first convening awaits Capital Occupancy. The monthly cycle (Book V Article 5, Book IX Article 4):</p>',
    '<div class="cc-cycle-list cc-mt-12">',
    '<div class="cc-cycle-row"><span class="cc-cycle-week">Week 1</span><span class="cc-cycle-note">Intelligence Engine publishes monthly domain reports</span></div>',
    '<div class="cc-cycle-row"><span class="cc-cycle-week">Week 2</span><span class="cc-cycle-note">Ministers confer with their domain pair; recommendations drafted</span></div>',
    '<div class="cc-cycle-row"><span class="cc-cycle-week">Week 3</span><span class="cc-cycle-note">Cabinet convenes \u2014 eight Ministers and the Consul</span></div>',
    '<div class="cc-cycle-row"><span class="cc-cycle-week">Week 4</span><span class="cc-cycle-note">Consul presents the unified Recommendation; Sovereign ratifies</span></div>',
    '</div>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">Decree ledger</div>',
    '<p class="cc-small cc-muted">Outbound decrees issued from the Capital. Each flows through the Ostia contract to Codex for chronicling.</p>',
    '<div class="cc-decree-list cc-mt-12">',
    '<div class="cc-decree-row">',
    '<span class="cc-decree-id">Decree 0001</span>',
    '<span class="cc-decree-title">Ashara and Petra profiles ratified to v0.4</span>',
    '<span class="cc-decree-date">17 Apr 2026</span>',
    '</div>',
    '</div>',
    '</article>',
    CC.renderSeatList('senate', 'Senate seats'),
    CC.renderFoundationBanner('The Senate is scaffolded but does not yet convene. Capital Occupancy (Stage 2) unlocks live Cabinet meetings on this floor.'),
    '</section>',
  ].join('');
};

// --- Forum ---
CC.roomRenderers['forum'] = function(room) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<article class="cc-card">',
    '<div class="cc-card-title">Open floor</div>',
    '<p class="cc-small cc-muted">The Forum is informal. Any companion can be invoked here for pre-deliberation before proposals reach the Senate.</p>',
    '</article>',
    CC.renderFoundationBanner('Invocation pending Borders stage. The Forum stands empty until companion voices arrive.'),
    '</section>',
  ].join('');
};

// --- Scriptorium — the Capital's operational record ---
// A chronological log of the Capital's own runtime events: errors, warnings,
// informational notices. Distinct from the Archives (which reads canonical
// records from Codex via Ostia). The Scriptorium is native: UI-rendered from
// localStorage, no Ostia fetch.
CC.renderLogEntry = function(entry, idx) {
  var level = entry.level || 'info';
  var ts = entry.ts || '';
  var msgDisplay = CC.escHtml(entry.message || '(no message)');
  var contextHtml = '';
  if (entry.context) {
    var ctxStr;
    try { ctxStr = JSON.stringify(entry.context, null, 2); }
    catch (e) { ctxStr = String(entry.context); }
    contextHtml = '<pre class="cc-log-context">' + CC.escHtml(ctxStr) + '</pre>';
  }
  // Parse ISO timestamp into a local civic-style line without constructing
  // a Date from ambiguous strings (canon-0012 is about date-only strings;
  // full ISO timestamps are unambiguous and safe).
  var tsLabel = ts;
  try {
    var d = new Date(ts);
    if (!isNaN(d.getTime())) {
      var pad = function(n) { return n < 10 ? '0' + n : String(n); };
      tsLabel = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
        + ' \u00b7 ' + pad(d.getDate()) + ' ' + (CC.MONTH_NAMES[d.getMonth()] || '') + ' ' + d.getFullYear();
    }
  } catch (e) {}
  return [
    '<article class="cc-log-entry" data-level="' + CC.escAttr(level) + '">',
    '<div class="cc-log-entry-head">',
    '<span class="cc-log-level" data-level="' + CC.escAttr(level) + '">' + CC.escHtml(level) + '</span>',
    '<span class="cc-log-ts">' + CC.escHtml(tsLabel) + '</span>',
    '</div>',
    '<p class="cc-log-message">' + msgDisplay + '</p>',
    contextHtml,
    '</article>',
  ].join('');
};

CC.roomRenderers['scriptorium'] = function(room) {
  var entries = CC.readLog();
  var counts = { error: 0, warn: 0, info: 0 };
  entries.forEach(function(e) {
    if (counts[e.level] != null) counts[e.level]++;
  });
  var summary = [
    '<article class="cc-card">',
    '<div class="cc-card-title">The Scribe\u2019s tally</div>',
    '<dl class="cc-ledger cc-mt-12">',
    '<dt class="cc-ledger-label">Total entries</dt><dd class="cc-ledger-value">' + entries.length + ' of ' + CC.LOG_MAX + '</dd>',
    '<dt class="cc-ledger-label">Errors</dt><dd class="cc-ledger-value">' + counts.error + '</dd>',
    '<dt class="cc-ledger-label">Warnings</dt><dd class="cc-ledger-value">' + counts.warn + '</dd>',
    '<dt class="cc-ledger-label">Notices</dt><dd class="cc-ledger-value">' + counts.info + '</dd>',
    '</dl>',
    '<div class="cc-log-actions cc-mt-16">',
    '<button class="cc-pref-btn cc-pref-btn-ghost" data-action="copyLog">Copy all</button>',
    '<button class="cc-pref-btn cc-pref-btn-ghost" data-action="clearLog">Clear</button>',
    '</div>',
    '</article>',
  ].join('');

  var listHtml;
  if (entries.length === 0) {
    listHtml = [
      '<article class="cc-card">',
      '<div class="cc-card-title">Ledger</div>',
      '<p class="cc-small cc-muted">No entries. The Scribe waits. Operational events will appear here as the Capital runs.</p>',
      '</article>',
    ].join('');
  } else {
    // Most recent first.
    var rendered = entries.slice().reverse().map(CC.renderLogEntry).join('');
    listHtml = [
      '<article class="cc-card cc-log-list-card">',
      '<div class="cc-card-title">Ledger \u2014 most recent first</div>',
      '<div class="cc-log-list cc-mt-12">' + rendered + '</div>',
      '</article>',
    ].join('');
  }

  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    summary,
    listHtml,
    CC.renderFoundationBanner('The Scriptorium is native to the Capital. It holds runtime memory only; canonical chronicling remains with Codex.'),
    '</section>',
  ].join('');
};

// --- Archives ---
CC.roomRenderers['archives'] = function(room) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<article class="cc-card">',
    '<div class="cc-card-title">The Library, consulted from the Capital</div>',
    '<p class="cc-small cc-muted">The Archives call through to Codex (Ostia) and render canonical records in the Capital\u2019s context. Canons, Constitution, journal, lore.</p>',
    '<p class="cc-small cc-mt-16">Sister Province: <a href="https://github.com/Rishabh1804/Codex" data-action="externalLink" data-href="https://github.com/Rishabh1804/Codex">rishabh1804/Codex</a></p>',
    '</article>',
    '<article class="cc-card" id="archivesCanons">',
    '<div class="cc-card-title">Canons</div>',
    '<p class="cc-small cc-muted" id="archivesCanonsBody">Awaiting Codex fetch...</p>',
    '</article>',
    CC.renderFoundationBanner('Live Codex fetch pending Builder decision on runtime-fetch vs build-time bake. See ARCHITECTURE.md section 3.1.'),
    '</section>',
  ].join('');
};

// --- Temple ---
CC.renderBookRow = function(numeral, title, state, stateLabel) {
  return [
    '<div class="cc-book-row">',
    '<span class="cc-book-numeral">' + CC.escHtml(numeral) + '</span>',
    '<span class="cc-book-title">' + CC.escHtml(title) + '</span>',
    '<span class="cc-book-state" data-state="' + CC.escAttr(state) + '">' + CC.escHtml(stateLabel) + '</span>',
    '</div>',
  ].join('');
};

CC.roomRenderers['temple'] = function(room) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<article class="cc-card">',
    '<div class="cc-card-title">The Constitution of the Republic of Codex</div>',
    '<p class="cc-small cc-muted">Nine Books and four Appendices. Drafted across the Constitutional Convention of 15\u201316 April 2026. Canonical text maintained at Codex; displayed here for civic reading.</p>',
    '<p class="cc-mt-16"><a href="https://github.com/Rishabh1804/Codex/blob/main/constitution/constitution-v1.0.pdf" data-action="externalLink" data-href="https://github.com/Rishabh1804/Codex/blob/main/constitution/constitution-v1.0.pdf">Read the Constitution at Codex</a></p>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">The Books of the Constitution</div>',
    '<p class="cc-small cc-muted">Book I is ratified. Books II through IX are drafting-ready \u2014 published as part of Constitution v1.0, awaiting formal Book-level ratification per Book V Article 6.</p>',
    '<div class="cc-books-list cc-mt-12">',
    CC.renderBookRow('Book I',    'The Foundation',                'ratified', 'Ratified 15 Apr 2026'),
    CC.renderBookRow('Book II',   'The Order of the Codex',         'drafting', 'Drafting-ready'),
    CC.renderBookRow('Book III',  'The Provinces',                  'drafting', 'Drafting-ready'),
    CC.renderBookRow('Book IV',   'The Edicts',                     'partial',  'Eight Edicts ratified; Book pending'),
    CC.renderBookRow('Book V',    'Processes and Accountability',   'drafting', 'Drafting-ready'),
    CC.renderBookRow('Book VI',   'Emergency Provisions',           'drafting', 'Drafting-ready'),
    CC.renderBookRow('Book VII',  'The Seams',                      'drafting', 'Drafting-ready'),
    CC.renderBookRow('Book VIII', 'The Living Order',               'drafting', 'Drafting-ready'),
    CC.renderBookRow('Book IX',   'The Economy and Motivation',     'drafting', 'Drafting-ready'),
    '</div>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">The Four Pillars</div>',
    '<p class="cc-small cc-muted">Book I Article 1. Held as self-evident. Bind every Book that follows. Immutable except by unanimous Constitutional Convention with the Sovereign\u2019s sealed assent.</p>',
    '<ol class="cc-pillar-list cc-mt-12">',
    '<li class="cc-pillar"><span class="cc-pillar-numeral">I</span><span class="cc-pillar-name">Nothing Is Wasted</span></li>',
    '<li class="cc-pillar"><span class="cc-pillar-numeral">II</span><span class="cc-pillar-name">The Map Is Not the Territory</span></li>',
    '<li class="cc-pillar"><span class="cc-pillar-numeral">III</span><span class="cc-pillar-name">Growth Is Fractal, Not Linear</span></li>',
    '<li class="cc-pillar"><span class="cc-pillar-numeral">IV</span><span class="cc-pillar-name">Territory Is Earned and Held</span></li>',
    '</ol>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">The Sovereign\u2019s Covenant</div>',
    '<p class="cc-small cc-muted">Book I Article 2. Ratified at founding, 15 April 2026.</p>',
    '<blockquote class="cc-covenant cc-mt-12"><em>No Sovereign is above this Constitution. The rules the Sovereign writes bind the Sovereign also.</em></blockquote>',
    '</article>',
    CC.renderFoundationBanner('The Temple displays; it does not yet ratify. Book ratification ceremonies arrive at Capital Occupancy stage.'),
    '</section>',
  ].join('');
};

// --- Treasury ---
CC.roomRenderers['treasury'] = function(room) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<article class="cc-card">',
    '<div class="cc-card-title">Ashara\u2019s office</div>',
    '<p class="cc-small cc-muted">Treasury Minister. Financial Health domain. Sovereign Dividend, budget proposals, long-horizon fiscal strategy.</p>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">The Republic\u2019s treasury \u2014 Phase 1 Patronage</div>',
    '<p class="cc-small cc-muted">The Republic is currently 100% Architect-funded. Subscription in; envelope out. Two maturation phases follow: Contribution (Provinces generate revenue) and Sovereign Economy (Treasury accumulates reserves). See Book IX.</p>',
    '<dl class="cc-ledger cc-mt-12">',
    '<dt class="cc-ledger-label">Subscription (Ledger A)</dt><dd class="cc-ledger-value">\u20b913,500 / month</dd>',
    '<dt class="cc-ledger-label">Architect\u2019s Personal Slice</dt><dd class="cc-ledger-value">20% default (10\u201330% variable)</dd>',
    '<dt class="cc-ledger-label">Republic Treasury</dt><dd class="cc-ledger-value">80% default</dd>',
    '<dt class="cc-ledger-label">Envelope (Ledger B)</dt><dd class="cc-ledger-value">Monthly token capacity \u2014 the binding constraint</dd>',
    '</dl>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">Per-Province allocation (initial proposal)</div>',
    '<p class="cc-small cc-muted">Book IX Article 4. Unratified \u2014 awaits first Cabinet convening. Percentages of the monthly envelope after the Architect\u2019s Personal Slice is taken.</p>',
    '<dl class="cc-ledger cc-mt-12">',
    '<dt class="cc-ledger-label">Command Center (Monument)</dt><dd class="cc-ledger-value">35%</dd>',
    '<dt class="cc-ledger-label">Codex</dt><dd class="cc-ledger-value">25%</dd>',
    '<dt class="cc-ledger-label">SproutLab</dt><dd class="cc-ledger-value">15%</dd>',
    '<dt class="cc-ledger-label">SEP Invoicing</dt><dd class="cc-ledger-value">15%</dd>',
    '<dt class="cc-ledger-label">SEP Dashboard</dt><dd class="cc-ledger-value">5%</dd>',
    '<dt class="cc-ledger-label">Reserve</dt><dd class="cc-ledger-value">5%</dd>',
    '</dl>',
    '</article>',
    CC.renderResidentList('treasury'),
    CC.renderFoundationBanner('Financial metrics pending. Sovereign Dividend tracking arrives at Regions stage.'),
    '</section>',
  ].join('');
};

// --- Productivity ---
CC.renderCriterion = function(text, state, note) {
  return [
    '<li class="cc-criterion" data-state="' + CC.escAttr(state) + '">',
    '<span class="cc-criterion-state">' + CC.escHtml(state) + '</span>',
    '<div class="cc-criterion-body">',
    '<span class="cc-criterion-text">' + CC.escHtml(text) + '</span>',
    note ? '<span class="cc-criterion-note">' + CC.escHtml(note) + '</span>' : '',
    '</div>',
    '</li>',
  ].join('');
};

CC.roomRenderers['productivity'] = function(room) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<article class="cc-card">',
    '<div class="cc-card-title">Petra\u2019s office</div>',
    '<p class="cc-small cc-muted">Efficiency Minister. Productivity domain. Throughput, capacity, ship-tempo across the Republic.</p>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">Monument progress \u2014 Command Center</div>',
    '<p class="cc-small cc-muted">Five stages per ROADMAP. One floor at a time. Petra-pure scope: a stage is complete or it is not.</p>',
    '<div class="cc-stages-list cc-mt-12">',
    '<div class="cc-stage" data-state="active"><span class="cc-stage-name">Foundation</span><span class="cc-stage-state">In progress</span></div>',
    '<div class="cc-stage" data-state="pending"><span class="cc-stage-name">Capital Occupancy</span><span class="cc-stage-state">Pending</span></div>',
    '<div class="cc-stage" data-state="pending"><span class="cc-stage-name">Roads</span><span class="cc-stage-state">Pending</span></div>',
    '<div class="cc-stage" data-state="pending"><span class="cc-stage-name">Borders</span><span class="cc-stage-state">Pending</span></div>',
    '<div class="cc-stage" data-state="pending"><span class="cc-stage-name">Regions</span><span class="cc-stage-state">Pending</span></div>',
    '</div>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">Foundation Complete \u2014 criterion ledger</div>',
    '<p class="cc-small cc-muted">Honest accounting per ROADMAP Stage 1. No criterion skipped; partials named explicitly. Single source: CC.FOUNDATION_CRITERIA.</p>',
    '<ul class="cc-criteria-list cc-mt-12">',
    (CC.FOUNDATION_CRITERIA || []).map(function(c) {
      return CC.renderCriterion(c.text, c.state, c.note);
    }).join(''),
    '</ul>',
    '</article>',
    CC.renderResidentList('productivity'),
    CC.renderFoundationBanner('Productivity metrics pending Capital Occupancy stage.'),
    '</section>',
  ].join('');
};

// --- Table of Research ---
CC.roomRenderers['table'] = function(room) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<article class="cc-card">',
    '<div class="cc-card-title">Open questions; no decisions</div>',
    '<p class="cc-small cc-muted">The Table is exploratory. Research lives here before proposals form, before positions harden. Not a decisional room.</p>',
    '</article>',
    CC.renderResidentList('table'),
    CC.renderFoundationBanner('Research flows arrive at Borders stage, when Aeon and Pip take their seats in voice.'),
    '</section>',
  ].join('');
};

// --- Minister offices (generic by id) ---
CC.roomRenderers['ministers-orinth'] = function(room) {
  return CC.renderMinisterOffice(room, 'orinth');
};
CC.roomRenderers['ministers-rune'] = function(room) {
  return CC.renderMinisterOffice(room, 'rune');
};
CC.roomRenderers['ministers-bard'] = function(room) {
  return CC.renderMinisterOffice(room, 'bard');
};

CC.renderMinisterOffice = function(room, ministerId) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    CC.renderResidentList(room.id),
    CC.renderFoundationBanner('Minister profile not yet drafted. Scheduled for Round 4\u20135 of the companion profile pass.'),
    '</section>',
  ].join('');
};

// --- Visiting Chambers ---
CC.roomRenderers['visiting'] = function(room) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<article class="cc-card">',
    '<div class="cc-card-title">Invocation surface</div>',
    '<p class="cc-small cc-muted">Itinerants and Province-residents summoned to the Capital appear here. Cipher is the current itinerant \u2014 the Censor travels by function across Provinces.</p>',
    '</article>',
    CC.renderResidentList('visiting'),
    CC.renderFoundationBanner('Invocation pattern pending Borders stage. Cipher\u2019s visiting surface awaits the LLM layer.'),
    '</section>',
  ].join('');
};

// --- Monument Plaza ---
// Progress bar is SVG (canon-0002 compliant: SVG geometry attributes aren't
// inline CSS styles). Green fill = complete criteria; amber fill = partial.
// The remainder is the unfilled track. Numbers drawn from FOUNDATION_CRITERIA.
CC.renderProgressBar = function(complete, partial, total) {
  var pctComplete = total ? (complete / total) * 100 : 0;
  var pctPartial  = total ? (partial  / total) * 100 : 0;
  var pctCompleteStr = pctComplete.toFixed(2);
  var pctPartialStr  = pctPartial.toFixed(2);
  return [
    '<svg class="cc-progress-bar" viewBox="0 0 100 6" preserveAspectRatio="none"',
    ' role="progressbar" aria-valuemin="0"',
    ' aria-valuemax="' + CC.escAttr(String(total)) + '"',
    ' aria-valuenow="' + CC.escAttr(String(complete)) + '"',
    ' aria-label="Foundation progress: ' + CC.escAttr(complete + ' of ' + total + ' complete') + '">',
    '<rect x="0" y="0" width="100" height="6" rx="3" class="cc-progress-track"/>',
    complete ? '<rect x="0" y="0" width="' + pctCompleteStr + '" height="6" class="cc-progress-fill-complete"/>' : '',
    partial  ? '<rect x="' + pctCompleteStr + '" y="0" width="' + pctPartialStr + '" height="6" class="cc-progress-fill-partial"/>' : '',
    '</svg>',
  ].join('');
};

CC.MONUMENT_STAGES = [
  { id: 'foundation',        name: 'Foundation',        state: 'active',   note: 'The Capital is legible and instrumented.' },
  { id: 'capital-occupancy', name: 'Capital Occupancy', state: 'pending',  note: 'The Senate begins convening; decrees author live.' },
  { id: 'roads',             name: 'Roads',             state: 'pending',  note: 'Cross-Province live state flows through the Gates.' },
  { id: 'borders',           name: 'Borders',           state: 'pending',  note: 'Companion voices activate across the Capital.' },
  { id: 'regions',           name: 'Regions',           state: 'pending',  note: 'The Republic is used daily at full scope.' },
];

CC.roomRenderers['plaza'] = function(room) {
  var complete = 0, partial = 0;
  var total = (CC.FOUNDATION_CRITERIA || []).length;
  (CC.FOUNDATION_CRITERIA || []).forEach(function(c) {
    if (c.state === 'complete') complete++;
    else if (c.state === 'partial') partial++;
  });

  var stageBlocks = (CC.MONUMENT_STAGES || []).map(function(s) {
    var stateLabel = s.state === 'active' ? 'In progress'
      : s.state === 'complete' ? 'Complete'
      : 'Pending';
    return [
      '<div class="cc-stage" data-state="' + CC.escAttr(s.state) + '">',
      '<div class="cc-stage-body">',
      '<span class="cc-stage-name">' + CC.escHtml(s.name) + '</span>',
      s.note ? '<span class="cc-stage-note">' + CC.escHtml(s.note) + '</span>' : '',
      '</div>',
      '<span class="cc-stage-state">' + CC.escHtml(stateLabel) + '</span>',
      '</div>',
    ].join('');
  }).join('');

  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<article class="cc-card">',
    '<div class="cc-card-title">Command Center \u2014 the current Monument</div>',
    '<p class="cc-small cc-muted">The Capital is itself a Monument Project. The Plaza displays its stage and progress.</p>',
    '<div class="cc-monument-progress cc-mt-16">',
    '<div class="cc-monument-progress-head">',
    '<span class="cc-monument-progress-stage">Foundation</span>',
    '<span class="cc-monument-progress-count">' + complete + ' of ' + total + ' complete'
      + (partial ? ' \u00b7 ' + partial + ' partial' : '') + '</span>',
    '</div>',
    CC.renderProgressBar(complete, partial, total),
    '<p class="cc-small cc-muted cc-mt-8">See the <a href="#/productivity" data-action="nav" data-target="/productivity">Productivity Office</a> for the full criterion ledger.</p>',
    '</div>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">Monument stages</div>',
    '<div class="cc-stages-list cc-mt-12">' + stageBlocks + '</div>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">Future Monuments</div>',
    '<p class="cc-small cc-muted">Chip / ATMP manufacturing plant (East Singhbhum) \u2014 charter pending. PCB assembly startup \u2014 charter pending. A Monument Project is declared only by Consul proposal and Sovereign ratification per Book IV Edict VI.</p>',
    '</article>',
    CC.renderFoundationBanner('Plaza reads live from the Foundation criterion ledger. When a criterion changes state, the bar re-renders on next load.'),
    '</section>',
  ].join('');
};

// --- Gates ---
CC.roomRenderers['gates'] = function(room) {
  const gates = CC.PROVINCES
    .filter(function(p) { return p.gate_id; })
    .map(function(p) {
      const roleDisplay = CC.escHtml(p.role);
      return [
        '<article class="cc-gate-card">',
        '<div class="cc-gate-name">The ' + CC.escHtml(p.gate_id.charAt(0).toUpperCase() + p.gate_id.slice(1)) + ' Gate</div>',
        '<div class="cc-gate-province">' + CC.escHtml(p.name) + ' \u2014 ' + roleDisplay + '</div>',
        '<div class="cc-gate-description">' + CC.escHtml(p.function) + '</div>',
        '<a class="cc-gate-link" href="' + CC.escAttr(p.live) + '" data-action="externalLink" data-href="' + CC.escAttr(p.live) + '">Visit \u2192</a>',
        '</article>',
      ].join('');
    }).join('');

  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<div class="cc-gates-list">' + gates + '</div>',
    CC.renderFoundationBanner('Live Province state arrives at Roads stage. Currently: links only.'),
    '</section>',
  ].join('');
};

// --- Generic fallback ---
CC.roomRenderers['_generic'] = function(room) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    CC.renderResidentList(room.id),
    CC.renderFoundationBanner(),
    '</section>',
  ].join('');
};
