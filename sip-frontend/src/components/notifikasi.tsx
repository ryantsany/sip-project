"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, X, AlertCircle, Info } from "lucide-react";

const dummyNotifications = [
  {
    id: 1,
    type: "warning",
    title: "Ini notifikasi warning",
    message: "Konsep Keamanan Informasi, enkripsi dan deskripsi caesar Chiper.",
    time: "Beberapa detik yang lalu",
  },
  {
    id: 2,
    type: "info",
    title: "Ini notifikasi informasi",
    message: "Konsep Keamanan Informasi, enkripsi dan deskripsi caesar Chiper.",
    time: "2 jam yang lalu",
  },
  {
    id: 3,
    type: "warning",
    title: "Ini notifikasi warning",
    message: "Konsep Keamanan Informasi, enkripsi dan deskripsi caesar Chiper.",
    time: "3 hari yang lalu",
  },
];

export default function NotificationDropdown() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <div className="relative">
      {/* Tombol Lonceng */}
      <button
        onClick={() => setIsNotifOpen(!isNotifOpen)}
        className={`relative p-2 rounded-full transition-colors ${
          isNotifOpen
            ? "bg-blue-100 text-blue-600"
            : "text-blue-600 hover:bg-blue-100 hover:text-black"
        }`}
      >
        <Bell size={34} className="fill-current" />
        {/* Badge Merah */}
        <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-[#F3F6F8]">
          3
        </span>
      </button>

      {/* Dropdown Content */}
      {isNotifOpen && (
        <div className="absolute right-0 top-full mt-4 w-[320px] sm:w-[380px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-[60]">
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
            {dummyNotifications.map((notif) => (
              <div
                key={notif.id}
                className="flex gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex-shrink-0 mt-1">
                  {notif.type === "warning" ? (
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
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-gray-400">{notif.time}</p>
                </div>
              </div>
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