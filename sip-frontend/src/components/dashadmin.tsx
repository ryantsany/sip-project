"use client";

import React from "react";
import Sidebar from "@/components/sidebar";
import { Bell } from "lucide-react";

// --- Data Dummy Statistik ---
const stats = [
  {
    label: "Total Buku",
    value: 212,
    growth: "+19 Bulan ini",
    isPositive: true,
  },
  {
    label: "Buku terpinjam",
    value: 75,
    growth: "+19 Bulan ini",
    isNegative: true, 
  },
  {
    label: "Buku belum dikembalikan",
    value: 212,
    growth: "+21 Bulan ini",
    isPositive: false,
  },
];

// --- Data Dummy Tabel ---
const pendingBooks = [
  { id: 1, title: "Blue Box Vol. 9", status: "Pending" },
  { id: 2, title: "Blue Box Vol. 9", status: "Pending" },
  { id: 3, title: "Blue Box Vol. 9", status: "Pending" },
];

const overdueBooks = [
  { id: 1, title: "Blue Box Vol. 9", status: "Tenggat + 3h", borrower: "Mekas" },
  { id: 2, title: "Blue Box Vol. 9", status: "Tenggat", borrower: "Mekas" },
  { id: 3, title: "Blue Box Vol. 9", status: "Tenggat", borrower: "Mekas" },
];

export default function DashAdmin() {
  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      
      <Sidebar role="admin" />

      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-700 mb-1">
              Selamat datang kembali,
            </h1>
            <h1 className="text-3xl font-bold text-slate-700 mb-2">Pamedi!</h1>
            <p className="text-gray-500">Ringkasan kegiatan perpustakaan.</p>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
              <div>
                <span className={`text-xs font-bold ${
                    index === 1 ? "text-red-500" : index === 2 ? "text-orange-500" : "text-green-500"
                }`}>
                    {stat.growth}
                </span>
                <h2 className="text-4xl font-bold text-slate-700 mt-2">{stat.value}</h2>
              </div>
              <p className="text-slate-500 font-bold text-lg">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Tables */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tabel Kiri */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Butuh diproses</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="p-5 text-slate-700 font-bold">Judul Buku</th>
                                <th className="p-5 text-slate-700 font-bold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingBooks.map((book) => (
                                <tr key={book.id} className="border-b border-gray-50 last:border-none">
                                    <td className="p-5 font-medium text-slate-700">{book.title}</td>
                                    <td className="p-5 text-center">
                                        <span className="bg-[#FDF6B2] text-[#723B13] px-4 py-1 rounded-full font-bold text-xs">
                                            {book.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tabel Kanan */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Buku terlambat</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="p-5 text-slate-700 font-bold">Judul Buku</th>
                                <th className="p-5 text-slate-700 font-bold text-center">Status</th>
                                <th className="p-5 text-slate-700 font-bold text-center">Nama</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overdueBooks.map((book) => (
                                <tr key={book.id} className="border-b border-gray-50 last:border-none">
                                    <td className="p-5 font-medium text-slate-700">{book.title}</td>
                                    <td className="p-5 text-center">
                                        <span className="bg-[#F87171] text-white px-4 py-1 rounded-full font-bold text-xs whitespace-nowrap">
                                            {book.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-center text-slate-600 font-medium">
                                        {book.borrower}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}