"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Bell, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/sidebar"; // Import Sidebar Baru
import { http } from "@/lib/http";
import { BorrowListResponse, BorrowRecord } from "@/types/api";


export default function RiwayatPinjam() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [borrowingList, setBorrowingList] = useState<BorrowRecord[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchBorrowingList = useCallback(async () => {
    try {
      setIsLoadingList(true);
      setFetchError(null);
      const response = await http.get<BorrowListResponse>("/pinjam-buku");
      setBorrowingList(response.data);
    } catch (error) {
      console.error("Failed to fetch borrowings:", error);
      setFetchError("Gagal memuat riwayat peminjaman.");
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchBorrowingList();
  }, [fetchBorrowingList]);

  const filteredData = borrowingList.filter((item) => {
    const matchStatus =
      activeFilter === "Semua" || item.status === activeFilter;
    const matchSearch = item.book_title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  const sortedData = filteredData.sort((a, b) => {
    const dateA = new Date(a.borrow_date).getTime();
    const dateB = new Date(b.borrow_date).getTime();
    return dateB - dateA; // Urutkan dari terbaru ke terlama
  });

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      
      {/* PANGGIL SIDEBAR DISINI */}
      <Sidebar />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-700">Riwayat</h1>
            <h1 className="text-3xl font-bold text-slate-700">Peminjaman</h1>
          </div>
          <div className="cursor-pointer p-2 rounded-full transition-colors text-blue-600 hover:bg-blue-100 hover:text-black">
            <Bell size={34} className="fill-current" />
          </div>
        </header>

        {/* Search Bar */}
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
                  <th className="p-6 font-semibold text-slate-600 text-center">Tanggal Peminjaman</th>
                  <th className="p-6 font-semibold text-slate-600 text-center">Batas Waktu</th>
                  <th className="p-6 font-semibold text-slate-600 text-center">Tanggal Pengembalian</th>
                  <th className="p-6 font-semibold text-slate-600 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingList && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-[#4F4F4F]">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <p className="text-sm font-medium">Memuat riwayat peminjaman...</p>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoadingList && fetchError && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-red-500">
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-sm font-semibold">{fetchError}</p>
                        <button
                          onClick={fetchBorrowingList}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Coba Lagi
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoadingList && !fetchError && sortedData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400">
                      Tidak ada riwayat peminjaman ditemukan.
                    </td>
                  </tr>
                )}

                {!isLoadingList && !fetchError &&
                  sortedData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-none"
                    >
                      <td className="p-6">
                        <span className="font-semibold text-slate-700 block w-max">
                          {item.book_title}
                        </span>
                      </td>
                      <td className="p-6 text-center text-slate-500">{item.borrow_date}</td>
                      <td className="p-6 text-center text-slate-500">{item.due_date}</td>
                      <td className="p-6 text-center text-slate-500">{item.return_date ?? "-"}</td>
                      <td className="p-6 text-center">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

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
    <span className={`px-4 py-1.5 rounded-full text-sm font-bold inline-block ${styleClass}`}>
      {status}
    </span>
  );
}