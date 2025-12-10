"use client";

import { useEffect, useState } from "react";
import { http } from "@/lib/http";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminDashboardData, AdminDashboardResponse } from "@/types/api";
import StatCard from "./stat-card";
import { Banana, ClockAlert, Library } from "lucide-react";
import { TrendingUp, Trophy } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Peminjaman",
    color: "#3B82F6",
  },
} satisfies ChartConfig;

export default function DashAdmin() {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [currentDate, setCurrentDate] = useState("");
  
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      
      const datePart = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    
      const dayPart = now.toLocaleDateString("id-ID", {
        weekday: "long",
      });

      const timePart = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).replace(":", ".");

      setCurrentDate(`${datePart} | ${dayPart}, ${timePart} WIB`);
    };

    updateClock(); 
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  const pendingBorrowings = dashboardData?.pending_borrowings ?? [];
  const lateBorrowings = dashboardData?.late_borrowings ?? [];
  const monthlyStats = dashboardData?.monthly_stats ?? [];
  const topBooks = dashboardData?.top_books ?? [];

  useEffect(() => {
      async function fetchAdminDashboard() {
        try {
          setIsLoading(true);
          const response = await http.get<AdminDashboardResponse>("/admin/dashboard/borrowings");
          setDashboardData(response.data);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchAdminDashboard();
    }, []);

  return (
    <div className="flex min-h-screen bg-[#F3F6F8] font-sans text-slate-900">
      
      <Sidebar role="admin" />

      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-700 mb-1">
              Halo,
            {loading ? (
              <Skeleton className="h-9 w-48 mt-2" />
            ) : (
              <span className="text-3xl font-bold text-blue-500">
                {user?.nama ? ` ${user.nama.split(' ')[0]}` : "User"}!
              </span>
            )}
            </h1>
            <p className="text-slate-500">Selamat datang di dashboard admin perpustakaan.</p>
          </div>
            <h2 className="text-slate-500 text-lg mt-1 font-medium">
              {currentDate || <Skeleton className="h-7 w-64" />}
            </h2>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {
            isLoading ? (
              <>
                <Skeleton className="h-30 w-full rounded-2xl" />
                <Skeleton className="h-30 w-full rounded-2xl" />
                <Skeleton className="h-30 w-full rounded-2xl" />
              </>
            ) : (
              <>
                <StatCard icon={<Library size={32} className="text-white bg-blue-400 rounded-full p-1" />} index={0} label="Total Buku" subLabel="buku di koleksi" value={dashboardData?.total_books} growth={dashboardData?.books_added_this_month}  />
                <StatCard icon={<Banana size={32} className="text-white bg-blue-400 rounded-full p-1" />} index={0} label="Dipinjam" subLabel="buku dipinjam" value={dashboardData?.total_borrowings} growth={dashboardData?.books_borrowed_this_month}  />
                <StatCard icon={<ClockAlert size={32} className="text-white bg-blue-400 rounded-full p-1" />} index={2} label="Belum Dikembalikan" subLabel="buku terlambat" value={dashboardData?.total_overdue} growth={dashboardData?.books_overdue_this_month} />
              </>
            )
          }
        </section>

        {/* --- BAGIAN CHART --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            
            {/* KOLOM KIRI: CHART */}
            <div className="lg:col-span-2">
                <Card className="rounded-2xl shadow-sm border border-gray-100 h-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-700">Statistik Peminjaman</CardTitle>
                        <CardDescription>Grafik jumlah peminjaman buku 6 bulan terakhir</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        {isLoading ? (
                            <Skeleton className="h-[300px] w-full ml-3" />
                        ) : (
                            <ChartContainer config={chartConfig} className="h-[300px] w-full ml-3">
                                <BarChart
                                    accessibilityLayer
                                    data={monthlyStats}
                                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="count" fill="var(--color-count)" radius={8} barSize={40}>
                                        <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* KOLOM KANAN: TOP 5 BUKU */}
            <div className="lg:col-span-1">
                <Card className="rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold text-slate-700">Buku Terpopuler</CardTitle>
                            <Trophy className="text-yellow-500" size={20} />
                        </div>
                        <CardDescription>5 buku paling sering dipinjam bulan ini</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-4">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <Skeleton key={`top-book-skeleton-${idx}`} className="h-16 w-full rounded-xl" />
                                ))
                            ) : topBooks.length > 0 ? (
                                topBooks.map((book, index) => (
                                    <div key={book.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`
                                                flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0
                                                ${index === 0 ? "bg-yellow-100 text-yellow-700" : 
                                                  index === 1 ? "bg-gray-200 text-slate-700" :
                                                  index === 2 ? "bg-orange-100 text-orange-800" : "bg-white border text-slate-500"}
                                            `}>
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-700 text-sm truncate">{book.title}</p>
                                                <p className="text-xs text-slate-500 truncate">{book.author}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md shrink-0">
                                            <TrendingUp size={12} />
                                            <span className="text-xs font-bold">{book.count}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-slate-500 py-8">
                                    Belum ada data peminjaman bulan ini.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>    
        </section>
        {/* --- END BAGIAN CHART --- */}

        {/* Tables */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tabel Kiri */}
            <div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-row mb-2">
                      <h3 className="text-xl font-bold text-slate-700">Butuh diproses</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className=" text-slate-700 font-bold">Judul Buku</th>
                                <th className="p-5 text-slate-700 font-bold text-center">Nama</th>
                                <th className="p-5 text-slate-700 font-bold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                              Array.from({ length: 3 }).map((_, idx) => (
                                <tr key={`pending-skeleton-${idx}`} className="border-b border-gray-50 last:border-none">
                                  <td className="p-5"><Skeleton className="h-5 w-48" /></td>
                                  <td className="p-5"><Skeleton className="h-6 w-24 mx-auto rounded-full" /></td>
                                </tr>
                              ))
                            ) : pendingBorrowings.length ? (
                              pendingBorrowings.map((book, idx) => (
                                <tr key={idx} className="border-b border-gray-50 last:border-none">
                                    <td className="font-medium text-slate-700">{book.book_title}</td>
                                    <td className="p-5 text-center text-slate-600 font-medium">
                                        {book.peminjam}
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className="bg-[#FDF6B2] text-[#723B13] px-4 py-1 rounded-full font-bold text-xs">
                                            {book.status}
                                        </span>
                                    </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="p-5 text-center text-slate-500">Tidak ada data pending.</td>
                              </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tabel Kanan */}
            <div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-row mb-2">
                      <h3 className="text-xl font-bold text-slate-800">Buku terlambat</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-slate-700 font-bold">Judul Buku</th>
                                <th className="p-5 text-slate-700 font-bold text-center">Nama</th>
                                <th className="p-5 text-slate-700 font-bold text-center">Status</th>
                                <th className="p-5 text-slate-700 font-bold text-center">Denda</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                              Array.from({ length: 3 }).map((_, idx) => (
                                <tr key={`late-skeleton-${idx}`} className="border-b border-gray-50 last:border-none">
                                  <td className=""><Skeleton className="h-5 w-48" /></td>
                                  <td className="p-5"><Skeleton className="h-6 w-28 mx-auto rounded-full" /></td>
                                  <td className="p-5"><Skeleton className="h-5 w-32 mx-auto" /></td>
                                  <td className="p-5"><Skeleton className="h-5 w-20 mx-auto" /></td>
                                </tr>
                              ))
                            ) : lateBorrowings.length ? (
                              lateBorrowings.map((book, idx) => (
                                <tr key={`late-${idx}`} className="border-b border-gray-50 last:border-none">
                                    <td className="font-medium text-slate-700">{book.book_title}</td>
                                    <td className="p-5 text-center text-slate-600 font-medium">
                                        {book.peminjam}
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className="bg-[#F87171] text-white px-4 py-1 rounded-full font-bold text-xs whitespace-nowrap">
                                            {book.status}
                                        </span>
                                    </td>   
                                    <td className="p-5 text-center text-slate-700">
                                        Rp {book.denda?.toLocaleString('id-ID')}
                                    </td>                             
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="p-5 text-center text-slate-500">Tidak ada buku terlambat.</td>
                              </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}