---
name: local-dev
description: How to run and verify the Atlanta Art Map static site locally
---

# Local Dev — DataNeel/atlanta_art_map

Record of the LOCAL-DEV onboarding run (2026-09-24).

## Stack

- Static HTML/CSS/JS site (GitHub Pages, branch `gh-pages`, custom domain `atlantaartmap.com`).
- No package manager, no build step, no tests, no env vars (Mapbox token is hardcoded in `art.js`).
- Content scripts `add_image.py` / `replace_image.py` are Python 2 + PIL — irrelevant to serving the site.

## Steps that worked

1. Serve the repo root: `python3 -m http.server 8000 --bind 127.0.0.1` → http://127.0.0.1:8000. No dependencies to install; no infra to start; no DB.
2. Data check: `python3 -c "import json; d=json.load(open('art.geojson')); print(len(d['features']))"` → 40 features, all image assets present.
3. Syntax check: `node --check art.js`.
4. Browser verification (headless Chromium via Playwright, installed at `/tmp/pw` with system libs from `sudo apt-get install libnss3 libnspr4 ...`):
   - Home: map initializes, markers render, 40 nav thumbnails populate.
   - Deep link `/?piece=40`: popup opens with correct picnote and loaded image.
   - Thumbnail click: popup opens, `active` class set.
   - Screenshots: `/tmp/aam-home.png`, `/tmp/aam-popup.png`.

## Gotchas

- **Basemap is dead upstream:** the Mapbox Classic style `atlantaartmap.jnem740e` returns HTTP 410 (Classic styles deprecated). Expect `requestfailed` console noise and no base tiles — in production too. Markers/popups/nav still work (local data).
- Do not try to run the Python scripts with python3 (`raw_input` / `Image.ANTIALIAS` are Python 2 only).
- No lint/typecheck/test tooling exists — do not invent commands.
