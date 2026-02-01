"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/providers/auth-provider";

export default function AuthCallbackPage() {
  const { refresh } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  useEffect(() => {
    (async () => {
      await refresh();
      router.replace(next);
    })();
  }, [refresh, router, next]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-zinc-50 px-4">
      <div className="text-sm text-gray-700">Finishing sign-in...</div>
    </div>
  );
}
