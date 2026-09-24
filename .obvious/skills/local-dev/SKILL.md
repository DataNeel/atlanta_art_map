---
name: local-dev
description: How to run and verify the Atlanta Art Map static site locally
---

# Local Dev — DataNeel/atlanta_art_map

## Stack
Static HTML/CSS/JS site (GitHub Pages, branch `gh-pages`). No package manager,
no build step, no test framework. Mapbox.js v2.0.1 via CDN. Data in `art.geojson`.

## Run
```bash
python3 -m http.server 8321 --bind 127.0.0.1
# open http://127.0.0.1:8321/
```
Any static file server works; there is no canonical dev server in the repo.
Parse the actual port from the server output — do not assume a default.

## Verify (canonical flow)
1. All local assets return 200: `index.html`, `art.js`, `art.geojson`,
   `stylesheets/styles.css`, `lazysizes.min.js`, `images/<n>.jpg`.
2. GeoJSON integrity: `python3 -c "import json; json.load(open('art.geojson'))"`
   (40 features at last check).
3. Browser check (Playwright + headless Chromium works):
   - `document.querySelector('#map-one')` exists.
   - `.leaflet-marker-icon` elements render (markers come from local
     `art.geojson`, so they render even if Mapbox tiles fail).
   - Deep link `index.html?piece=1` opens a popup with `picnote` text.
   - Capture a screenshot as evidence.

## Known issues
- Console errors for `a.tiles.mapbox.com/.../ TileJSON` (CORS): pre-existing —
  Mapbox.js v2.0.1 requests TileJSON over plain `http://` and the legacy
  endpoint does not send CORS headers. Not a local-dev defect; markers and
  popups still work. Tiles may be blank in some environments.

## Content tooling (manual, not part of dev loop)
`add_image.py` / `replace_image.py` are Python 2 + PIL scripts that resize
images and update `art.geojson`. Run manually; not verified here.
