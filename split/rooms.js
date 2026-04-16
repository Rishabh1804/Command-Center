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
      '<span class="cc-resident-status" data-status="' + CC.escAttr(status) + '">' + CC.escHtml(statusLabel) + '</span>',
      '</article>',
    ].join('');
  }).join('');
  return [
    '<h3 class="cc-mt-16">' + CC.escHtml(labelOverride || 'Seated') + '</h3>',
    '<div class="cc-resident-list">' + cards + '</div>',
  ].join('');
};

// --- Capital Overview (home) ---
CC.roomRenderers['home'] = function(room) {
  const roomCards = CC.ROOMS
    .filter(function(r) { return r.id !== 'home'; })
    .map(function(r) {
      const residents = CC.residentsOfRoom(r.id);
      const residentText = residents.length
        ? residents.map(function(id) { return id.charAt(0).toUpperCase() + id.slice(1); }).join(', ')
        : 'No standing residents';
      return [
        '<button class="cc-room-card" data-action="navRoom" data-room="' + CC.escAttr(r.id) + '">',
        '<div class="cc-room-card-name">' + CC.escHtml(r.name) + '</div>',
        '<div class="cc-room-card-function">' + CC.escHtml(r.subtitle || '') + '</div>',
        '<div class="cc-room-card-residents">' + CC.escHtml(residentText) + '</div>',
        '</button>',
      ].join('');
    }).join('');

  return [
    '<section class="cc-room">',
    CC.renderRoomHeader(room),
    '<div class="cc-capital-grid">' + roomCards + '</div>',
    CC.renderFoundationBanner('The Capital is in Foundation stage. Rooms are scaffolded; functions are being built by Ashara and Petra. See ROADMAP.md in the repository for the progression.'),
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
