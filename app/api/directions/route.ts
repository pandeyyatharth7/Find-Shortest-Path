import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { source, destination } = await request.json()

    if (!source || !destination) {
      return NextResponse.json({ error: "Source and destination are required" }, { status: 400 })
    }

    // Check if API key is configured
    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
    }

    // Call Google Maps Directions API
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`

    const response = await fetch(directionsUrl)
    const data = await response.json()

    if (data.status !== "OK") {
      return NextResponse.json({ error: `Google Maps API error: ${data.status}` }, { status: 400 })
    }

    // Extract useful information from the response
    const route = data.routes[0]
    const leg = route.legs[0]

    return NextResponse.json({
      distance: leg.distance.text,
      duration: leg.duration.text,
      steps: leg.steps.map((step: any) => ({
        instruction: step.html_instructions.replace(/<[^>]*>/g, ""), // Remove HTML tags
        distance: step.distance.text,
        duration: step.duration.text,
      })),
      polyline: route.overview_polyline.points,
    })
  } catch (error) {
    console.error("Directions API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
