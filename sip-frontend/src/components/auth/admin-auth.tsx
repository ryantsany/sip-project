"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isAuthorized = user?.role === "admin" || user?.role === "petugas";

  useEffect(() => {
    if (!loading && (!user || !isAuthorized)) {
      router.replace("/dashboard");
    }
  }, [loading, user, isAuthorized, router]);

  if (loading || !user || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}