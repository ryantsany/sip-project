"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import NotificationDropdown from "@/components/notifikasi";
import { AlertCircle, Info, CheckCheck } from "lucide-react";

import { http } from "@/lib/http";

type NotificationItem = {
  id: string;
  tipe: string;
  judul: string;
  pesan: string;
  is_read: number;
  created_at: string;
};

type NotificationResponse = {
  data: NotificationItem[];
};

export default function NotifikasiPage() {
  const [activeTab, setActiveTab] = useState<"semua" | "belum_dibaca">("semua");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await http.get<NotificationResponse>("/notifications");
        if (!isMounted) return;
        setNotifications(response.data ?? []);
        setError(null);
      } catch (err) {
        console.error("Gagal memuat notifikasi:", err);
        if (!isMounted) return;
        setNotifications([]);
        setError("Tidak dapat memuat notifikasi. Coba lagi nanti.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkAllRead = async () => {
    const unreadNotifications = notifications.filter((notif) => notif.is_read === 0);
    if (unreadNotifications.length === 0 || isMarkingAll) {
      return;
    }

    setIsMarkingAll(true);
    try {
      await Promise.all(
        unreadNotifications.map((notif) =>
          http.post(`/notifications/${notif.id}/mark-as-read`, {})
        )
      );

      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: 1 })));
    } catch (err) {
      console.error("Gagal menandai semua notifikasi sebagai dibaca:", err);
      setError("Gagal menandai semua notifikasi sebagai dibaca.");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (err) {
      console.warn("Format tanggal tidak valid", err);
      return timestamp;
    }
  };

  // Filter Data berdasarkan Tab
  const displayedNotifications = useMemo(() => {
    if (activeTab === "belum_dibaca") {
      return notifications.filter((notif) => notif.is_read === 0);
    }

    return notifications;
  }, [activeTab, notifications]);

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
              disabled={isMarkingAll}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isMarkingAll
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              <CheckCheck size={18} />
              {isMarkingAll ? "Menandai..." : "Tandai semua sudah dibaca"}
            </button>
          )}

        </div>

        {/* Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[600px] p-6">
          <div className="flex flex-col gap-4">
            {isLoading && (
              <div className="text-sm text-gray-500">Memuat notifikasi...</div>
            )}

            {!isLoading && error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                {error}
              </div>
            )}
            
            {!isLoading && !error &&
              displayedNotifications.map((notif) => (
              <Link 
                href={`/notifikasi/${notif.id}`}
                key={notif.id}
                className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="shrink-0 mt-0.5">
                  {notif.tipe === 'important' ? (
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
                    {notif.judul}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    {notif.pesan}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {formatDate(notif.created_at)}
                  </p>
                </div>
              </Link>
            ))}

            {/* Empty State */}
            {!isLoading && !error && displayedNotifications.length === 0 && (
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