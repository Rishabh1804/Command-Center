/* Command Center — ostia.js
   Codex integration. The Capital's link to the Library (Ostia).
   Foundation Stage v0.1 \u2014 fetcher + snippet exporter stubs.

   Two responsibilities:
     1. Read path  \u2014 fetch canonical records from Codex and render in the Capital.
     2. Write path \u2014 produce Aurelius-format snippets for Codex's import pipeline.

   Builder note (Ashara, Petra): the runtime-fetch vs build-time-bake decision
   is open. Stubs below implement runtime fetch with localStorage cache fallback,
   but both strategies are valid. See ARCHITECTURE.md section 3.1. */

CC.ostia = {};

// --- Cache ---
CC.ostia.CACHE_KEY_PREFIX = 'cc-codex-cache-';
CC.ostia.CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes; revisit at Roads stage

CC.ostia.readCache = function(fileKey) {
  try {
    const raw = localStorage.getItem(CC.ostia.CACHE_KEY_PREFIX + fileKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed._fetched_at) return null;
    if (Date.now() - parsed._fetched_at > CC.ostia.CACHE_TTL_MS) return null;
    return parsed.data;
  } catch (e) { return null; }
};

CC.ostia.writeCache = function(fileKey, data) {
  try {
    localStorage.setItem(CC.ostia.CACHE_KEY_PREFIX + fileKey, JSON.stringify({
      _fetched_at: Date.now(),
      data: data,
    }));
  } catch (e) {
    // Storage failure is non-fatal \u2014 Capital still renders, just refetches next time
    console.warn('CC.ostia: cache write failed', e);
  }
};

// --- Fetch ---
CC.ostia.fetch = function(fileKey) {
  // fileKey: 'companions' | 'canons' | 'journal' | 'lore' | 'constitution'
  const filename = CC.CODEX.files[fileKey];
  if (!filename) {
    return Promise.reject(new Error('CC.ostia.fetch: unknown fileKey ' + fileKey));
  }

  // Check cache first
  const cached = CC.ostia.readCache(fileKey);
  if (cached) {
    CC.state.cache[fileKey] = cached;
    return Promise.resolve(cached);
  }

  const url = CC.CODEX.base_raw + filename;
  return fetch(url, { cache: 'no-cache' })
    .then(function(resp) {
      if (!resp.ok) throw new Error('Ostia fetch failed: ' + resp.status + ' for ' + filename);
      return resp.json();
    })
    .then(function(data) {
      CC.state.cache[fileKey] = data;
      CC.ostia.writeCache(fileKey, data);
      return data;
    });
};

// --- Render hook: once companions.json is cached, refresh resident cards ---
CC.ostia.onCompanionsFetched = function() {
  // If the current room shows a resident list, re-render to pick up real profiles
  if (!CC.state.current_room) return;
  const room = CC.ROOMS.find(function(r) { return r.id === CC.state.current_room; });
  if (room) CC.renderRoom(room);
};

// --- Canons rendering helper (used by Archives room) ---
CC.ostia.renderCanonsInto = function(el) {
  if (!el) return;
  el.textContent = 'Fetching from Codex...';
  CC.ostia.fetch('canons')
    .then(function(data) {
      if (!data || !Array.isArray(data.canons)) {
        el.innerHTML = '<em>Canons file received but shape unexpected. Ashara + Petra to inspect at Capital Occupancy.</em>';
        return;
      }
      const count = data.canons.length;
      const recent = data.canons.slice(-5).reverse();
      const lines = recent.map(function(c) {
        const id = CC.escHtml(c.id || '?');
        const title = CC.escHtml(c.title || c.rule || '(untitled)');
        return '<li><strong>' + id + '</strong> \u2014 ' + title + '</li>';
      }).join('');
      el.innerHTML = [
        '<p>' + count + ' canons in the Library.</p>',
        '<p class="cc-small cc-muted">Most recent:</p>',
        '<ul class="cc-small">' + lines + '</ul>',
      ].join('');
    })
    .catch(function(err) {
      el.innerHTML = '<em>Could not reach Codex. ' + CC.escHtml(err.message || 'Unknown error') + '</em>';
    });
};

// --- Snippet export (write path, placeholder) ---
// Builders will develop this at Capital Occupancy stage. Shape mirrors the
// Aurelius snippet format used by Codex's existing pipeline.
CC.ostia.buildSnippet = function(operations) {
  // operations: array of { type: 'new_canons'|'new_chapters'|'update_companions'|..., payload: {...} }
  return {
    _schema: 'aurelius-snippet-v1',
    _source: 'command-center',
    _authored: new Date().toISOString(),
    operations: operations || [],
  };
};

CC.ostia.exportSnippet = function(snippet) {
  // Foundation stage: download as JSON for manual import to Codex.
  // Future: transmit via agent surface or GitHub API.
  const blob = new Blob([JSON.stringify(snippet, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cc-snippet-' + Date.now() + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  CC.toast('Snippet exported. Import to Codex via the snippet pipeline.');
};

// --- Auto-fetch at startup (non-blocking) ---
CC.ostia.warmStart = function() {
  CC.ostia.fetch('companions')
    .then(function() { CC.ostia.onCompanionsFetched(); })
    .catch(function(err) {
      console.warn('CC.ostia: initial companions fetch failed \u2014 Capital renders from residence data only', err.message);
    });
};
