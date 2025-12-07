"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, BookOpen, ChevronRight, Sparkles } from "lucide-react";
import { SiswaAuth } from "@/components/auth/siswa-auth";

import { http } from "@/lib/http";
import { BookSummary, ApiResponse } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/sidebar";
import NotificationDropdown from "@/components/notifikasi";

type AllBooksResponse = ApiResponse<BookSummary[]>;

type SortOption = "newest" | "title" | "author" | "year";

export default function NewBooksPage() {
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await http.get<AllBooksResponse>("/books-all");
        if (!isMounted) return;
        setBooks(response.data ?? []);
        setError(null);
      } catch (err) {
        console.error("Gagal memuat daftar buku:", err);
        if (!isMounted) return;
        setBooks([]);
        setError("Tidak dapat memuat daftar buku. Coba lagi nanti.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.judul.toLowerCase().includes(query) ||
          book.penulis?.toLowerCase().includes(query) ||
          book.kategori.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "title":
        result.sort((a, b) => a.judul.localeCompare(b.judul));
        break;
      case "author":
        result.sort((a, b) => (a.penulis ?? "").localeCompare(b.penulis ?? ""));
        break;
      case "year":
        result.sort((a, b) => Number(b.tahun) - Number(a.tahun));
        break;
      case "newest":
      default:
        // Already sorted by newest from API
        break;
    }

    return result;
  }, [books, searchQuery, sortBy]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Terbaru" },
    { value: "title", label: "Judul (A-Z)" },
    { value: "author", label: "Penulis (A-Z)" },
    { value: "year", label: "Tahun Terbit" },
  ];

  return (
    <SiswaAuth>
      <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
        <Sidebar />

        <main className="flex-1 md:ml-64 p-8">
          {/* Header */}
          <header className="flex justify-between items-start mb-6">
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <ChevronRight size={14} />
                <span className="text-slate-700 font-medium">Koleksi Baru</span>
              </nav>
              <h1 className="text-3xl font-bold text-slate-700 mt-6">Buku Baru Ditambahkan</h1>
              <p className="text-slate-500 text-sm mt-1">
                Jelajahi {books.length} koleksi terbaru perpustakaan
              </p>
            </div>
            <NotificationDropdown />
          </header>

          {/* Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 mt-10">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>
              <Input
                className="w-full pl-10 pr-4 py-5 bg-white border-gray-200 rounded-xl shadow-sm focus-visible:ring-blue-500 placeholder:text-gray-400"
                placeholder="Cari judul, penulis, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={`flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors ${
                  isSortOpen ? "border-blue-500 ring-2 ring-blue-100" : ""
                }`}
              >
                <SlidersHorizontal size={18} className="text-gray-500" />
                <span className="text-sm text-slate-700 font-medium">
                  {sortOptions.find((o) => o.value === sortBy)?.label}
                </span>
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Urutkan
                  </p>
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        sortBy === option.value
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-slate-600 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <BookCardSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-red-50 p-6 rounded-full mb-4">
                  <BookOpen size={48} className="text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Gagal Memuat Data
                </h3>
                <p className="text-sm text-slate-500 max-w-md">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredAndSortedBooks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-slate-100 p-6 rounded-full mb-4">
                  <BookOpen size={48} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  {searchQuery ? "Tidak Ada Hasil" : "Belum Ada Buku"}
                </h3>
                <p className="text-sm text-slate-500 max-w-md">
                  {searchQuery
                    ? `Tidak ditemukan buku dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
                    : "Perpustakaan belum memiliki koleksi buku. Silakan cek kembali nanti."}
                </p>
              </div>
            )}

            {/* Books Grid */}
            {!isLoading && !error && filteredAndSortedBooks.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredAndSortedBooks.map((book, index) => (
                  <BookCard key={book.slug} book={book} isNew={index < 5} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </SiswaAuth>
  );
}

function BookCardSkeleton() {
  return (
    <div className="aspect-2/3 rounded-2xl overflow-hidden bg-gray-200">
      <Skeleton className="h-full w-full" />
    </div>
  );
}

function BookCard({ book, isNew }: { book: BookSummary; isNew?: boolean }) {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const ASSET_BASE = API_BASE?.replace(/\/api\/?$/, "");
  const isAvailable = book.status === "available" || Number(book.stok) > 0;

  return (
    <Link href={`/detailbuku?buku=${book.slug}`} className="block h-full">
      <div className="group relative aspect-2/3 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-gray-200">
        {book.cover_url ? (
          <Image
            src={`${ASSET_BASE}${book.cover_url}`}
            alt={book.judul}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <BookOpen size={48} className="text-slate-300" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-full text-slate-800 uppercase tracking-wide">
            {book.kategori}
          </span>
          {isNew && (
            <span className="flex items-center gap-1 bg-amber-400 text-[10px] font-bold px-2 py-1 rounded-full text-amber-900 uppercase tracking-wide">
              <Sparkles size={10} />
              Baru
            </span>
          )}
        </div>

      

        {/* Book Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2 drop-shadow-md">
            {book.judul}
          </h3>
          <p className="text-xs text-gray-300 font-medium drop-shadow-md line-clamp-1">
            {book.penulis}
          </p>
        </div>
      </div>
    </Link>
  );
}
