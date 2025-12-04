"use client";

import React, { useState } from "react";
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

// --- Tipe Data Buku ---
type Book = {
  id: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  year: string;
  category: string;
  status: string;
  stock: string;
  description: string;
  cover: string;
};

// --- Data Dummy Awal ---
const initialBooks: Book[] = [
  {
    id: 1,
    title: "Blue Box Vol. 9",
    author: "Kouji Miura",
    publisher: "Shueisha",
    isbn: "978-602-74729-4-4",
    year: "2023",
    category: "Comic",
    status: "tersedia",
    stock: "5 / 10",
    description: "Cerita romansa...",
    cover: "/bluebox17.jpeg",
  },
  {
    id: 2,
    title: "Blue Box Vol. 1",
    author: "Kouji Miura",
    publisher: "Shueisha",
    isbn: "978-602-74729-4-4",
    year: "2024",
    category: "Comic",
    status: "tersedia",
    stock: "8 / 10",
    description: "Cerita romansa...",
    cover: "/bluebox1.jpeg",
  },

  {
    id: 3,
    title: "The Invincible Iron Man",
    author: "Matt Fraction",
    publisher: "Marvel Comics",
    isbn: "978-1302906203",
    year: "2012",
    category: "Comic",
    status: "tersedia",
    stock: "9 / 11",
    description: "A thrilling adventure of Tony Stark...",
    cover: "/ironman.jpg",
  },

  {
    id: 4,
    title: "Captain America: To Serve and Protect",
    author: "Mark Waid",
    publisher: "Marvel Comics",
    isbn: "978-0785169461",
    year: "2011",
    category: "Comic",
    status: "tersedia",
    stock: "20 / 30",
    description: "The story of Steve Rogers...",
    cover: "/captainamerica.jpg",
  },

  {
    id: 5,
    title: "Bring On The Bad Guys: Mephisto", 
    author: "Marc Guggenheim",
    publisher: "Marvel Comics",
    isbn: "978-1302906212",
    year: "2025",
    category: "Comic",
    status: "tersedia",
    stock: "66 / 66",
    description: "Mephisto's sinister plans unfold...",
    cover: "/mephisto.jpg",
  },

  {
    id: 6,
    title: "Spider-Man",
    author: "Stan Lee",
    publisher: "Marvel Comics",
    isbn: "978-1302906203",
    year: "2016",
    category: "Comic",
    status: "tersedia",
    stock: "27 / 30",
    description: "The adventures of Peter Parker...",
    cover: "/spiderman.jpg",
  },
];

export default function KelolaBuku() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>(initialBooks);

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    year: "",
    category: "",
    status: "tersedia",
    stock: "", 
    description: "",
  });

  // --- LOGIKA FILTER & PAGINATION ---
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  // --- HANDLER: Reset Form ---
  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      publisher: "",
      isbn: "",
      year: "",
      category: "",
      status: "tersedia",
      stock: "",
      description: "",
    });
    setImagePreview(null);
    setIsEditing(false); 
    setCurrentId(null);
    setIsDialogOpen(false);
  };

  // --- HANDLER: Edit Buku ---
  const handleEdit = (book: Book) => {
    setFormData({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        isbn: book.isbn,
        year: book.year,
        category: book.category,
        status: book.status,
        stock: book.stock,
        description: book.description,
    });
    setImagePreview(book.cover);
    setIsEditing(true); 
    setCurrentId(book.id);
    setIsDialogOpen(true); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.author || !formData.publisher || !formData.isbn || !formData.year || !formData.category || !formData.status || !formData.stock) {
      toast.error("Mohon lengkapi semua field yang wajib diisi.");
      return;
    }

    if (isEditing && currentId !== null) {
        setBooks(books.map((book) => 
            book.id === currentId 
            ? { ...book, ...formData} 
            : book
        ));
        toast.success("Berhasil Mengubah Data!");
    } else {
        const newBook: Book = {
            id: Date.now(),
            title: formData.title,
            author: formData.author,
            publisher: formData.publisher,
            isbn: formData.isbn,
            year: formData.year,
            category: formData.category || "General",
            status: formData.status,
            stock: formData.stock || "0/0",
            description: formData.description,
            cover: imagePreview || "",
        };
        setBooks([newBook, ...books]);
        toast.success("Buku Berhasil Ditambahkan!");
    }
    resetForm();
  };

  // --- HANDLER: Hapus Buku ---
  const handleDelete = (id: number) => {
    setBooks(books.filter((b) => b.id !== id));
    if (currentBooks.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
  };

  // --- HANDLER: Pagination ---
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      <Toaster position="top-center" />
      <Sidebar role="admin" />

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
                        Tambah buku
                    </Button>
                </DialogTrigger>
                
                <DialogContent className="fixed !left-1/2 !top-1/2 z-50 w-full max-w-[700px] !-translate-x-1/2 !-translate-y-1/2 bg-white p-8 rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-none">
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
                                        <Image src={imagePreview} alt="Preview" width={128} height={128} className="object-cover w-full h-full" />
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
                                <Input name="title" value={formData.title} onChange={handleInputChange} className="rounded-full border-slate-400 h-10 px-4 focus-visible:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="font-bold text-slate-700 text-sm">Penulis</label>
                                <Input name="author" value={formData.author} onChange={handleInputChange} className="rounded-full border-slate-400 h-10 px-4 focus-visible:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="font-bold text-slate-700 text-sm">Penerbit</label>
                                <Input name="publisher" value={formData.publisher} onChange={handleInputChange} className="rounded-full border-slate-400 h-10 px-4 focus-visible:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="font-bold text-slate-700 text-sm">ISBN</label>
                                <Input name="isbn" value={formData.isbn} onChange={handleInputChange} className="rounded-full border-slate-400 h-10 px-4 focus-visible:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="font-bold text-slate-700 text-sm">Tahun Terbit</label>
                                <Input name="year" value={formData.year} onChange={handleInputChange} className="rounded-full border-slate-400 h-10 px-4 focus-visible:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="font-bold text-slate-700 text-sm">Kategori</label>
                                <div className="relative">
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full appearance-none rounded-full border border-slate-400 bg-transparent h-10 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
                                        <option value="">Pilih Kategori</option>
                                        <option value="Comic">Comic</option>
                                        <option value="Novel">Novel</option>
                                        <option value="Biography">Biography</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="font-bold text-slate-700 text-sm">Status</label>
                                <div className="relative">
                                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full appearance-none rounded-full border border-slate-400 bg-transparent h-10 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
                                        <option value="tersedia">Tersedia</option>
                                        <option value="habis">Habis</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="font-bold text-slate-700 text-sm">Stok</label>
                                <Input name="stock" value={formData.stock} onChange={handleInputChange} className="rounded-full border-slate-400 h-10 px-4 focus-visible:ring-blue-500" placeholder="Contoh: 10/10" />
                            </div>
                            <div className="col-span-2 space-y-1">
                                <label className="font-bold text-slate-700 text-sm">Deskripsi</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-400 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 flex gap-3 sm:justify-end">
                        <Button type="button" onClick={resetForm} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 rounded-lg">
                            Batal
                        </Button>
                        <Button type="button" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 rounded-lg">
                            {isEditing ? "Simpan Perubahan" : "Simpan"}
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
                            <th className="p-6 font-bold text-slate-700 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBooks.length > 0 ? (
                            currentBooks.map((book) => (
                            <tr key={book.id} className="hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-none">
                                <td className="p-4 pl-6">
                                    <div className="relative h-16 w-12 rounded-md overflow-hidden shadow-sm border border-gray-200 bg-gray-50 flex items-center justify-center">    
                                        {book.cover ? (
                                            <Image src={book.cover} alt={book.title} fill className="object-cover" />
                                        ) : (
                                            <span className="text-[10px] text-slate-400 text-center leading-tight p-1 font-medium">
                                                No Image
                                            </span>
                                        )}
                                        
                                    </div>
                                </td>
                                <td className="p-6 font-medium text-slate-700">{book.title}</td>
                                <td className="p-6 text-slate-600">{book.author}</td>
                                <td className="p-6 text-slate-600">{book.isbn}</td>
                                <td className="p-6 text-slate-600 pl-10">{book.stock}</td>
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
                                            onClick={() => handleDelete(book.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
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
                Menampilkan {currentBooks.length} dari {filteredBooks.length} hasil
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