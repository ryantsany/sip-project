"use client";

export default function StatCard({ index, label, value, growth }: { index: number; label: string; value: number | null | undefined; growth: number | null | undefined }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
        <div>
            <span className={`text-xs font-bold ${
                index === 1 ? "text-red-500" : index === 2 ? "text-orange-500" : "text-green-500"
            }`}>
                {'+' + growth + ' Bulan ini'}
            </span>
            <h2 className="text-4xl font-bold text-slate-700 mt-2">{value}</h2>
        </div>
        <p className="text-slate-500 font-bold text-lg">{label}</p>
    </div>
  );
}