"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Upload,
    X,
} from "lucide-react";
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
import { AddBookResponse, BooksResponse, BookSummary, Paginated, Category, CategoriesResponse } from "@/types/api";
import { http } from "@/lib/http";
import { toast } from "sonner";

export default function KelolaBuku() {
    const [data, setData] = useState<Paginated<BookSummary> | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
    const ASSET_BASE = API_BASE?.replace(/\/api\/?$/, "");

    const [searchQuery, setSearchQuery] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [books, setBooks] = useState<BookSummary[]>([]);

    // --- STATE PAGINATION ---
    const [currentPage, setCurrentPage] = useState(1);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [slug, setSlug] = useState<string | null>(null);
    const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchBooks = async (page = 1, query = "") => {
        try {
            setIsLoading(true);
            const endpoint = query
                ? `/search-books?query=${encodeURIComponent(query)}&page=${page}`
                : `/books?page=${page}`;
            const response = await http.get<BooksResponse>(endpoint);
            const payload = response.data;
            setData(payload);
            setBooks(payload.data);
            setCurrentPage(payload.current_page);
            console.log("Books Data:", payload);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(currentPage, appliedSearch);
        http.get<CategoriesResponse>("/categories").then(res => setCategories(res.data)).catch(console.error);
    }, [currentPage, appliedSearch]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setCurrentPage(1);
            setAppliedSearch(searchQuery.trim());
        }, 400);
        return () => clearTimeout(delay);
    }, [searchQuery]);

    const [formData, setFormData] = useState({
        judul: "",
        penulis: "",
        penerbit: "",
        isbn: "",
        tahun: "",
        category_id: "",
        status: "available",
        stok: "",
        deskripsi: "",
    });

    const totalPages = data?.last_page ?? 1;

    // --- HANDLER: Reset Form ---
    const resetForm = () => {
        setFormData({
            judul: "",
            penulis: "",
            penerbit: "",
            isbn: "",
            tahun: "",
            category_id: "",
            status: "available",
            stok: "",
            deskripsi: "",
        });
        setImagePreview(null);
        setCoverFile(null);
        setIsEditing(false);
        setIsDialogOpen(false);
        setSlug(null);
    };

    // --- HANDLER: Edit Buku ---
    const handleEdit = (book: BookSummary) => {
        setFormData({
            judul: book.judul,
            penulis: book.penulis || "",
            penerbit: book.penerbit,
            isbn: book.isbn,
            tahun: book.tahun,
            category_id: book.category?.id?.toString() || "",
            status: book.status,
            stok: book.stok.toString(),
            deskripsi: book.deskripsi || "",
        });
        setImagePreview(book.cover_url ? `${ASSET_BASE}${book.cover_url}` : null);
        setIsEditing(true);
        setIsDialogOpen(true);
        setSlug(book.slug);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (isSubmitting) return;

        const missingField = [
            formData.judul,
            formData.penulis,
            formData.penerbit,
            formData.isbn,
            formData.tahun,
            formData.status,
            formData.stok,
        ].some((value) => !value);

        if (missingField) {
            toast.error("Mohon lengkapi semua field yang wajib diisi.");
            return;
        }

        const jumlah = parseInt(formData.stok, 10);
        if (Number.isNaN(jumlah) || jumlah <= 0) {
            toast.error("Stok harus berupa angka positif.");
            return;
        }

        const tahun = parseInt(formData.tahun, 10);
        if (Number.isNaN(tahun) || tahun < 1900) {
            toast.error("Masukkan tahun terbit yang valid.");
            return;
        }

        const payload = new FormData();
        payload.append('judul', formData.judul);
        payload.append('penulis', formData.penulis);
        payload.append('penerbit', formData.penerbit);
        payload.append('isbn', formData.isbn);
        payload.append('tahun', tahun.toString());
        payload.append('jumlah', jumlah.toString());
        payload.append('status', formData.status);
        if (formData.category_id) payload.append('category_id', formData.category_id);
        if (formData.deskripsi) payload.append('deskripsi', formData.deskripsi);
        if (coverFile) payload.append('cover_img', coverFile);

        if (!isEditing) {
            try {
                setIsSubmitting(true);
                await http.postForm<AddBookResponse>('/tambah-buku', payload);
                toast.success('Buku berhasil ditambahkan');
                resetForm();
                setSearchQuery('');
                setAppliedSearch('');
                setCurrentPage(1);
                await fetchBooks(1, '');
            } catch (error) {
                setIsDialogOpen(false)
                console.error(error);
                toast.error('Gagal menambahkan buku.');
            } finally {
                setIsSubmitting(false);
                setIsEditing(false);
            }
        } else {
            try {
                setIsSubmitting(true);
                await http.postForm<AddBookResponse>(`/edit-buku/${slug}`, payload);
                toast.success('Data buku berhasil diubah');
                resetForm();
                setSearchQuery('');
                setAppliedSearch('');
                setCurrentPage(1);
                await fetchBooks(1, '');
            } catch (error) {
                setIsDialogOpen(false)
                console.error(error);
                toast.error("Gagal Mengubah buku");
            } finally {
                setIsSubmitting(false);
                setIsEditing(false);
                setSlug(null);
            }
        }
    };

    // --- HANDLER: Hapus Buku ---
    const handleDelete = async () => {
        if (!confirmDeleteSlug) return;
        try {
            setIsSubmitting(true);
            await http.delete(`/book/${confirmDeleteSlug}`);
            toast.success('Buku berhasil dihapus');
            setConfirmDeleteSlug(null);

            const isLastItemOnPage = books.length === 1 && currentPage > 1;
            const nextPage = isLastItemOnPage ? currentPage - 1 : currentPage;
            setCurrentPage(nextPage);
            await fetchBooks(nextPage, appliedSearch);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Gagal menghapus buku.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- HANDLER: Pagination ---
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    return (
        <>
            <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
                <Toaster position="top-center" />
                <Sidebar/>

                <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-700 mb-2">Kelola Buku</h1>
                            <p className="text-gray-500">Kelola data buku di perpustakaan</p>
                        </div>
                    </header>

                    {/* --- Search Bar & Tambah Buku --- */}
                    <div className="flex w-full items-center gap-4 mb-6 pt-6">
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Search size={20} />
                            </div>
                            <Input
                                className="w-full pl-12 pr-12 py-6 bg-white border-gray-200 rounded-xl shadow-sm focus-visible:ring-blue-500 placeholder:text-gray-400 text-base"
                                placeholder="Cari berdasarkan Judul/Kategori/ISBN"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
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
                                    Tambah buku
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="fixed left-1/2! top-1/2! z-50 w-full max-w-[700px] -translate-x-1/2! -translate-y-1/2! bg-white p-8 rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-none">
                                <div
                                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none hover:bg-slate-100 p-1 cursor-pointer"
                                    onClick={resetForm}
                                >
                                    <X className="h-6 w-6 text-slate-500" />
                                    <span className="sr-only">Close</span>
                                </div>

                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-slate-800 mb-4">
                                        {isEditing ? "Edit Buku" : "Tambah Buku"}
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-6">
                                    {/* Image Uploader */}
                                    <div className="flex flex-col items-center justify-center gap-2 mb-6">
                                        <label htmlFor="cover-upload" className="cursor-pointer group relative">
                                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-blue-500 transition-colors">
                                                {imagePreview ? (
                                                    <Image src={imagePreview} alt="Preview" width={128} height={128} className="object-cover w-full h-full" unoptimized />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500">
                                                        <Upload size={32} strokeWidth={1.5} />
                                                    </div>
                                                )}
                                            </div>
                                            <input id="cover-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                        <p className="text-sm text-slate-500">Click to browse image</p>
                                    </div>

                                    {/* Form Inputs */}
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 text-sm">Judul</label>
                                            <Input name="judul" value={formData.judul} onChange={handleInputChange} className="rounded-full border-slate-400 h-10 px-4 focus-visible:ring-blue-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 text-sm">Penulis</label>
                                            <Input name="penulis" value={formData.penulis} onChange={handleInputChange} className="rounded-full border-slate-400 h-10 px-4 focus-visible:ring-blue-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 text-sm">Penerbit</label>
                                            <Input name="penerbit" value={formData.penerbit} onChange={handleInputChange} className="rounded-full border-slate-400 h-10 px-4 focus-visible:ring-blue-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 text-sm">ISBN</label>
                                            <Input name="isbn" value={formData.isbn} onChange={handleInputChange} className="rounded-full border-slate-400 h-10 px-4 focus-visible:ring-blue-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 text-sm">Tahun Terbit</label>
                                            <Input name="tahun" value={formData.tahun} onChange={handleInputChange} className="rounded-full border-slate-400 h-10 px-4 focus-visible:ring-blue-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 text-sm">Kategori</label>
                                            <div className="relative">
                                                <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full appearance-none rounded-full border border-slate-400 bg-transparent h-10 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
                                                    <option value="" disabled>Pilih kategori</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 text-sm">Status</label>
                                            <div className="relative">
                                                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full appearance-none rounded-full border border-slate-400 bg-transparent h-10 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
                                                    <option value="available">Tersedia</option>
                                                    <option value="unavailable">Tidak tersedia</option>
                                                </select>
                                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 text-sm">Stok</label>
                                            <Input name="stok" value={formData.stok} onChange={handleInputChange} className="rounded-full border-slate-400 h-10 px-4 focus-visible:ring-blue-500" placeholder="Contoh: 10" />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <label className="font-bold text-slate-700 text-sm">Deskripsi</label>
                                            <textarea name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-400 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" />
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="mt-8 flex gap-3 sm:justify-end">
                                    <Button type="button" onClick={resetForm} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 rounded-lg">
                                        Batal
                                    </Button>
                                    <Button type="button" onClick={handleSave} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 rounded-lg disabled:opacity-70">
                                        {isSubmitting ? 'Menyimpan...' : isEditing ? "Simpan Perubahan" : "Simpan"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* --- TABLE CONTENT --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="p-6 font-bold text-slate-700">Cover</th>
                                        <th className="p-6 font-bold text-slate-700">Judul</th>
                                        <th className="p-6 font-bold text-slate-700">Penulis</th>
                                        <th className="p-6 font-bold text-slate-700">ISBN</th>
                                        <th className="p-6 font-bold text-slate-700">Stok Tersedia</th>
                                        <th className="p-6 font-bold text-slate-700">Total Buku</th>
                                        <th className="p-6 font-bold text-slate-700 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!isLoading && books.length ? (
                                        books.map((book, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-none">
                                                <td className="p-4 pl-6">
                                                    <div className="relative h-16 w-12 rounded-md overflow-hidden shadow-sm border border-gray-200 bg-gray-50 flex items-center justify-center">
                                                        {book.cover_url ? (
                                                            <Image src={`${ASSET_BASE}${book.cover_url}`} alt={book.judul} fill className="object-cover" unoptimized />
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400 text-center leading-tight p-1 font-medium">
                                                                No Image
                                                            </span>
                                                        )}

                                                    </div>
                                                </td>
                                                <td className="p-6 font-medium text-slate-700">{book.judul}</td>
                                                <td className="p-6 text-slate-600">{book.penulis}</td>
                                                <td className="p-6 text-slate-600">{book.isbn}</td>
                                                <td className="p-6 text-slate-600 pl-10">{book.stok}</td>
                                                <td className="p-6 text-slate-600 pl-10">{book.jumlah}</td>
                                                <td className="p-6 text-center">
                                                    <div className="flex justify-center gap-4">
                                                        {/* --- TOMBOL EDIT --- */}
                                                        <button
                                                            className="bg-blue-50 p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200"
                                                            onClick={() => handleEdit(book)}
                                                        >
                                                            <Pencil size={18} />
                                                        </button>

                                                        {/* Tombol Hapus */}
                                                        <button
                                                            className="bg-red-50 p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors border border-red-200"
                                                            onClick={() => setConfirmDeleteSlug(book.slug)}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : isLoading ? (
                                        Array.from({ length: 5 }).map((_, idx) => (
                                            <tr key={`skeleton-${idx}`} className="border-b border-gray-50 last:border-none">
                                                <td className="p-6"><div className="h-16 w-12 rounded-md bg-slate-100" /></td>
                                                <td className="p-6"><div className="h-4 w-48 rounded bg-slate-100" /></td>
                                                <td className="p-6"><div className="h-4 w-40 rounded bg-slate-100" /></td>
                                                <td className="p-6"><div className="h-4 w-32 rounded bg-slate-100" /></td>
                                                <td className="p-6"><div className="h-4 w-20 rounded bg-slate-100" /></td>
                                                <td className="p-6"><div className="h-8 w-24 mx-auto rounded bg-slate-100" /></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-500">
                                                Tidak ada buku yang ditemukan.
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
                            Menampilkan {data?.from ?? 0}-{data?.to ?? 0} dari {data?.total ?? 0} hasil
                            (Halaman {data?.current_page ?? 1} dari {data?.last_page ?? 1})
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
                                disabled={currentPage >= totalPages || isLoading}
                            >
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
            {confirmDeleteSlug && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Hapus Buku</h3>
                        <p className="text-slate-600 mb-6">Yakin ingin menghapus buku ini? Tindakan ini tidak dapat dibatalkan.</p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" className="rounded-lg" onClick={() => setConfirmDeleteSlug(null)} disabled={isSubmitting}>Batal</Button>
                            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-lg" onClick={handleDelete} disabled={isSubmitting}>
                                {isSubmitting ? 'Menghapus...' : 'Hapus'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}