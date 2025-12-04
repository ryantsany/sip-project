"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown, 
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

// --- Tipe Data User ---
type User = {
  id: number;
  nomorInduk: string;
  nama: string;
  kelas: string;
  role: string;
  peminjamanAktif: number;
};

// --- Data Dummy ---
const initialUsers: User[] = [
  { id: 1, nomorInduk: "1313623056", nama: "Fadil Bukan Jaidi", kelas: "10 MIPA 1", role: "Siswa", peminjamanAktif: 0 },
  { id: 2, nomorInduk: "1313623057", nama: "Jarwo Situmorang", kelas: "12 IPS 3", role: "Siswa", peminjamanAktif: 2 },
  { id: 3, nomorInduk: "1313623058", nama: "Heru Budi", kelas: "11 MIPA 4", role: "Siswa", peminjamanAktif: 5 },
  { id: 4, nomorInduk: "1313623059", nama: "Steve Harrington", kelas: "11 IPS 1", role: "Siswa", peminjamanAktif: 1 },
  { id: 5, nomorInduk: "1313623060", nama: "Adolf Hutler", kelas: "10 IPS 2", role: "Siswa", peminjamanAktif: 1 },
  { id: 6, nomorInduk: "1313623061", nama: "Dustin Henderson", kelas: "12 MIPA 2", role: "Siswa", peminjamanAktif: 3 },
  { id: 7, nomorInduk: "1313623062", nama: "Mike Wheelers", kelas: "12 MIPA 2", role: "Siswa", peminjamanAktif: 1 },
  { id: 8, nomorInduk: "1313623063", nama: "Hank Schrader", kelas: "12 IPS 2", role: "Siswa", peminjamanAktif: 4 },
];

export default function KelolaUser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>(initialUsers);

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nama: "",
    nomorInduk: "",
    kelas: "",
    role: "",
  });

  // --- LOGIKA FILTER & PAGINATION ---
  const filteredUsers = users.filter((user) =>
      user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nomorInduk.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

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
      role: "",
    });
    setIsEditing(false);
    setCurrentId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (user: User) => {
    setFormData({
      nama: user.nama,
      nomorInduk: user.nomorInduk,
      kelas: user.kelas,
      role: user.role,
    });
    setIsEditing(true);
    setCurrentId(user.id);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.nama || !formData.nomorInduk || !formData.role) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    if (isEditing && currentId !== null) {
      setUsers(
        users.map((user) =>
          user.id === currentId ? { ...user, ...formData } : user
        )
      );
      toast.success("Data User Diperbarui!");
    } else {
      const newUser: User = {
        id: Date.now(),
        ...formData,
        peminjamanAktif: 0,
      };
      setUsers([newUser, ...users]);
      toast.success("User Berhasil Ditambahkan!");
    }
    resetForm();
  };

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      <Toaster position="top-center" />
      <Sidebar role="admin" />

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
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-6 rounded-xl flex items-center gap-2 whitespace-nowrap shadow-sm"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus size={18} />
                Tambah User
              </Button>
            </DialogTrigger>

            <DialogContent className="fixed !left-1/2 !top-1/2 z-50 w-full max-w-[600px] !-translate-x-1/2 !-translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
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
                      >
                        <option value="Siswa">Siswa</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <ChevronDown size={18} className="text-slate-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-8 flex gap-3 sm:justify-end">
                <Button type="button" onClick={resetForm} className="h-10 rounded-xl bg-red-600 px-8 font-bold text-white hover:bg-red-700">Batal</Button>
                <Button type="button" onClick={handleSave} className="h-10 rounded-xl bg-blue-600 px-8 font-bold text-white hover:bg-blue-700">Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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
                {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-none"
                    >
                      <td className="p-6 text-slate-600 text-center">{user.nomorInduk}</td>
                      <td className="p-6 text-slate-600">{user.nama}</td>
                      <td className="p-6 text-slate-600">{user.kelas}</td>
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
                            className="bg-red-50 p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors border border-red-200"
                            onClick={() => setUsers(users.filter((u) => u.id !== user.id))}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">
                            Tidak ada data siswa ditemukan.
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
            Menampilkan {currentUsers.length} dari {filteredUsers.length} hasil 
            (Halaman {currentPage} dari {totalPages || 1})
          </p>
          <div className="flex gap-2">
            <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10 border-gray-300 text-slate-600 hover:bg-gray-100 disabled:opacity-50"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10 border-gray-300 text-slate-600 hover:bg-gray-100 disabled:opacity-50"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || totalPages === 0}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}