"use client";

import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale"; 
import { cn } from "@/lib/utils"; 
import {
  Bell,
  Search,
  SlidersHorizontal,
  Calendar as CalendarIcon,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const bookDetail = {
  id: 1,
  title: "Blue Box Vol. 17",
  author: "Kouji Miura",
  publisher: "Shueisha",
  isbn: "978-4-08-891642-3",
  category: "Comic",
  stock: 10,
  status: "Tersedia",
  synopsis: "Setelah ujian selesai, liburan musim panas akhirnya dimulai! Taiki dan Chinatsu pergi kencan rahasia di festival kembang api, tetapi waktu romantis mereka terganggu ketika mereka bertemu dengan siswa Eimei lainnya. Bisakah mereka terus menyembunyikan hubungan mereka dari teman-teman dan teman sekelas mereka?",
  coverImage: "/bluebox17.jpeg", 
};

export default function DetailBuku() {
  // STATE FOR DATE PICKER (Default to today)
  const [date, setDate] = useState<Date | undefined>(new Date());
  const handlePinjam = () => {
    const formattedDate = date ? format(date, "dd MMMM yyyy", { locale: id }) : "Belum dipilih";
    alert(`Buku berhasil dipinjam! Tanggal: ${formattedDate}`);
  };
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
                            {bookDetail.title}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="flex flex-col lg:flex-row gap-8 lg:h-[600px]">
            {/* Bagian Kiri: Cover Buku */}
            <div className="w-full lg:w-auto flex-shrink-0 flex justify-center lg:justify-start h-auto lg:h-full">
                <div className="relative h-full aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                    <Image
                        src={bookDetail.coverImage} 
                        alt={bookDetail.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Bagian Kanan: Informasi Detail */}
            <div className="flex-1 w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative h-full">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                        {bookDetail.title}
                    </h2>
                    <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">
                        {bookDetail.status}
                    </span>
                </div>

                {/* Metadata List */}
                <div className="space-y-3 mb-8 text-sm md:text-base">
                    
                    {/* Penulis */}
                    <div className="flex items-start">
                        <span className="font-semibold text-slate-800 w-28 shrink-0">Penulis</span>
                        <span className="mr-3 text-slate-800">:</span>
                        <span className="text-slate-600 flex-1">{bookDetail.author}</span>
                    </div>

                    {/* Penerbit */}
                    <div className="flex items-start">
                        <span className="font-semibold text-slate-800 w-28 shrink-0">Penerbit</span>
                        <span className="mr-3 text-slate-800">:</span>
                        <span className="text-slate-600 flex-1">{bookDetail.publisher}</span>
                    </div>

                    {/* ISBN */}
                    <div className="flex items-start">
                        <span className="font-semibold text-slate-800 w-28 shrink-0">ISBN</span>
                        <span className="mr-3 text-slate-800">:</span>
                        <span className="text-slate-600 flex-1">{bookDetail.isbn}</span>
                    </div>

                    {/* Kategori */}
                    <div className="flex items-start">
                        <span className="font-semibold text-slate-800 w-28 shrink-0">Kategori</span>
                        <span className="mr-3 text-slate-800">:</span>
                        <span className="text-slate-600 flex-1">{bookDetail.category}</span>
                    </div>

                    {/* Stok */}
                    <div className="flex items-start">
                        <span className="font-semibold text-slate-800 w-28 shrink-0">Stok</span>
                        <span className="mr-3 text-slate-800">:</span>
                        <span className="text-slate-600 flex-1">{bookDetail.stock}</span>
                    </div>
                    
                </div>

                {/* Sinopsis */}
                <div className="mb-10">
                    <h3 className="font-bold text-slate-800 mb-2">Sinopsis:</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify">
                        {bookDetail.synopsis}
                    </p>
                </div>

                {/* --- FOOTER: TOMBOL & MODAL --- */}
                <div className="flex justify-end mt-auto pt-16">
                    
                    <Dialog>
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
                                    Tanggal Peminjaman
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
                                >
                                    Pinjam
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}