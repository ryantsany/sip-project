"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Loader2, Search, } from "lucide-react";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/sidebar"; 
import NotificationDropdown from "@/components/notifikasi";
import { http } from "@/lib/http";
import { BorrowListResponse, BorrowRecord } from "@/types/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function RiwayatPinjam() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [borrowingList, setBorrowingList] = useState<BorrowRecord[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);
  const [selectedExtendItem, setSelectedExtendItem] = useState<{ id: string; title: string } | null>(null);

  // --- 2. HANDLER MEMBUKA MODAL ---
  const openExtendModal = (id: string, title: string) => {
    setSelectedExtendItem({ id, title });
    setIsExtendDialogOpen(true);
  };

// --- 3. HANDLER EKSEKUSI PERPANJANG (Saat tombol "Ya" diklik) ---
  const handleConfirmExtend = async () => {
    if (!selectedExtendItem) return;

    try {
        // Simulasi API Call (Ganti dengan API asli Anda nanti)
        // await http.post(`/pinjam-buku/${selectedExtendItem.id}/extend`);
        
        toast.success("Berhasil Diperpanjang!", {
            description: `Masa pinjam buku "${selectedExtendItem.title}" telah diperpanjang.`,
            className: "!bg-white !text-slate-900 !border-slate-200",
        });

    } catch (error) {
        console.error(error);
        toast.error("Gagal memperpanjang peminjaman.");
    } finally {
        setIsExtendDialogOpen(false);
        setSelectedExtendItem(null);
        fetchBorrowingList(); // Refresh data setelah perpanjangan
    }
  };

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

  const handleExtend = (id: string, title: string) => {
  // Logika API perpanjangan disini
  // Contoh: await http.post(`/pinjam-buku/${id}/extend`);
  
  // Feedback visual sederhana
  alert(`Permintaan perpanjangan untuk buku "${title}" berhasil dikirim!`);
};

  const filteredData = borrowingList.filter((item) => {
    const matchStatus =
      activeFilter === "Semua" || item.status === activeFilter;
    // Search Logic (Judul ATAU Status)
    const query = searchQuery.toLowerCase();
    const matchSearch = 
      item.book_title.toLowerCase().includes(query) || 
      item.status.toLowerCase().includes(query);

    return matchStatus && matchSearch;
  });

  const sortedData = filteredData.sort((a, b) => {
    const dateA = new Date(a.borrow_date).getTime();
    const dateB = new Date(b.borrow_date).getTime();
    return dateB - dateA; // Urutkan dari terbaru ke terlama
  });

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      
      <Sidebar />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        
        <header className="flex justify-between items-start mb-8 relative z-50">
          <div>
            <h1 className="text-3xl font-bold text-slate-700">Riwayat Pinjaman</h1>
            <p className="text-gray-500 mt-1">Lihat riwayat peminjaman bukumu</p>
          </div>
          <NotificationDropdown />
        </header>

        {/* Search Bar */}
        <div className="relative mb-8 z-20 pt-6">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pt-6 text-gray-400">
            <Search size={18} />
          </div>
          <Input
            className="w-full pl-10 pr-12 py-6 bg-white border-gray-200 rounded-xl shadow-sm focus-visible:ring-blue-500 placeholder:text-gray-400"
            placeholder="Cari berdasarkan judul buku atau status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* --- FILTER TABS --- */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="font-bold text-slate-700 mr-2">Status:</span>
          {["Semua","Pending", "Dipinjam", "Dikembalikan", "Tenggat", "Terlambat"].map(
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
                  <th className="p-6 font-semibold text-slate-600 text-center">Aksi</th>
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

                      {/* 4. BUTTON PERPANJANG (Memicu Modal) */}
                      <td className="p-6 text-center">
                        {item.status === "Dipinjam" ? (
                          <div className="flex justify-center">
                            <button 
                              onClick={() => openExtendModal(item.id, item.book_title)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-full text-sm transition-colors shadow-sm"
                              title="Perpanjang Peminjaman"
                            >
                              Perpanjang
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* --- 5. MODAL KONFIRMASI PERPANJANG --- */}
        <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
            <DialogContent className="fixed !left-1/2 !top-1/2 z-50 w-full max-w-[450px] !-translate-x-1/2 !-translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl border-none">
                
                {/* Tombol Close */}
                <div 
                    className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 hover:bg-slate-100 p-1 cursor-pointer"
                    onClick={() => setIsExtendDialogOpen(false)}
                >
                    <X className="h-6 w-6 text-slate-500" />
                </div>

                <DialogHeader className="mb-2">
                    <DialogTitle className="text-2xl font-bold text-slate-800 text-center">
                        Konfirmasi Perpanjangan
                    </DialogTitle>
                </DialogHeader>

                <div className="text-center py-4">
                    <p className="text-slate-600">
                        Apakah Anda yakin ingin memperpanjang masa peminjaman untuk buku:
                    </p>
                    <p className="text-blue-600 font-bold text-lg mt-2 px-4 py-2 bg-blue-50 rounded-xl inline-block">
                        {selectedExtendItem?.title}
                    </p>
                    <p className="text-sm text-slate-400 mt-4">
                        *Perpanjangan hanya dapat menambah durasi 7 hari dari batas waktu saat ini.
                    </p>
                </div>

                <DialogFooter className="mt-4 flex gap-3 justify-center sm:justify-center">
                    <Button 
                        type="button" 
                        onClick={() => setIsExtendDialogOpen(false)} 
                        className="h-10 rounded-xl bg-gray-100 px-8 font-bold text-slate-600 hover:bg-gray-200"
                    >
                        Batal
                    </Button>
                    <Button 
                        type="button" 
                        onClick={handleConfirmExtend} 
                        className="h-10 rounded-xl bg-blue-600 px-8 font-bold text-white hover:bg-blue-700"
                    >
                        Ya, Perpanjang
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let styleClass = "bg-gray-100 text-gray-600";

  switch (status) {
    case "Pending":
      styleClass = "bg-yellow-100 text-yellow-700 border border-yellow-200";
      break;
    case "Dipinjam":
      styleClass = "bg-blue-100 text-blue-700 border border-blue-200";
      break;
    case "Dikembalikan":
      styleClass = "bg-green-100 text-green-700 border border-green-200";
      break;
    case "Tenggat":
      styleClass = "bg-[#F87171] text-white border border-red-400";
      break;
    case "Terlambat":
      styleClass = "bg-red-100 text-red-700 border border-red-200";
      break;
  }

  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-bold inline-block ${styleClass}`}>
      {status}
    </span>
  );
}