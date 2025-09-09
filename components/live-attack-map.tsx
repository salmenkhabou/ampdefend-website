"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Wifi } from "lucide-react"
import { useRealtimeData } from "@/hooks/use-realtime-data"

export function LiveAttackMap() {
  const { threats } = useRealtimeData()
  const activeThreats = threats.filter((threat) => threat.severity === "high").slice(0, 3)

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Live Attack Map</h3>
        </div>

        <div className="relative h-80 bg-slate-900/50 rounded-lg p-6 border border-slate-800">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-slate-700/30" />
              ))}
            </div>
          </div>

          {/* Network topology */}
          <div className="relative h-full flex items-center justify-center">
            {/* VPN Node */}
            <div className="absolute left-1/4 top-1/3 flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-500/20 border-2 border-blue-400 rounded-full flex items-center justify-center">
                <Wifi className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-xs text-blue-400 mt-1">VPN</span>
              <span className="text-xs text-muted-foreground">~80%</span>
            </div>

            {/* EV Decoy */}
            <div className="absolute right-1/4 top-1/2 flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-xs text-green-400 mt-1">EV Decoy</span>
            </div>

            {/* SM Decoy */}
            <div className="absolute right-1/4 bottom-1/3 flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-xs text-green-400 mt-1">SM Decoy</span>
            </div>

            {/* Attacker Node */}
            {activeThreats.length > 0 && (
              <div className="absolute left-8 top-1/2 flex flex-col items-center">
                <div className="w-12 h-12 bg-red-500/20 border-2 border-red-400 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                </div>
                <span className="text-xs text-red-400 mt-1">Attacker</span>
                <span className="text-xs text-muted-foreground">{activeThreats[0]?.public_ip?.slice(0, 12)}...</span>
              </div>
            )}

            {/* Connection lines */}
            {activeThreats.length > 0 && (
              <>
                {/* Attacker to VPN */}
                <div
                  className="absolute left-20 top-1/2 w-16 h-0.5 bg-gradient-to-r from-red-400 to-blue-400 animate-pulse"
                  style={{ transform: "translateY(-1px) rotate(-15deg)", transformOrigin: "left" }}
                />

                {/* VPN to EV Decoy */}
                <div
                  className="absolute left-1/3 top-5/12 w-20 h-0.5 bg-gradient-to-r from-blue-400 to-green-400"
                  style={{ transform: "translateY(-1px) rotate(8deg)", transformOrigin: "left" }}
                />

                {/* EV to SM Decoy */}
                <div
                  className="absolute right-1/4 top-7/12 w-0.5 h-12 bg-gradient-to-b from-green-400 to-green-400"
                  style={{ transform: "translateX(-1px)" }}
                />
              </>
            )}

            {/* Intrusion detected alert */}
            {activeThreats.length > 0 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-sm text-red-400 font-medium">Intrusion detected</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {activeThreats[0]?.alert_type?.replace(/_/g, " ")} • {activeThreats[0]?.public_ip}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
