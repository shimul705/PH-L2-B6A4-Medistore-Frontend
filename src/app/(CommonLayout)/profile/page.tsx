"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequireAuth } from "@/src/components/shared/require-auth";
import { useAuth } from "@/src/providers/auth-provider";
import { apiFetch } from "@/src/lib/api";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileInner />
    </RequireAuth>
  );
}

function ProfileInner() {
  const { user, logout, refresh } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState<string>(user?.name || "");
  const [imageUrl, setImageUrl] = useState<string>(user?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name || "");
    setImageUrl(user?.image || "");
  }, [user?.name, user?.image]);

  const onSave = async () => {
    setError(null);
    setSaving(true);
    try {
      await apiFetch("/api/v1/users/me", {
        method: "PATCH",
        json: {
          name: name.trim() || undefined,
          image: imageUrl.trim() || undefined,
        },
      });
      await refresh();
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Account details</CardTitle>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setName(user?.name || "");
                    setImageUrl(user?.image || "");
                  }}>
                    Cancel
                  </Button>
                  <Button disabled={saving} onClick={onSave}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white border">
                  <Image
                    src={user?.image || "https://placehold.co/200x200?text=User"}
                    alt={user?.name || "User"}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{user?.name || "—"}</p>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-gray-600">Role: <span className="font-medium">{user?.role}</span></p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input disabled={!isEditing} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-1">
                  <Label>Photo URL</Label>
                  <Input
                    disabled={!isEditing}
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Quick links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/profile/orders"><Button className="w-full" variant="outline">My orders</Button></Link>
              <Link href="/wishlist"><Button className="w-full" variant="outline">Wishlist</Button></Link>
              <Link href="/dashboard"><Button className="w-full" variant="outline">Dashboard</Button></Link>
              <Link href="/shop"><Button className="w-full">Browse medicines</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
