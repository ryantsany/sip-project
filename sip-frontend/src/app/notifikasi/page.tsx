"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import NotificationDropdown from "@/components/notifikasi"; 
import { AlertCircle, Info, CheckCheck } from "lucide-react"; 

// Data Dummy Awal
const initialData = [
  {
    id: 1,
    type: "warning",
    title: "Ini notifikasi warning",
    message: "Konsep Keamanan Informasi, enkripsi dan deskripsi caesar Chiper, Vigere Chiper dan beberapa enkripsi lainnya",
    time: "Beberapa detik yang lalu",
    isRead: false,
  },
  {
    id: 2,
    type: "info",
    title: "Ini notifikasi informasi",
    message: "Konsep Keamanan Informasi, enkripsi dan deskripsi caesar Chiper, Vigere Chiper dan beberapa enkripsi lainnya",
    time: "Beberapa detik yang lalu",
    isRead: true,
  },
  {
    id: 3,
    type: "warning",
    title: "Peringatan Keamanan Akun",
    message: "Terdeteksi login baru pada perangkat yang tidak dikenali. Segera periksa aktivitas akun Anda.",
    time: "5 menit yang lalu",
    isRead: false,
  },
];

export default function NotifikasiPage() {
  const [activeTab, setActiveTab] = useState<"semua" | "belum_dibaca">("semua");
  const [notifications, setNotifications] = useState(initialData);

  // Filter Data berdasarkan Tab
  const displayedNotifications = activeTab === "semua" 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  // Fungsi Tandai Semua Dibaca
  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
  };

  // Warna Hex untuk Fill Icon
  const BLUE_600 = "#2563EB"; 
  const RED_600 = "#DC2626";

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
        
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-700">
            Notifikasi
          </h1>
          <NotificationDropdown />
        </div>

        {/* --- TABS & ACTIONS --- */}
        <div className="flex flex-wrap items-center justify-between mb-6 pt-6">
          
          {/* Group Tombol Tabs */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("semua")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeTab === "semua"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTab("belum_dibaca")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeTab === "belum_dibaca"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              Belum dibaca
            </button>
          </div>

          {/* Tombol "Tandai semua dibaca" (Hanya muncul di tab Belum Dibaca) */}
          {activeTab === "belum_dibaca" && displayedNotifications.length > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <CheckCheck size={18} />
              Tandai semua sudah dibaca
            </button>
          )}

        </div>

        {/* Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[600px] p-6">
          <div className="flex flex-col gap-4">
            
            {displayedNotifications.map((notif) => (
              <div 
                key={notif.id}
                className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {notif.type === 'warning' ? (
                    <AlertCircle 
                      size={40} 
                      color="white" 
                      fill={RED_600} 
                      className="drop-shadow-sm"
                    />
                  ) : (
                    <Info 
                      size={40} 
                      color="white" 
                      fill={BLUE_600} 
                      className="drop-shadow-sm"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    {notif.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    {notif.message}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {notif.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {displayedNotifications.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <div className="bg-gray-50 p-4 rounded-full mb-3">
                  <CheckCheck size={32} className="text-gray-300" />
                </div>
                <p>Tidak ada notifikasi baru.</p>
              </div>
            )}
            
          </div>
        </div>

      </main>
    </div>
  );
}