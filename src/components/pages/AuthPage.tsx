import React, { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Wallet, ArrowRight, Shield, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export function AuthPage() {
  const { login, register } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (registerPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setIsLoading(true);
    try {
      await register(registerName, registerEmail, registerPassword);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Left side - Branding */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary p-3">
                <Wallet className="h-8 w-8 text-primary-foreground" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-primary">FinConnect</h1>
                <p className="text-muted-foreground">Track, plan, and share budgets</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="mb-2">Collaborative Finance Tracking</h2>
                <p className="text-muted-foreground">
                  Make budgeting interactive, transparent, and social. Track spending, plan budgets, and get AI-driven insights — all while fostering human connection.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-start gap-2 p-4 rounded-lg bg-card border">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3>Collaborate</h3>
                  <p className="text-muted-foreground">
                    Share projects with friends, family, or team
                  </p>
                </div>

                <div className="flex flex-col items-start gap-2 p-4 rounded-lg bg-card border">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <TrendingUp className="h-5 w-5 text-accent" aria-hidden="true" />
                  </div>
                  <h3>AI Insights</h3>
                  <p className="text-muted-foreground">
                    Get personalized financial recommendations
                  </p>
                </div>

                <div className="flex flex-col items-start gap-2 p-4 rounded-lg bg-card border">
                  <div className="rounded-lg bg-secondary/10 p-2">
                    <Shield className="h-5 w-5 text-secondary" aria-hidden="true" />
                  </div>
                  <h3>Secure</h3>
                  <p className="text-muted-foreground">
                    Your financial data is protected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth forms */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Welcome to FinConnect</CardTitle>
                <CardDescription>
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          autoComplete="email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          autoComplete="current-password"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Button>

                      <p className="text-center text-muted-foreground">
                        Demo: Use any email and password to login
                      </p>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Full Name</Label>
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Sarah Johnson"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          required
                          autoComplete="name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="you@example.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          required
                          autoComplete="email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                          autoComplete="new-password"
                          minLength={8}
                        />
                        <p className="text-muted-foreground">
                          At least 8 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-confirm-password">Confirm Password</Label>
                        <Input
                          id="register-confirm-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerConfirmPassword}
                          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                          required
                          autoComplete="new-password"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-center text-muted-foreground">
                    By continuing, you agree to our{' '}
                    <button className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
