"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown, 
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { http } from "@/lib/http";
import { UsersResponse } from "@/types/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// --- Tipe Data User ---
type User = {
  nomorInduk: string;
  nama: string;
  kelas: string | null;
  role: string;
  peminjamanAktif: number;
};

export default function KelolaUser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNomorInduk, setCurrentNomorInduk] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    nama: "",
    nomorInduk: "",
    kelas: "",
    role: "siswa",
  });
  const [isDeletingNomorInduk, setIsDeletingNomorInduk] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hydrateUsers = useCallback((payload: UsersResponse["data"]) => {
    const normalizedUsers: User[] = payload.data.map((user) => ({
      nomorInduk: user.nomor_induk,
      nama: user.nama,
      kelas: user.kelas,
      role: user.role,
      peminjamanAktif: user.peminjaman_aktif,
    }));

    setUsers(normalizedUsers);
    setPaginationInfo({
      current_page: payload.current_page,
      last_page: payload.last_page,
      total: payload.total,
      per_page: payload.per_page,
      from: payload.from ?? 0,
      to: payload.to ?? 0,
    });
  }, []);

  const loadUsers = useCallback(async (page: number, query: string) => {
    const trimmed = query.trim();
    const endpoint = trimmed
      ? `/search-users?query=${encodeURIComponent(trimmed)}&page=${page}`
      : `/users?page=${page}`;
    const response = await http.get<UsersResponse>(endpoint);
    return response.data;
  }, []);

  useEffect(() => {
    let isActive = true;
    const delay = searchQuery.trim() ? 400 : 0;

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const payload = await loadUsers(currentPage, searchQuery);
        if (!isActive) return;
        hydrateUsers(payload);
        setError(null);
      } catch (err) {
        if (!isActive) return;
        console.error("Failed to fetch users:", err);
        setUsers([]);
        setPaginationInfo(null);
        setError("Gagal memuat data user.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }, delay);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [currentPage, searchQuery, loadUsers, hydrateUsers]);

  // --- PAGINATION DATA DARI SERVER ---
  const totalPages = paginationInfo?.last_page ?? 1;
  const totalItems = paginationInfo?.total ?? users.length;
  const currentUsers = users;

  // --- HANDLER PAGINATION ---
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // --- HANDLER FORM ---
  const resetForm = () => {
    setFormData({
      nama: "",
      nomorInduk: "",
      kelas: "",
      role: "siswa",
    });
    setIsEditing(false);
    setCurrentNomorInduk(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (user: User) => {
    setFormData({
      nama: user.nama,
      nomorInduk: user.nomorInduk,
      kelas: user.kelas ?? "",
      role: user.role,
    });
    setIsEditing(true);
    setCurrentNomorInduk(user.nomorInduk);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (nomorInduk: string) => {
    const confirmed = window.confirm("Yakin ingin menghapus user ini?");
    if (!confirmed) return;

    try {
      setIsDeletingNomorInduk(nomorInduk);
      await http.delete(`/delete-user/${nomorInduk}`);
      toast.success("User berhasil dihapus.");
      const payload = await loadUsers(currentPage, searchQuery);
      hydrateUsers(payload);
      setError(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Gagal menghapus user.");
    } finally {
      setIsDeletingNomorInduk(null);
    }
  };

  const handleSave = async () => {
    if (!formData.nama || !formData.nomorInduk || !formData.role) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    const payload = {
      nomor_induk: formData.nomorInduk.trim(),
      nama: formData.nama.trim(),
      kelas: formData.kelas.trim() || null,
      role: formData.role,
    };

    try {
      setIsSubmitting(true);
      if (isEditing && currentNomorInduk !== null) {
        await http.put(`/update-user/${currentNomorInduk}`, payload);
        toast.success("Data user diperbarui.");
      } else {
        await http.post("/add-user", payload);
        toast.success("User berhasil ditambahkan.");
      }

      const refreshed = await loadUsers(currentPage, searchQuery);
      hydrateUsers(refreshed);
      setError(null);
      resetForm();
    } catch (error) {
      console.error("Failed to save user:", error);
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan user.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      <Toaster position="top-center" />
      <Sidebar />

      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-700 mb-2">Kelola User</h1>
            <p className="text-gray-500">Kelola data user perpustakaan</p>
          </div>
        </header>

        {/* Search Bar & Tambah User */}
        <div className="flex w-full items-center gap-4 mb-6 pt-6">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <Input
              className="w-full pl-12 pr-12 py-6 bg-white border-gray-200 rounded-xl shadow-sm focus-visible:ring-blue-500 placeholder:text-gray-400 text-base"
              placeholder="Cari berdasarkan Nama/Nomor Induk"
              value={searchQuery}
              onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
              }}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold px-6 py-6 rounded-xl flex items-center gap-2 whitespace-nowrap shadow-sm"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus size={18} />
                Tambah User
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
              <div
                className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 hover:bg-slate-100 p-1 cursor-pointer"
                onClick={resetForm}
              >
                <X className="h-6 w-6 text-slate-500" />
              </div>

              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  {isEditing ? "Edit User" : "Tambah User"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Nomor Induk</label>
                  <Input
                    name="nomorInduk"
                    value={formData.nomorInduk}
                    onChange={handleInputChange}
                    disabled={isEditing || isSubmitting}
                    className="h-11 w-full rounded-full border border-slate-400 bg-white px-5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Nama Lengkap</label>
                  <Input
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-full border border-slate-400 bg-white px-5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">Kelas</label>
                    <Input
                      name="kelas"
                      value={formData.kelas}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-full border border-slate-400 bg-white px-5 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Jika admin, kosongkan saja"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">Role</label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="h-11 w-full appearance-none rounded-full border border-slate-400 bg-white px-5 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                        disabled={isSubmitting}
                      >
                        <option value="siswa">Siswa</option>
                        <option value="guru">Guru</option>
                        <option value="petugas">Petugas</option>
                        <option value="admin">Admin</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <ChevronDown size={18} className="text-slate-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-8 flex gap-3 sm:justify-end">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="h-10 rounded-xl bg-red-600 px-8 font-bold text-white hover:bg-red-700"
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="h-10 rounded-xl bg-blue-600 px-8 font-bold text-white hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </span>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* --- TABLE USER --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-6 font-bold text-slate-700 text-center">Nomor Induk</th>
                  <th className="p-6 font-bold text-slate-700">Nama</th>
                  <th className="p-6 font-bold text-slate-700">Kelas</th>
                  <th className="p-6 font-bold text-slate-700 text-center">Peminjaman Aktif</th>
                  <th className="p-6 font-bold text-slate-700 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index} className="border-b border-gray-50 last:border-none">
                      <td colSpan={5} className="p-6">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ))
                ) : currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr
                      key={user.nomorInduk}
                      className="hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-none"
                    >
                      <td className="p-6 text-slate-600 text-center">{user.nomorInduk}</td>
                      <td className="p-6 text-slate-600">{user.nama}</td>
                      <td className="p-6 text-slate-600">{user.kelas ?? "-"}</td>
                      <td className="p-6 text-slate-600 text-center">{user.peminjamanAktif}</td>
                      <td className="p-6 text-center">
                        <div className="flex justify-center gap-4">
                          <button
                            className="bg-blue-50 p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200"
                            onClick={() => handleEdit(user)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            type="button"
                            className="bg-red-50 p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDelete(user.nomorInduk)}
                            disabled={isDeletingNomorInduk === user.nomorInduk}
                          >
                            {isDeletingNomorInduk === user.nomorInduk ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      {error ?? "Tidak ada data user ditemukan."}
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
            Menampilkan {currentUsers.length} dari {totalItems} hasil {" "}
            (Halaman {currentPage} dari {totalPages || 1})
          </p>
          <div className="flex gap-2">
            <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10 border-gray-300 text-slate-600 hover:bg-gray-100 disabled:opacity-50"
                onClick={handlePrevPage}
                disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10 border-gray-300 text-slate-600 hover:bg-gray-100 disabled:opacity-50"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || totalPages === 0 || isLoading}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}