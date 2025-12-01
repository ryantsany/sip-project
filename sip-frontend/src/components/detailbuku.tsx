"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { http } from "@/lib/http";
import { format, set } from "date-fns";
import { id } from "date-fns/locale"; 
import { cn } from "@/lib/utils"; 
import { Bell, Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Sidebar from "@/components/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookSummary, BookSummaryResponse, BorrowCreateResponse } from "@/types/api";
import { toast } from "sonner";

const FALLBACK_COVER = "/bluebox17.jpeg";
const FALLBACK_TITLE = "Detail Buku";

export default function DetailBuku() {
    // STATE FOR DATE PICKER (Default to today)
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [bookSummary, setBookSummary] = useState<BookSummary | null>(null);
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [isLoadingBorrow, setIsLoadingBorrow] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // STATE FOR DIALOG 
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
    const ASSET_BASE = API_BASE?.replace(/\/api\/?$/, "");

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const slug = query.get("buku");
        
        async function fetchBooks() {
            if (!slug) {
                setFetchError("Parameter buku tidak ditemukan.");
                setIsLoadingBook(false);
                return;
            }
            try {
                setIsLoadingBook(true);
                setFetchError(null);
                const response = await http.get<BookSummaryResponse>("/books/" + slug);
                setBookSummary(response.data);
            } catch (error) {
                console.error("Failed to fetch Books:", error);
                setFetchError("Gagal memuat detail buku.");
            } finally {
                setIsLoadingBook(false);
            }
        }
        fetchBooks();
        
    }, []);

    const handlePinjam = () => {
        const query = new URLSearchParams(window.location.search);
        const slug = query.get("buku");
        const formattedDate: string = date ? format(date, "yyyy-MM-dd", { locale: id }) : "Belum dipilih";

        setIsDialogOpen(false);

        async function borrowBook() {
            try {
                setIsLoadingBorrow(true);
                setFetchError(null);
                const response = await http.post<BorrowCreateResponse>("/pinjam-buku", {
                    book_slug: slug,
                    borrow_date: formattedDate
                });
            } catch (error) {
                console.error("Failed to fetch Books:", error);
                setFetchError("Gagal memuat detail buku.");
            } finally {
                setIsLoadingBorrow(false);
                toast.success("Berhasil Meminjam Buku!", {
                    description: `Buku "${bookSummary?.judul}" berhasil dipinjam untuk tanggal ${format(formattedDate, "dd MMMM yyyy", { locale: id })}.`,
                    duration: 5000, 
                    
                    action: {
                        label: "Lihat",
                        onClick: () => {
                            window.location.href = "/riwayatpinjam";
                        },
                    },
                });
            }
        }
        borrowBook();
        
    };

    const detailTitle = bookSummary?.judul ?? (fetchError ? "Gagal memuat buku" : FALLBACK_TITLE);
    const coverImage = ASSET_BASE + (bookSummary?.cover_url ?? FALLBACK_COVER);
    const statusLabel = bookSummary?.status
        ? bookSummary.status.toLowerCase() === "available"
            ? "Tersedia"
            : bookSummary.status
        : undefined;

    return (
        <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
            
            {/* --- HEADER --- */}
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

            {/* --- BREADCRUMB --- */}
            <div className="mb-8">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className="text-slate-500 hover:text-blue-600">
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-slate-700 font-medium truncate max-w-[200px] md:max-w-none">
                                {isLoadingBook ? (
                                    <Skeleton className="h-6 w-48" />
                                ) : (
                                    detailTitle
                                )}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {isLoadingBook ? (
                    <BookDetailSkeleton />
                ) : bookSummary ? (
                    <>
                        {/* Bagian Kiri: Cover Buku */}
                        <div className="w-full lg:w-[350px] shrink-0 flex justify-center lg:justify-start">
                            <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                                <Image
                                    src={coverImage}
                                    alt={bookSummary.judul}
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Bagian Kanan: Informasi Detail */}
                        <div className="flex flex-col bg-white rounded-2xl p-8 shadow-sm border border-gray-100 w-full">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                                    {bookSummary.judul}
                                </h2>
                                {statusLabel && (
                                    <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">
                                        {statusLabel}
                                    </span>
                                )}
                            </div>

                            {/* Metadata List */}
                            <div className="space-y-3 mb-8 text-sm md:text-base">
                                {/* Penulis */}
                                <div className="flex items-start">
                                    <span className="font-semibold text-slate-800 w-28 shrink-0">Penulis</span>
                                    <span className="mr-3 text-slate-800">:</span>
                                    <span className="text-slate-600 flex-1">{bookSummary.penulis ?? "-"}</span>
                                </div>

                                {/* Penerbit */}
                                <div className="flex items-start">
                                    <span className="font-semibold text-slate-800 w-28 shrink-0">Penerbit</span>
                                    <span className="mr-3 text-slate-800">:</span>
                                    <span className="text-slate-600 flex-1">{bookSummary.penerbit}</span>
                                </div>

                                {/* ISBN */}
                                <div className="flex items-start">
                                    <span className="font-semibold text-slate-800 w-28 shrink-0">ISBN</span>
                                    <span className="mr-3 text-slate-800">:</span>
                                    <span className="text-slate-600 flex-1">{bookSummary.isbn}</span>
                                </div>

                                {/* Kategori */}
                                <div className="flex items-start">
                                    <span className="font-semibold text-slate-800 w-28 shrink-0">Kategori</span>
                                    <span className="mr-3 text-slate-800">:</span>
                                    <span className="text-slate-600 flex-1">{bookSummary.kategori}</span>
                                </div>

                                {/* Stok */}
                                <div className="flex items-start">
                                    <span className="font-semibold text-slate-800 w-28 shrink-0">Stok</span>
                                    <span className="mr-3 text-slate-800">:</span>
                                    <span className="text-slate-600 flex-1">{bookSummary.stok}</span>
                                </div>
                            </div>

                            {/* Sinopsis */}
                            <div className="mb-10">
                                <h3 className="font-bold text-slate-800 mb-2">Sinopsis:</h3>
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify">
                                    {bookSummary.deskripsi || "Belum ada deskripsi untuk buku ini."}
                                </p>
                            </div>

                            {/* --- FOOTER: TOMBOL & MODAL --- */}
                            <div className="flex justify-end ">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-xl font-bold text-lg">
                                            Pinjam
                                        </Button>
                                    </DialogTrigger>
                                    
                                    <DialogContent className="sm:max-w-[500px] bg-white rounded-xl p-6">
                                        <DialogHeader className="mb-4">
                                            <DialogTitle className="text-xl font-bold text-slate-800">
                                                Form Peminjaman
                                            </DialogTitle>
                                        </DialogHeader>
                                        
                                        {/* --- DATE PICKER INPUT --- */}
                                        <div className="grid gap-2 py-2">
                                            <label className="text-sm font-semibold text-slate-600">
                                                Tanggal Pengambilan
                                            </label>
                                            
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal border-slate-300 h-11 text-slate-700",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {date ? (
                                                            format(date, "dd MMMM yyyy", { locale: id })
                                                        ) : (
                                                            <span>Pilih tanggal</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={setDate}
                                                        disabled={(date) =>
                                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <DialogFooter className="mt-6">
                                            <Button 
                                                type="submit" 
                                                onClick={handlePinjam}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 rounded-lg"
                                                disabled={isLoadingBorrow}
                                            >
                                                {isLoadingBorrow ? 
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Meminjam...
                                                </>  : "Pinjam"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </>
                ) : (
                    <BookDetailEmptyState message={fetchError ?? "Data buku tidak ditemukan."} />
                )}
            </div>
        </main>
        </div>
  );
}

function BookDetailSkeleton() {
    return (
        <>
            <div className="w-full lg:w-[400px] shrink-0 flex justify-center lg:justify-start">
                <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                    <Skeleton className="h-full w-full" />
                </div>
            </div>

            <div className="flex-1 w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <Skeleton className="h-9 w-3/4" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-3 mb-8 text-sm md:text-base">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div className="flex items-start gap-3" key={index}>
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 flex-1" />
                        </div>
                    ))}
                </div>
                <div className="mb-10 space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <div className="flex justify-end mt-auto pt-16">
                    <Skeleton className="h-12 w-40 rounded-xl" />
                </div>
            </div>
        </>
    );
}

function BookDetailEmptyState({ message }: { message: string }) {
    return (
        <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
            <p className="max-w-md text-base md:text-lg">{message}</p>
        </div>
    );
}