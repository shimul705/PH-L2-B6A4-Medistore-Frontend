"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/src/providers/auth-provider";

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/shop";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ name, email, password, role });
      // After registering, redirect to login (user must login manually)
      router.push(`/login?next=${encodeURIComponent(next)}`);
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-zinc-50 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Register with email/password or Google.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
          )}

          <Button type="button" variant="outline" className="w-full" onClick={loginWithGoogle}>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>

            <div className="space-y-1">
              <Label>Account type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={role === "CUSTOMER" ? "default" : "outline"}
                  onClick={() => setRole("CUSTOMER")}
                >
                  Customer
                </Button>
                <Button
                  type="button"
                  variant={role === "SELLER" ? "default" : "outline"}
                  onClick={() => setRole("SELLER")}
                >
                  Seller
                </Button>
              </div>
              <p className="text-xs text-gray-500">Sellers can add/manage medicines from the dashboard.</p>
            </div>

            <Button disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link className="text-blue-600 font-medium hover:underline" href={`/login?next=${encodeURIComponent(next)}`}>
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
