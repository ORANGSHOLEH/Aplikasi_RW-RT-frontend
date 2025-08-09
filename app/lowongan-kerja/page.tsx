"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import Image from "next/image";
import FilterLoker from "../components/layout/FilterOptions";

interface LokerItem {
  id: number;
  url_gambar: string;
  nama_perusahaan: string;
  alamat_perusahaan: string;
  kontak: string;
  posisi: string;
  gaji: string;
  syarat: string;
  waktu_kerja: string;
  tempat_kerja: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    current_page: number;
    data: LokerItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  message: string;
}

export default function LokerPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lokerData, setLokerData] = useState<LokerItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    waktu_kerja: "",
    tempat_kerja: "",
    syarat: "",
    gaji_min: "",
    gaji_max: "",
    per_page: 10,
  });

  // Fungsi untuk mengambil data dari API dengan filter
  const fetchLokerData = async (page: number, currentFilters = filters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...Object.fromEntries(
          Object.entries(currentFilters).filter(
            ([_, value]) => value !== "" && value !== null
          )
        ),
      });

      const response = await fetch(`http://localhost:8000/api/loker?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        setLokerData(result.data.data);
        setCurrentPage(result.data.current_page);
        setTotalPages(result.data.last_page);
        setTotalItems(result.data.total);
        setItemsPerPage(result.data.per_page);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching loker data:", error);
      setError("Gagal mengambil data loker. Silakan coba lagi.");
      setLokerData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
    fetchLokerData(1, newFilters);
  };

  // Fungsi untuk pindah halaman
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      fetchLokerData(pageNumber);
    }
  };

  // Fungsi untuk halaman sebelumnya
  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Fungsi untuk halaman selanjutnya
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate nomor halaman untuk pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  };

  // Menghitung indeks untuk pagination info
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  useEffect(() => {
    fetchLokerData(1);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="p-8 bg-gray-100">
          <h1 className="text-3xl text-black font-bold">Lowongan Kerja</h1>
          <p className="text-black">
            Temukan peluang karir terbaik di berbagai perusahaan ternama.
          </p>
        </div>

        <div className="container mx-auto px-8">
          {/* Filter Component */}
          <FilterLoker
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button
                onClick={() => fetchLokerData(currentPage)}
                className="ml-4 underline hover:no-underline"
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* Loker Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {lokerData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Image
                      src={item.url_gambar}
                      alt={item.nama_perusahaan}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {item.posisi}
                      </h3>
                      <h4 className="text-lg font-medium text-blue-600 mb-2">
                        {item.nama_perusahaan}
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <span className="font-medium">Gaji:</span> {item.gaji}
                        </p>
                        <p>
                          <span className="font-medium">Waktu:</span>{" "}
                          {item.waktu_kerja}
                        </p>
                        <p>
                          <span className="font-medium">Tempat:</span>{" "}
                          {item.tempat_kerja}
                        </p>
                        <p>
                          <span className="font-medium">Alamat:</span>{" "}
                          {item.alamat_perusahaan}
                        </p>
                        <p>
                          <span className="font-medium">Kontak:</span>{" "}
                          {item.kontak}
                        </p>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Syarat:</span>{" "}
                          {item.syarat}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Data State */}
              {!loading && lokerData.length === 0 && !error && (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">
                    Tidak ada data lowongan kerja.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 py-8">
                  {/* Previous Button */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    ⏮
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === pageNumber
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    ⏭
                  </button>
                </div>
              )}

              {/* Pagination Info */}
              {totalItems > 0 && (
                <div className="text-center text-gray-600 pb-8">
                  Menampilkan {indexOfFirstItem} sampai {indexOfLastItem} dari{" "}
                  {totalItems} hasil
                </div>
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
