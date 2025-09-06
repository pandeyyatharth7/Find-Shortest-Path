# Fastest Path Finder

A Next.js application for finding the fastest route between two locations using Google Maps API.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Add your Google Maps API key to `.env.local`
5. Run the development server: `npm run dev`

## Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Directions API** (required for route calculation)
   - Maps JavaScript API (optional, for future interactive map features)
   - Geocoding API (optional, for address validation)
4. Create credentials (API Key)
5. Add the API key to your `.env.local` file as `GOOGLE_MAPS_API_KEY`

## Environment Variables

- `GOOGLE_MAPS_API_KEY`: Your Google Maps API key (server-side only for security)

## Security

The Google Maps API key is kept secure on the server side and never exposed to the client. All API calls are made through our secure `/api/directions` endpoint. The current implementation prioritizes security by avoiding client-side API key exposure.

## Features

- Clean, responsive interface with modern design
- Secure server-side Google Maps API integration
- Real-time route calculation with distance and duration
- Turn-by-turn directions with step-by-step instructions
- Route statistics including time and distance estimates
- Loading states and comprehensive error handling
- Mobile-friendly responsive layout
- Security-first approach with no client-side API key exposure

## How to Download

You can get your code in two ways:
1. **Download ZIP**: Click the three dots (⋯) in the top right of the v0 interface and select "Download ZIP"
2. **Push to GitHub**: Click the GitHub logo button in the top right to push directly to your repository

## Usage

1. Enter your starting address in the "Source" field
2. Enter your destination in the "Destination" field  
3. Click "Find Fastest Route" to calculate the optimal path
4. View detailed route statistics and turn-by-turn directions

The app calculates the optimal route and displays comprehensive information including total distance, estimated travel time, and detailed step-by-step directions for easy navigation.

## Interactive Map (Optional Enhancement)

For interactive map display, you would need to implement a secure client-side integration. Consider using:
- Server-side rendering for map generation
- Secure iframe embedding
- Domain-restricted API keys with proper CORS configuration

The current implementation prioritizes security by keeping all API interactions on the server side.
