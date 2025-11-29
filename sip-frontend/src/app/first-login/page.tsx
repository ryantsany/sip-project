"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { http } from "@/lib/http";
import { useSearchParams } from "next/navigation";

type LoginResponse = {
  token: string;
  redirect_url: string;
};

type APIResponse<T> = {
  meta: unknown;
  data: T;
};

function FirstLoginContent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nomorInduk: useSearchParams().get('nomor_induk') || "",
    password: "",
    password_confirmation: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await http.post<APIResponse<LoginResponse>>('/first-login', {
        nomor_induk: formData.nomorInduk,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }

      if (response.data?.redirect_url) {
        try {
          const url = new URL(response.data.redirect_url);
          router.push(url.pathname + url.search);
        } catch {
          router.push(response.data.redirect_url);
        }
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError("Gagal membuat password baru");
    } finally {
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

      {/* --- 2. CARD NEW PASSWORD --- */}
      <div className="relative z-10 w-full max-w-[400px] bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300 mx-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 mb-2 text-center">
            Buat Password Baru
          </h2>
          <p className="text-sm text-slate-500 mb-6 text-center">
            Silakan buat password baru untuk mengamankan akun Anda.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          {/*}
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

          {/* Confirm Password */}
          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-bold text-slate-600 ml-1"
            >
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg bg-[#F0F4FF] border-transparent focus:bg-white border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 outline-none transition-all placeholder:text-gray-400 pr-12"
                value={formData.password_confirmation}
                placeholder="Konfirmasi Password Anda"
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Tombol Buat Password */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Membuat password...
              </>
            ) : (
              "Buat password"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

export default function FirstLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FirstLoginContent />
    </Suspense>
  );
}