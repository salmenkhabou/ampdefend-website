"use client"

import { useState } from "react"
import { useAlerts } from "@/hooks/use-alerts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, BellRing, Check, X, AlertTriangle, Info, Settings, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"

export function AlertNotifications() {
  const { alerts, unreadCount, markAsRead, markAllAsRead, dismissAlert, playAlertSound, setPlayAlertSound } =
    useAlerts()
  const [open, setOpen] = useState(false)

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === "critical" || severity === "high") {
      return <AlertTriangle className="h-4 w-4 text-destructive" />
    }
    return <Info className="h-4 w-4 text-primary" />
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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-destructive" />
          ) : (
            <Bell className="h-5 w-5 text-muted-foreground" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPlayAlertSound(!playAlertSound)}
              className="h-8 w-8 p-0"
            >
              {playAlertSound ? (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-80">
          {alerts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {alerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 hover:bg-accent/50 transition-colors border-l-2 ${
                    !alert.read
                      ? alert.severity === "critical" || alert.severity === "high"
                        ? "border-l-destructive bg-destructive/5"
                        : "border-l-primary bg-primary/5"
                      : "border-l-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      {getAlertIcon(alert.type, alert.severity)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{alert.title}</p>
                          <Badge variant={getAlertColor(alert.severity) as any} className="text-xs">
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.timestamp.toLocaleString()}</p>
                        {alert.actionRequired && (
                          <Badge variant="outline" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!alert.read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)} className="h-6 w-6 p-0">
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)} className="h-6 w-6 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
        <div className="p-2">
          <Link href="/dashboard/alerts">
            <DropdownMenuItem className="w-full justify-center">
              <Settings className="mr-2 h-4 w-4" />
              View All Alerts
            </DropdownMenuItem>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
