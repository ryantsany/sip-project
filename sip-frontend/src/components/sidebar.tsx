"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutDashboard,
  BookOpen, 
  Users,   
  Search,   
  LogOut,
  History, 
  Lock,    
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// Definisikan tipe props
interface SidebarProps {
  role?: "siswa" | "admin"; 
}

export default function Sidebar({ role = "siswa" }: SidebarProps) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

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
      <div className="flex items-center gap-3 mb-10">
        <Image src="/logo.png" alt="Logo" width={50} height={50} className="object-contain" />
        <div className="font-bold text-xl text-slate-700 leading-tight">
          Perpustakan<br />Sekolah
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 overflow-hidden shrink-0">
          <User size={24} />
        </div>
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div>
          ) : (
            <>
              <p className="text-sm font-bold truncate">
                {user?.nama}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.nomor_induk}
              </p>
            </>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {/* --- MENU ADMIN --- */}
        {role === "admin" && (
          <>
            <Link href="/admin/dashboard" className="block">
              <Button variant="ghost" className={getLinkClass("/admin/dashboard")}>
                <LayoutDashboard size={20} />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/kelolabuku" className="block">
              <Button variant="ghost" className={getLinkClass("/admin/kelolabuku")}>
                <BookOpen size={20} />
                Kelola Buku
              </Button>
            </Link>
            <Link href="/admin/kelolauser" className="block">
              <Button variant="ghost" className={getLinkClass("/admin/kelolauser")}>
                <Users size={20} />
                Kelola User
              </Button>
            </Link>
            <Link href="/admin/kelolapinjaman" className="block">
              <Button variant="ghost" className={getLinkClass("/admin/kelolapinjaman")}>
                <Search size={20} />
                Kelola Pinjaman
              </Button>
            </Link>
          </>
        )}

        {/* --- MENU SISWA --- */}
        {role === "siswa" && (
          <>
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
          </>
        )}
      </nav>

      <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-red-600 mt-auto" onClick={logout}>
        <LogOut size={20} />
        Keluar
      </Button>
    </aside>
  );
}