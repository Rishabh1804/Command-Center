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
  const hearthCards = await page.$$('.cc-hearth-card');
  assert(hearthCards.length === 3, 'Hearth has 3 presence cards (got ' + hearthCards.length + ')');
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
