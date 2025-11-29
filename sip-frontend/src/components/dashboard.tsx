"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  History,
  User,
  LogOut,
  Bell,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Lock,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Book = {
  id: number;
  title: string;
  author: string;
  category: string;
  coverImage: string;
};

const books: Book[] = [
  {
    id: 1,
    title: "Blue Box Vol. 1",
    author: "Kouji Miura",
    category: "Comic",
    coverImage: "/bluebox1.jpeg",
  },
  {
    id: 2,
    title: "Blue Box Vol. 9",
    author: "Kouji Miura",
    category: "Comic",
    coverImage: "/bluebox.jpg",
  },
  {
    id: 3,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    category: "Fantasi",
    coverImage: "/harryp.jpg",
  },
  {
    id: 4,
    title: "Blue Box Vol. 17",
    author: "Kouji Miura",
    category: "Comic",
    coverImage: "/bluebox17.jpeg",
  },
];

export default function Dashboard() {
  // --- STATE MANAGEMENT ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Semua", ...new Set(books.map((b) => b.category))];

  // Logic Filter
  const filteredBooks = books.filter((book) => {
    const matchCategory =
      selectedCategory === "Semua" || book.category === selectedCategory;

    const query = searchQuery.toLowerCase();
    const matchSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query);

    return matchCategory && matchSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      {/* --- SIDEBAR --- */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col p-6 fixed h-full z-10">
        <div className="flex items-center gap-3 mb-10">
          <Image
            src="/logo.png"
            alt="Logo Perpustakaan"
            width={50}
            height={50}
            className="object-contain"
          />
          <div className="font-bold text-xl text-slate-700 leading-tight">
            Perpustakan
            <br />
            Sekolah
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2">
            <User size={24} />
          </div>
          <div>
            <p className="text-sm font-bold">Heru Budi</p>
            <p className="text-xs text-gray-500">1313623056</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-500 hover:text-slate-900"
          >
            <History size={20} />
            Riwayat Peminjaman
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-500 hover:text-slate-900"
          >
            <Lock size={20} />
            Ubah Kata Sandi
          </Button>
        </nav>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-500 hover:text-red-600 mt-auto"
        >
          <LogOut size={20} />
          Keluar
        </Button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-700">
              Selamat datang kembali,
            </h1>
            <h1 className="text-3xl font-bold text-slate-700">Heru!</h1>
          </div>
          <div className="cursor-pointer p-2 rounded-full transition-colors text-blue-600 hover:bg-blue-100 hover:text-black">
            <Bell size={34} className="fill-current" />
          </div>
        </header>

        {/* Search & Filter */}
        <div className="relative mb-10 z-20">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <Input
            className="w-full pl-10 pr-12 py-6 bg-white border-gray-200 rounded-xl shadow-sm focus-visible:ring-blue-500 placeholder:text-gray-400"
            placeholder="Cari berdasarkan Judul, Penulis, atau Kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div
            className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-2 rounded-full transition-colors ${
              isFilterOpen
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100 text-gray-500"
            }`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal size={18} />
          </div>

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-1 animate-in fade-in zoom-in-95 duration-200">
              <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Pilih Kategori
              </p>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-600 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- SECTION 1: BARU DITAMBAHKAN --- */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {searchQuery ? (
              <h2 className="text-xl font-bold text-slate-600">
                Hasil pencarian: &quot;{searchQuery}&quot;
              </h2>
            ) : selectedCategory === "Semua" ? (
              <Link
                href="/dashboard/new-books"
                className="group flex items-center gap-2 cursor-pointer"
              >
                <h2 className="text-xl font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                  Baru ditambahkan
                </h2>
                <ChevronRight 
                  size={20} 
                  className="text-slate-600 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" 
                />
              </Link>
            ) : (
              <h2 className="text-xl font-bold text-slate-600">
                Kategori: {selectedCategory}
              </h2>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-gray-400">
                Tidak ada buku ditemukan.
              </div>
            )}
          </div>
        </section>

        {/* --- SECTION 2: REKOMENDASI --- */}
        {selectedCategory === "Semua" && searchQuery === "" && (
          <section>
            <h2 className="text-xl font-bold text-slate-600 mb-4">
              Rekomendasi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.slice(1, 4).map((book, index) => (
                <BookCard key={`rec-${index}`} book={book} />
              ))}
              {books[0] && <BookCard book={books[0]} />}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <div className="group relative aspect-[3/4.5] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-gray-200">
      <Image
        src={book.coverImage}
        alt={book.title}
        fill
        className="object-cover transition-transform group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute top-3 left-3">
        <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-full text-slate-800 uppercase tracking-wide">
          {book.category}
        </span>
      </div>
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-2 drop-shadow-md">
          {book.title}
        </h3>
        <p className="text-xs text-gray-300 font-medium drop-shadow-md">
          {book.author}
        </p>
      </div>
    </div>
  );
}