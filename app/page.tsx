import { Shield, Activity, AlertTriangle, Network, Lock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              Smart Honeypot Shield for <span className="text-primary">Critical Infrastructure</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
              Protect smart grids, EV chargers, and industrial energy systems with advanced honeypot technology. Detect
              attacks, trigger alerts, and automatically block malicious IPs in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  <Shield className="mr-2 h-5 w-5" />
                  Start Protection
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  <Activity className="mr-2 h-5 w-5" />
                  View Live Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Threat Detection</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Deploy intelligent decoy devices to detect and neutralize cyber threats before they reach your critical
              infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Honeypots</CardTitle>
                <CardDescription>
                  Deploy decoy smart meters, EV chargers, and controllers to attract and analyze attackers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <AlertTriangle className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>Real-time Alerts</CardTitle>
                <CardDescription>
                  Instant notifications when threats are detected with detailed attack analysis and recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Network className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Attack Visualization</CardTitle>
                <CardDescription>
                  Live network maps showing attack paths, compromised devices, and threat intelligence
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Lock className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>Auto IP Blocking</CardTitle>
                <CardDescription>
                  Automatically block malicious IPs and prevent further attacks on your infrastructure
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Activity className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Behavior Analysis</CardTitle>
                <CardDescription>
                  Log and analyze attacker behavior patterns to improve future threat detection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Zap className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>Energy Grid Focus</CardTitle>
                <CardDescription>
                  Specialized protection for smart grids, EV charging networks, and industrial control systems
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Secure Your Infrastructure?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join leading energy companies protecting their critical systems with AMPDefend's Smart Honeypot Shield.
          </p>
          <Link href="/signup">
            <Button size="lg">
              <Shield className="mr-2 h-5 w-5" />
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/images/ampdefend-logo.png"
                  alt="AMPDefend Logo"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="text-lg font-bold">AMPDefend</span>
              </div>
              <p className="text-muted-foreground">Advanced cybersecurity for critical energy infrastructure.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-foreground">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-foreground">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 AMPDefend. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
