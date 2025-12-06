"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { http } from "@/lib/http";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import {
  Bell,
  Search,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import Sidebar from "@/components/sidebar"; 
import NotificationDropdown from "@/components/notifikasi";
import { BookSummary, LatestBooksResponse } from "@/types/api";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        setIsLoadingBooks(true);
        const response = await http.get<LatestBooksResponse>("/books-latest");
        setBooks(response.data);
      } catch (error) {
        console.error("Failed to fetch Books:", error);
      } finally {
        setIsLoadingBooks(false);
      }
    }
    fetchBooks();
  }, []);

  const categories = ["Semua", ...new Set(books.map((b) => b.kategori))];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      setSelectedCategory("Semua");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      
      <Sidebar />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        <header className="flex justify-between items-start mb-8 relative z-50">
          <div>
            <h1 className="text-3xl font-bold text-slate-700">
              Selamat datang kembali,
            </h1>
            {loading ? (
              <Skeleton className="h-9 w-48 mt-2" />
            ) : (
              <h1 className="text-3xl font-bold text-slate-700">
                {user?.nama ? user.nama.split(' ')[0] : "User"}!
              </h1>
            )}
          </div>
          <NotificationDropdown/>
        </header>

        {/* Search & Filter */}
        <div className="relative mb-10 z-20 pt-6">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pt-6 text-gray-400">
            <Search size={18} />
          </div>
          <Input
            className="w-full pl-10 pr-12 py-6 bg-white border-gray-200 rounded-xl shadow-sm focus-visible:ring-blue-500 placeholder:text-gray-400"
            placeholder="Cari berdasarkan Judul, Penulis, atau Kategori..."
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <div
            className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-2 pt-7 rounded-full transition-colors ${isFilterOpen
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
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${selectedCategory === category
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

        {/* --- CONTENT BOOKS --- */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {searchQuery ? (
              <h2 className="text-xl font-bold text-slate-600">
                Hasil pencarian: &quot;{searchQuery}&quot;
              </h2>
            ) : selectedCategory === "Semua" ? (
              <Link href="/dashboard/new-books" className="group flex items-center gap-2 cursor-pointer">
                <h2 className="text-xl font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                  Baru ditambahkan
                </h2>
                <ChevronRight size={20} className="text-slate-600 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ) : (
              <h2 className="text-xl font-bold text-slate-600">
                Kategori: {selectedCategory}
              </h2>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {isLoadingBooks ? (
              Array.from({ length: 10 }).map((_, index) => (
                <BookCardSkeleton key={index} />
              ))
            ) : books.length > 0 ? (
              books.map((book) => <BookCard key={book.slug} book={book} />)
            ) : (
              <div className="col-span-full py-10 text-center text-gray-400">
                Tidak ada buku ditemukan.
              </div>
            )}
          </div>
        </section>

        {/* --- RECOMMENDATION --- */}
        {selectedCategory === "Semua" && searchQuery === "" && (
          <section>
            <h2 className="text-xl font-bold text-slate-600 mb-4">Rekomendasi</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {isLoadingBooks ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <BookCardSkeleton key={index} />
                ))
              ) : (
                books.map((book) => <BookCard key={book.slug} book={book} />)
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function BookCardSkeleton() {
  return (
    <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-gray-200">
      <Skeleton className="h-full w-full" />
    </div>
  );
}

function BookCard({ book }: { book: BookSummary }) {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const ASSET_BASE = API_BASE?.replace(/\/api\/?$/, "");
  return (
    <Link href={`/detailbuku?buku=${book.slug}`} className="block h-full">
      <div className="group relative aspect-[2/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-gray-200">
        <Image
          src={`${ASSET_BASE}${book.cover_url}`}
          alt={book.judul}  
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-full text-slate-800 uppercase tracking-wide">
            {book.kategori}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-2 drop-shadow-md">
            {book.judul}
          </h3>
          <p className="text-xs text-gray-300 font-medium drop-shadow-md">
            {book.penulis}
          </p>
        </div>
      </div>
    </Link>
  );
}