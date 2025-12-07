"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, X, AlertCircle, Info } from "lucide-react";

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

export default function NotificationDropdown() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError("Gagal memuat notifikasi. Coba lagi nanti.");
        setNotifications([]);
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

  const unreadCount = notifications.filter((notif) => notif.is_read === 0).length;

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (error) {
      console.warn("Invalid date format", error);
      return timestamp;
    }
  };

  return (
    <div className="relative">
      {/* Tombol Lonceng */}
      <button
        onClick={() => setIsNotifOpen(!isNotifOpen)}
        className={`relative p-2 rounded-full transition-colors hover:cursor-pointer ${
          isNotifOpen
            ? "bg-blue-100 text-blue-600"
            : "text-blue-600 hover:bg-blue-100 hover:text-black"
        }`}
      >
        <Bell size={34} className="fill-current" />
        {/* Badge Merah */}
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-[#F3F6F8]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Content */}
      {isNotifOpen && (
  <div className="absolute right-0 top-full mt-4 w-[320px] sm:w-[380px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-60">
          {/* Header Dropdown */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-slate-800 text-lg">Notifikasi</h3>
            <button
              onClick={() => setIsNotifOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* List Notifikasi */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoading && (
              <div className="px-5 py-6 text-sm text-gray-500">
                Memuat notifikasi...
              </div>
            )}

            {!isLoading && error && (
              <div className="px-5 py-6 text-sm text-red-500">
                {error}
              </div>
            )}

            {!isLoading && !error && notifications.length === 0 && (
              <div className="px-5 py-6 text-sm text-gray-500 text-center">
                Belum ada notifikasi.
              </div>
            )}

            {!isLoading && !error &&
              notifications.map((notif) => (
                <Link
                  key={notif.id}
                  href={`/notifikasi/${notif.id}`}
                  onClick={() => setIsNotifOpen(false)}
                  className={`flex w-full gap-3 px-5 py-4 border-b border-gray-50 text-left transition-colors group ${
                    notif.is_read === 0 ? "bg-blue-50/40 hover:bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  aria-label={`Buka notifikasi ${notif.judul}`}
                >
                  <div className="shrink-0 mt-1">
                    {notif.tipe === "important" ? (
                      <AlertCircle
                        size={20}
                        className="text-red-500 fill-red-100"
                      />
                    ) : (
                      <Info size={20} className="text-blue-500 fill-blue-100" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700 mb-1">
                      {notif.judul}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">
                      {notif.pesan}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {formatDate(notif.created_at)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>

          {/* Footer Dropdown */}
          <div className="bg-gray-50 px-5 py-3 text-right">
            <Link
              href="/notifikasi"
              className="text-xs font-bold text-blue-500 hover:text-blue-700 hover:underline transition-all"
            >
              Lihat semua
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}