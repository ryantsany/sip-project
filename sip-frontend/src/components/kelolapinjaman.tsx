"use client";

import React, { useState } from "react";
import {
  Search,
  Pencil,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// --- Tipe Data ---
type Loan = {
  id: number;
  borrower: string;
  title: string;
  dueDate: string;
  status: "Dikembalikan" | "Tenggat" | "Pending" | "Dipinjam";
  fine?: string;
  pickupDate?: string;
};

// --- Data Dummy ---
const initialActiveLoans: Loan[] = [
  { id: 1, borrower: "Kouji Miura", title: "Blue Box Vol. 9", dueDate: "11-11-2025", status: "Dikembalikan", fine: "Rp0" },
  { id: 2, borrower: "Kouji Miura", title: "Blue Box Vol. 9", dueDate: "11-11-2025", status: "Tenggat", fine: "Rp0" },
];

const initialRequestLoans: Loan[] = [
  { id: 101, borrower: "Kouji Miura", title: "Blue Box Vol. 9", pickupDate: "11-11-2025", dueDate: "18-11-2025", status: "Pending" },
  { id: 102, borrower: "Ahmad Dani", title: "One Piece Vol. 100", pickupDate: "12-11-2025", dueDate: "19-11-2025", status: "Pending" },
];

export default function KelolaPinjaman() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"aktif" | "pengajuan">("aktif");
  
  // 1. STATE DATA
  const [activeData, setActiveData] = useState<Loan[]>(initialActiveLoans);
  const [requestData, setRequestData] = useState<Loan[]>(initialRequestLoans);

  // 2. STATE MODAL & FORM
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [extendedDate, setExtendedDate] = useState(""); 

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- PILIH DATA BERDASARKAN TAB ---
  const currentList = activeTab === "aktif" ? activeData : requestData;

  const filteredData = currentList.filter(
    (loan) =>
      loan.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // --- HELPER: Format Tanggal ---
  const formatDateDisplay = (dateString: string) => {
      if(!dateString) return "";
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
  };

  // --- HANDLER ---
  const handleEdit = (loan: Loan) => {
    setSelectedLoan(loan);
    setExtendedDate(""); 
    setIsDialogOpen(true);
  };

  const handleApprove = () => {
    if (!selectedLoan) return;
    setRequestData((prev) => prev.filter((item) => item.id !== selectedLoan.id));
    const approvedLoan: Loan = {
        ...selectedLoan,
        status: "Dipinjam",
        fine: "Rp0", 
    };
    setActiveData((prev) => [approvedLoan, ...prev]);
    setIsDialogOpen(false);
    toast.success("Peminjaman Disetujui!", {
        description: `Buku "${selectedLoan.title}" kini masuk ke Peminjaman Aktif.`,
        className: "!bg-white !text-slate-900 !border-slate-200",
    });
  };

  const handleSaveUpdate = () => {
      if (!selectedLoan) return;
      if (!extendedDate) {
          toast.error("Silakan pilih tanggal perpanjangan terlebih dahulu!");
          return;
      }
      setActiveData((prevData) => 
        prevData.map((loan) => 
            loan.id === selectedLoan.id 
            ? { ...loan, dueDate: formatDateDisplay(extendedDate) } 
            : loan
        )
      );
      setIsDialogOpen(false);
      toast.success("Tenggat Waktu Diperbarui!", {
          description: `Tenggat baru untuk "${selectedLoan.borrower}" adalah ${formatDateDisplay(extendedDate)}.`,
          className: "!bg-white !text-slate-900 !border-slate-200",
      });
  };

  const handleTabChange = (tab: "aktif" | "pengajuan") => {
      setActiveTab(tab);
      setCurrentPage(1);
      setSearchQuery("");
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
        case "Dikembalikan": return "bg-green-100 text-green-700";
        case "Pending": return "bg-[#FDF6B2] text-[#723B13]";
        case "Tenggat": return "bg-red-100 text-red-600";
        case "Dipinjam": return "bg-blue-100 text-blue-700";
        default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      <Toaster position="top-center" />
      <Sidebar role="admin" />

      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-700 mb-2">Kelola Pinjaman</h1>
            <p className="text-gray-500">Kelola peminjaman buku dan pengajuan perpanjangan</p>
          </div>
        </header>

        {/* --- TABS & SEARCH BAR (UKURAN DISESUAIKAN: h-14) --- */}
        <div className="flex w-full items-center gap-4 mb-6 pt-6">
            
            {/* Tabs Group */}
            <div className="flex gap-4">
                <button
                    onClick={() => handleTabChange("aktif")}
                    className={`h-12 px-6 rounded-xl font-bold text-sm transition-colors whitespace-nowrap shadow-sm flex items-center justify-center ${
                        activeTab === "aktif"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-500 border border-slate-200 hover:bg-gray-50"
                    }`}
                >
                    Peminjaman Aktif
                </button>
                <button
                    onClick={() => handleTabChange("pengajuan")}
                    className={`h-12 px-6 rounded-xl font-bold text-sm transition-colors whitespace-nowrap shadow-sm flex items-center justify-center ${
                        activeTab === "pengajuan"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-500 border border-slate-200 hover:bg-gray-50"
                    }`}
                >
                    Pengajuan Peminjaman
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={20} />
                </div>
                <Input
                    className="py-6 w-full pl-12 pr-12 bg-white border-gray-200 rounded-xl shadow-sm focus-visible:ring-blue-500 placeholder:text-gray-400 text-sm"
                    placeholder="Cari berdasarkan user/buku"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* --- TABLE CONTENT --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="p-6 font-bold text-slate-700">Nama Peminjam</th>
                            <th className="p-6 font-bold text-slate-700">Judul</th>
                            
                            {activeTab === "pengajuan" && (
                                <th className="p-6 font-bold text-slate-700 text-center">Tanggal Pengambilan</th>
                            )}
                            
                            <th className="p-6 font-bold text-slate-700 text-center">Tenggat</th>
                            <th className="p-6 font-bold text-slate-700 text-center">Status</th>
                            
                            {activeTab === "aktif" && (
                                <th className="p-6 font-bold text-slate-700 text-center">Denda</th>
                            )}
                            
                            <th className="p-6 font-bold text-slate-700 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((loan) => (
                            <tr key={loan.id} className="hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-none">
                                <td className="p-6 text-slate-700 font-medium">{loan.borrower}</td>
                                <td className="p-6 text-slate-700">{loan.title}</td>
                                
                                {activeTab === "pengajuan" && (
                                    <td className="p-6 text-slate-700 text-center">{loan.pickupDate}</td>
                                )}

                                <td className="p-6 text-slate-700 text-center">{loan.dueDate}</td>
                                
                                <td className="p-6 text-center">
                                    <span 
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(loan.status)}`}
                                    >
                                        {loan.status}
                                    </span>
                                </td>

                                {activeTab === "aktif" && (
                                    <td className="p-6 text-slate-700 text-center">{loan.fine}</td>
                                )}
                                
                                <td className="p-6 text-center">
                                    <div className="flex justify-center">
                                        <button 
                                            className="bg-blue-50 p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200"
                                            onClick={() => handleEdit(loan)}
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">
                                    Tidak ada data ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-slate-500 text-sm">
                Menampilkan {currentItems.length} dari {filteredData.length} hasil
                (Halaman {currentPage} dari {totalPages || 1})
            </p>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-gray-300 text-slate-600 hover:bg-gray-100" onClick={handlePrevPage} disabled={currentPage === 1}>
                    <ChevronLeft size={20} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-gray-300 text-slate-600 hover:bg-gray-100" onClick={handleNextPage} disabled={currentPage >= totalPages || totalPages === 0}>
                    <ChevronRight size={20} />
                </Button>
            </div>
        </div>

        {/* --- MODAL EDIT / ACC --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="fixed !left-1/2 !top-1/2 z-50 w-full max-w-[500px] !-translate-x-1/2 !-translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl border-none">
                
                <div 
                    className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 hover:bg-slate-100 p-1 cursor-pointer"
                    onClick={() => setIsDialogOpen(false)}
                >
                    <X className="h-6 w-6 text-slate-500" />
                </div>

                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-800 mb-4">
                        {activeTab === "pengajuan" ? "Proses Pengajuan" : "Edit Peminjaman"}
                    </DialogTitle>
                </DialogHeader>

                {selectedLoan && (
                    <div className="space-y-4">
                        
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Peminjam:</span>
                                <span className="font-semibold text-slate-700">{selectedLoan.borrower}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-500">Buku:</span>
                                <span className="font-semibold text-slate-700">{selectedLoan.title}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-500">Tanggal Pengambilan:</span>
                                <span className="font-semibold text-slate-700">{selectedLoan.pickupDate}</span>
                            </div>
                
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tanggal Tenggat:</span>
                                <span className="font-semibold text-slate-700">{selectedLoan.dueDate}</span>
                            </div>
                            
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-slate-500">Status Saat Ini:</span>
                                <span 
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedLoan.status)}`}
                                >
                                    {selectedLoan.status}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            {activeTab === "pengajuan" ? (
                                <div className="flex gap-3 justify-end">
                                    <Button 
                                        onClick={() => setIsDialogOpen(false)} 
                                        className="h-10 rounded-xl bg-red-600 px-8 font-bold text-white hover:bg-red-700"
                                    >
                                        Batal
                                    </Button>
                                    <Button 
                                        onClick={handleApprove} 
                                        className="bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold px-6 h-10"
                                    >
                                        <CheckSquare className="mr-2 h-4 w-4" />
                                        Setujui Peminjaman
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-slate-700">Perpanjang Tenggat</label>
                                        <Input 
                                            type="date" 
                                            className="rounded-full border-slate-400" 
                                            value={extendedDate}
                                            onChange={(e) => setExtendedDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-3 justify-end mt-4">
                                        <Button 
                                            onClick={() => setIsDialogOpen(false)} 
                                            className="h-10 rounded-xl bg-red-600 px-8 font-bold text-white hover:bg-red-700"
                                        >
                                            Batal
                                        </Button>
                                        <Button onClick={handleSaveUpdate} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center font-bold px-6 h-10 rounded-xl">
                                            Simpan Perubahan
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}