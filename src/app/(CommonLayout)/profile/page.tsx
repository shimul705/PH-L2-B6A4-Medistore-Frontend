"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequireAuth } from "@/src/components/shared/require-auth";
import { useAuth } from "@/src/providers/auth-provider";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileInner />
    </RequireAuth>
  );
}

function ProfileInner() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your account and orders.</p>
          </div>
          <Button variant="outline" onClick={() => void logout()} className="text-red-600">
            Log out
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Account details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">{user?.name || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Role</span>
                <span className="font-medium">{user?.role}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Quick links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/profile/orders"><Button className="w-full" variant="outline">My orders</Button></Link>
              <Link href="/dashboard"><Button className="w-full" variant="outline">Dashboard</Button></Link>
              <Link href="/shop"><Button className="w-full">Browse medicines</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
