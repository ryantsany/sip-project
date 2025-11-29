"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nomorInduk: "",
    password: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login data:", formData);
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans">
      {/* --- 1. BACKGROUND IMAGE & OVERLAY --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/loginn.png" 
          alt="Library Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[5px]" />
      </div>

      {/* --- 2. CARD LOGIN --- */}
      <div className="relative z-10 w-full max-w-[400px] bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300 mx-4">
        <div className="flex flex-col items-center mb-8 text-center">
          <Image
            src="/logo.png"
            alt="Logo Perpustakaan"
            width={90}
            height={90}
            className="object-contain"
          />     
          <h1 className="text-lg font-bold text-slate-700">
            Sistem Informasi Perpustakaan
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Input Nomor Induk */}
          <div className="space-y-1">
            <label 
              htmlFor="nomorInduk" 
              className="block text-sm font-bold text-slate-600 ml-1"
            >
              Nomor Induk
            </label>
            <input
              id="nomorInduk"
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-[#F0F4FF] border-transparent focus:bg-white border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 outline-none transition-all placeholder:text-gray-400"
              value={formData.nomorInduk}
              placeholder="Masukkan Nomor Induk Anda"
              onChange={(e) => setFormData({...formData, nomorInduk: e.target.value})}
              required
            />
          </div>

          {/* Input Password */}
          <div className="space-y-1">
            <label 
              htmlFor="password" 
              className="block text-sm font-bold text-slate-600 ml-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg bg-[#F0F4FF] border-transparent focus:bg-white border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 outline-none transition-all placeholder:text-gray-400 pr-12"
                value={formData.password}
                placeholder="Masukkan Password Anda"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              {/* Toggle Show/Hide Password */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] mt-4"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}