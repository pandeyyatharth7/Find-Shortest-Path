"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Clock, Route } from "lucide-react"

export default function PathFinderPage() {
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSearch = async () => {
    if (!source || !destination) {
      alert("Please enter both source and destination addresses")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/directions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source,
          destination,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get directions")
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error finding route:", error)
      alert("Error finding route. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-4">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-white mb-2">Fastest Path Finder</h1>
          <p className="text-slate-200">Find the optimal route between any two locations</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-white text-xl">Route Planning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="source" className="text-slate-100 text-lg font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Source
                </Label>
                <Input
                  id="source"
                  type="text"
                  placeholder="Enter starting address"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="bg-white/95 border-0 text-gray-800 placeholder:text-gray-600 h-12 text-base"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="text-slate-100 text-lg font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Destination
                </Label>
                <Input
                  id="destination"
                  type="text"
                  placeholder="Enter destination address"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-white/95 border-0 text-gray-800 placeholder:text-gray-600 h-12 text-base"
                  disabled={loading}
                />
              </div>

              <Button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 h-12 text-base font-medium disabled:opacity-50"
              >
                <Star className="w-4 h-4 mr-2" />
                {loading ? "Finding Route..." : "Find Fastest Route"}
              </Button>

              {result && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Route className="w-5 h-5" />
                    Route Statistics
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-slate-700/80 border-slate-500/50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">{result.distance}</div>
                        <div className="text-slate-200 text-sm">Total Distance</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-700/80 border-slate-500/50">
                      <CardContent className="p-4 text-center">
                        <Clock className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-white">{result.duration}</div>
                        <div className="text-slate-200 text-sm">Estimated Time</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-slate-700/80 border-slate-500/50">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Turn-by-Turn Directions</CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-40 overflow-y-auto">
                      <div className="space-y-2">
                        {result.steps.slice(0, 5).map((step: any, index: number) => (
                          <div key={index} className="text-slate-100 text-sm p-2 bg-slate-600/60 rounded">
                            <span className="font-medium text-amber-300">{index + 1}.</span> {step.instruction}
                            <div className="text-xs text-slate-300 mt-1">
                              {step.distance} • {step.duration}
                            </div>
                          </div>
                        ))}
                        {result.steps.length > 5 && (
                          <div className="text-slate-300 text-xs text-center">
                            +{result.steps.length - 5} more steps...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-white text-xl">Route Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96 lg:h-[500px] rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center text-center p-8">
                <MapPin className="w-16 h-16 text-amber-400 mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Interactive Map</h3>
                <p className="text-slate-200 text-sm mb-4">
                  To enable the interactive map display, you'll need to add your Google Maps API key to the environment
                  variables.
                </p>
                <div className="bg-slate-700/60 rounded-lg p-4 text-left text-sm">
                  <p className="text-slate-100 mb-2">
                    <strong>Setup Instructions:</strong>
                  </p>
                  <ol className="text-slate-200 space-y-1 text-xs">
                    <li>1. Get a Google Maps API key from Google Cloud Console</li>
                    <li>2. Enable Maps JavaScript API and Directions API</li>
                    <li>3. Add the key to your environment variables</li>
                    <li>4. Configure domain restrictions for security</li>
                  </ol>
                </div>
                {result && (
                  <div className="mt-4 text-amber-300 text-sm">
                    ✓ Route calculated! Map would display the path here.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
