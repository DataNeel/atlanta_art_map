# Codebase Map

| Path | Purpose |
|---|---|
| `index.html` | Single page — head loads Mapbox.js v2.0.1 + leaflet.markercluster (CDN) and lazysizes (local); body has nav bar, `#map-one` map container, `#info` thumbnail strip |
| `art.js` | All app logic (~122 lines): map init with Atlanta bounds/zoom, loads `art.geojson` into a marker-cluster layer, popups, `?piece=` deep links, thumbnail nav, zoom-responsive icon sizing |
| `art.geojson` | Content data — 40 art-piece features (coordinates, pieceID, picnote, image paths) |
| `art.geojson.bak` | Backup copy of `art.geojson` written by `add_image.py` |
| `images/` | Per-piece images `{id}.jpg`, `{id}_thumb.jpg`, `{id}_nav.jpg`, `{id}_icon.png` (ids 1–40) plus `icon_mask.png` used to mask icons |
| `stylesheets/` | `styles.css` — layout, map popups, thumbnail nav, marker clusters |
| `add_image.py` | Python 2 + PIL interactive script — adds a new piece: resizes image into 4 sizes, inserts feature into `art.geojson` |
| `replace_image.py` | Python 2 + PIL interactive script — regenerates the 4 image sizes for an existing piece ID |
| `lazysizes.min.js` | Vendored lazy-loading library for nav thumbnails |
| `CNAME` | Custom domain `atlantaartmap.com` (GitHub Pages) |
