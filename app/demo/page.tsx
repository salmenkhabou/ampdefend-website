"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Activity,
  AlertTriangle,
  Network,
  Lock,
  Zap,
  Eye,
  MapPin,
  Clock,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface DemoThreat {
  id: string
  type: string
  source: string
  target: string
  severity: "high" | "medium" | "low"
  status: "detected" | "blocked" | "analyzing"
  timestamp: string
  location: string
  progress: number
}

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [demoThreats, setDemoThreats] = useState<DemoThreat[]>([])
  const [metrics, setMetrics] = useState({
    activeHoneypots: 12,
    threatsDetected: 47,
    blockedIPs: 23,
    systemStatus: "operational",
  })

  const demoSteps = [
    {
      title: "Threat Detection",
      description: "Honeypot devices detect suspicious activity",
      icon: Eye,
      color: "text-blue-400",
    },
    {
      title: "Analysis",
      description: "AI analyzes attack patterns and behavior",
      icon: Activity,
      color: "text-yellow-400",
    },
    {
      title: "Alert Generation",
      description: "Real-time alerts sent to security team",
      icon: AlertTriangle,
      color: "text-orange-400",
    },
    {
      title: "Auto-Block",
      description: "Malicious IPs automatically blocked",
      icon: Lock,
      color: "text-red-400",
    },
  ]

  const generateDemoThreat = (): DemoThreat => {
    const types = ["OCPP Probe", "Modbus Scan", "IEC104 Attack", "VPN Analysis"]
    const sources = ["203.0.113.25", "198.51.100.42", "192.0.2.156", "172.16.0.89"]
    const targets = ["EV Charger", "Smart Meter", "Grid Controller", "SCADA System"]
    const locations = ["Tunis, Tunisia", "Berlin, Germany", "Tokyo, Japan", "New York, USA"]
    const severities: ("high" | "medium" | "low")[] = ["high", "medium", "low"]

    return {
      id: Math.random().toString(36).substr(2, 9),
      type: types[Math.floor(Math.random() * types.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      status: "detected",
      timestamp: new Date().toLocaleTimeString(),
      location: locations[Math.floor(Math.random() * locations.length)],
      progress: 0,
    }
  }

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      // Add new threat occasionally
      if (Math.random() < 0.3) {
        const newThreat = generateDemoThreat()
        setDemoThreats((prev) => [newThreat, ...prev.slice(0, 4)])

        // Update metrics
        setMetrics((prev) => ({
          ...prev,
          threatsDetected: prev.threatsDetected + 1,
          blockedIPs: Math.random() < 0.7 ? prev.blockedIPs + 1 : prev.blockedIPs,
        }))
      }

      // Update threat progress
      setDemoThreats((prev) =>
        prev.map((threat) => {
          if (threat.progress < 100) {
            const newProgress = Math.min(100, threat.progress + Math.random() * 25)
            let newStatus = threat.status

            if (newProgress > 25 && newProgress < 75) {
              newStatus = "analyzing"
            } else if (newProgress >= 75) {
              newStatus = "blocked"
            }

            return { ...threat, progress: newProgress, status: newStatus }
          }
          return threat
        }),
      )

      // Update demo step
      setCurrentStep((prev) => (prev + 1) % demoSteps.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const resetDemo = () => {
    setDemoThreats([])
    setCurrentStep(0)
    setMetrics({
      activeHoneypots: 12,
      threatsDetected: 47,
      blockedIPs: 23,
      systemStatus: "operational",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/ampdefend-logo.png"
              alt="AMPDefend Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-foreground">AMPDefend</span>
            <Badge variant="secondary" className="ml-2">
              Live Demo
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Home
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">
            Live Demo: <span className="text-primary">Smart Honeypot Shield</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto">
            Watch AMPDefend detect, analyze, and block real-time cyber threats targeting critical energy infrastructure.
            This interactive demonstration shows how our honeypot technology protects your systems.
          </p>

          {/* Demo Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <Button onClick={() => setIsPlaying(!isPlaying)} variant={isPlaying ? "secondary" : "default"} size="lg">
              {isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isPlaying ? "Pause Demo" : "Start Demo"}
            </Button>
            <Button onClick={resetDemo} variant="outline" size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>
        </div>
      </section>

      {/* Live Metrics */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Honeypots</CardTitle>
                <Shield className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeHoneypots}</div>
                <p className="text-xs text-muted-foreground">Protecting infrastructure</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Threats Detected</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.threatsDetected}</div>
                <p className="text-xs text-muted-foreground">Real-time detection</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
                <Network className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.blockedIPs}</div>
                <p className="text-xs text-muted-foreground">Auto-protection active</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Activity className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary capitalize">{metrics.systemStatus}</div>
                <p className="text-xs text-muted-foreground">All systems online</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Process Flow */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Process Steps */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Threat Detection Process
                </CardTitle>
                <CardDescription>Watch how AMPDefend processes threats in real-time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoSteps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === index
                  const isCompleted = currentStep > index

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary/10 border border-primary/20"
                          : isCompleted
                            ? "bg-secondary/10"
                            : "bg-muted/50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive
                            ? "bg-primary text-primary-foreground animate-pulse"
                            : isCompleted
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      {isActive && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Live Threats */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Live Threat Feed
                </CardTitle>
                <CardDescription>Real-time threats being detected and processed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {demoThreats.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No active threats detected</p>
                      <p className="text-sm">Your infrastructure is secure</p>
                    </div>
                  ) : (
                    demoThreats.map((threat) => (
                      <div key={threat.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                threat.severity === "high"
                                  ? "destructive"
                                  : threat.severity === "medium"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {threat.severity.toUpperCase()}
                            </Badge>
                            <span className="font-medium">{threat.type}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {threat.timestamp}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Source:</span>
                            <p className="font-mono">{threat.source}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target:</span>
                            <p>{threat.target}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{threat.location}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="capitalize">{threat.status.replace("_", " ")}</span>
                            <span>{Math.round(threat.progress)}%</span>
                          </div>
                          <Progress value={threat.progress} className="h-2" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Network Map */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                Interactive Network Topology
              </CardTitle>
              <CardDescription>Live visualization of your protected infrastructure and active threats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 bg-slate-900/50 rounded-lg p-6 border border-slate-800">
                {/* Grid background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-slate-700/30" />
                    ))}
                  </div>
                </div>

                {/* Network nodes */}
                <div className="relative h-full flex items-center justify-center">
                  {/* Honeypot devices */}
                  <div className="absolute left-1/4 top-1/4 flex flex-col items-center">
                    <div className="w-12 h-12 bg-secondary/20 border-2 border-secondary rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6 text-secondary" />
                    </div>
                    <span className="text-xs text-secondary mt-1">EV Charger</span>
                  </div>

                  <div className="absolute right-1/4 top-1/4 flex flex-col items-center">
                    <div className="w-12 h-12 bg-secondary/20 border-2 border-secondary rounded-full flex items-center justify-center">
                      <Shield className="h-6 w-6 text-secondary" />
                    </div>
                    <span className="text-xs text-secondary mt-1">Smart Meter</span>
                  </div>

                  <div className="absolute left-1/4 bottom-1/4 flex flex-col items-center">
                    <div className="w-12 h-12 bg-secondary/20 border-2 border-secondary rounded-full flex items-center justify-center">
                      <Network className="h-6 w-6 text-secondary" />
                    </div>
                    <span className="text-xs text-secondary mt-1">Controller</span>
                  </div>

                  {/* Threat source */}
                  {demoThreats.length > 0 && (
                    <div className="absolute right-8 top-1/2 flex flex-col items-center">
                      <div className="w-12 h-12 bg-destructive/20 border-2 border-destructive rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-3 h-3 bg-destructive rounded-full" />
                      </div>
                      <span className="text-xs text-destructive mt-1">Threat</span>
                      <span className="text-xs text-muted-foreground">{demoThreats[0]?.source}</span>
                    </div>
                  )}

                  {/* Attack lines */}
                  {demoThreats.length > 0 && (
                    <>
                      <div className="absolute right-20 top-1/2 w-16 h-0.5 bg-gradient-to-l from-destructive to-secondary animate-pulse" />
                      <div className="absolute right-1/3 top-5/12 w-12 h-0.5 bg-gradient-to-l from-secondary to-primary" />
                    </>
                  )}

                  {/* Status indicator */}
                  <div className="absolute top-4 left-4 bg-card/90 border border-border rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                      <span className="text-sm font-medium">System Protected</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{metrics.activeHoneypots} honeypots active</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Protect Your Infrastructure?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the full power of AMPDefend's Smart Honeypot Shield with a personalized demonstration for your
            specific infrastructure needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                <Shield className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Request Full Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
