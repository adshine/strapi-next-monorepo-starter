"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import type { User } from "@/types/auth"

type AuthMode = "login" | "signup" | "forgot-password"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: AuthMode
  onAuthSuccess?: () => void
}

interface FormData {
  email: string
  password: string
  confirmPassword: string
  name: string
  agreeToTerms: boolean
  subscribeToNewsletter: boolean
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  onAuthSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    agreeToTerms: false,
    subscribeToNewsletter: false,
  })

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Use real authentication API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        throw new Error("Authentication failed")
      }

      onAuthSuccess?.()
      onClose()
      resetForm()
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields")
      return
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Use real signup API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Registration failed")
      }

      // Send verification email
      setVerificationSent(true)
      setLoading(false)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const handleVerifyEmail = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Use real verification API
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      })

      if (!response.ok) {
        throw new Error("Invalid verification code")
      }

      onAuthSuccess?.()
      onClose()
      resetForm()
    } catch (err) {
      setError("Invalid verification code")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate reset email API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setError("Password reset link sent to your email")
      setLoading(false)
      setTimeout(() => setMode("login"), 2000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      agreeToTerms: false,
      subscribeToNewsletter: false,
    })
    setError("")
    setMode("login")
    setVerificationSent(false)
    setVerificationCode("")
    setLoading(false)
  }

  const renderVerificationStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <CheckCircle className="text-accent-success mx-auto mb-4 h-12 w-12" />
        <h3 className="text-text-primary mb-2 text-lg font-semibold">
          Check your email
        </h3>
        <p className="text-text-muted mb-6 text-sm">
          We've sent a 6-digit verification code to{" "}
          <strong>{formData.email}</strong>
        </p>

        <div className="space-y-2">
          <Label htmlFor="verification-code">Verification Code</Label>
          <Input
            id="verification-code"
            type="text"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => {
              const code = e.target.value.replace(/\D/g, "").slice(0, 6)
              setVerificationCode(code)
              if (error) setError("")
            }}
            className="text-center font-mono text-2xl tracking-widest"
            maxLength={6}
          />
        </div>

        {error && (
          <Alert className="border-accent-danger mt-4">
            <AlertDescription className="text-accent-danger">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => {
              setVerificationSent(false)
              setError("")
              setVerificationCode("")
            }}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleVerifyEmail}
            disabled={loading || verificationCode.length !== 6}
            className="bg-accent-primary hover:bg-accent-primary/90 flex-1"
          >
            {loading ? "Verifying..." : "Continue"}
          </Button>
        </div>

        <p className="text-text-muted mt-4 text-xs">
          Didn't receive the code?{" "}
          <button className="text-accent-primary hover:underline">
            Resend
          </button>
        </p>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-elevated border-border-neutral sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text-primary text-center">
            {mode === "signup"
              ? "Create Account"
              : mode === "forgot-password"
                ? "Reset Password"
                : "Welcome Back"}
          </DialogTitle>
        </DialogHeader>

        {verificationSent ? (
          renderVerificationStep()
        ) : (
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as AuthMode)}
          >
            {!["forgot-password"].includes(mode) && (
              <TabsList className="bg-subtle grid w-full grid-cols-2">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-accent-primary data-[state=active]:text-text-inverse"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-accent-primary data-[state=active]:text-text-inverse"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="text-text-muted absolute top-3 left-3 h-4 w-4" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="bg-primary border-border-neutral text-text-primary pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="text-text-muted absolute top-3 left-3 h-4 w-4" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="bg-primary border-border-neutral text-text-primary pr-10 pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-text-muted hover:text-text-primary absolute top-3 right-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me" />
                    <Label
                      htmlFor="remember-me"
                      className="text-text-muted text-sm"
                    >
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMode("forgot-password")}
                    className="text-accent-primary text-sm hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <Alert className="border-accent-danger">
                    <AlertDescription className="text-accent-danger">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleLogin}
                  disabled={loading}
                  className="bg-accent-primary hover:bg-accent-primary/90 text-text-inverse w-full"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-elevated text-text-muted px-2 text-xs">
                      or
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="border-border-neutral text-text-primary hover:bg-elevated w-full"
                  onClick={() =>
                    handleInputChange("email", "demo@framertemplates.com")
                  }
                >
                  Continue as Demo User
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="text-text-muted absolute top-3 left-3 h-4 w-4" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="bg-primary border-border-neutral text-text-primary pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="text-text-muted absolute top-3 left-3 h-4 w-4" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="bg-primary border-border-neutral text-text-primary pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="text-text-muted absolute top-3 left-3 h-4 w-4" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="bg-primary border-border-neutral text-text-primary pr-10 pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-text-muted hover:text-text-primary absolute top-3 right-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="text-text-muted absolute top-3 left-3 h-4 w-4" />
                    <Input
                      id="signup-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="bg-primary border-border-neutral text-text-primary pr-10 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToTerms", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="terms"
                      className="text-text-muted text-sm leading-5"
                    >
                      I agree to the{" "}
                      <button className="text-accent-primary hover:underline">
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button className="text-accent-primary hover:underline">
                        Privacy Policy
                      </button>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.subscribeToNewsletter}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "subscribeToNewsletter",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor="newsletter"
                      className="text-text-muted text-sm leading-5"
                    >
                      Subscribe to our newsletter for template updates and tips
                    </Label>
                  </div>
                </div>

                {error && (
                  <Alert className="border-accent-danger">
                    <AlertDescription className="text-accent-danger">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleSignup}
                  disabled={loading}
                  className="bg-accent-primary hover:bg-accent-primary/90 text-text-inverse w-full"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="forgot-password" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-text-primary mb-2 text-lg font-semibold">
                    Reset your password
                  </h3>
                  <p className="text-text-muted text-sm">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <div className="relative">
                    <Mail className="text-text-muted absolute top-3 left-3 h-4 w-4" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="bg-primary border-border-neutral text-text-primary pl-10"
                    />
                  </div>
                </div>

                {error && (
                  <Alert
                    className={`border-${error.includes("sent") ? "accent-success" : "accent-danger"}`}
                  >
                    <AlertDescription
                      className={`text-${error.includes("sent") ? "accent-success" : "accent-danger"}`}
                    >
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="bg-accent-primary hover:bg-accent-primary/90 text-text-inverse w-full"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-accent-primary w-full text-sm hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
