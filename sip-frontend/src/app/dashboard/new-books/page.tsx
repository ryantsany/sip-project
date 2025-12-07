"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiswaAuth } from "@/components/auth/siswa-auth";

import { http } from "@/lib/http";
import { BookSummary, ApiResponse } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";

type AllBooksResponse = ApiResponse<BookSummary[]>;

export default function NewBooksPage() {
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <SiswaAuth>
      <div className="min-h-screen bg-[#F3F6F8] p-8 font-sans text-slate-900">
        <div className="max-w-7xl mx-auto mb-8 flex items-center gap-4">
          <Link href="/dashboard">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-700">Buku Baru Ditambahkan</h1>
            <p className="text-slate-500 text-sm">Daftar koleksi terbaru perpustakaan</p>
          </div>
        </div>

        {/* Grid Buku Full Page */}
        <div className="max-w-7xl mx-auto">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="aspect-[3/4.5] rounded-2xl overflow-hidden bg-gray-200">
                  <Skeleton className="h-full w-full" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          {!isLoading && !error && books.length === 0 && (
            <div className="text-center text-gray-500">
              Belum ada buku di perpustakaan.
            </div>
          )}

          {!isLoading && !error && books.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.slug} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SiswaAuth>
  );
}

function BookCard({ book }: { book: BookSummary }) {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const ASSET_BASE = API_BASE?.replace(/\/api\/?$/, "");

  return (
    <Link href={`/detailbuku?buku=${book.slug}`} className="block h-full">
      <div className="group relative aspect-[3/4.5] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-gray-200">
        {book.cover_url ? (
          <Image
            src={`${ASSET_BASE}${book.cover_url}`}
            alt={book.judul}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xl text-slate-400 text-center leading-tight p-4 font-medium">
              No Image
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
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