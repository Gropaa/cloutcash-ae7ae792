import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/AuthCard";
import { motion } from "framer-motion";

const Login = () => {
  const [searchParams] = useSearchParams();

  // Read initial mode from URL
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // 🔥 NEW: Update mode whenever URL query changes
  useEffect(() => {
    const queryMode = searchParams.get("mode");
    if (queryMode === "signup") {
      setMode("signup");
    } else {
      setMode("login");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Backdrop Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-primary/10 backdrop-blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="mb-4 backdrop-blur-sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          {/* Login / Signup Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-muted/50 backdrop-blur-sm rounded-xl">
            <Button
              variant={mode === "login" ? "default" : "ghost"}
              onClick={() => setMode("login")}
              className="flex-1 transition-all duration-300"
              style={{ borderRadius: "10px" }}
            >
              Login
            </Button>

            <Button
              variant={mode === "signup" ? "default" : "ghost"}
              onClick={() => setMode("signup")}
              className="flex-1 transition-all duration-300"
              style={{ borderRadius: "10px" }}
            >
              Sign Up
            </Button>
          </div>
        </motion.div>

        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <AuthCard mode={mode} onSuccess={() => navigate("/dashboard")} />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
