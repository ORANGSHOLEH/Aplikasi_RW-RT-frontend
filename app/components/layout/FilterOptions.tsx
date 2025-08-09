import { useState, useEffect } from "react";

interface FilterOptions {
  waktu_kerja: string[];
  tempat_kerja: string[];
  per_page_options: number[];
  gaji_ranges: Array<{
    label: string;
    min: number;
    max: number | null;
  }>;
}

interface FilterProps {
  onFilterChange: (filters: any) => void;
  currentFilters: any;
}

export default function FilterLoker({
  onFilterChange,
  currentFilters,
}: FilterProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [localFilters, setLocalFilters] = useState({
    search: "",
    waktu_kerja: "",
    tempat_kerja: "",
    syarat: "",
    gaji_min: "",
    gaji_max: "",
    per_page: 10,
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    setLocalFilters((prev) => ({ ...prev, ...currentFilters }));
  }, [currentFilters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/loker-filter-options"
      );
      const result = await response.json();
      if (result.success) {
        setFilterOptions(result.data);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

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
      syarat: "",
      gaji_min: "",
      gaji_max: "",
      per_page: 10,
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  if (!filterOptions)
    return <div className="text-black">Loading filters...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Cari Perusahaan/Posisi
          </label>
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Masukkan nama perusahaan atau posisi..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Waktu Kerja */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Waktu Kerja
          </label>
          <select
            value={localFilters.waktu_kerja}
            onChange={(e) => handleFilterChange("waktu_kerja", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="">Semua</option>
            {filterOptions.waktu_kerja.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Tempat Kerja */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Tempat Kerja
          </label>
          <select
            value={localFilters.tempat_kerja}
            onChange={(e) => handleFilterChange("tempat_kerja", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="">Semua</option>
            {filterOptions.tempat_kerja.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Items per page */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Items per halaman
          </label>
          <select
            value={localFilters.per_page}
            onChange={(e) =>
              handleFilterChange("per_page", parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            {filterOptions.per_page_options.map((option) => (
              <option key={option} value={option}>
                {option} items
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gaji Range */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-black mb-2">
          Rentang Gaji
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {filterOptions.gaji_ranges.map((range, index) => (
            <button
              key={index}
              onClick={() => {
                handleFilterChange("gaji_min", range.min);
                handleFilterChange("gaji_max", range.max);
              }}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                localFilters.gaji_min == range.min &&
                localFilters.gaji_max == range.max
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-black border-gray-300 hover:bg-gray-50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Syarat */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-black mb-2">
          Cari dalam Syarat
        </label>
        <input
          type="text"
          value={localFilters.syarat}
          onChange={(e) => handleFilterChange("syarat", e.target.value)}
          placeholder="Contoh: S1, React, Laravel..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>

      {/* Clear Filters */}
      <div className="mt-4">
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
