        
       
import React from "react";
  import {
  BuildingStorefrontIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
    

  interface DashboardStats {
  totalUmkm: number;
  totalLoker: number;
  activeLoker: number;
  inactiveLoker: number;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
  onRefresh?: () => void;
  onTabChange?: (tab: string) => void;
}

export default function DashboardOverview({
  stats,
  onRefresh,
  onTabChange,
        
        }: DashboardOverviewProps) {
  return (
    <div className="px-4 sm:px-8 lg:px-16 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Statistik Dashboard</h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm flex items-center gap-2"
          >
            <ArrowRightCircleIcon className="h-5 w-5" />
            Refresh
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-indigo-50 p-6 rounded-lg shadow flex flex-col items-center hover:shadow-lg transition">
          <BuildingStorefrontIcon className="h-10 w-10 text-indigo-600 mb-2" />
          <span className="text-3xl font-bold text-indigo-700">{stats.totalUmkm}</span>
          <span className="mt-2 text-gray-700 font-medium">Total UMKM</span>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg shadow flex flex-col items-center hover:shadow-lg transition">
          <BriefcaseIcon className="h-10 w-10 text-green-600 mb-2" />
          <span className="text-3xl font-bold text-green-700">{stats.totalLoker}</span>
          <span className="mt-2 text-gray-700 font-medium">Total Loker</span>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow flex flex-col items-center hover:shadow-lg transition">
          <CheckCircleIcon className="h-10 w-10 text-blue-600 mb-2" />
          <span className="text-3xl font-bold text-blue-700">{stats.activeLoker}</span>
          <span className="mt-2 text-gray-700 font-medium">Loker Aktif</span>
        </div>
        <div className="bg-red-50 p-6 rounded-lg shadow flex flex-col items-center hover:shadow-lg transition">
          <XCircleIcon className="h-10 w-10 text-red-600 mb-2" />
          <span className="text-3xl font-bold text-red-700">{stats.inactiveLoker}</span>
          <span className="mt-2 text-gray-700 font-medium">Loker Tidak Aktif</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <button
          className="flex items-center justify-between bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-lg shadow transition group"
          onClick={() => onTabChange && onTabChange("umkm")}
        >
        
        <div className="flex items-center gap-3">
            <BuildingStorefrontIcon className="h-7 w-7 text-white" />
            <span className="font-semibold text-lg">Lihat Data UMKM</span>
          </div>
          <ArrowRightCircleIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition" />
        </button>
        <button
          className="flex items-center justify-between bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg shadow transition group"
          onClick={() => onTabChange && onTabChange("loker")}
        >
          <div className="flex items-center gap-3">
            <BriefcaseIcon className="h-7 w-7 text-white" />
            <span className="font-semibold text-lg">Lihat Data Loker</span>
          </div>
          <ArrowRightCircleIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition" />
        </button>
      </div>
    </div>
  );
}