import { type NextRequest, NextResponse } from "next/server"

async function geocode(query: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
  const res = await fetch(url, {
    headers: {
      "User-Agent": "FastestPathFinder v0 App",
      "Accept-Language": "en",
      Referer: "https://v0.app",
    },
  })
  if (!res.ok) {
    throw new Error(`Nominatim error: ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>
  if (!data?.length) {
    throw new Error("Location not found")
  }
  return { lat: Number.parseFloat(data[0].lat), lon: Number.parseFloat(data[0].lon), label: data[0].display_name }
}

function formatDuration(seconds: number) {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h} hr ${m} min`
}

function formatDistance(meters: number) {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export async function POST(request: NextRequest) {
  try {
    const { source, destination } = await request.json()

    if (!source || !destination) {
      console.log("[v0] Missing required fields:", { source: !!source, destination: !!destination })
      return NextResponse.json({ error: "Source and destination are required" }, { status: 400 })
    }

    console.log("[v0] Geocoding with Nominatim:", { source, destination })
    const [src, dst] = await Promise.all([geocode(source), geocode(destination)])

    console.log("[v0] Requesting route from OSRM:", {
      src: { lat: src.lat, lon: src.lon },
      dst: { lat: dst.lat, lon: dst.lon },
    })

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${src.lon},${src.lat};${dst.lon},${dst.lat}?overview=full&geometries=geojson&steps=true`
    const osrmRes = await fetch(osrmUrl, { headers: { "Accept-Language": "en" } })
    const osrmData = await osrmRes.json()

    console.log("[v0] OSRM response status:", osrmData.code)

    if (osrmData.code !== "Ok" || !osrmData.routes?.length) {
      const message = osrmData.message || "No route found"
      return NextResponse.json({ error: `OSRM error: ${message}` }, { status: 400 })
    }

    const route = osrmData.routes[0]
    const leg = route.legs?.[0]
    const steps = leg?.steps || []

    const formattedSteps = steps.map((s: any) => {
      const m = s.maneuver || {}
      const verb = (m.type || "continue").replace(/_/g, " ")
      const mod = m.modifier ? ` ${String(m.modifier).toLowerCase()}` : ""
      const road = s.name || "road"
      const instruction = `${verb}${mod} on ${road}`
      return {
        instruction,
        distance: formatDistance(s.distance),
        duration: formatDuration(s.duration),
      }
    })

    const payload = {
      distance: formatDistance(route.distance),
      duration: formatDuration(route.duration),
      steps: formattedSteps,
      geometry: route.geometry, // GeoJSON LineString
      start: { lat: src.lat, lon: src.lon, label: src.label },
      end: { lat: dst.lat, lon: dst.lon, label: dst.label },
    }

    console.log("[v0] Route prepared:", {
      distance: payload.distance,
      duration: payload.duration,
      steps: payload.steps.length,
    })

    return NextResponse.json(payload)
  } catch (error) {
    console.error("[v0] Directions error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
