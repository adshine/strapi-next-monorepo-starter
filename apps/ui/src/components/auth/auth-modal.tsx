'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react';

import { saveMockUser, getMockUser, updateMockUser, MOCK_USERS, type User } from '@/lib/mock-data';

type AuthMode = 'login' | 'signup' | 'forgot-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onAuthSuccess?: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

export function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    agreeToTerms: false,
    subscribeToNewsletter: false,
  });

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const existingUser = getMockUser();
      const baseUser: User = existingUser ?? { ...MOCK_USERS[0], id: Date.now().toString() };
      const nextUser: User = { ...baseUser, email: formData.email };
      updateMockUser(nextUser);

      onAuthSuccess?.();
      onClose();
      resetForm();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate signup API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send verification email
      setVerificationSent(true);
      setLoading(false);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate verification API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new user account
      const newUser = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name!,
        planId: '1', // Solo plan by default
        downloadsToday: 0,
        downloadsReset: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        requestsThisMonth: 0,
        requestsReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
        favorites: [],
      };

      saveMockUser(newUser);

      onAuthSuccess?.();
      onClose();
      resetForm();
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate reset email API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setError('Password reset link sent to your email');
      setLoading(false);
      setTimeout(() => setMode('login'), 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      agreeToTerms: false,
      subscribeToNewsletter: false,
    });
    setError('');
    setMode('login');
    setVerificationSent(false);
    setVerificationCode('');
    setLoading(false);
  };

  const renderVerificationStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-accent-success mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Check your email
        </h3>
        <p className="text-text-muted text-sm mb-6">
          We've sent a 6-digit verification code to <strong>{formData.email}</strong>
        </p>

        <div className="space-y-2">
          <Label htmlFor="verification-code">Verification Code</Label>
          <Input
            id="verification-code"
            type="text"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => {
              const code = e.target.value.replace(/\D/g, '').slice(0, 6);
              setVerificationCode(code);
              if (error) setError('');
            }}
            className="text-center text-2xl tracking-widest font-mono"
            maxLength={6}
          />
        </div>

        {error && (
          <Alert className="mt-4 border-accent-danger">
            <AlertDescription className="text-accent-danger">{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setVerificationSent(false);
              setError('');
              setVerificationCode('');
            }}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleVerifyEmail}
            disabled={loading || verificationCode.length !== 6}
            className="flex-1 bg-accent-primary hover:bg-accent-primary/90"
          >
            {loading ? 'Verifying...' : 'Continue'}
          </Button>
        </div>

        <p className="text-xs text-text-muted mt-4">
          Didn't receive the code? <button className="text-accent-primary hover:underline">Resend</button>
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-elevated border-border-neutral">
        <DialogHeader>
          <DialogTitle className="text-center text-text-primary">
            {mode === 'signup' ? 'Create Account' :
             mode === 'forgot-password' ? 'Reset Password' :
             'Welcome Back'}
          </DialogTitle>
        </DialogHeader>

        {verificationSent ? (
          renderVerificationStep()
        ) : (
          <Tabs value={mode} onValueChange={(value) => setMode(value as AuthMode)}>
            {!['forgot-password'].includes(mode) && (
              <TabsList className="grid w-full grid-cols-2 bg-subtle">
                <TabsTrigger value="login" className="data-[state=active]:bg-accent-primary data-[state=active]:text-text-inverse">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-accent-primary data-[state=active]:text-text-inverse">
                  Sign Up
                </TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 bg-primary border-border-neutral text-text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 bg-primary border-border-neutral text-text-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-text-muted hover:text-text-primary"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me" />
                    <Label htmlFor="remember-me" className="text-sm text-text-muted">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMode('forgot-password')}
                    className="text-sm text-accent-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <Alert className="border-accent-danger">
                    <AlertDescription className="text-accent-danger">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-accent-primary hover:bg-accent-primary/90 text-text-inverse"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-elevated px-2 text-xs text-text-muted">or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-border-neutral text-text-primary hover:bg-elevated"
                  onClick={() => handleInputChange('email', 'demo@framertemplates.com')}
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
                    <User className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10 bg-primary border-border-neutral text-text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 bg-primary border-border-neutral text-text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 bg-primary border-border-neutral text-text-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-text-muted hover:text-text-primary"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                    <Input
                      id="signup-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10 bg-primary border-border-neutral text-text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm text-text-muted leading-5">
                      I agree to the{' '}
                      <button className="text-accent-primary hover:underline">Terms of Service</button>
                      {' '}and{' '}
                      <button className="text-accent-primary hover:underline">Privacy Policy</button>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.subscribeToNewsletter}
                      onCheckedChange={(checked) => handleInputChange('subscribeToNewsletter', checked as boolean)}
                    />
                    <Label htmlFor="newsletter" className="text-sm text-text-muted leading-5">
                      Subscribe to our newsletter for template updates and tips
                    </Label>
                  </div>
                </div>

                {error && (
                  <Alert className="border-accent-danger">
                    <AlertDescription className="text-accent-danger">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full bg-accent-primary hover:bg-accent-primary/90 text-text-inverse"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="forgot-password" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Reset your password
                  </h3>
                  <p className="text-text-muted text-sm">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 bg-primary border-border-neutral text-text-primary"
                    />
                  </div>
                </div>

                {error && (
                  <Alert className={`border-${error.includes('sent') ? 'accent-success' : 'accent-danger'}`}>
                    <AlertDescription className={`text-${error.includes('sent') ? 'accent-success' : 'accent-danger'}`}>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="w-full bg-accent-primary hover:bg-accent-primary/90 text-text-inverse"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full text-sm text-accent-primary hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
