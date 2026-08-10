# Component Manifest — DataNeel/atlanta_art_map

## Status: Skipped

The `component-manifest-generator` skill requires a root `package.json` to identify and catalog UI components.

This repository is a static GitHub Pages site with no package manager, build system, or component framework. The skill does not apply.

## What exists instead

The site's UI is composed of vanilla HTML/CSS/JS elements:

- **Map container** — Mapbox.js v2.0.1 map with clustered markers (`art.js`)
- **Thumbnail navigation strip** — Horizontal scrollable thumbnail bar for browsing art pieces (`index.html` + `art.js`)
- **Marker popups** — Mapbox popups on marker click with thumbnail and link to full image (`art.js`)
- **Zoom controls** — Custom Leaflet zoom control positioned top-right (`art.js`)

These are not framework components and cannot be cataloged by the manifest generator.
