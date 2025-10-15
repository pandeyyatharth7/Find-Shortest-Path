# Fastest Path Finder

A Next.js application that finds the fastest route between two locations with a free, keyless mapping stack.

## What’s inside

- Map rendering: Leaflet (loaded via CDN) + OpenStreetMap tiles
- Geocoding: Nominatim (https://nominatim.openstreetmap.org)
- Routing: OSRM demo server (https://router.project-osrm.org) using the `car` profile
- API: Next.js App Router endpoint at `/api/directions` that geocodes and requests directions server-side
- UI: Clean, responsive form with interactive map, route polyline, and statistics (distance and duration)

## Why this stack?

- Free to use and no API keys required for development
- No client-side secrets are exposed
- Standards-based GeoJSON geometry returned from the API for easy rendering

## Setup

You can use the code in two ways:

- In v0:
  - Download ZIP: Click the three dots (⋯) in the top-right of the code block and choose “Download ZIP”
  - Publish: Click “Publish” to deploy on Vercel directly from v0

- Locally (optional):
  1. Clone the repository
  2. Install dependencies: `npm install`
  3. Start the dev server: `npm run dev`
  4. Open http://localhost:3000

No environment variables are required.

## Usage

1. Enter a Source address
2. Enter a Destination address
3. Click “Search”
4. You’ll see:
   - An interactive map centered on the route (OpenStreetMap tiles)
   - Start and end markers
   - Route polyline
   - Route statistics: total distance and estimated travel time

## Architecture

- Frontend (client):
  - Renders the map using Leaflet (loaded via a script tag in `app/layout.tsx`)
  - Draws the route polyline and markers and auto-fits bounds

- Backend (server):
  - `/api/directions`:
    - Geocodes Source and Destination using Nominatim
    - Queries the OSRM demo server for directions
    - Responds with distance, duration, step info, and GeoJSON LineString coordinates

## Important notes

- Public services are rate‑limited:
  - Nominatim and the OSRM demo server are shared resources. For production, consider hosting your own instances or using a provider with SLAs.
- Tiles usage:
  - Default OSM tiles are intended for light usage. For higher traffic, use a commercial tile provider (e.g., MapTiler, Mapbox) and update the tile URL in the map component.

## Troubleshooting

- “Modules must be served with a valid MIME type” for leaflet:
  - Fixed by loading Leaflet via CDN rather than importing the npm module. This is already set up in `app/layout.tsx`.
- Blank map initially:
  - The script loads asynchronously. Wait a moment or refresh; the map initializes once `window.L` is available.
- “Error finding route”:
  - Check that the addresses are valid and include sufficient locality (city/country) so Nominatim can geocode them.
  - Rate limits may temporarily block requests—try again later.

## Migration from Google Maps

Previously this project referenced Google Maps. It now uses:
- OpenStreetMap (tiles) + Leaflet for rendering
- Nominatim (geocoding) and OSRM (routing)
- No `GOOGLE_MAPS_API_KEY` is required anymore (and any `.env` entry for it can be removed).

## License and Attribution

- Map data © OpenStreetMap contributors
- Routing powered by OSRM
- Geocoding provided by Nominatim
