/* Command Center — smoketest.js
 *
 * Pre-ship verification harness. Loads the built index.html in headless
 * Chromium, walks every room, asserts minimal invariants, captures
 * console errors. Runs before commit to catch the regressions that
 * manifest-based review cannot.
 *
 * Usage (from Command-Center repo root):
 *   node tools/smoketest.js
 *
 * Canon-gov-009: instrumentation before feature.
 * Canon-gov-010: this harness is how "tested in browser" becomes truthful.
 */

'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const REPO_ROOT = path.resolve(__dirname, '..');
const INDEX_URL = 'file://' + path.join(REPO_ROOT, 'index.html');

const ROUTES = [
  '#/',
  '#/senate',
  '#/consul',
  '#/order',
  '#/forum',
  '#/archives',
  '#/scriptorium',
  '#/temple',
  '#/treasury',
  '#/productivity',
  '#/table',
  '#/ministers/orinth',
  '#/ministers/rune',
  '#/ministers/bard',
  '#/visiting',
  '#/plaza',
  '#/gates',
];

let failures = 0;
let checks = 0;

function assert(condition, label) {
  checks++;
  if (condition) {
    console.log('  ok  ' + label);
  } else {
    failures++;
    console.log('  FAIL ' + label);
  }
}

async function main() {
  if (!fs.existsSync(path.join(REPO_ROOT, 'index.html'))) {
    console.error('index.html not found; run bash split/build.sh first.');
    process.exit(2);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },  // iPhone 14-ish phone viewport
    deviceScaleFactor: 3,
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  console.log('Loading ' + INDEX_URL);
  await page.goto(INDEX_URL, { waitUntil: 'load' });

  // Wait briefly for boot() and initial render
  await page.waitForTimeout(300);

  console.log('\n=== Hearth invariants ===');
  const heartHeader = await page.$('.cc-hearth-header');
  assert(!!heartHeader, 'Hearth header present at /');
  const civicDate = await page.$('.cc-hearth-date');
  assert(!!civicDate, 'Civic date rendered on Hearth');
  const hearthTiles = await page.$$('.cc-hearth-tile');
  assert(hearthTiles.length >= 4 && hearthTiles.length <= 6,
    'Hearth has 4-6 bulletin tiles (got ' + hearthTiles.length + ')');
  // Every tile must carry an icon SVG — civic iconography is load-bearing.
  const tileIcons = await page.$$('.cc-hearth-tile-icon svg');
  assert(tileIcons.length === hearthTiles.length,
    'Each Hearth tile has an icon (' + tileIcons.length + ' icons, ' + hearthTiles.length + ' tiles)');
  // Monument tile carries an embedded progressbar.
  const tileProgress = await page.$('.cc-hearth-tile-progress [role="progressbar"]');
  assert(!!tileProgress, 'Monument tile embeds a progressbar');
  const districts = await page.$$('.cc-district');
  assert(districts.length === 5, 'City map has 5 districts (got ' + districts.length + ')');
  const chronicle = await page.$('.cc-chronicle-strip');
  assert(!!chronicle, 'Chronicle inscription strip rendered');
  const footer = await page.$('#capitalFooter');
  assert(!!footer, 'Civic footer present');

  console.log('\n=== Room routes ===');
  for (const route of ROUTES) {
    await page.evaluate(r => { window.location.hash = r; }, route);
    await page.waitForTimeout(80);
    const tonal = await page.getAttribute('body', 'data-tonal');
    const roomEl = await page.$('.cc-room');
    assert(!!roomEl, 'route ' + route + ' renders a room');
    if (!roomEl) continue;
    // Home uses .cc-hearth-date as its title surface; other rooms use .cc-room-title.
    const titleSel = route === '#/' ? '.cc-hearth-date' : '.cc-room-title';
    const titleEl = await page.$(titleSel);
    assert(!!titleEl, 'route ' + route + ' has a title element (' + titleSel + ', tonal=' + tonal + ')');
    if (!titleEl) continue;
    const title = await titleEl.textContent();
    assert(!!title && title.trim().length > 0, 'route ' + route + ' title is non-empty');
    // No horizontal overflow — documentElement.scrollWidth must not exceed
    // innerWidth at the 390px phone viewport. Catches the Temple book-row
    // class of bug where long state pills push cards past the viewport.
    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      inner: window.innerWidth,
    }));
    assert(overflow.scroll <= overflow.inner,
      'route ' + route + ' no horizontal overflow (scrollWidth=' + overflow.scroll + ', innerWidth=' + overflow.inner + ')');
    // Room icon present on every room except the Hearth. The Hearth uses the
    // civic date as its own visual anchor in place of a header icon.
    if (route !== '#/') {
      const iconEl = await page.$('.cc-room-icon-lg svg');
      assert(!!iconEl, 'route ' + route + ' renders a room icon');
    }
  }

  console.log('\n=== Scriptorium invariants ===');
  await page.evaluate(() => { window.location.hash = '#/scriptorium'; });
  await page.waitForTimeout(100);
  const scribeTally = await page.$$('.cc-log-entry');
  // Boot logs at least one 'Capital booted' info entry
  assert(scribeTally.length >= 1, 'Scriptorium has at least one entry (boot record)');
  const levelPill = await page.$('.cc-log-level[data-level="info"]');
  assert(!!levelPill, 'info-level pill rendered');

  console.log('\n=== Settings overlay ===');
  await page.evaluate(() => { window.location.hash = '#/'; });
  await page.waitForTimeout(100);
  await page.click('[data-action="openSettings"]');
  await page.waitForTimeout(80);
  const overlay = await page.$('#overlayContainer:not([hidden])');
  assert(!!overlay, 'Settings overlay opens');
  const themeButtons = await page.$$('[data-action="setTheme"]');
  assert(themeButtons.length === 2, 'Theme has 2 buttons (dark/light)');
  const sizeButtons = await page.$$('[data-action="setTextSize"]');
  assert(sizeButtons.length === 3, 'Text size has 3 buttons (low/med/high)');
  const orientButtons = await page.$$('[data-action="setOrientation"]');
  assert(orientButtons.length === 0, 'No orientation setting (feature deferred)');

  // Text-size scale: Small=14, Medium=17, Large=21 after 17 Apr 2026 walk.
  console.log('\n=== Text-size scale ===');
  const sizeChecks = [
    { size: 'low',  label: 'Small',  expected: '14px' },
    { size: 'med',  label: 'Medium', expected: '17px' },
    { size: 'high', label: 'Large',  expected: '21px' },
  ];
  for (const c of sizeChecks) {
    await page.click('[data-action="setTextSize"][data-size="' + c.size + '"]');
    await page.waitForTimeout(40);
    const applied = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue('--fs-base').trim()
    );
    assert(applied === c.expected,
      'TextSize ' + c.label + ' (' + c.size + ') sets --fs-base to ' + c.expected + ' (got "' + applied + '")');
  }

  // Overflow must hold at Large size too — pill text widest at 21px base.
  // Temple carries the long state labels; that's the worst case.
  console.log('\n=== Overflow at Large size (Temple) ===');
  await page.click('[data-action="closeOverlay"]');
  await page.waitForTimeout(40);
  await page.evaluate(() => { window.location.hash = '#/temple'; });
  await page.waitForTimeout(80);
  const templeOverflow = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    inner: window.innerWidth,
  }));
  assert(templeOverflow.scroll <= templeOverflow.inner,
    'Temple no horizontal overflow at Large (scrollWidth=' + templeOverflow.scroll + ', innerWidth=' + templeOverflow.inner + ')');

  // The Order — hierarchy + flippable card
  console.log('\n=== The Order ===');
  await page.evaluate(() => { window.location.hash = '#/order'; });
  await page.waitForTimeout(100);
  const orderSections = await page.$$('.cc-order-section');
  assert(orderSections.length === 7,
    'Order renders 7 hierarchy sections (got ' + orderSections.length + ')');
  const sovereignMember = await page.$('.cc-order-member-sovereign');
  assert(!!sovereignMember, 'Sovereign card present at top of Order');
  const orderMembers = await page.$$('.cc-order-member');
  assert(orderMembers.length >= 18,
    'Order shows 18+ member cards (Sovereign + 17 Gen 0, some shown twice for dual roles) (got ' + orderMembers.length + ')');
  // Open a companion card and verify flippability
  await page.click('.cc-order-member[data-companion="ashara"]');
  await page.waitForTimeout(100);
  const compCard = await page.$('.cc-comp-card[data-flipped="false"]');
  assert(!!compCard, 'Companion card overlay opens for Ashara');
  const compName = await page.$('.cc-comp-name');
  assert(!!compName, 'Companion card carries a name');
  // Flip it
  await page.click('[data-action="flipCompanion"]');
  await page.waitForTimeout(100);
  const compFlipped = await page.$('.cc-comp-card[data-flipped="true"]');
  assert(!!compFlipped, 'Companion card flips on action');
  await page.click('[data-action="closeOverlay"]');
  await page.waitForTimeout(40);

  // Accessibility surface checks
  console.log('\n=== Accessibility ===');
  const skipLink = await page.$('.cc-skip-link');
  assert(!!skipLink, 'Skip-to-content link present');
  await page.evaluate(() => { window.location.hash = '#/plaza'; });
  await page.waitForTimeout(80);
  const progressBar = await page.$('[role="progressbar"]');
  assert(!!progressBar, 'Monument Plaza exposes a progressbar role for AT');
  await page.evaluate(() => { window.location.hash = '#/senate'; });
  await page.waitForTimeout(80);
  const ariaCurrent = await page.$('[aria-current="location"]');
  assert(!!ariaCurrent, 'Breadcrumb marks current room with aria-current');

  console.log('\n=== Runtime errors ===');
  assert(pageErrors.length === 0, 'No uncaught page errors (' + pageErrors.length + ')');
  if (pageErrors.length) pageErrors.forEach(e => console.log('    > ' + e));

  // Sandbox network failures are expected — the runsc container has no valid
  // TLS chain to raw.githubusercontent.com, so Ostia fetches fail. The app
  // correctly logs these via the Scriptorium (CC.log -> console.error), which
  // is the designed behavior. Exclude them from the unexpected-error count.
  const EXPECTED_IN_SANDBOX = [
    'ERR_CERT_AUTHORITY_INVALID',
    'Ostia fetch failed',
    'Failed to load resource',
    'Failed to fetch',
  ];
  const unexpectedErrors = consoleErrors.filter(err =>
    !EXPECTED_IN_SANDBOX.some(sub => err.indexOf(sub) !== -1)
  );
  assert(unexpectedErrors.length === 0, 'No unexpected console.error (' + unexpectedErrors.length + ', excluding known sandbox network failures)');
  if (unexpectedErrors.length) unexpectedErrors.forEach(e => console.log('    > ' + e));

  // Verify Scriptorium captured the Ostia failures as expected
  const scribeErrors = await page.evaluate(() => {
    const arr = JSON.parse(localStorage.getItem('cc-log') || '[]');
    return arr.filter(e => e.level === 'error').length;
  });
  assert(scribeErrors >= 1, 'Scriptorium captured at least one error from Ostia failure (got ' + scribeErrors + ')');

  console.log('\n=== Summary ===');
  console.log('  checks: ' + checks + ', failures: ' + failures);

  await browser.close();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(err => {
  console.error('smoketest crashed:', err);
  process.exit(2);
});
