"use client";

import React from "react";
import { useEffect, useState } from "react";
import { http } from "@/lib/http";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminDashboardData, AdminDashboardResponse } from "@/types/api";
import StatCard from "./stat-card";

export default function DashAdmin() {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const pendingBorrowings = dashboardData?.pending_borrowings ?? [];
  const lateBorrowings = dashboardData?.late_borrowings ?? [];

  useEffect(() => {
      async function fetchAdminDashboard() {
        try {
          setIsLoading(true);
          const response = await http.get<AdminDashboardResponse>("/admin/dashboard/borrowings");
          setDashboardData(response.data);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchAdminDashboard();
    }, []);

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
            {loading ? (
              <Skeleton className="h-9 w-48 mt-2" />
            ) : (
              <h1 className="text-3xl font-bold text-slate-700">
                {user?.nama ? user.nama.split(' ')[0] : "User"}!
              </h1>
            )}
            <p className="text-gray-500">Ringkasan kegiatan perpustakaan.</p>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {
            isLoading ? (
              <>
                <Skeleton className="h-30 w-full rounded-2xl" />
                <Skeleton className="h-30 w-full rounded-2xl" />
                <Skeleton className="h-30 w-full rounded-2xl" />
              </>
            ) : (
              <>
                <StatCard index={0} label="Total Buku" value={dashboardData?.total_books} growth={dashboardData?.books_added_this_month}  />
                <StatCard index={1} label="Buku Terpinjam" value={dashboardData?.total_borrowings} growth={dashboardData?.books_borrowed_this_month}  />
                <StatCard index={2} label="Buku Belum Dikembalikan" value={dashboardData?.total_overdue} growth={dashboardData?.books_overdue_this_month} />
              </>
            )
          }
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
                                <th className="p-5 text-slate-700 font-bold text-center">Nama</th>
                                <th className="p-5 text-slate-700 font-bold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                              Array.from({ length: 3 }).map((_, idx) => (
                                <tr key={`pending-skeleton-${idx}`} className="border-b border-gray-50 last:border-none">
                                  <td className="p-5"><Skeleton className="h-5 w-48" /></td>
                                  <td className="p-5"><Skeleton className="h-6 w-24 mx-auto rounded-full" /></td>
                                </tr>
                              ))
                            ) : pendingBorrowings.length ? (
                              pendingBorrowings.map((book, idx) => (
                                <tr key={idx} className="border-b border-gray-50 last:border-none">
                                    <td className="p-5 font-medium text-slate-700">{book.book_title}</td>
                                    <td className="p-5 text-center text-slate-600 font-medium">
                                        {book.peminjam}
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className="bg-[#FDF6B2] text-[#723B13] px-4 py-1 rounded-full font-bold text-xs">
                                            {book.status}
                                        </span>
                                    </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={2} className="p-5 text-center text-slate-500">Tidak ada data pending.</td>
                              </tr>
                            )}
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
                                <th className="p-5 text-slate-700 font-bold text-center">Nama</th>
                                <th className="p-5 text-slate-700 font-bold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                              Array.from({ length: 3 }).map((_, idx) => (
                                <tr key={`late-skeleton-${idx}`} className="border-b border-gray-50 last:border-none">
                                  <td className="p-5"><Skeleton className="h-5 w-48" /></td>
                                  <td className="p-5"><Skeleton className="h-6 w-28 mx-auto rounded-full" /></td>
                                  <td className="p-5"><Skeleton className="h-5 w-32 mx-auto" /></td>
                                </tr>
                              ))
                            ) : lateBorrowings.length ? (
                              lateBorrowings.map((book, idx) => (
                                <tr key={`late-${idx}`} className="border-b border-gray-50 last:border-none">
                                    <td className="p-5 font-medium text-slate-700">{book.book_title}</td>
                                    <td className="p-5 text-center">
                                        <span className="bg-[#F87171] text-white px-4 py-1 rounded-full font-bold text-xs whitespace-nowrap">
                                            {book.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-center text-slate-600 font-medium">
                                        {book.peminjam}
                                    </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="p-5 text-center text-slate-500">Tidak ada buku terlambat.</td>
                              </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}