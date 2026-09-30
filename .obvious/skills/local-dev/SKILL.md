---
name: local-dev
description: How to run and verify the Atlanta Art Map static site locally
---

# Local Dev — DataNeel/atlanta_art_map

Record of the LOCAL-DEV onboarding pass (2026-09-30, sandbox cmp_oysqb1tt).

## What the app is

A static GitHub Pages site: `index.html` loads Mapbox.js v2.0.1 (CDN) plus
`art.js`, which fetches `art.geojson` (40 features), renders clustered markers,
a scrollable thumbnail bar (`#info a.item`), and marker popups. No build step,
no package manager, no tests.

## Run it

```bash
# No dependencies to install. Serve the repo root with any static server:
python3 -m http.server 8000 --bind 127.0.0.1
# then open http://localhost:8000/
```

- Check the port is free first; parse the actual port from server output
  (`Serving HTTP on 127.0.0.1 port 8000` in the log) — do not assume defaults.
- No lock files to clear (no package manager). No env vars required
  (Mapbox token is hardcoded in `art.js`).

## Verify it

1. **HTTP health:** `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/index.html`
   → 200. Same for `art.js`, `art.geojson`, `stylesheets/styles.css`, `images/7.jpg`.
2. **Data integrity:** `python3 -c "import json; print(len(json.load(open('art.geojson'))['features']))"` → 40.
3. **Primary flows (Playwright + headless Chromium).** Browser deps on a fresh
   sandbox: `pip install playwright && python3 -m playwright install chromium
   --only-shell && sudo python3 -m playwright install-deps chromium`.
   Exercised flows:
   - Initial load → `.leaflet-marker-icon` present (markers render/cluster),
     `#info a.item` count == feature count (40), map instance alive.
   - Click a thumbnail → `.leaflet-popup` visible, item gains `active` class,
     popup `<img>` points at a local `images/<id>_thumb.jpg`.
   - Deep link `?piece=7` → popup auto-opens with that piece's picnote.
   - Zero `pageerror` events.
4. **Proof artifacts:** screenshots + `results.json` under `.obvious-install/evidence/`
   (gitignored). The verify script lives at `.obvious-install/verify.py`; if
   `.obvious-install/` was cleaned, recreate the checks from step 3.

## Known issue (do not chase during local-dev setup)

The Mapbox classic basemap `atlantaartmap.jnem740e` is dead upstream:
TileJSON and tiles return HTTP 410 "Classic styles are no longer supported"
(Mapbox deprecated classic styles). Basemap is blank locally AND in
production; markers/popups/thumbnails are unaffected. A fix means swapping in
a new Mapbox style ID + token in `art.js` — a product change requiring owner
sign-off, not part of onboarding.

## Not applicable here

- Lint / typecheck / tests: none exist (static site, no tooling).
- Postgres/Redis/etc.: no backing services.
- `add_image.py` / `replace_image.py`: Python 2 + PIL content utilities;
  they do not run on Python 3 and are not part of local dev verification.
