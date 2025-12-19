"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Search,
    Pencil,
    ChevronLeft,
    ChevronRight,
    CheckSquare,
    X,
    Loader2,
    CalendarPlus2,
    BookCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { http } from "@/lib/http";
import { ManageBorrowingsResponse, ManageBorrowingRecord } from "@/types/api";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function KelolaPinjaman() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"aktif" | "pengajuan" | "terlambat" | "dikembalikan">("aktif");
    const [borrowings, setBorrowings] = useState<ManageBorrowingRecord[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<ManageBorrowingRecord | null>(null);
    const [actionState, setActionState] = useState<{ type: 'accept' | 'extend' | 'return' | 'reject' | null; id: string | null }>({
        type: null,
        id: null,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const itemsPerPage = 6;

    const fetchBorrowings = useCallback(async () => {
        try {
            setIsLoading(true);
            setFetchError(null);
            const response = await http.get<ManageBorrowingsResponse>("/borrowings");
            setBorrowings(response.data.borrowings ?? []);
        } catch (error) {
            console.error("Failed to fetch borrowings:", error);
            setFetchError("Gagal memuat data peminjaman.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBorrowings();
    }, [fetchBorrowings]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery]);

    const groupedBorrowings = useMemo(() => {
        const pending = borrowings.filter((loan) => (loan.status ?? "").toLowerCase() === "pending");
        const active = borrowings.filter((loan) => (loan.status ?? "").toLowerCase() === "dipinjam");
        const late = borrowings.filter((loan) => ["terlambat", "tenggat"].includes((loan.status ?? "").toLowerCase()));
        const returned = borrowings.filter((loan) => (loan.status ?? "").toLowerCase() === "dikembalikan");

        return {
            aktif: active,
            pengajuan: pending,
            terlambat: late,
            dikembalikan: returned,
        } as const;
    }, [borrowings]);

    const currentList = groupedBorrowings[activeTab];
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredData = useMemo(() => {
        if (!normalizedQuery) return currentList;
        return currentList.filter((loan) => {
            const borrower = loan.borrower?.toLowerCase() ?? "";
            const title = loan.book_title?.toLowerCase() ?? "";
            return borrower.includes(normalizedQuery) || title.includes(normalizedQuery);
        });
    }, [currentList, normalizedQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const formatDateDisplay = (dateString?: string | null) => {
        if (!dateString) return "-";
        const normalized = dateString.slice(0, 10);
        const [year, month, day] = normalized.split("-");
        if (year && month && day) {
            return `${day}-${month}-${year}`;
        }
        return dateString;
    };

    const formatCurrency = (amount?: number | null) => {
        if (amount === null || amount === undefined) return "-";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const calculateExtendedDate = (dueDate?: string | null) => {
        if (!dueDate) return null;
        const current = new Date(dueDate);
        if (Number.isNaN(current.getTime())) {
            return null;
        }
        current.setDate(current.getDate() + 7);
        return current.toISOString().slice(0, 10);
    };

    const nextDueDate = selectedLoan ? calculateExtendedDate(selectedLoan.due_date) : null;
    const canExtendLoan = (selectedLoan?.status ?? "").toLowerCase() === "dipinjam";
    const isActionLoading = actionState.type !== null;

    const handleEdit = (loan: ManageBorrowingRecord) => {
        setSelectedLoan(loan);
        setIsDialogOpen(true);
    };

    const handleApprove = async () => {
        if (!selectedLoan) return;

        setActionState({ type: "accept", id: selectedLoan.id });
        try {
            await http.post(`/borrowings/${selectedLoan.id}/accept`, {});
            toast.success("Peminjaman disetujui", {
                description: `Buku "${selectedLoan.book_title ?? "-"}" siap dipinjam.`,
                className: "!bg-white !text-slate-900 !border-slate-200",
            });
            setIsDialogOpen(false);
            fetchBorrowings();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Gagal menyetujui peminjaman.";
            toast.error("Gagal menyetujui", {
                description: message,
                className: "!bg-white !text-slate-900 !border-slate-200",
            });
        } finally {
            setActionState({ type: null, id: null });
        }
    };

    const handleExtendLoan = async () => {
        if (!selectedLoan) return;

        setActionState({ type: "extend", id: selectedLoan.id });
        try {
            await http.post(`/borrowings/${selectedLoan.id}/extend`, {});
            toast.success("Tenggat diperpanjang", {
                description: "Periode peminjaman bertambah 1 minggu.",
                className: "!bg-white !text-slate-900 !border-slate-200",
            });
            setIsDialogOpen(false);
            fetchBorrowings();
        } catch (error) {
            console.error(error);
            toast.error("Gagal memperpanjang tenggat", {
                description: "Sudah pernah memperpanjang atau terjadi kesalahan.",
                className: "!bg-white !text-slate-900 !border-slate-200",
            });
        } finally {
            setActionState({ type: null, id: null });
        }
    };

    const handleReturnBook = async () => {
        if (!selectedLoan) return;

        setActionState({ type: "return", id: selectedLoan.id });
        try {
            await http.post(`/borrowings/${selectedLoan.id}/return`, {});
            toast.success("Buku dikembalikan", {
                description: `Buku "${selectedLoan.book_title ?? "-"}" telah dikembalikan.`,
                className: "!bg-white !text-slate-900 !border-slate-200",
            });
            setIsDialogOpen(false);
            fetchBorrowings();
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengembalikan buku", {
                description: "Terjadi kesalahan saat memproses pengembalian.",
                className: "!bg-white !text-slate-900 !border-slate-200",
            });
        } finally {
            setActionState({ type: null, id: null });
        }
    };

    const handleRejectLoan = async () => {
        if (!selectedLoan) return;

        setActionState({ type: "reject", id: selectedLoan.id });
        try {
            await http.post(`/borrowings/${selectedLoan.id}/reject`, {});
            toast.success("Pengajuan ditolak", {
                description: `Pengajuan peminjaman untuk buku "${selectedLoan.book_title ?? "-"}" telah ditolak.`,
                className: "!bg-white !text-slate-900 !border-slate-200",
            });
            setIsDialogOpen(false);
            fetchBorrowings();
        } catch (error) {
            console.error(error);
            toast.error("Gagal menolak pengajuan", {
                description: "Terjadi kesalahan saat menolak pengajuan peminjaman.",
                className: "!bg-white !text-slate-900 !border-slate-200",
            });
        } finally {
            setActionState({ type: null, id: null });
        }
    };

    const handleTabChange = (tab: "aktif" | "pengajuan" | "terlambat" | "dikembalikan") => {
        setActiveTab(tab);
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
            case "Dikembalikan":
                return "bg-green-100 text-green-700 border border-green-200 tracking-wider";
            case "Pending":
                return "bg-[#FDF6B2] text-[#723B13] border border-yellow-200 tracking-wider"; 
            case "Tenggat":
            case "Terlambat":
                return "bg-red-100 text-red-400 border border-red-200 tracking-wider";
            case "Dipinjam":
                return "bg-blue-100 text-blue-500 border border-blue-200 tracking-wider";
            default:
                return "bg-gray-100 text-gray-500 border border-gray-200 tracking-wider";
        }
    };

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      <Toaster position="top-center" />
      <Sidebar />

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
            <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                <button
                    onClick={() => handleTabChange("aktif")}
                    className={`h-10 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap flex items-center justify-center tracking-wider ${
                        activeTab === "aktif"
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-slate-500 hover:bg-gray-50"
                    }`}
                >
                    Aktif
                </button>
                <button
                    onClick={() => handleTabChange("pengajuan")}
                    className={`h-10 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap flex items-center justify-center tracking-wider ${
                        activeTab === "pengajuan"
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-slate-500 hover:bg-gray-50"
                    }`}
                >
                    Pengajuan
                </button>
                <button
                    onClick={() => handleTabChange("terlambat")}
                    className={`h-10 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap flex items-center justify-center tracking-wider ${
                        activeTab === "terlambat"
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-slate-500 hover:bg-gray-50"
                    }`}
                >
                    Terlambat
                </button>
                <button
                    onClick={() => handleTabChange("dikembalikan")}
                    className={`h-10 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap flex items-center justify-center tracking-wider ${
                        activeTab === "dikembalikan"
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-slate-500 hover:bg-gray-50"
                    }`}
                >
                    Dikembalikan
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={20} />
                </div>
                <Input
                    className="py-6 w-full pl-12 pr-12 bg-white border-gray-200 rounded-xl shadow-sm focus-visible:ring-blue-500 placeholder:text-gray-400 text-sm"
                    placeholder="Cari berdasarkan Nama Peminjam/Buku"
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
                            
                            {activeTab === "dikembalikan" && (<th className="p-6 font-bold text-slate-700 text-center">Tanggal Pengembalian</th>)}
                            {activeTab !== "dikembalikan" && (<th className="p-6 font-bold text-slate-700 text-center">Tenggat</th>)}
                            <th className="p-6 font-bold text-slate-700 text-center">Status</th>
                            
                            {activeTab !== "pengajuan" && (
                                <th className="p-6 font-bold text-slate-700 text-center">Denda</th>
                            )}
                            
                            <th className="p-6 font-bold text-slate-700 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={6} className="p-10 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <p className="text-sm font-medium">Memuat data peminjaman...</p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!isLoading && fetchError && (
                            <tr>
                                <td colSpan={6} className="p-10 text-center text-red-500">
                                    <div className="flex flex-col items-center gap-3">
                                        <p className="text-sm font-semibold">{fetchError}</p>
                                        <Button
                                            onClick={fetchBorrowings}
                                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                                        >
                                            Coba Lagi
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!isLoading && !fetchError && currentItems.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-10 text-center text-gray-500">
                                    {activeTab === "pengajuan"
                                        ? "Belum ada pengajuan peminjaman."
                                        : activeTab === "aktif"
                                        ? "Belum ada peminjaman aktif."
                                        : activeTab === "terlambat"
                                        ? "Tidak ada buku terlambat."
                                        : "Belum ada buku yang dikembalikan."}
                                </td>
                            </tr>
                        )}

                        {!isLoading && !fetchError &&
                            currentItems.map((loan) => (
                                <tr key={loan.id} className="hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-none">
                                    <td className="p-6 text-slate-700 font-medium">{loan.borrower ?? "-"}</td>
                                    <td className="p-6 text-slate-700">{loan.book_title ?? "-"}</td>

                                    {activeTab === "pengajuan" && (
                                        <td className="p-6 text-slate-700 text-center">{formatDateDisplay(loan.borrow_date)}</td>
                                    )}

                                    {activeTab === "dikembalikan" && (
                                        <td className="p-6 text-slate-700 text-center">{formatDateDisplay(loan.return_date)}</td>
                                    )}

                                    {activeTab !== "dikembalikan" && (
                                        <td className="p-6 text-slate-700 text-center">{formatDateDisplay(loan.due_date)}</td>
                                    )}

                                    <td className="p-6 text-center">
                                        <span
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(loan.status)}`}
                                        >
                                            {loan.status ?? "-"}
                                        </span>
                                    </td>

                                    {activeTab !== "pengajuan" && (
                                        <td className="p-6 text-slate-700 text-center">{formatCurrency(loan.denda)}</td>
                                    )}

                                    <td className="p-6 text-center">
                                        <div className="flex justify-center">
                                            <button
                                                className="bg-blue-50 p-2 rounded-lg text-blue-500 hover:bg-blue-100 transition-colors border border-blue-200"
                                                onClick={() => handleEdit(loan)}
                                            >
                                                <Pencil size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-slate-500 text-sm">
                Menampilkan {isLoading ? 0 : currentItems.length} dari {isLoading ? 0 : filteredData.length} hasil
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
            <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-[500px] -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl border-none">
                
                <div 
                    className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 hover:bg-slate-100 p-1 cursor-pointer"
                    onClick={() => setIsDialogOpen(false)}
                >
                    <X className="h-6 w-6 text-slate-500" />
                </div>

                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-800 mb-4">
                        {activeTab === "pengajuan" ? "Detail Pengajuan" : "Detail Peminjaman"}
                    </DialogTitle>
                </DialogHeader>

                {selectedLoan && (
                    <div className="space-y-4">
                        
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Peminjam:</span>
                                <span className="font-semibold text-slate-700">{selectedLoan.borrower ?? "-"}</span>
                            </div>

                            <div className="flex justify-between items-start gap-4">
                                <span className="text-slate-500 shrink-0">Buku:</span>
                                <span className="font-semibold text-slate-700 text-right">{selectedLoan.book_title ?? "-"}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-500">Tanggal Pengambilan:</span>
                                <span className="font-semibold text-slate-700">{formatDateDisplay(selectedLoan.borrow_date)}</span>
                            </div>
                
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tanggal Tenggat:</span>
                                <span className="font-semibold text-slate-700">{formatDateDisplay(selectedLoan.due_date)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-500">Denda:</span>
                                <span className="font-semibold text-slate-700">{formatCurrency(selectedLoan.denda)}</span>
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
                                        className="h-10 rounded-xl bg-gray-200 px-8 font-bold text-slate-700 hover:bg-gray-300 hover:cursor-pointer"
                                    >
                                        Tutup
                                    </Button>
                                    <Button 
                                        onClick={handleRejectLoan}
                                        disabled={isActionLoading}
                                        className="bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold px-6 h-10 flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {actionState.type === "reject" ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <X className="h-4 w-4" />
                                        )}
                                        Tolak
                                    </Button>
                                    <Button 
                                        onClick={handleApprove} 
                                        disabled={isActionLoading}
                                        className="bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold px-6 h-10 flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {actionState.type === "accept" ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckSquare className="h-4 w-4" />
                                        )}
                                        Setujui
                                    </Button>
                                </div>
                            ) : activeTab === "dikembalikan" ? (<></>) : activeTab === "terlambat" ? (
                                <div className="space-y-4 text-right">
                                    <Button 
                                            onClick={handleReturnBook}
                                            disabled={isActionLoading}
                                            className="h-10 rounded-xl px-8 font-bold bg-[#04AA6D] text-white hover:bg-[#079b65] hover:cursor-pointer disabled:opacity-60"
                                        >
                                            {actionState.type === "return" ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <BookCheck />
                                            )}
                                            Dikembalikan
                                        </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-sm text-blue-900">
                                        <p className="font-semibold">Perpanjang 1 minggu</p>
                                        <p className="text-blue-800 mt-1">
                                            Tenggat baru: <span className="font-bold">{nextDueDate ? formatDateDisplay(nextDueDate) : "-"}</span>
                                        </p>
                                        <p className="text-xs text-blue-700 mt-2">
                                            Perpanjangan hanya dapat dilakukan sekali dan khusus untuk status Dipinjam.
                                        </p>
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                        <Button 
                                            onClick={handleReturnBook}
                                            disabled={isActionLoading}
                                            className="h-10 rounded-xl px-8 font-bold bg-[#04AA6D] text-white hover:bg-[#079b65] hover:cursor-pointer disabled:opacity-60"
                                        >
                                            {actionState.type === "return" ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <BookCheck />
                                            )}
                                            Dikembalikan
                                        </Button>
                                        <Button
                                            onClick={handleExtendLoan}
                                            disabled={!canExtendLoan || isActionLoading}
                                            className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white flex items-center font-bold px-6 h-10 rounded-xl gap-2 disabled:opacity-60"
                                        >
                                            {actionState.type === "extend" ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : null}
                                            <CalendarPlus2 /> Perpanjang
                                        </Button>
                                    </div>
                                    {!canExtendLoan && (
                                        <p className="text-xs text-slate-500 text-left">
                                            * Perpanjang hanya tersedia untuk peminjaman berstatus Dipinjam dan belum pernah diperpanjang.
                                        </p>
                                    )}
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