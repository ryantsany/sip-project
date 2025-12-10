"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { http } from "@/lib/http";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import {
  Search,
  SlidersHorizontal,
  Filter,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import Sidebar from "@/components/sidebar";
import NotificationDropdown from "@/components/notifikasi";
import { BookSummary, LatestBooksResponse, BooksResponse, CategoriesResponse, AllBooksResponse, Category } from "@/types/api";

type SortOption = "newest" | "title" | "author" | "year";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchResults, setSearchResults] = useState<BookSummary[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Dropdown states
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // All Books lazy loading states
  const [allBooks, setAllBooks] = useState<BookSummary[]>([]);
  const [allBooksPage, setAllBooksPage] = useState(1);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoadingBooks(true);
        const [booksResponse, categoriesResponse] = await Promise.all([
          http.get<LatestBooksResponse>("/books-latest"),
          http.get<CategoriesResponse>("/categories")
        ]);

        setBooks(booksResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoadingBooks(false);
      }
    }
    fetchData();
  }, []);

  // Fetch all books with pagination
  const fetchAllBooks = useCallback(async (page: number, reset: boolean = false) => {
    if (isLoadingMore && !reset) return;

    try {
      setIsLoadingMore(true);
      const response = await http.get<AllBooksResponse>(`/books?page=${page}`);

      if (page === 1 || reset) {
        setAllBooks(response.data.data);
      } else {
        setAllBooks(prev => [...prev, ...response.data.data]);
      }

      setHasMoreBooks(response.data.current_page < response.data.last_page);
      setAllBooksPage(response.data.current_page);
    } catch (error) {
      console.error("Failed to fetch all books:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  // Initial fetch for all books
  useEffect(() => {
    fetchAllBooks(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreBooks && !isLoadingMore && selectedCategory === null && searchQuery === "") {
          fetchAllBooks(allBooksPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMoreBooks, isLoadingMore, allBooksPage, fetchAllBooks, selectedCategory, searchQuery]);

  // Search books
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await http.get<BooksResponse>(
          `/search-books?query=${encodeURIComponent(searchQuery.trim())}`
        );
        setSearchResults(response.data.data);
      } catch (error) {
        console.error("Failed to search books:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedCategory(null);
  };

  // Logic to filter and sort books
  const displayedBooks = useMemo(() => {
    let result = searchQuery.trim()
      ? searchResults
      : selectedCategory === null
        ? [...books]
        : books.filter((b) => b.category?.name === selectedCategory);

    // Apply Sorting
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
  }, [books, searchResults, searchQuery, selectedCategory, sortBy]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Terbaru" },
    { value: "title", label: "Judul (A-Z)" },
    { value: "author", label: "Penulis (A-Z)" },
    { value: "year", label: "Tahun Terbit" },
  ];

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
          <NotificationDropdown />
        </header>

        {/* Search & Filters Container */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 mt-10">

          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
            <Input
              className="w-full pl-10 pr-4 py-5 bg-white border-gray-200 rounded-xl shadow-sm focus-visible:ring-blue-500 placeholder:text-gray-400"
              placeholder="Cari judul, penulis, atau kategori..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Category Dropdown - REVISED STRUCTURE */}
          <div className="relative">
            <button
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsSortOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors min-w-[160px] justify-between ${isCategoryOpen ? "border-blue-500 ring-2 ring-blue-100" : ""
                }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Filter size={18} className="text-gray-500 shrink-0" />
                <span className="text-sm text-slate-700 font-medium truncate">
                  {selectedCategory ?? "Semua"}
                </span>
              </div>
            </button>

            {isCategoryOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 z-50 animate-in fade-in zoom-in-95 duration-200">
                {/* DIV LUAR: Bentuk dan Bayangan */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                  {/* DIV DALAM: Scrolling dan Padding */}
                  <div className="max-h-80 overflow-y-auto mt-1">

                    {/* HEADER: Z-10 dan sticky */}
                    <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider sticky top-0 bg-white z-10 border-b border-gray-50/20 mb-1">
                      Pilih Kategori
                    </p>

                    {/* "Semua" option */}
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors relative z-0 ${selectedCategory === null
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-slate-600 hover:bg-gray-50"
                        }`}
                    >
                      Semua
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors relative z-0 ${selectedCategory === category.name
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-slate-600 hover:bg-gray-50"
                          }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsCategoryOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors ${isSortOpen ? "border-blue-500 ring-2 ring-blue-100" : ""
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
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${sortBy === option.value
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

        {/* --- CONTENT BOOKS --- */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {searchQuery ? (
              <h2 className="text-xl font-bold text-slate-600">
                Hasil pencarian: &quot;{searchQuery}&quot;
              </h2>
            ) : selectedCategory === null ? (
              <h2 className="text-xl font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                Baru ditambahkan
              </h2>
            ) : (
              <h2 className="text-xl font-bold text-slate-600">
                Kategori: {selectedCategory}
              </h2>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {isLoadingBooks || isSearching ? (
              Array.from({ length: 10 }).map((_, index) => (
                <BookCardSkeleton key={`latest-skeleton-${index}`} />
              ))
            ) : displayedBooks.length > 0 ? (
              displayedBooks.map((book, index) => <BookCard key={`latest-${book.slug}-${index}`} book={book} />)
            ) : (
              <div className="col-span-full py-10 text-center text-gray-400">
                Tidak ada buku ditemukan.
              </div>
            )}
          </div>
        </section>

        {/* --- ALL BOOKS WITH LAZY LOADING --- */}
        {selectedCategory === null && searchQuery === "" && (
          <section>
            <h2 className="text-xl font-bold text-slate-600 mb-4">Semua buku</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allBooks.map((book, index) => (
                <BookCard key={`all-${book.slug}-${index}`} book={book} />
              ))}

              {/* Loading skeletons */}
              {isLoadingMore && (
                Array.from({ length: 5 }).map((_, index) => (
                  <BookCardSkeleton key={`all-skeleton-${index}`} />
                ))
              )}
            </div>

            {/* Intersection Observer Target */}
            {hasMoreBooks && (
              <div
                ref={loadMoreRef}
                className="h-10 w-full flex items-center justify-center mt-4"
              >
                {isLoadingMore && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-sm">Memuat lebih banyak...</span>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function BookCardSkeleton() {
  return (
    <div className="aspect-2/3 rounded-2xl overflow-hidden bg-gray-200">
      <Skeleton className="h-full w-full" />
    </div>
  );
}

function BookCard({ book }: { book: BookSummary }) {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const ASSET_BASE = API_BASE?.replace(/\/api\/?$/, "");
  return (
    <Link href={`/detailbuku?buku=${book.slug}`} className="block h-full">
      <div className="group relative aspect-2/3 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-gray-200">
        {book.cover_url ? (
          <Image src={`${ASSET_BASE}${book.cover_url}`} alt={book.judul} fill className="object-cover" unoptimized />
        ) : (
          <span className="text-xl text-slate-400 text-center leading-tight p-1 font-medium">
            No Image
          </span>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-full text-slate-800 uppercase tracking-wide">
            {book.category?.name ?? "Uncategorized"}
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