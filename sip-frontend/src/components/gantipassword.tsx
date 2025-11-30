"use client";

import React from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/sidebar"; // Import Sidebar Baru

export default function GantiPassword() {
  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      
      {/* PANGGIL SIDEBAR DISINI */}
      <Sidebar />

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

            {/* --- BAGIAN KANAN: GAMBAR --- */}
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