"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export function SiswaAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user){
        router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user){ 
    return null;
  }
  
  return <>{children}</>;
}