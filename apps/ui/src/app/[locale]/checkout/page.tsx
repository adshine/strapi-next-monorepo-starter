"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  Lock,
  Shield,
} from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { MOCK_ADD_ONS, MOCK_PLANS } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type CheckoutStep = "review" | "payment" | "processing" | "complete"

interface CheckoutItem {
  id: string
  name: string
  price: number
  period: "month" | "year"
  type: "plan" | "addon"
}

// Mock payment processing
const processPayment = (amount: number, cardDetails: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        // 95% success rate for demo
        if (Math.random() > 0.05) {
          resolve({ success: true, transactionId: `txn_${Date.now()}` })
        } else {
          reject({ success: false, error: "Payment method declined" })
        }
      },
      2000 + Math.random() * 3000
    ) // 2-5 seconds
  })
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, refreshUser } = useAuth()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("review")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Extract checkout parameters from URL
  const planId = searchParams.get("plan")
  const billing = searchParams.get("billing") as "month" | "year" | null
  const addOnsParam = searchParams.get("addons")

  const selectedPlan = planId ? MOCK_PLANS.find((p) => p.id === planId) : null
  const selectedAddOns = addOnsParam ? addOnsParam.split(",") : []

  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    zip: "",
  })

  // Redirect if no plan selected or user not authenticated
  useEffect(() => {
    if (!selectedPlan || !user) {
      router.push("/pricing")
    }
  }, [selectedPlan, user, router])

  if (!selectedPlan || !user) {
    return null
  }

  const checkoutItems: CheckoutItem[] = [
    {
      id: selectedPlan.id,
      name: `${selectedPlan.name} Plan`,
      price: billing === "year" ? selectedPlan.price * 0.8 : selectedPlan.price,
      period: billing || "month",
      type: "plan",
    },
    ...selectedAddOns.map((addOnId) => {
      const addOn = MOCK_ADD_ONS.find(
        (a: (typeof MOCK_ADD_ONS)[0]) => a.id === addOnId
      )!
      return {
        id: addOn.id,
        name: addOn.name,
        price: billing === "year" ? addOn.price * 0.8 : addOn.price,
        period: billing || "month",
        type: "addon" as const,
      }
    }),
  ]

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price, 0)
  const tax = Math.round(subtotal * 0.08 * 100) / 100 // 8% tax
  const total = Math.round((subtotal + tax) * 100) / 100

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !cardDetails.number ||
      !cardDetails.expiry ||
      !cardDetails.cvc ||
      !cardDetails.name
    ) {
      setError("Please fill in all payment details")
      return
    }

    setLoading(true)
    setError("")
    setCurrentStep("processing")

    try {
      // Simulate payment processing
      await processPayment(total * 100, cardDetails) // Convert to cents

      // Mock successful payment - update user plan
      const updatedUser = {
        ...user,
        planId: selectedPlan.id,
        // Reset quotas for new plan
        downloadsToday: 0,
        downloadsReset: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
        requestsThisMonth: 0,
        requestsReset: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          1
        ).toISOString(),
      }

      // In a real app, this would be saved to backend/localStorage
      // For now, just refresh the user context
      refreshUser()

      // Redirect to success page
      router.push(
        `/account/thanks?plan=${selectedPlan.slug}&billing=${billing || "month"}&addons=${selectedAddOns.join(",")}&amount=${total}`
      )
    } catch (err: any) {
      setError(err.error || "Payment failed. Please try again.")
      setCurrentStep("payment")
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  if (currentStep === "processing") {
    return (
      <div className="bg-primary flex min-h-screen items-center justify-center p-4">
        <Card className="bg-elevated border-border-neutral w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="bg-accent-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Clock className="text-accent-primary h-8 w-8 animate-spin" />
            </div>
            <h2 className="text-text-primary mb-2 text-xl font-semibold">
              Processing Payment
            </h2>
            <p className="text-text-muted mb-4">
              Please wait while we process your payment...
            </p>
            <div className="bg-subtle h-2 w-full rounded-full">
              <div className="bg-accent-primary h-2 animate-pulse rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-primary min-h-screen">
      {/* Header */}
      <div className="border-border-neutral bg-elevated/50 border-b">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Link
            href="/pricing"
            className="text-text-muted hover:text-text-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pricing
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Order Summary */}
          <div>
            <Card className="bg-elevated border-border-neutral">
              <CardHeader>
                <CardTitle className="text-text-primary">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {checkoutItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="text-text-primary font-medium">
                        {item.name}
                      </div>
                      <div className="text-text-muted text-sm capitalize">
                        {item.period}ly
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-text-primary font-semibold">
                        ${item.price.toFixed(2)}
                      </div>
                      <div className="text-text-muted text-sm">
                        /${item.period}
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="text-text-primary">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Tax</span>
                    <span className="text-text-primary">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span className="text-text-primary">Total</span>
                    <span className="text-accent-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Badge
                    variant="secondary"
                    className="bg-accent-success/20 text-accent-success border-accent-success/30"
                  >
                    Billed {billing === "year" ? "annually" : "monthly"} •
                    Cancel anytime
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card className="bg-elevated border-border-neutral">
              <CardHeader>
                <CardTitle className="text-text-primary flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep === "review" ? (
                  <div className="space-y-4">
                    <Button
                      onClick={() => setCurrentStep("payment")}
                      className="bg-accent-primary hover:bg-accent-primary/90 text-text-inverse w-full"
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    {/* Card Information */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) =>
                            setCardDetails((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="bg-primary border-border-neutral"
                        />
                      </div>

                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) =>
                            setCardDetails((prev) => ({
                              ...prev,
                              number: formatCardNumber(e.target.value),
                            }))
                          }
                          className="bg-primary border-border-neutral"
                          maxLength={19}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiration</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) =>
                              setCardDetails((prev) => ({
                                ...prev,
                                expiry: formatExpiry(e.target.value),
                              }))
                            }
                            className="bg-primary border-border-neutral"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            type="password"
                            value={cardDetails.cvc}
                            onChange={(e) =>
                              setCardDetails((prev) => ({
                                ...prev,
                                cvc: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 4),
                              }))
                            }
                            className="bg-primary border-border-neutral"
                            maxLength={4}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          placeholder="12345"
                          value={cardDetails.zip}
                          onChange={(e) =>
                            setCardDetails((prev) => ({
                              ...prev,
                              zip: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10),
                            }))
                          }
                          className="bg-primary border-border-neutral"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="bg-accent-danger/10 border-accent-danger/20 flex items-center gap-2 rounded border p-3">
                        <AlertCircle className="text-accent-danger h-4 w-4" />
                        <span className="text-accent-danger text-sm">
                          {error}
                        </span>
                      </div>
                    )}

                    <div className="text-text-muted flex items-center gap-2 text-sm">
                      <Lock className="h-4 w-4" />
                      <span>
                        Your payment information is secure and encrypted
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-accent-primary hover:bg-accent-primary/90 text-text-inverse w-full"
                    >
                      {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Security Badges */}
            <div className="text-text-muted mt-6 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>256-bit Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
