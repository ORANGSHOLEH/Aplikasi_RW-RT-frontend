"use client";

import { useState, useEffect } from "react";

interface FilterProps {
  onFilterChange: (filters: any) => void;
  currentFilters: any;
  allData: any[]; // Pass all loker data untuk extract unique values
}

export default function FirebaseFilterOptions({
  onFilterChange,
  currentFilters,
  allData,
}: FilterProps) {
  const [localFilters, setLocalFilters] = useState({
    search: "",
    waktu_kerja: "",
    tempat_kerja: "",
    salary_range: "" as
      | string
      | { label: string; min: number; max: number | null },
    location: "",
    company: "",
  });

  // Extract unique values dari data Firebase
  const getUniqueValues = (field: string) => {
    const values = allData
      .map((item) => {
        if (field === "waktu_kerja" || field === "tempat_kerja") {
          return item.original_data?.[field];
        }
        return item[field];
      })
      .filter(Boolean)
      .filter((value, index, arr) => arr.indexOf(value) === index)
      .sort();

    return values;
  };

  const uniqueWaktuKerja = getUniqueValues("waktu_kerja");
  const uniqueTempatKerja = getUniqueValues("tempat_kerja");
  const uniqueLocations = getUniqueValues("location");
  const uniqueCompanies = getUniqueValues("company");

  // Gaji ranges based on common Indonesian salary ranges
  const salaryRanges = [
    { label: "< 3 Juta", min: 0, max: 3000000 },
    { label: "3-5 Juta", min: 3000000, max: 5000000 },
    { label: "5-8 Juta", min: 5000000, max: 8000000 },
    { label: "8-12 Juta", min: 8000000, max: 12000000 },
    { label: "> 12 Juta", min: 12000000, max: null },
  ];

  useEffect(() => {
    setLocalFilters((prev) => ({ ...prev, ...currentFilters }));
  }, [currentFilters]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      waktu_kerja: "",
      tempat_kerja: "",
      salary_range: "",
      location: "",
      company: "",
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Helper function to extract numbers from salary string
  const extractSalaryNumber = (salaryStr: string) => {
    const numbers = salaryStr.match(/[\d,]+/g);
    if (!numbers) return 0;
    return parseInt(numbers[0].replace(/,/g, ""));
  };

  const isInSalaryRange = (salaryStr: string, range: any) => {
    const salary = extractSalaryNumber(salaryStr);
    if (range.max === null) {
      return salary >= range.min;
    }
    return salary >= range.min && salary <= range.max;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Filter Lowongan
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Cari Posisi/Perusahaan
          </label>
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Ketik untuk mencari..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Waktu Kerja */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⏰ Waktu Kerja
          </label>
          <select
            value={localFilters.waktu_kerja}
            onChange={(e) => handleFilterChange("waktu_kerja", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="">Semua Waktu</option>
            {uniqueWaktuKerja.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Tempat Kerja */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏢 Tempat Kerja
          </label>
          <select
            value={localFilters.tempat_kerja}
            onChange={(e) => handleFilterChange("tempat_kerja", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="">Semua Tempat</option>
            {uniqueTempatKerja.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Lokasi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📍 Lokasi
          </label>
          <select
            value={localFilters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="">Semua Lokasi</option>
            {uniqueLocations.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Perusahaan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏭 Perusahaan
          </label>
          <select
            value={localFilters.company}
            onChange={(e) => handleFilterChange("company", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="">Semua Perusahaan</option>
            {uniqueCompanies.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Salary Range Buttons */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          💰 Rentang Gaji
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange("salary_range", "")}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              !localFilters.salary_range
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Semua Gaji
          </button>
          {salaryRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => handleFilterChange("salary_range", range)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                typeof localFilters.salary_range === "object" &&
                localFilters.salary_range?.label === range.label
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {Object.values(localFilters).some((v) => v) && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-800">
              <span className="font-medium">Filter aktif:</span>
              {localFilters.search && (
                <span className="ml-2 bg-blue-200 px-2 py-1 rounded text-xs">
                  Search: {localFilters.search}
                </span>
              )}
              {localFilters.waktu_kerja && (
                <span className="ml-2 bg-blue-200 px-2 py-1 rounded text-xs">
                  Waktu: {localFilters.waktu_kerja}
                </span>
              )}
              {localFilters.tempat_kerja && (
                <span className="ml-2 bg-blue-200 px-2 py-1 rounded text-xs">
                  Tempat: {localFilters.tempat_kerja}
                </span>
              )}
              {localFilters.salary_range && (
                <span className="ml-2 bg-blue-200 px-2 py-1 rounded text-xs">
                  Gaji:{" "}
                  {typeof localFilters.salary_range === "object"
                    ? localFilters.salary_range.label
                    : localFilters.salary_range}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ✕ Hapus Semua
            </button>
          </div>
        </div>
      )}

      {/* Clear All Button */}
      <div className="mt-4 pt-4 border-t">
        <button
          onClick={clearFilters}
          className="w-full md:w-auto px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          🔄 Reset Filter
        </button>
      </div>
    </div>
  );
}
