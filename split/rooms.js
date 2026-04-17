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
    '<h1 class="cc-room-title">' + CC.escHtml(room.name) + '</h1>',
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

// --- Civic Hearth — the Dawn Page of the Capital, per Edict IV ---
// Warm, quiet, inviting. Presence first, activity second, demands never.
// A hearth with an inscribed wall.

CC.renderHearthHeader = function() {
  return [
    '<header class="cc-hearth-header">',
    '<div class="cc-hearth-eyebrow">The Capital Stands</div>',
    '<div class="cc-hearth-date">' + CC.escHtml(CC.formatCivicDate()) + '</div>',
    '<p class="cc-hearth-stage">',
    'The Capital is at Foundation. The Senate is scaffolded but does not yet convene. ',
    'The Ministers hold their offices. The Gates are open. The Library is within reach.',
    '</p>',
    '</header>',
  ].join('');
};

// Living cards: latest decree, latest canon, undrafted profile count.
// Each card is presence, not telemetry. Nothing blinks. Nothing demands.
CC.renderHearthCards = function() {
  var cards = [];

  // Card 1 — the Capital's most recent outbound decree.
  // Currently a single known decree; future: read CC.state.decrees (ledger).
  cards.push([
    '<article class="cc-hearth-card">',
    '<div class="cc-hearth-card-label">Latest Decree</div>',
    '<div class="cc-hearth-card-body">Decree 0001 \u2014 Ashara &amp; Petra profiles ratified to v0.4.</div>',
    '<div class="cc-hearth-card-meta">Chronicled 17 Apr 2026 \u00b7 first outbound decree from the Capital</div>',
    '</article>',
  ].join(''));

  // Card 2 — most recent canon ratified.
  var canonsData = (CC.state.cache && CC.state.cache.canons) || null;
  var canonLine = 'Fetching from the Library.';
  var canonMeta = 'Consulted via Ostia';
  if (canonsData && Array.isArray(canonsData.canons) && canonsData.canons.length > 0) {
    // Sort by created descending; fall back to array order.
    var sorted = canonsData.canons.slice().sort(function(a, b) {
      var da = a && a.created ? String(a.created) : '';
      var db = b && b.created ? String(b.created) : '';
      if (da < db) return 1;
      if (da > db) return -1;
      return 0;
    });
    var latest = sorted[0] || canonsData.canons[canonsData.canons.length - 1];
    if (latest) {
      var title = latest.title || latest.rule || latest.id || '(untitled)';
      canonLine = CC.escHtml(title);
      var metaParts = [];
      if (latest.id) metaParts.push(CC.escHtml(latest.id));
      if (latest.created) metaParts.push('ratified ' + CC.escHtml(CC.formatDateShort(latest.created)));
      canonMeta = metaParts.join(' \u00b7 ') || 'consulted via Ostia';
    }
  } else {
    canonLine = '<em>' + canonLine + '</em>';
  }
  cards.push([
    '<article class="cc-hearth-card">',
    '<div class="cc-hearth-card-label">Latest Canon</div>',
    '<div class="cc-hearth-card-body">' + canonLine + '</div>',
    '<div class="cc-hearth-card-meta">' + canonMeta + '</div>',
    '</article>',
  ].join(''));

  // Card 3 — undrafted Gen 0 profiles (honest count, encourages Cabinet).
  var companionsData = (CC.state.cache && CC.state.cache.companions) || null;
  var drafted = 0;
  var total = (CC.GEN_ZERO_IDS || []).length;
  if (companionsData && Array.isArray(companionsData.companions)) {
    companionsData.companions.forEach(function(c) {
      if (CC.GEN_ZERO_IDS.indexOf(c.id) !== -1) drafted++;
    });
  }
  var undrafted = total - drafted;
  var orderLine = undrafted === 0
    ? 'The Order is fully profiled.'
    : undrafted + ' of ' + total + ' Gen 0 companions await profile drafting.';
  var orderMeta = total > 0
    ? drafted + ' of ' + total + ' profiles present in Codex'
    : 'Awaiting Ostia fetch';
  cards.push([
    '<article class="cc-hearth-card">',
    '<div class="cc-hearth-card-label">The Order</div>',
    '<div class="cc-hearth-card-body">' + CC.escHtml(orderLine) + '</div>',
    '<div class="cc-hearth-card-meta">' + CC.escHtml(orderMeta) + '</div>',
    '</article>',
  ].join(''));

  return '<div class="cc-hearth-cards">' + cards.join('') + '</div>';
};

// City map — rooms as districts. Charter Art. 4: the Capital is a city.
CC.renderRoomTileCard = function(r) {
  var residents = CC.residentsOfRoom(r.id);
  var residentText = residents.length
    ? residents.map(function(id) { return id.charAt(0).toUpperCase() + id.slice(1); }).join(', ')
    : 'No standing residents';
  return [
    '<button class="cc-room-card" data-action="navRoom" data-room="' + CC.escAttr(r.id) + '">',
    '<div class="cc-room-card-name">' + CC.escHtml(r.name) + '</div>',
    '<div class="cc-room-card-function">' + CC.escHtml(r.subtitle || '') + '</div>',
    '<div class="cc-room-card-residents">' + CC.escHtml(residentText) + '</div>',
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
    CC.renderSeatList('senate', 'Senate seats'),
    CC.renderFoundationBanner('The Senate is scaffolded but does not yet convene. Capital Occupancy (Stage 2) unlocks Cabinet meetings.'),
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
CC.roomRenderers['temple'] = function(room) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<article class="cc-card">',
    '<div class="cc-card-title">The Constitution of the Republic of Codex</div>',
    '<p class="cc-small cc-muted">Nine Books. Drafted across the Constitutional Convention, 15\u201316 April 2026. Maintained at Codex; displayed here.</p>',
    '<p class="cc-mt-16"><a href="https://github.com/Rishabh1804/Codex/blob/main/constitution/constitution-v1.0.pdf" data-action="externalLink" data-href="https://github.com/Rishabh1804/Codex/blob/main/constitution/constitution-v1.0.pdf">Read the Constitution (Codex)</a></p>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">The Sovereign\u2019s Covenant</div>',
    '<p class="cc-small cc-muted">Book I Article 2. Ratified at founding.</p>',
    '<p class="cc-small cc-mt-16"><em>\u201CNothing is wasted. The map is not the territory. Growth is fractal, not linear.\u201D</em></p>',
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
    CC.renderResidentList('treasury'),
    CC.renderFoundationBanner('Financial metrics pending. Sovereign Dividend tracking arrives at Regions stage.'),
    '</section>',
  ].join('');
};

// --- Productivity ---
CC.roomRenderers['productivity'] = function(room) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<article class="cc-card">',
    '<div class="cc-card-title">Petra\u2019s office</div>',
    '<p class="cc-small cc-muted">Efficiency Minister. Productivity domain. Throughput, capacity, ship-tempo across the Republic.</p>',
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
CC.roomRenderers['plaza'] = function(room) {
  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<article class="cc-card">',
    '<div class="cc-card-title">Command Center \u2014 the current Monument</div>',
    '<p class="cc-small cc-muted">The Capital is itself a Monument Project. Stage: <strong>Foundation</strong>.</p>',
    '<div class="cc-mt-16">',
    '<p class="cc-small"><strong>Foundation</strong> \u2014 in progress. The Capital is legible.</p>',
    '<p class="cc-small cc-muted">Capital Occupancy \u2014 pending.</p>',
    '<p class="cc-small cc-muted">Roads \u2014 pending.</p>',
    '<p class="cc-small cc-muted">Borders \u2014 pending.</p>',
    '<p class="cc-small cc-muted">Regions \u2014 pending.</p>',
    '</div>',
    '</article>',
    '<article class="cc-card">',
    '<div class="cc-card-title">Future Monuments</div>',
    '<p class="cc-small cc-muted">Chip / ATMP manufacturing plant (East Singhbhum) \u2014 charter pending. PCB assembly startup \u2014 charter pending.</p>',
    '</article>',
    CC.renderFoundationBanner('Monument progress visualization arrives at Capital Occupancy.'),
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
