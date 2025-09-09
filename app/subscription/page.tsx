"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Shield, Smartphone, Wrench, HeadphonesIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface PlanFeature {
  name: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: PlanFeature[]
  popular?: boolean
  icon: React.ReactNode
}

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const plans: Plan[] = [
    {
      id: "hardware",
      name: "Hardware Kit",
      price: "2,000",
      period: "per device",
      description: "Smart honeypot devices for physical deployment",
      icon: <Shield className="h-6 w-6" />,
      features: [
        { name: "Smart meter decoy device", included: true },
        { name: "EV charger decoy device", included: true },
        { name: "Industrial controller decoy", included: true },
        { name: "Hardware warranty", included: true },
        { name: "Installation guide", included: true },
      ],
    },
    {
      id: "basic",
      name: "Basic",
      price: "70",
      period: "per month",
      description: "Perfect for small factories & EV chargers",
      icon: <Smartphone className="h-6 w-6" />,
      features: [
        { name: "SMS alerts", included: true },
        { name: "Local logs storage", included: true },
        { name: "Basic fraud detection", included: true },
        { name: "Mobile app access", included: true },
        { name: "Email support", included: true },
        { name: "Weekly reports", included: false },
        { name: "ERP integration", included: false },
        { name: "Advanced analytics", included: false },
      ],
    },
    {
      id: "standard",
      name: "Standard",
      price: "120",
      period: "per month",
      description: "Ideal for mid-size companies",
      icon: <Check className="h-6 w-6" />,
      popular: true,
      features: [
        { name: "Everything in Basic", included: true },
        { name: "Weekly PDF/Excel reports", included: true },
        { name: "ERP integration", included: true },
        { name: "WhatsApp alerts", included: true },
        { name: "Priority support", included: true },
        { name: "Custom dashboards", included: true },
        { name: "Advanced analytics", included: false },
        { name: "Threat intelligence", included: false },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "280",
      period: "per month",
      description: "For large industries & STEG",
      icon: <Shield className="h-6 w-6" />,
      features: [
        { name: "Everything in Standard", included: true },
        { name: "Advanced fraud analytics", included: true },
        { name: "National threat intelligence", included: true },
        { name: "VPN/proxy detection", included: true },
        { name: "ROI reports", included: true },
        { name: "24/7 phone support", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated account manager", included: true },
      ],
    },
  ]

  const additionalServices = [
    {
      id: "consulting",
      name: "Consulting / Custom Services",
      price: "FREE",
      description: "Custom security consulting and implementation services",
      icon: <HeadphonesIcon className="h-6 w-6" />,
    },
    {
      id: "maintenance",
      name: "Maintenance",
      price: "250 TND",
      description: "Monthly maintenance and support services",
      icon: <Wrench className="h-6 w-6" />,
    },
  ]

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleContinue = async () => {
    if (!selectedPlan) return

    setLoading(true)
    // Here you would integrate with your payment processor
    // For now, we'll redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image
              src="/images/ampdefend-logo.png"
              alt="AMPDefend Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold text-foreground">AMPDefend</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your Protection Plan</h1>
          <p className="text-muted-foreground">Select the perfect security solution for your infrastructure</p>
        </div>

        {/* Main Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedPlan === plan.id
                  ? "ring-2 ring-primary border-primary"
                  : "border-border hover:border-primary/50"
              } ${plan.popular ? "border-primary" : ""}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2 text-primary">{plan.icon}</div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">TND</span>
                  <div className="text-sm text-muted-foreground">{plan.period}</div>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check
                        className={`h-4 w-4 mr-2 ${feature.included ? "text-green-500" : "text-muted-foreground"}`}
                      />
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">Additional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {additionalServices.map((service) => (
              <Card key={service.id} className="border-border">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2 text-primary">{service.icon}</div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-foreground">{service.price}</span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center space-y-4">
          <Button onClick={handleContinue} disabled={!selectedPlan || loading} className="w-full max-w-md" size="lg">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                Processing...
              </div>
            ) : (
              `Continue with ${plans.find((p) => p.id === selectedPlan)?.name || "Selected Plan"}`
            )}
          </Button>

          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
