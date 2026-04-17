/* Command Center — core.js
   Navigation · Utilities · Toasts · Overlays · escHtml/escAttr · Theme
   Foundation Stage v0.1 */

// --- HTML escaping (Hard Rule 4 carry-over from SproutLab) ---
CC.escHtml = function(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};
CC.escAttr = CC.escHtml;

// --- DOM helpers ---
CC.$ = function(sel, root) { return (root || document).querySelector(sel); };
CC.$$ = function(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

// --- State ---
CC.state = {
  current_room: null,
  cache: {},    // Codex JSON local cache
  toast_queue: [],
};

// --- Routing ---
// Hash-based routing: #/senate, #/forum, #/ministers/orinth, etc.
CC.parseRoute = function() {
  const hash = window.location.hash || '#/';
  const path = hash.replace(/^#/, '') || '/';
  return path;
};

CC.roomByRoute = function(path) {
  if (!path || path === '/') return CC.ROOMS[0];
  return CC.ROOMS.find(function(r) { return r.route === path; }) || null;
};

CC.navigate = function(path) {
  if (path.charAt(0) !== '/') path = '/' + path;
  window.location.hash = '#' + path;
};

CC.onRouteChange = function() {
  const path = CC.parseRoute();
  const room = CC.roomByRoute(path);
  if (!room) {
    document.body.setAttribute('data-tonal', 'neutral');
    CC.renderNotFound(path);
    return;
  }
  CC.state.current_room = room.id;
  // Tonal register cascades to card rules, headers, and breadcrumb chip.
  // Charter Art. 4 — spatial metaphor delivered visually.
  document.body.setAttribute('data-tonal', room.tonal_register || 'neutral');
  CC.renderRoom(room);
  CC.renderBreadcrumb(room);
  window.scrollTo(0, 0);
};

// --- Breadcrumb ---
CC.renderBreadcrumb = function(room) {
  const bar = CC.$('#breadcrumbBar');
  if (!bar) return;
  if (room.id === 'home') {
    bar.hidden = true;
    bar.innerHTML = '';
    return;
  }
  bar.hidden = false;
  // Civic signage: middle-dot separator, "The Capital" as formal address,
  // tonal chip declaring the room's register and (for rooms with a
  // ceremonial register) the Consul's implicit modulator context.
  const home = '<a href="#/" data-action="nav" data-target="/">The Capital</a>';
  const sep = '<span class="cc-breadcrumb-sep">\u00b7</span>';
  const name = '<span>' + CC.escHtml(room.name) + '</span>';
  let chip = '';
  const tonal = room.tonal_register;
  if (tonal && tonal !== 'neutral') {
    chip = '<span class="cc-tonal-chip" data-tonal="' + CC.escAttr(tonal) + '">'
      + '<span class="cc-tonal-chip-dot" aria-hidden="true"></span>'
      + CC.escHtml(tonal) + '</span>';
  }
  bar.innerHTML = home + sep + name + chip;
};

// --- Toasts ---
CC.toast = function(message, opts) {
  opts = opts || {};
  const container = CC.$('#toastContainer');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'cc-toast';
  el.textContent = message;
  container.appendChild(el);
  const duration = opts.duration || 3000;
  setTimeout(function() {
    el.style.transition = 'opacity 200ms ease-out';
    el.style.opacity = '0';
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 220);
  }, duration);
};

// --- Theme ---
CC.setTheme = function(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('cc-theme', theme); } catch (e) {}
};
CC.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  CC.setTheme(current === 'dark' ? 'light' : 'dark');
  CC.toast('Theme: ' + (current === 'dark' ? 'light' : 'dark'));
};

// --- Text size ---
CC.setTextSize = function(size) {
  const bases = { low: '12px', med: '14px', high: '17px' };
  if (!bases[size]) return;
  document.documentElement.style.setProperty('--fs-base', bases[size]);
  try { localStorage.setItem('cc-textSize', size); } catch (e) {}
};

CC.THEME_LABELS = { dark: 'Dark', light: 'Light' };
CC.TEXT_SIZE_LABELS = { low: 'Small', med: 'Medium', high: 'Large' };
CC.ORIENTATION_LABELS = { portrait: 'Portrait Only', auto: 'Auto' };

// Small diagnostic block for the Settings overlay — shows whether the last
// applyOrientation call succeeded, and surfaces an install hint when the
// Capital is viewed in a browser tab rather than installed as a PWA.
CC._renderOrientationDiagnostic = function() {
  var pref = CC.getOrientation();
  var standalone = CC.isStandalone();
  var status = CC._orientationLockStatus;
  var lines = [];
  lines.push('Mode: ' + (standalone ? 'Installed app (standalone)' : 'Browser tab'));
  if (!standalone && pref === 'portrait') {
    lines.push('Lock requires the installed Capital app. Install via your browser menu, then launch from the home screen.');
  }
  if (status) {
    if (!status.ok) {
      lines.push('Last lock attempt: ' + status.reason + (status.hint ? ' \u2014 ' + status.hint : ''));
    } else if (pref === 'portrait') {
      lines.push('Last lock attempt: ' + status.reason);
    }
  }
  if (lines.length === 0) return '';
  return '<p class="cc-pref-current cc-pref-diagnostic">' + lines.map(CC.escHtml).join('<br>') + '</p>';
};

// --- Orientation preference ---
// The manifest declares "any" (app permits all orientations). At runtime the
// Sovereign's preference governs: "portrait" applies a JS-level Screen
// Orientation API lock; "auto" releases it and lets the OS auto-rotate
// setting prevail. Default is "portrait" — predictable for phone-first use.
// Screen Orientation API is well-supported on Android Chrome PWAs in
// standalone display mode; in browser-tab mode the lock() call rejects and
// we suppress silently.
CC.getOrientation = function() {
  try {
    var v = localStorage.getItem('cc-orientation');
    if (v === 'portrait' || v === 'auto') return v;
  } catch (e) {}
  return 'portrait';
};

CC.setOrientation = function(pref) {
  if (pref !== 'portrait' && pref !== 'auto') return;
  try { localStorage.setItem('cc-orientation', pref); } catch (e) {}
  // User-initiated change: pass notify so a toast confirms success or surfaces
  // the reason for failure. Boot-time apply stays silent to avoid noise.
  CC.applyOrientation(pref, { notify: true });
};

// Detect PWA standalone mode (as opposed to running in a browser tab).
// Screen Orientation lock() only works in standalone mode on Android Chrome.
CC.isStandalone = function() {
  try {
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
    if (window.navigator && window.navigator.standalone === true) return true;
  } catch (e) {}
  return false;
};

// Tracks the reason applyOrientation last failed (surface in Settings).
CC._orientationLockStatus = null;

CC.applyOrientation = function(pref, opts) {
  opts = opts || {};
  if (typeof screen === 'undefined' || !screen.orientation) {
    CC._orientationLockStatus = { ok: false, reason: 'Screen Orientation API not available in this browser.' };
    return;
  }
  if (pref === 'portrait') {
    if (typeof screen.orientation.lock !== 'function') {
      CC._orientationLockStatus = { ok: false, reason: 'Orientation lock not supported by this browser.' };
      return;
    }
    // Try the more specific lock first; if that rejects with NotSupportedError
    // (some browsers disallow the -primary suffix), fall back to generic 'portrait'.
    var tryLock = function(spec, isFallback) {
      var p;
      try { p = screen.orientation.lock(spec); } catch (e) {
        CC._orientationLockStatus = { ok: false, reason: 'lock threw: ' + (e && e.message || e) };
        if (opts.notify) CC.toast('Lock failed: ' + (e.message || e));
        return;
      }
      if (!p || typeof p.then !== 'function') {
        CC._orientationLockStatus = { ok: true, reason: 'locked (sync) to ' + spec };
        return;
      }
      p.then(function() {
        CC._orientationLockStatus = { ok: true, reason: 'locked to ' + spec };
        if (opts.notify) CC.toast('Orientation locked to portrait.');
      }).catch(function(err) {
        if (!isFallback && /portrait-primary/i.test(spec)) {
          tryLock('portrait', true);
          return;
        }
        var hint = CC.isStandalone()
          ? (err && err.name === 'SecurityError' ? 'Needs user gesture; try toggling again.' : 'Browser refused lock.')
          : 'Install the Capital as an app (Chrome menu -> Install app) so orientation lock can apply. Currently viewing in a browser tab.';
        CC._orientationLockStatus = { ok: false, reason: (err && err.message) || String(err), hint: hint };
        if (opts.notify) CC.toast('Lock failed: ' + hint);
      });
    };
    tryLock('portrait-primary', false);
  } else {
    if (typeof screen.orientation.unlock === 'function') {
      try {
        screen.orientation.unlock();
        CC._orientationLockStatus = { ok: true, reason: 'unlocked (auto)' };
      } catch (e) {
        CC._orientationLockStatus = { ok: false, reason: 'unlock threw: ' + (e && e.message || e) };
      }
    }
  }
};

// If the lock is released by the browser or OS, reapply when the device
// rotates and the Sovereign's preference is still portrait.
CC._orientationListenerBound = false;
CC.bindOrientationListener = function() {
  if (CC._orientationListenerBound) return;
  if (typeof screen === 'undefined' || !screen.orientation || typeof screen.orientation.addEventListener !== 'function') return;
  screen.orientation.addEventListener('change', function() {
    if (CC.getOrientation() === 'portrait') {
      var ot = screen.orientation.type || '';
      if (ot.indexOf('portrait') !== 0) {
        CC.applyOrientation('portrait');
      }
    }
  });
  CC._orientationListenerBound = true;
};

// --- Settings overlay (Foundation — refined; Builders will extend) ---
CC.openSettings = function() {
  const backdrop = CC.$('#overlayBackdrop');
  const overlay = CC.$('#overlayContainer');
  if (!backdrop || !overlay) return;
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const currentSize = localStorage.getItem('cc-textSize') || 'med';
  const currentOrient = CC.getOrientation();
  const themeBtn = function(id) {
    const selected = id === current ? ' aria-pressed="true"' : ' aria-pressed="false"';
    return '<button class="cc-pref-btn" data-action="setTheme" data-theme="' + CC.escAttr(id) + '"' + selected + '>'
      + CC.escHtml(CC.THEME_LABELS[id] || id) + '</button>';
  };
  const sizeBtn = function(id) {
    const selected = id === currentSize ? ' aria-pressed="true"' : ' aria-pressed="false"';
    return '<button class="cc-pref-btn" data-action="setTextSize" data-size="' + CC.escAttr(id) + '"' + selected + '>'
      + CC.escHtml(CC.TEXT_SIZE_LABELS[id] || id) + '</button>';
  };
  const orientBtn = function(id) {
    const selected = id === currentOrient ? ' aria-pressed="true"' : ' aria-pressed="false"';
    return '<button class="cc-pref-btn" data-action="setOrientation" data-orient="' + CC.escAttr(id) + '"' + selected + '>'
      + CC.escHtml(CC.ORIENTATION_LABELS[id] || id) + '</button>';
  };
  overlay.innerHTML = [
    '<h3 class="cc-overlay-title">Settings</h3>',
    '<p class="cc-small cc-muted">Foundation-stage surface. Ashara and Petra will extend this at Capital Occupancy.</p>',
    '<div class="cc-pref-group">',
    '<h4 class="cc-pref-label">Theme</h4>',
    '<div class="cc-pref-row">' + themeBtn('dark') + themeBtn('light') + '</div>',
    '<p class="cc-pref-current">Current: ' + CC.escHtml(CC.THEME_LABELS[current] || current) + '</p>',
    '</div>',
    '<div class="cc-pref-group">',
    '<h4 class="cc-pref-label">Text size</h4>',
    '<div class="cc-pref-row">' + sizeBtn('low') + sizeBtn('med') + sizeBtn('high') + '</div>',
    '<p class="cc-pref-current">Current: ' + CC.escHtml(CC.TEXT_SIZE_LABELS[currentSize] || currentSize) + '</p>',
    '</div>',
    '<div class="cc-pref-group">',
    '<h4 class="cc-pref-label">Orientation</h4>',
    '<div class="cc-pref-row">' + orientBtn('portrait') + orientBtn('auto') + '</div>',
    '<p class="cc-pref-current">Current: ' + CC.escHtml(CC.ORIENTATION_LABELS[currentOrient] || currentOrient) + '. '
      + (currentOrient === 'portrait'
        ? 'The Capital stays portrait regardless of phone auto-rotate.'
        : 'The Capital follows the phone\u2019s auto-rotate setting.') + '</p>',
    CC._renderOrientationDiagnostic(),
    '</div>',
    '<div class="cc-pref-actions">',
    '<button class="cc-pref-btn cc-pref-btn-ghost" data-action="closeOverlay">Close</button>',
    '</div>',
  ].join('');
  backdrop.hidden = false;
  overlay.hidden = false;
};

CC.closeOverlay = function() {
  const backdrop = CC.$('#overlayBackdrop');
  const overlay = CC.$('#overlayContainer');
  if (backdrop) backdrop.hidden = true;
  if (overlay) { overlay.hidden = true; overlay.innerHTML = ''; }
};

// --- 404 ---
CC.renderNotFound = function(path) {
  const root = CC.$('#roomContainer');
  root.innerHTML = [
    '<section class="cc-room">',
    '<div class="cc-room-header">',
    '<div class="cc-room-eyebrow">Not found</div>',
    '<h1 class="cc-room-title">No such room</h1>',
    '<p class="cc-room-subtitle">The Capital has no district at ' + CC.escHtml(path) + '</p>',
    '</div>',
    '<p><a href="#/" data-action="nav" data-target="/">Return to the Capital Overview</a></p>',
    '</section>',
  ].join('');
};

// --- Residence lookups (reads CC.RESIDENCE + Codex companion profiles when fetched) ---
// A companion's *residence* is their primary office/chamber. One residence per companion.
CC.residentsOfRoom = function(roomId) {
  return Object.keys(CC.RESIDENCE).filter(function(cid) {
    const r = CC.RESIDENCE[cid];
    return r.room === roomId || r.chamber === roomId;
  });
};

// A companion's *seating* is any room where they have a seat (Senate seat, committee seat).
// Residents are also seated in their own room. Distinct from residence: Orinth resides in
// her own office but has a seat in the Senate.
CC.seatsInRoom = function(roomId) {
  // Walk CC.ROOMS' residents array (the declarative seat list per room)
  const room = CC.ROOMS.find(function(r) { return r.id === roomId; });
  if (!room || !Array.isArray(room.residents)) return [];
  return room.residents.slice();
};

CC.companionRecord = function(cid) {
  // Returns a synthetic placeholder record until Codex fetch lands.
  // Once ostia.js fetches companions.json, this will read from the cache.
  const cached = CC.state.cache.companions;
  if (cached && Array.isArray(cached.companions)) {
    const found = cached.companions.find(function(c) { return c.id === cid; });
    if (found) return found;
  }
  // Foundation-stage fallback: minimal record sourced from residence metadata.
  return {
    id: cid,
    identity: { name: cid.charAt(0).toUpperCase() + cid.slice(1), title: '', key_trait: '' },
    _placeholder: true,
  };
};

// --- Event delegation (Hard Rule 3: no inline onclick) ---
CC.handleClick = function(e) {
  let target = e.target;
  // Walk up to find data-action
  while (target && target !== document.body) {
    const action = target.getAttribute && target.getAttribute('data-action');
    if (action) {
      e.preventDefault();
      CC.dispatchAction(action, target, e);
      return;
    }
    target = target.parentNode;
  }
};

CC.dispatchAction = function(action, el, e) {
  switch (action) {
    case 'nav': {
      const t = el.getAttribute('data-target');
      if (t) CC.navigate(t);
      break;
    }
    case 'goHome':
      CC.navigate('/');
      break;
    case 'openSettings':
      CC.openSettings();
      break;
    case 'closeOverlay':
      CC.closeOverlay();
      break;
    case 'setTheme': {
      const t = el.getAttribute('data-theme');
      if (t) {
        CC.setTheme(t);
        // Refresh Settings overlay if open so aria-pressed reflects new state.
        const overlay = CC.$('#overlayContainer');
        if (overlay && !overlay.hidden) CC.openSettings();
      }
      break;
    }
    case 'setTextSize': {
      const s = el.getAttribute('data-size');
      if (s) {
        CC.setTextSize(s);
        const overlay = CC.$('#overlayContainer');
        if (overlay && !overlay.hidden) CC.openSettings();
      }
      break;
    }
    case 'setOrientation': {
      const o = el.getAttribute('data-orient');
      if (o) {
        CC.setOrientation(o);
        const overlay = CC.$('#overlayContainer');
        if (overlay && !overlay.hidden) CC.openSettings();
      }
      break;
    }
    case 'navRoom': {
      const rid = el.getAttribute('data-room');
      if (rid) {
        const room = CC.ROOMS.find(function(r) { return r.id === rid; });
        if (room) CC.navigate(room.route);
      }
      break;
    }
    case 'externalLink': {
      const href = el.getAttribute('data-href');
      if (href) window.open(href, '_blank', 'noopener');
      break;
    }
    default:
      // Silent for unknown actions; Builders will add more
      break;
  }
};
