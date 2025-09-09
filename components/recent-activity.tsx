"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Wifi } from "lucide-react"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import Link from "next/link"

export function RecentActivity() {
  const { threats, loading } = useRealtimeData()

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-secondary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {threats.slice(0, 6).map((threat) => (
            <div
              key={threat.id}
              className="flex items-center justify-between py-3 border-b border-border/50 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    threat.severity === "high"
                      ? "bg-destructive"
                      : threat.severity === "medium"
                        ? "bg-orange-500"
                        : "bg-yellow-500"
                  } animate-pulse`}
                ></div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{threat.alert_type.replace("_", " ")}</span>
                    {threat.alert_type === "intrusion_detected" && <Wifi className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {threat.device_id} • {new Date(threat.uploaded_at).toLocaleDateString()}{" "}
                    {new Date(threat.uploaded_at).toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-muted-foreground">from {threat.public_ip}</div>
                  <div className="text-xs text-muted-foreground">
                    {threat.city}, {threat.country}
                  </div>
                </div>
              </div>
              <Badge variant={threat.severity === "high" ? "destructive" : "secondary"} className="text-xs font-medium">
                {threat.severity}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border/50">
          <Link href="/dashboard/alerts">
            <Button variant="outline" className="w-full text-sm bg-transparent">
              View All Alerts
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
