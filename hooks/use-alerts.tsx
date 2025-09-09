"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRealtimeData } from "./use-realtime-data"

interface Alert {
  id: string
  type: "threat" | "system" | "maintenance" | "info"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  message: string
  timestamp: Date
  read: boolean
  dismissed: boolean
  actionRequired: boolean
  sourceIp?: string
  targetDevice?: string
  threatType?: string
}

interface AlertContextType {
  alerts: Alert[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismissAlert: (id: string) => void
  clearAll: () => void
  playAlertSound: boolean
  setPlayAlertSound: (play: boolean) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [playAlertSound, setPlayAlertSound] = useState(true)
  const { threats } = useRealtimeData()

  // Generate alerts from threat data
  useEffect(() => {
    const newAlerts: Alert[] = threats
      .filter((threat) => threat.severity === "high" || threat.severity === "critical")
      .map((threat) => ({
        id: `alert-${threat.id}`,
        type: "threat" as const,
        severity: threat.severity as "high",
        title: `${threat.alert_type.replace("_", " ").toUpperCase()} Detected`,
        message: `${threat.raw_message} - Activity from ${threat.public_ip} (${threat.city}, ${threat.country}) targeting ${threat.device_id}. VPN likelihood: ${threat.vpn_likelihood}%`,
        timestamp: new Date(threat.uploaded_at),
        read: false,
        dismissed: false,
        actionRequired: !!threat.ip_blocked,
        sourceIp: threat.public_ip,
        targetDevice: threat.device_id,
        threatType: threat.alert_type,
      }))

    // Add system alerts
    const systemAlerts: Alert[] = [
      {
        id: "system-1",
        type: "system",
        severity: "medium",
        title: "Honeypot Deployment",
        message: "New honeypot device successfully deployed to network segment 192.168.1.0/24",
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        read: false,
        dismissed: false,
        actionRequired: false,
      },
      {
        id: "system-2",
        type: "maintenance",
        severity: "low",
        title: "Scheduled Maintenance",
        message: "System maintenance scheduled for tonight at 2:00 AM EST. Expected downtime: 30 minutes.",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: false,
        dismissed: false,
        actionRequired: false,
      },
    ]

    const allAlerts = [...newAlerts, ...systemAlerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    setAlerts((prevAlerts) => {
      // Merge with existing alerts, preserving read/dismissed status
      const mergedAlerts = allAlerts.map((newAlert) => {
        const existingAlert = prevAlerts.find((alert) => alert.id === newAlert.id)
        return existingAlert ? { ...newAlert, read: existingAlert.read, dismissed: existingAlert.dismissed } : newAlert
      })
      return mergedAlerts
    })
  }, [threats])

  // Play sound for new critical alerts
  useEffect(() => {
    if (playAlertSound) {
      const newCriticalAlerts = alerts.filter(
        (alert) => !alert.read && !alert.dismissed && (alert.severity === "critical" || alert.severity === "high"),
      )

      if (newCriticalAlerts.length > 0) {
        // In a real app, you would play an actual sound file
        console.log("🚨 Critical alert sound would play here")
      }
    }
  }, [alerts, playAlertSound])

  const markAsRead = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)))
  }

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })))
  }

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, dismissed: true } : alert)))
  }

  const clearAll = () => {
    setAlerts([])
  }

  const unreadCount = alerts.filter((alert) => !alert.read && !alert.dismissed).length

  const value = {
    alerts: alerts.filter((alert) => !alert.dismissed),
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissAlert,
    clearAll,
    playAlertSound,
    setPlayAlertSound,
  }

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}

export function useAlerts() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error("useAlerts must be used within an AlertProvider")
  }
  return context
}
