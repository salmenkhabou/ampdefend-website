"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { AlertTriangle, Activity, Shield, Network, Clock, MapPin, Zap } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const chartData = [
  { time: "00:00", threats: 12, blocked: 8 },
  { time: "04:00", threats: 19, blocked: 15 },
  { time: "08:00", threats: 23, blocked: 18 },
  { time: "12:00", threats: 31, blocked: 25 },
  { time: "16:00", threats: 28, blocked: 22 },
  { time: "20:00", threats: 35, blocked: 30 },
]

const threatTypeData = [
  { name: "Intrusion", value: 45, color: "#ef4444" },
  { name: "Port Scan", value: 25, color: "#f97316" },
  { name: "Brute Force", value: 20, color: "#eab308" },
  { name: "VPN Analysis", value: 10, color: "#22c55e" },
]

export default function MonitoringPage() {
  const { threats, metrics, loading } = useRealtimeData()

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Real-time Monitoring</h1>
              <p className="text-muted-foreground">Live threat detection and system metrics</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
          </div>

          {/* Real-time Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Honeypots</CardTitle>
                <Shield className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeHoneypots}</div>
                <p className="text-xs text-muted-foreground">
                  Last updated: {metrics.lastUpdated.toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Threats Detected</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.threatsDetected}</div>
                <p className="text-xs text-muted-foreground">+{threats.length} in last hour</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
                <Network className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.blockedIps}</div>
                <p className="text-xs text-muted-foreground">Auto-blocked threats</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Activity className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary capitalize">{metrics.systemStatus}</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Threat Detection Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="threats"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={2}
                        name="Threats Detected"
                      />
                      <Line
                        type="monotone"
                        dataKey="blocked"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Threats Blocked"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Threat Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={threatTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {threatTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {threatTypeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-muted-foreground">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Threats Feed */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-destructive" />
                Live Threats Feed
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Real-time</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {threats.map((threat) => (
                  <div
                    key={threat.id}
                    className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            threat.severity === "high"
                              ? "text-destructive"
                              : threat.severity === "medium"
                                ? "text-orange-500"
                                : "text-yellow-500"
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">
                            {threat.alert_type?.replace("_", " ") || "Unknown Threat"}
                          </h3>
                          <Badge
                            variant={
                              threat.severity === "high"
                                ? "destructive"
                                : threat.severity === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {threat.severity}
                          </Badge>
                          {threat.ip_blocked && (
                            <Badge variant="outline" className="text-xs">
                              Blocked
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>IP: {threat.public_ip}</span>
                          <span>Device: {threat.device_id}</span>
                          {threat.city && threat.country && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {threat.city}, {threat.country}
                            </div>
                          )}
                          {threat.vpn_likelihood && <span>VPN: {threat.vpn_likelihood}%</span>}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(threat.timestamp || threat.uploaded_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!threat.ip_blocked && (
                        <Button variant="outline" size="sm">
                          Block IP
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
