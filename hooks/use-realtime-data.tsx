"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { realtimeDb } from "@/lib/firebase"
import { ref, onValue, off } from "firebase/database"
import { sendAlertToWebhook } from "@/lib/webhook"

interface ThreatData {
  id: string
  alert_type: string
  severity: "low" | "medium" | "high" | "critical"
  public_ip: string
  ip_blocked: string
  device_id: string
  timestamp: string
  uploaded_at: string
  raw_message: string
  city: string
  country: string
  region: string
  timezone: string
  loc: string
  org: string
  vpn_likelihood: number
}

interface SystemMetrics {
  activeHoneypots: number
  threatsDetected: number
  blockedIps: number
  systemStatus: "online" | "offline" | "maintenance"
  lastUpdated: Date
}

interface RealtimeDataContextType {
  threats: ThreatData[]
  metrics: SystemMetrics
  loading: boolean
  error: string | null
}

const RealtimeDataContext = createContext<RealtimeDataContextType | undefined>(undefined)

export function RealtimeDataProvider({ children }: { children: React.ReactNode }) {
  const [threats, setThreats] = useState<ThreatData[]>([])
  const [processedAlerts, setProcessedAlerts] = useState<Set<string>>(new Set())
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeHoneypots: 12,
    threatsDetected: 0,
    blockedIps: 0,
    systemStatus: "online",
    lastUpdated: new Date(),
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const alertsRef = ref(realtimeDb, "alerts")

    const unsubscribe = onValue(
      alertsRef,
      (snapshot) => {
        try {
          const data = snapshot.val()
          if (data) {
            // Convert Firebase object to array and sort by timestamp
            const threatsArray: ThreatData[] = Object.keys(data)
              .map((key) => ({
                id: key,
                ...data[key],
              }))
              .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())

            Object.keys(data).forEach((alertId) => {
              if (!processedAlerts.has(alertId)) {
                console.log(`[v0] New alert detected: ${alertId}`)
                sendAlertToWebhook(alertId, data[alertId])
                setProcessedAlerts((prev) => new Set([...prev, alertId]))
              }
            })

            setThreats(threatsArray)

            // Update metrics based on real data
            const blockedCount = threatsArray.filter((threat) => threat.ip_blocked).length
            const highSeverityCount = threatsArray.filter((threat) => threat.severity === "high").length

            setMetrics((prev) => ({
              ...prev,
              threatsDetected: threatsArray.length,
              blockedIps: blockedCount,
              lastUpdated: new Date(),
            }))
          } else {
            setThreats([])
          }
          setLoading(false)
          setError(null)
        } catch (err) {
          console.error("Error fetching real-time data:", err)
          setError("Failed to fetch real-time data")
          setLoading(false)
        }
      },
      (error) => {
        console.error("Firebase connection error:", error)
        setError("Database connection failed")
        setLoading(false)
      },
    )

    return () => {
      off(alertsRef, "value", unsubscribe)
    }
  }, [processedAlerts])

  const value = {
    threats,
    metrics,
    loading,
    error,
  }

  return <RealtimeDataContext.Provider value={value}>{children}</RealtimeDataContext.Provider>
}

export function useRealtimeData() {
  const context = useContext(RealtimeDataContext)
  if (context === undefined) {
    throw new Error("useRealtimeData must be used within a RealtimeDataProvider")
  }
  return context
}
