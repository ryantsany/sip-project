"use client";

import {Library} from "lucide-react"

export default function StatCard({ icon, index, label, subLabel, value, growth }: { icon: any,index: number; label: string; subLabel: string; value: number | null | undefined; growth: number | null | undefined }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-min-content">
        <div className="flex flex-row items-center gap-3 mb-2">
          {icon}
          <h1 className="text-2xl font-bold text-slate-700 ">{label}</h1>
        </div>
        <div>
            <h2 className="text-4xl font-bold text-slate-700 mt-2">{value}</h2>
        </div>
        <div className="flex flex-row items-center justify-between">
          <p className="text-slate-500 font-bold text-lg">{subLabel}</p>
          <div className="flex flex-col">
            <span className={`text-lg font-bold tracking-wider ${
                    index === 1 ? "text-red-500" : index === 2 ? "text-orange-500" : "text-blue-400"
                }`}>
                    {'+' + growth}
            </span>
            <span className="text-xs text-slate-400">
              dari minggu lalu
            </span>
          </div>
        </div>
    </div>
  );
}