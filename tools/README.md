# Command Center — tools

Pre-ship verification for the Capital.

## What's here

- `smoketest.js` — Playwright-backed headless Chromium harness. Loads the built `index.html` at a phone viewport (390x844), walks every route, asserts structural invariants, verifies error capture, returns non-zero on any unexpected failure.
- `package.json` — Playwright dev dependency + npm scripts.
- `node_modules/` — gitignored. Install with `npm install` from this directory.

## First-time setup

```bash
cd tools
npm install
npx playwright install chromium
```

## Running

```bash
# from Command-Center/tools
npm run verify     # builds then smoketests
# or
npm run smoketest  # smoketest only, against whatever index.html exists at repo root
```

## When to run

Before every commit that touches `split/*.js`, `split/*.css`, `split/template.html`, or `split/build.sh`. Catches regressions that static review misses — render errors, routing breakage, new runtime console errors, missing selectors.

## What's verified (current)

- Hearth rendering: civic date, three presence cards, five districts, chronicle strip, footer
- Every route resolves and renders a room with a non-empty title
- Tonal register cascades to `body[data-tonal]` per room
- Scriptorium captures boot event + Ostia fetch failures (error level)
- Settings overlay opens with the expected button counts
- No uncaught page errors
- No unexpected console.error calls (known sandbox network failures are whitelisted and confirmed to flow through the Scriptorium as designed)

## Canons honored

- `canon-gov-007` (research before implement) — smoketest surfaces browser-specific issues the sandbox alone cannot
- `canon-gov-009` (instrument before features) — Scriptorium + smoketest together make runtime state observable
- `canon-gov-010` (label untested work honestly) — with smoketest running, "tested in browser" is a provable commit claim, not a hand-wave

## Extending

Add an assertion to `smoketest.js`'s `main()`. Follow the `assert(condition, label)` pattern; the label appears in the summary.

For routes, append to `ROUTES`. For new rooms with non-standard title surfaces, mirror the Hearth special-case.
