"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Eye, EyeOff, Check } from "lucide-react";
import { signIn } from "next-auth/react";
import api, { setAuthToken } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      if (data.success) {
        setAuthToken(data.data.token);
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          setError("Account created but session failed. Please login.");
          setLoading(false);
          return;
        }
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-hero items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 text-center px-12">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Start scanning with TrustShield
          </h2>
          <p className="text-lg text-white/70 max-w-md">
            Create your free account and get instant access to AI-powered fraud detection and document analysis.
          </p>
          <div className="mt-8 space-y-3 text-left max-w-xs mx-auto">
            {["Email & URL phishing detection", "AI-generated image scanning", "Legal document simplification"].map(
              (feature) => (
                <div key={feature} className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  {feature}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Free forever. No credit card required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Full name</label>
              <Input
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-1">
                      <div className={`h-1.5 w-1.5 rounded-full ${check.met ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      <span className={check.met ? "text-primary" : ""}>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading} isLoading={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
