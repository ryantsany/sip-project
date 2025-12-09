"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { http } from "@/lib/http";
import { useAuth } from "@/context/auth-context";

type LoginResponse = {
  token: string;
  redirect_url: string;
};

type APIResponse<T> = {
  meta: unknown;
  data: T;
};

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nomorInduk: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await http.post<APIResponse<LoginResponse>>('/login', {
        nomor_induk: formData.nomorInduk,
        password: formData.password
      });

      if (response.data?.token) {
        await login(response.data.token, response.data?.redirect_url);
      } else {
        await login("", response.data?.redirect_url);
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      let message = "Login gagal. Silakan coba lagi.";
      if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      setLoading(false);
    }
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

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

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
              onChange={(e) => setFormData({ ...formData, nomorInduk: e.target.value })}
              required
              disabled={loading}
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
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <span className="block text-center text-sm text-gray-500 mt-6">
          &copy; {new Date().getFullYear()} SIM | Kelompok 9
        </span>
      </div>
    </div>
  );
}