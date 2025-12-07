"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import { ArrowLeft, Calendar, Info, AlertCircle, CheckCheck } from "lucide-react";
import { http } from "@/lib/http";

type NotificationDetail = {
  id: string;
  tipe: string;
  judul: string;
  pesan: string;
  is_read: number;
  created_at: string;
};

type NotificationResponse = {
  data: NotificationDetail;
};

export default function NotificationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [notification, setNotification] = useState<NotificationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchNotification = async () => {
      try {
        setIsLoading(true);
        const response = await http.get<NotificationResponse>(`/notifications/${id}`);
        setNotification(response.data);
        setError(null);
        
        // Mark as read when viewing detail if not already read
        if (response.data.is_read === 0) {
             // Fire and forget or await? Await to ensure state consistency if we were to refetch
             await http.post(`/notifications/${id}/mark-as-read`, {});
             setNotification(prev => prev ? { ...prev, is_read: 1 } : null);
        }

      } catch (err) {
        console.error("Gagal memuat detail notifikasi:", err);
        setError("Gagal memuat detail notifikasi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotification();
  }, [id]);

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
      });
    } catch (err) {
      return timestamp;
    }
  };

  const BLUE_600 = "#2563EB";
  const RED_600 = "#DC2626";

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8">
        <div className="mb-6">
            <Link href="/notifikasi" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-4">
                <ArrowLeft size={20} className="mr-2" />
                Kembali ke Daftar Notifikasi
            </Link>
            <h1 className="text-3xl font-bold text-slate-700">Detail Notifikasi</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-content">
            {isLoading && <div className="text-gray-500">Memuat detail...</div>}
            
            {!isLoading && error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600">
                    {error}
                </div>
            )}

            {!isLoading && notification && (
                <div className="w-full">
                    <div className="flex items-center gap-4 mb-6">
                         <div className="shrink-0">
                            {notification.tipe === 'important' ? (
                                <AlertCircle size={48} color="white" fill={RED_600} />
                            ) : (
                                <Info size={48} color="white" fill={BLUE_600} />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{notification.judul}</h2>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    {formatDate(notification.created_at)}
                                </div>
                                {notification.is_read === 1 && (
                                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                        <CheckCheck size={14} />
                                        <span>Sudah dibaca</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {notification.pesan}
                        </p>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
