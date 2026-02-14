"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/src/providers/auth-provider";

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Welcome{user?.name ? `, ${user.name}` : ""}</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Manage your MediStore activities from here.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/dashboard/orders"><Button variant="outline" className="w-full">Orders</Button></Link>
            <Link href="/shop"><Button variant="outline" className="w-full">Browse medicines</Button></Link>
          </div>
          {(user?.role === "SELLER" || user?.role === "ADMIN") && (
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/dashboard/medicines"><Button className="w-full">Manage medicines</Button></Link>
              {user?.role === "ADMIN" && (
                <Link href="/dashboard/users"><Button className="w-full">Manage users</Button></Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Role</span>
            <span className="font-medium">{user?.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <Link href="/dashboard/profile"><Button variant="outline" className="w-full mt-2">Profile</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}
