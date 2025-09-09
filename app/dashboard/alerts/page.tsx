"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAlerts } from "@/hooks/use-alerts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Bell,
  Info,
  Settings,
  Search,
  Filter,
  Check,
  X,
  Volume2,
  VolumeX,
  Clock,
  Shield,
} from "lucide-react"

export default function AlertsPage() {
  const { alerts, unreadCount, markAsRead, markAllAsRead, dismissAlert, clearAll, playAlertSound, setPlayAlertSound } =
    useAlerts()
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter
    const matchesType = typeFilter === "all" || alert.type === typeFilter
    return matchesSearch && matchesSeverity && matchesType
  })

  const unreadAlerts = filteredAlerts.filter((alert) => !alert.read)
  const readAlerts = filteredAlerts.filter((alert) => alert.read)

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === "critical" || severity === "high") {
      return <AlertTriangle className="h-5 w-5 text-destructive" />
    }
    return <Info className="h-5 w-5 text-primary" />
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Alert Management</h1>
              <p className="text-muted-foreground">Monitor and manage security alerts</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPlayAlertSound(!playAlertSound)}
                className="flex items-center gap-2"
              >
                {playAlertSound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                Sound {playAlertSound ? "On" : "Off"}
              </Button>
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} size="sm">
                  <Check className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              )}
              <Button variant="outline" onClick={clearAll} size="sm">
                Clear All
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alerts.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{unreadCount}</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical</CardTitle>
                <Shield className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {alerts.filter((alert) => alert.severity === "critical" || alert.severity === "high").length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Required</CardTitle>
                <Settings className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alerts.filter((alert) => alert.actionRequired).length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="threat">Threat</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <Tabs defaultValue="unread" className="space-y-4">
            <TabsList>
              <TabsTrigger value="unread" className="flex items-center gap-2">
                Unread
                {unreadAlerts.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadAlerts.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value="unread">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Unread Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  {unreadAlerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Check className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No unread alerts</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {unreadAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            {getAlertIcon(alert.type, alert.severity)}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-foreground">{alert.title}</h3>
                                <Badge variant={getAlertColor(alert.severity) as any} className="text-xs">
                                  {alert.severity}
                                </Badge>
                                {alert.actionRequired && (
                                  <Badge variant="outline" className="text-xs">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{alert.message}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {alert.timestamp.toLocaleString()}
                                </div>
                                {alert.sourceIp && <span>IP: {alert.sourceIp}</span>}
                                {alert.targetDevice && <span>Device: {alert.targetDevice}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => markAsRead(alert.id)}>
                              <Check className="h-4 w-4 mr-2" />
                              Mark Read
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => dismissAlert(alert.id)}>
                              <X className="h-4 w-4 mr-2" />
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="read">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Read Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  {readAlerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No read alerts</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {readAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-start justify-between p-4 rounded-lg border border-border opacity-75"
                        >
                          <div className="flex items-start gap-4">
                            {getAlertIcon(alert.type, alert.severity)}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-foreground">{alert.title}</h3>
                                <Badge variant={getAlertColor(alert.severity) as any} className="text-xs">
                                  {alert.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{alert.message}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {alert.timestamp.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => dismissAlert(alert.id)}>
                            <X className="h-4 w-4 mr-2" />
                            Dismiss
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>All Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors ${
                          alert.read ? "opacity-75" : ""
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {getAlertIcon(alert.type, alert.severity)}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-foreground">{alert.title}</h3>
                              <Badge variant={getAlertColor(alert.severity) as any} className="text-xs">
                                {alert.severity}
                              </Badge>
                              {!alert.read && (
                                <Badge variant="outline" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {alert.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!alert.read && (
                            <Button variant="outline" size="sm" onClick={() => markAsRead(alert.id)}>
                              <Check className="h-4 w-4 mr-2" />
                              Mark Read
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => dismissAlert(alert.id)}>
                            <X className="h-4 w-4 mr-2" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
