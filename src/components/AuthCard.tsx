import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "@/hooks/use-toast";
import { Loader2, Users, Briefcase } from "lucide-react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/cloutcash-logo.png";
import { OnboardingModal } from "./OnboardingModal";

interface AuthCardProps {
  mode: "login" | "signup";
  onSuccess?: () => void;
}

const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .refine((email) => {
      const domain = email.split("@")[1];
      return domain && domain.length >= 3; // Basic domain validation
    }, "Invalid email domain"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .refine((password) => /[A-Z]/.test(password), "Password must contain at least one uppercase letter")
    .refine((password) => /[a-z]/.test(password), "Password must contain at least one lowercase letter")
    .refine((password) => /[0-9]/.test(password), "Password must contain at least one number"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .refine((name) => /^[a-zA-Z\s'-]+$/.test(name), "Name can only contain letters, spaces, hyphens, and apostrophes"),
  handle: z
    .string()
    .trim()
    .min(2, "Handle/Brand name must be at least 2 characters")
    .max(50, "Handle/Brand name must be less than 50 characters")
    .refine((handle) => {
      // Allow alphanumeric, underscores, dots, and optional @ prefix
      const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;
      return /^[a-zA-Z0-9_.]+$/.test(cleanHandle);
    }, "Handle can only contain letters, numbers, underscores, and dots"),
  followerCount: z
    .number()
    .min(0, "Follower count must be positive")
    .max(1000000000, "Follower count seems unrealistic")
    .optional(),
  marketingBudget: z
    .number()
    .min(0, "Budget must be positive")
    .max(10000000000, "Budget must be less than 10 billion")
    .optional(),
});

export const AuthCard = ({ mode, onSuccess }: AuthCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [marketingBudget, setMarketingBudget] = useState("");
  const [userType, setUserType] = useState<"creator" | "brand">("creator");
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newUserId, setNewUserId] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const validationData = {
        email,
        password,
        name,
        handle,
        followerCount: followerCount ? parseInt(followerCount) : undefined,
        marketingBudget: marketingBudget ? parseInt(marketingBudget) : undefined,
      };

      const result = signupSchema.safeParse(validationData);
      if (!result.success) {
        toast({
          title: "Validation Error",
          description: result.error.errors[0].message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const redirectUrl = `${window.location.origin}/dashboard`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
            user_type: userType,
            handle,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            handle,
            follower_count: userType === "creator" ? parseInt(followerCount || "0") : null,
            marketing_budget: userType === "brand" ? parseInt(marketingBudget || "0") : null,
            niche: "",
            profile_completed: false,
          })
          .eq("user_id", authData.user.id);

        if (profileError) console.error("Profile update error:", profileError);

        toast({
          title: "Account Created!",
          description: "Let's complete your profile in 3 quick steps.",
        });

        // Show onboarding modal
        setNewUserId(authData.user.id);
        setShowOnboarding(true);
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-2 shadow-2xl backdrop-blur-sm bg-card/95" style={{ borderRadius: '12px' }}>
      <CardHeader className="text-center space-y-4">
        <motion.img
          src={logo}
          alt="CloutCash"
          className="h-16 mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            {mode === "login" ? "Welcome Back" : "Join CloutCash"}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {mode === "login" 
              ? "Sign in to access your dashboard" 
              : "Match. Collaborate. Monetize your clout."}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.form
              key="login"
              onSubmit={handleLogin}
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" 
                disabled={loading}
                style={{ borderRadius: '12px' }}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Sign In
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base font-medium"
                style={{ borderRadius: '12px' }}
                disabled={loading}
                onClick={async () => {
                  const { error } = await lovable.auth.signInWithOAuth("google", {
                    redirect_uri: window.location.origin,
                  });
                  if (error) {
                    toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
                  }
                }}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              onSubmit={handleSignup}
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={userType === "creator" ? "default" : "outline"}
                  onClick={() => setUserType("creator")}
                  className="h-auto py-4 flex flex-col items-center gap-2 transition-all duration-300"
                  style={{ borderRadius: '12px' }}
                >
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">Creator</span>
                </Button>
                <Button
                  type="button"
                  variant={userType === "brand" ? "default" : "outline"}
                  onClick={() => setUserType("brand")}
                  className="h-auto py-4 flex flex-col items-center gap-2 transition-all duration-300"
                  style={{ borderRadius: '12px' }}
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="font-semibold">Brand</span>
                </Button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={userType}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="handle">
                      {userType === "creator" ? "Instagram Handle" : "Brand Name"}
                    </Label>
                    <Input
                      id="handle"
                      placeholder={userType === "creator" ? "@yourhandle" : "Your Brand"}
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  {userType === "creator" && (
                    <div className="space-y-2">
                      <Label htmlFor="followers">Follower Count (approx.)</Label>
                      <Input
                        id="followers"
                        type="number"
                        placeholder="e.g., 50000"
                        value={followerCount}
                        onChange={(e) => setFollowerCount(e.target.value)}
                        className="h-12"
                      />
                    </div>
                  )}

                  {userType === "brand" && (
                    <div className="space-y-2">
                      <Label htmlFor="budget">Monthly Marketing Budget (₹)</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="e.g., 100000"
                        value={marketingBudget}
                        onChange={(e) => setMarketingBudget(e.target.value)}
                        className="h-12"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 8 chars with uppercase, lowercase, number"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      className="h-12"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" 
                disabled={loading}
                style={{ borderRadius: '12px' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Start Matching"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base font-medium"
                style={{ borderRadius: '12px' }}
                disabled={loading}
                onClick={async () => {
                  const { error } = await lovable.auth.signInWithOAuth("google", {
                    redirect_uri: window.location.origin,
                  });
                  if (error) {
                    toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
                  }
                }}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </CardContent>

      {showOnboarding && newUserId && (
        <OnboardingModal
          isOpen={showOnboarding}
          onComplete={() => {
            setShowOnboarding(false);
            if (onSuccess) onSuccess();
          }}
          userType={userType}
          userId={newUserId}
        />
      )}
    </Card>
  );
};
