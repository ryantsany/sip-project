"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  History,
  User,
  LogOut,
  Bell,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GantiPassword() {
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
          <Link href="/dashboard" className="block">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-500 hover:text-slate-900"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Button>
          </Link>

          <Link href="/riwayatpinjam" className="block">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-500 hover:text-slate-900"
            >
              <History size={20} />
              Riwayat Peminjaman
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
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
              Ubah Kata Sandi
            </h1>
          </div>
          <div className="cursor-pointer p-2 rounded-full transition-colors text-blue-600 hover:bg-blue-100 hover:text-black">
            <Bell size={34} className="fill-current" />
          </div>
        </header>

        {/* --- CARD CONTAINER UTAMA --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row w-full max-w-5xl overflow-hidden min-h-[550px]">
            
            {/* --- BAGIAN KIRI: FORMULIR --- */}
            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <form className="space-y-8">
                  {/* Field 1: Kata Sandi Lama */}
                  <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 block">
                          Kata sandi lama
                      </label>
                      <Input 
                          type="password"
                          placeholder="Masukkan kata sandi lama"
                          className="bg-gray-50 border-gray-200 h-14 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all px-4 text-base"
                      />
                  </div>

                  {/* Field 2: Kata Sandi Baru */}
                  <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 block">
                          Kata sandi baru
                      </label>
                      <Input 
                          type="password"
                          placeholder="Masukkan kata sandi baru"
                          className="bg-gray-50 border-gray-200 h-14 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all px-4 text-base"
                      />
                  </div>

                  {/* Field 3: Konfirmasi Kata Sandi Baru */}
                  <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 block">
                          Konfirmasi kata sandi baru
                      </label>
                      <Input 
                          type="password"
                          placeholder="Ulangi kata sandi baru"
                          className="bg-gray-50 border-gray-200 h-14 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all px-4 text-base"
                      />
                  </div>

                  {/* Tombol Simpan */}
                  <div className="pt-6 flex justify-end w-full">
                      <Button 
                          type="submit"
                          className=" bg-blue-500 hover:bg-blue-700 text-white font-bold px-10 h-12 rounded-xl shadow-sm hover:shadow-md transition-all text-sm tracking-wide"
                      >
                          Simpan
                      </Button>
                  </div>
              </form>
            </div>

            <div className="w-full md:w-2/5 relative h-64 md:h-auto hidden md:block">
                <Image
                    src="/Danantara_Indonesia.svg"
                    alt="Logo Danantara"
                    fill
                    className="object-contain p-10" 
                    priority
                />
            </div>
        </div>
      </main>
    </div>
  );
}