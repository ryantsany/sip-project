"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context"; // Pastikan path ini sesuai
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutDashboard,
  History,
  User,
  LogOut,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  // Helper untuk menentukan style tombol aktif
  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path !== "/dashboard" && pathname.startsWith(path));
    
    return `w-full justify-start gap-3 ${
      isActive
        ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
        : "text-gray-500 hover:text-slate-900"
    }`;
  };

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col p-6 fixed h-full z-10">
      {/* --- LOGO --- */}
      <div className="flex items-center gap-3 mb-10">
        <Image
          src="/logo.png"
          alt="Logo Perpustakaan"
          width={50}
          height={50}
          className="object-contain"
        />
        <div className="font-bold text-xl text-slate-700 leading-tight">
          Perpustakan
          <br />
          Sekolah
        </div>
      </div>

      {/* --- USER PROFILE --- */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 overflow-hidden shrink-0">
          <User size={24} />
        </div>
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          ) : (
            <>
              <p className="text-sm font-bold truncate" title={user?.nama || "Heru Budi"}>
                {user?.nama || "Heru Budi"}
              </p>
              <p className="text-xs text-gray-500 truncate" title={user?.nomor_induk || "1313623056"}>
                {user?.nomor_induk || "1313623056"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 space-y-2">
        <Link href="/dashboard" className="block">
          <Button variant="ghost" className={getLinkClass("/dashboard")}>
            <LayoutDashboard size={20} />
            Dashboard
          </Button>
        </Link>

        <Link href="/riwayatpinjam" className="block">
          <Button variant="ghost" className={getLinkClass("/riwayatpinjam")}>
            <History size={20} />
            Riwayat Peminjaman
          </Button>
        </Link>

        <Link href="/gantipassword" className="block">
          <Button variant="ghost" className={getLinkClass("/gantipassword")}>
            <Lock size={20} />
            Ubah Kata Sandi
          </Button>
        </Link>
      </nav>

      {/* --- LOGOUT --- */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-gray-500 hover:text-red-600 mt-auto"
        onClick={logout}
      >
        <LogOut size={20} />
        Keluar
      </Button>
    </aside>
  );
}