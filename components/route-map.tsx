"use client"

// This avoids bundling the 'leaflet' npm module that was failing to load with a MIME-type error.

import { useEffect, useMemo, useRef } from "react"

type Props = {
  geometry: { type: "LineString"; coordinates: [number, number][] } | null
  start?: { lat: number; lon: number }
  end?: { lat: number; lon: number }
  className?: string
}

declare global {
  interface Window {
    L?: any
  }
}

export default function RouteMap({ geometry, start, end, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const tileLayerRef = useRef<any>(null)
  const lineLayerRef = useRef<any>(null)
  const startMarkerRef = useRef<any>(null)
  const endMarkerRef = useRef<any>(null)

  // Convert GeoJSON coords [lng, lat] -> [lat, lng]
  const lineLatLngs = useMemo(() => {
    if (!geometry?.coordinates?.length) return []
    return geometry.coordinates.map(([lng, lat]) => [lat, lng])
  }, [geometry])

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const L = window.L
    if (!L) return

    const center = start ? [start.lat, start.lon] : [0, 0]
    const map = L.map(containerRef.current, { zoomControl: true }).setView(center, 13)
    mapRef.current = map

    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      crossOrigin: true,
    })
    tiles.addTo(map)
    tileLayerRef.current = tiles

    return () => {
      // cleanup on unmount
      try {
        map.remove()
      } catch {}
      mapRef.current = null
      tileLayerRef.current = null
    }
  }, [start])

  // Update overlays whenever data changes
  useEffect(() => {
    const L = window.L
    const map = mapRef.current
    if (!L || !map) return

    // Clear previous overlays
    if (lineLayerRef.current) {
      map.removeLayer(lineLayerRef.current)
      lineLayerRef.current = null
    }
    if (startMarkerRef.current) {
      map.removeLayer(startMarkerRef.current)
      startMarkerRef.current = null
    }
    if (endMarkerRef.current) {
      map.removeLayer(endMarkerRef.current)
      endMarkerRef.current = null
    }

    const boundsPoints: [number, number][] = []

    if (lineLatLngs.length) {
      const line = L.polyline(lineLatLngs, { color: "#f59e0b", weight: 5 })
      line.addTo(map)
      lineLayerRef.current = line
      boundsPoints.push(...lineLatLngs)
    }

    if (start) {
      const m = L.circleMarker([start.lat, start.lon], { radius: 6, color: "#22c55e", fillOpacity: 1 })
      m.addTo(map)
      startMarkerRef.current = m
      boundsPoints.push([start.lat, start.lon])
    }

    if (end) {
      const m = L.circleMarker([end.lat, end.lon], { radius: 6, color: "#ef4444", fillOpacity: 1 })
      m.addTo(map)
      endMarkerRef.current = m
      boundsPoints.push([end.lat, end.lon])
    }

    if (boundsPoints.length) {
      const bounds = L.latLngBounds(boundsPoints)
      map.fitBounds(bounds, { padding: [24, 24] })
    } else if (start) {
      map.setView([start.lat, start.lon], 13)
    }
  }, [lineLatLngs, start, end])

  return <div ref={containerRef} className={className || "w-full h-96 lg:h-[500px] rounded-lg overflow-hidden"} />
}
