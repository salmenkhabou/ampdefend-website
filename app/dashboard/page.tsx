"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { LiveAttackMap } from "@/components/live-attack-map"
import { RecentActivity } from "@/components/recent-activity"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AMPDefend</h1>
              <p className="text-sm text-muted-foreground">Live Attack Map</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
              <Badge variant="outline" className="text-destructive border-destructive">
                VPN ~ 80%
              </Badge>
            </div>
          </div>

          <LiveAttackMap />

          <RecentActivity />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
