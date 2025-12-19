"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Search,
    Pencil,
    ChevronLeft,
    ChevronRight,
    X,
    Loader2,
    Plus,
    Trash2,
    FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { http } from "@/lib/http";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Category {
    id: number;
    name: string;
    slug: string;
    books_count: number;
}

interface CategoriesResponse {
    data: Category[];
}

export default function KelolaKategori() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [formData, setFormData] = useState({ name: "", slug: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const itemsPerPage = 8;

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setFetchError(null);
            const response = await http.get<CategoriesResponse>("/categories");
            setCategories(response.data ?? []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setFetchError("Gagal memuat data kategori.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredData = useMemo(() => {
        if (!normalizedQuery) return categories;
        return categories.filter((category) => {
            const name = category.name?.toLowerCase() ?? "";
            const slug = category.slug?.toLowerCase() ?? "";
            return name.includes(normalizedQuery) || slug.includes(normalizedQuery);
        });
    }, [categories, normalizedQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData({
            name,
            slug: generateSlug(name),
        });
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            slug: e.target.value,
        }));
    };

    const handleOpenAddDialog = () => {
        setDialogMode("add");
        setSelectedCategory(null);
        setFormData({ name: "", slug: "" });
        setIsDialogOpen(true);
    };

    const handleOpenEditDialog = (category: Category) => {
        setDialogMode("edit");
        setSelectedCategory(category);
        setFormData({ name: category.name, slug: category.slug });
        setIsDialogOpen(true);
    };

    const handleOpenDeleteDialog = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || !formData.slug.trim()) {
            toast.error("Validasi gagal", {
                description: "Nama dan slug kategori harus diisi.",
                className: "!bg-white !text-slate-900 !border-slate-200",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            if (dialogMode === "add") {
                await http.post("/categories", formData);
                toast.success("Kategori ditambahkan", {
                    description: `Kategori "${formData.name}" berhasil ditambahkan.`,
                    className: "!bg-white !text-slate-900 !border-slate-200",
                });
            } else if (dialogMode === "edit" && selectedCategory) {
                await http.put(`/categories/${selectedCategory.id}`, formData);
                toast.success("Kategori diperbarui", {
                    description: `Kategori "${formData.name}" berhasil diperbarui.`,
                    className: "!bg-white !text-slate-900 !border-slate-200",
                });
            }
            setIsDialogOpen(false);
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan kategori", {
                description: "Terjadi kesalahan saat menyimpan data.",
                className: "!bg-white !text-slate-900 !border-slate-200",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;

        setIsDeleting(true);
        try {
            await http.delete(`/categories/${selectedCategory.id}`);
            toast.success("Kategori dihapus", {
                description: `Kategori "${selectedCategory.name}" berhasil dihapus.`,
                className: "!bg-white !text-slate-900 !border-slate-200",
            });
            setIsDeleteDialogOpen(false);
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus kategori", {
                description: "Terjadi kesalahan saat menghapus data.",
                className: "!bg-white !text-slate-900 !border-slate-200",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
            <Toaster position="top-center" />
            <Sidebar/>

            <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-700 mb-2">Kelola Kategori</h1>
                        <p className="text-gray-500">Kelola kategori buku perpustakaan</p>
                    </div>
                </header>

                {/* --- SEARCH BAR & TAMBAH KATEGORI --- */}
                <div className="flex w-full items-center gap-4 mb-6 pt-6">
                    <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={20} />
                        </div>
                        <Input
                            className="w-full pl-12 pr-12 py-6 bg-white border-gray-200 rounded-xl shadow-sm focus-visible:ring-blue-500 placeholder:text-gray-400 text-base"
                            placeholder="Cari berdasarkan nama atau slug kategori"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleOpenAddDialog}
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold px-6 py-6 rounded-xl flex items-center gap-2 whitespace-nowrap shadow-sm"
                    >
                        <Plus size={18} />
                        Tambah Kategori
                    </Button>
                </div>

                {/* --- TABLE CONTENT --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="p-6 font-bold text-slate-700 w-16">No</th>
                                    <th className="p-6 font-bold text-slate-700">Nama Kategori</th>
                                    <th className="p-6 font-bold text-slate-700">Slug</th>
                                    <th className="p-6 font-bold text-slate-700 text-center">Jumlah Buku</th>
                                    <th className="p-6 font-bold text-slate-700 text-center w-32">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                                <p className="text-sm font-medium">Memuat data kategori...</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && fetchError && (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-red-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <p className="text-sm font-semibold">{fetchError}</p>
                                                <Button
                                                    onClick={fetchCategories}
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
                                        <td colSpan={5} className="p-10 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <FolderOpen className="h-12 w-12 text-gray-300" />
                                                <p className="text-sm">Belum ada kategori.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {!isLoading &&
                                    !fetchError &&
                                    currentItems.map((category, index) => (
                                        <tr
                                            key={category.id}
                                            className="hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-none"
                                        >
                                            <td className="p-6 text-slate-500 font-medium text-center">
                                                {startIndex + index + 1}
                                            </td>
                                            <td className="p-6 text-slate-700 font-medium">{category.name}</td>
                                            <td className="p-6 text-slate-500">
                                                <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                                                    {category.slug}
                                                </code>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold border border-blue-200">
                                                    {category.books_count ?? 0} buku
                                                </span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        className="bg-blue-50 p-2 rounded-lg text-blue-500 hover:bg-blue-100 transition-colors border border-blue-200"
                                                        onClick={() => handleOpenEditDialog(category)}
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        className="bg-red-50 p-2 rounded-lg text-red-500 hover:bg-red-100 transition-colors border border-red-200"
                                                        onClick={() => handleOpenDeleteDialog(category)}
                                                    >
                                                        <Trash2 size={18} />
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
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-10 w-10 border-gray-300 text-slate-600 hover:bg-gray-100"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={20} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-10 w-10 border-gray-300 text-slate-600 hover:bg-gray-100"
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages || totalPages === 0}
                        >
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                </div>

                {/* --- ADD/EDIT DIALOG --- */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-[450px] -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl border-none">
                        <div
                            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 hover:bg-slate-100 p-1 cursor-pointer"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            <X className="h-6 w-6 text-slate-500" />
                        </div>

                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-slate-800 mb-4">
                                {dialogMode === "add" ? "Tambah Kategori" : "Edit Kategori"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Nama Kategori
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    placeholder="Masukkan nama kategori"
                                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Slug
                                </label>
                                <Input
                                    value={formData.slug}
                                    onChange={handleSlugChange}
                                    disabled={true}
                                    placeholder="slug-kategori"
                                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500 font-mono text-sm"
                                />
                                <p className="text-xs text-slate-400 mt-1">
                                    Slug akan otomatis dibuat dari nama kategori
                                </p>
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <Button
                                    onClick={() => setIsDialogOpen(false)}
                                    variant="outline"
                                    className="h-10 rounded-xl px-6 font-bold border-gray-300 text-slate-600 hover:bg-gray-50 cursor-pointer"
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="h-10 rounded-xl px-6 font-bold bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : null}
                                    {dialogMode === "add" ? "Tambah" : "Simpan"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* --- DELETE CONFIRMATION DIALOG --- */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl border-none">
                        <div
                            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 hover:bg-slate-100 p-1 cursor-pointer"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            <X className="h-6 w-6 text-slate-500" />
                        </div>

                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-slate-800 mb-2">
                                Hapus Kategori
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <p className="text-slate-600">
                                Apakah Anda yakin ingin menghapus kategori{" "}
                                <span className="font-semibold text-slate-800">
                                    &quot;{selectedCategory?.name}&quot;
                                </span>
                                ?
                            </p>
                            <p className="text-sm text-red-500">
                                Tindakan ini tidak dapat dibatalkan.
                            </p>

                            <div className="flex gap-3 justify-end pt-4">
                                <Button
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    variant="outline"
                                    className="h-10 rounded-xl px-6 font-bold border-gray-300 text-slate-600 hover:bg-gray-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="h-10 rounded-xl px-6 font-bold bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
                                >
                                    {isDeleting ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Trash2 className="h-4 w-4 mr-2" />
                                    )}
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
