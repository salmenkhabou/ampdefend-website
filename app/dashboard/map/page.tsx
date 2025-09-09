"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, MapPin } from "lucide-react"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { useEffect, useRef, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"

const cityCoordinates: { [key: string]: [number, number] } = {
  tunis: [36.8065, 10.1815],
  paris: [48.8566, 2.3522],
  london: [51.5074, -0.1278],
  "new york": [40.7128, -74.006],
  tokyo: [35.6762, 139.6503],
  berlin: [52.52, 13.405],
  moscow: [55.7558, 37.6176],
  beijing: [39.9042, 116.4074],
  sydney: [-33.8688, 151.2093],
  cairo: [30.0444, 31.2357],
  mumbai: [19.076, 72.8777],
  "sao paulo": [-23.5505, -46.6333],
  "mexico city": [19.4326, -99.1332],
  lagos: [6.5244, 3.3792],
  istanbul: [41.0082, 28.9784],
  dubai: [25.2048, 55.2708],
  singapore: [1.3521, 103.8198],
  "hong kong": [22.3193, 114.1694],
  toronto: [43.6532, -79.3832],
  "los angeles": [34.0522, -118.2437],
}

function getThreatCoordinates(threat: any): [number, number] | null {
  // If threat has direct location coordinates
  if (threat.loc) {
    try {
      const [lat, lng] = threat.loc.split(",").map((coord: string) => Number.parseFloat(coord.trim()))
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return [lat, lng]
      }
    } catch (error) {
      console.error("Error parsing coordinates for threat:", threat.id, error)
    }
  }

  // If threat has city information, use city coordinates with small random offset
  if (threat.city) {
    const cityKey = threat.city.toLowerCase()
    const coords = cityCoordinates[cityKey]
    if (coords) {
      // Add small random offset to avoid overlapping markers
      const randomOffset = 0.1
      return [coords[0] + (Math.random() - 0.5) * randomOffset, coords[1] + (Math.random() - 0.5) * randomOffset]
    }
  }

  // If threat has country but no city, use a default location with random spread
  if (threat.country) {
    // Use a default location with larger random spread
    const randomSpread = 5
    return [20 + (Math.random() - 0.5) * randomSpread, 0 + (Math.random() - 0.5) * randomSpread]
  }

  return null
}

export default function MapPage() {
  const { threats } = useRealtimeData()
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [L, setL] = useState<any>(null)
  const markersRef = useRef<any[]>([])

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== "undefined") {
        const leaflet = await import("leaflet")

        // Load CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        setL(leaflet.default)
      }
    }
    loadLeaflet()
  }, [])

  // Initialize map
  useEffect(() => {
    if (L && mapRef.current && !map) {
      const newMap = L.map(mapRef.current, {
        center: [20, 0], // Center on world
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        attributionControl: false,
      })

      // Add dark tile layer for cybersecurity theme
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(newMap)

      setMap(newMap)
    }

    return () => {
      if (map) {
        map.remove()
        setMap(null)
      }
    }
  }, [L, map])

  // Update markers when threats change
  useEffect(() => {
    if (!map || !L || !threats.length) return

    // Clear existing markers
    markersRef.current.forEach((marker) => map.removeLayer(marker))
    markersRef.current = []

    let validMarkers = 0
    threats.forEach((threat) => {
      const coordinates = getThreatCoordinates(threat)

      if (coordinates) {
        const [lat, lng] = coordinates
        validMarkers++

        // Create custom icon based on severity
        const iconColor = threat.severity === "high" ? "#ef4444" : threat.severity === "medium" ? "#f59e0b" : "#10b981"

        const customIcon = L.divIcon({
          html: `
            <div style="
              width: 20px; 
              height: 20px; 
              background-color: ${iconColor}; 
              border: 2px solid white; 
              border-radius: 50%; 
              box-shadow: 0 0 10px ${iconColor}50;
              animation: pulse 2s infinite;
            "></div>
          `,
          className: "custom-threat-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })

        const marker = L.marker([lat, lng], { icon: customIcon })
          .bindPopup(`
            <div style="color: #000; font-family: system-ui;">
              <strong style="color: ${iconColor};">${threat.alert_type?.replace(/_/g, " ").toUpperCase()}</strong><br/>
              <strong>Device:</strong> ${threat.device_id || "Unknown"}<br/>
              <strong>IP:</strong> ${threat.public_ip || "Unknown"}<br/>
              <strong>Location:</strong> ${threat.city || "Unknown"}, ${threat.country || "Unknown"}<br/>
              <strong>Severity:</strong> ${threat.severity || "Unknown"}<br/>
              <strong>VPN Likelihood:</strong> ${threat.vpn_likelihood || "Unknown"}%<br/>
              <strong>Time:</strong> ${new Date(threat.timestamp).toLocaleString()}
            </div>
          `)
          .addTo(map)

        markersRef.current.push(marker)
      }
    })

    // Add pulse animation CSS if not already added
    if (!document.getElementById("threat-marker-styles")) {
      const style = document.createElement("style")
      style.id = "threat-marker-styles"
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .custom-threat-marker {
          background: transparent !important;
          border: none !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [map, L, threats])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Threat Map</h1>
          <p className="text-muted-foreground">Real-time geographic visualization of threats to your system</p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Global Threat Locations</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                  <span>High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Low Risk</span>
                </div>
              </div>
            </div>

            <div className="relative h-[600px] bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800">
              <div ref={mapRef} className="w-full h-full" />

              {threats.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No active threats detected</p>
                    <p className="text-sm">System monitoring...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                Showing {threats.filter((threat) => getThreatCoordinates(threat) !== null).length} threats with
                geographic data out of {threats.length} total threats
              </p>
              <p className="text-xs mt-1 text-blue-400">
                Threats are mapped using exact coordinates, city locations, or approximate regional positions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
