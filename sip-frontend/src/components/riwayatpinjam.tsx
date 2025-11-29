"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  History,
  User,
  LogOut,
  Bell,
  Search,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// --- Tipe Data Dummy ---
type BorrowRecord = {
  id: number;
  title: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string;
  status: "Dikembalikan" | "Tenggat" | "Dipinjam" | "Pending";
};

// --- Data Dummy ---
const borrowData: BorrowRecord[] = [
  {
    id: 1,
    title: "Blue Box Vol. 9",
    borrowDate: "12-11-2025",
    dueDate: "25-11-2025",
    returnDate: "22-11-2025",
    status: "Dikembalikan",
  },
  {
    id: 2,
    title: "Blue Box Vol. 9",
    borrowDate: "12-11-2025",
    dueDate: "25-11-2025",
    returnDate: "22-11-2025",
    status: "Tenggat",
  },
  {
    id: 3,
    title: "Blue Box Vol. 9",
    borrowDate: "12-11-2025",
    dueDate: "25-11-2025",
    returnDate: "22-11-2025",
    status: "Dikembalikan",
  },
  {
    id: 4,
    title: "Blue Box Vol. 1",
    borrowDate: "10-11-2025",
    dueDate: "24-11-2025",
    returnDate: "20-11-2025",
    status: "Dikembalikan",
  },
  {
    id: 5,
    title: "Harry Potter",
    borrowDate: "12-11-2025",
    dueDate: "25-11-2025",
    returnDate: "-",
    status: "Dipinjam",
  },
];

export default function RiwayatPinjam() {
  // State
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Logic Filter (Status + Search)
  const filteredData = borrowData.filter((item) => {
    const matchStatus =
      activeFilter === "Semua" || item.status === activeFilter;
    const matchSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      
      {/* --- SIDEBAR (Sama persis dengan Dashboard) --- */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col p-6 fixed h-full z-10">
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

        {/* Profile Section (Updated styling to match dashboard.tsx) */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2">
            <User size={24} />
          </div>
          <div>
            <p className="text-sm font-bold">Heru Budi</p>
            <p className="text-xs text-gray-500">1313623056</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-500 hover:text-slate-900"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Button>
          </Link>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
            >
              <History size={20} />
              Riwayat Peminjaman
            </Button>

            <Link href="/gantipassword" className="block">
                <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-500 hover:text-slate-900"
                >
                <Lock size={20} />
                Ubah Kata Sandi
                </Button>
            </Link>
        </nav>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-500 hover:text-red-600 mt-auto"
        >
          <LogOut size={20} />
          Keluar
        </Button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        
        {/* Header (Layout sama dengan Dashboard) */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-700">Riwayat</h1>
            <h1 className="text-3xl font-bold text-slate-700">Peminjaman</h1>
          </div>
          {/* Bell Icon (Updated styling to match dashboard.tsx) */}
          <div className="cursor-pointer p-2 rounded-full transition-colors text-blue-600 hover:bg-blue-100 hover:text-black">
            <Bell size={34} className="fill-current" />
          </div>
        </header>

        {/* Search Bar (Sama persis dengan Dashboard) */}
        <div className="relative mb-8 z-20">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <Input
            className="w-full pl-10 pr-12 py-6 bg-white border-gray-200 rounded-xl shadow-sm focus-visible:ring-blue-500 placeholder:text-gray-400"
            placeholder="Cari Riwayat Peminjaman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* --- FILTER TABS --- */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="font-bold text-slate-700 mr-2">Status:</span>
          {["Semua", "Dipinjam", "Dikembalikan", "Pending", "Tenggat"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>

        {/* --- TABLE CONTENT --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-6 font-semibold text-slate-600">Judul Buku</th>
                  <th className="p-6 font-semibold text-slate-600 text-center">
                    Tanggal Peminjaman
                  </th>
                  <th className="p-6 font-semibold text-slate-600 text-center">
                    Batas Waktu
                  </th>
                  <th className="p-6 font-semibold text-slate-600 text-center">
                    Tanggal Pengembalian
                  </th>
                  <th className="p-6 font-semibold text-slate-600 text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-none"
                  >
                    <td className="p-6">
                      <span className="font-semibold text-slate-700 block w-max">
                        {item.title}
                      </span>
                    </td>
                    <td className="p-6 text-center text-slate-500">
                      {item.borrowDate}
                    </td>
                    <td className="p-6 text-center text-slate-500">
                      {item.dueDate}
                    </td>
                    <td className="p-6 text-center text-slate-500">
                      {item.returnDate}
                    </td>
                    <td className="p-6 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400">
                      Tidak ada riwayat peminjaman ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Komponen Badge Status ---
function StatusBadge({ status }: { status: string }) {
  let styleClass = "bg-gray-100 text-gray-600";

  switch (status) {
    case "Dikembalikan":
      styleClass = "bg-green-100 text-green-700 border border-green-200";
      break;
    case "Tenggat":
      styleClass = "bg-[#F87171] text-white border border-red-400";
      break;
    case "Dipinjam":
      styleClass = "bg-blue-100 text-blue-700 border border-blue-200";
      break;
    case "Pending":
      styleClass = "bg-yellow-100 text-yellow-700 border border-yellow-200";
      break;
  }

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-bold inline-block ${styleClass}`}
    >
      {status}
    </span>
  );
}