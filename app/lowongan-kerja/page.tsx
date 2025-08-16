"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import FirebaseFilterOptions from "../components/layout/FirebaseFilterOptions";
import Image from "next/image";

interface LokerItem {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  salary: string;
  contact: string;
  location: string;
  is_active: boolean;
  image?: string;
  created_at?: string;
  updated_at?: string;
  original_data?: {
    waktu_kerja?: string;
    tempat_kerja?: string;
  };
}

export default function LokerPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allLokerData, setAllLokerData] = useState<LokerItem[]>([]); // All data for filters
  const [filteredData, setFilteredData] = useState<LokerItem[]>([]); // Filtered data
  const [displayData, setDisplayData] = useState<LokerItem[]>([]); // Paginated data
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(9);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    waktu_kerja: "",
    tempat_kerja: "",
    salary_range: "",
    location: "",
    company: "",
  });

  // Fetch all data from Firebase once
  const fetchAllLokerData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Fetching all loker data from Firebase...");

      const q = query(collection(db, "loker"), where("is_active", "==", true));

      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as LokerItem;
      });

      // Sort by created_at desc
      results.sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB.getTime() - dateA.getTime();
      });

      setAllLokerData(results);
      setFilteredData(results);
      console.log("✅ Fetched loker data:", results.length, "items");
    } catch (error) {
      console.error("❌ Error fetching loker data:", error);
      setError("Gagal mengambil data loker. Silakan coba lagi.");
      setAllLokerData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to data
  const applyFilters = (newFilters: any) => {
    let results = [...allLokerData];

    // Search filter
    if (newFilters.search) {
      const searchTerm = newFilters.search.toLowerCase();
      results = results.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm) ||
          item.company?.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm) ||
          item.requirements?.toLowerCase().includes(searchTerm)
      );
    }

    // Waktu kerja filter
    if (newFilters.waktu_kerja) {
      results = results.filter(
        (item) => item.original_data?.waktu_kerja === newFilters.waktu_kerja
      );
    }

    // Tempat kerja filter
    if (newFilters.tempat_kerja) {
      results = results.filter(
        (item) => item.original_data?.tempat_kerja === newFilters.tempat_kerja
      );
    }

    // Location filter
    if (newFilters.location) {
      results = results.filter((item) =>
        item.location?.toLowerCase().includes(newFilters.location.toLowerCase())
      );
    }

    // Company filter
    if (newFilters.company) {
      results = results.filter((item) => item.company === newFilters.company);
    }

    // Salary range filter
    if (newFilters.salary_range) {
      results = results.filter((item) => {
        const salaryStr = item.salary || "";
        const numbers = salaryStr.match(/[\d,]+/g);
        if (!numbers) return false;

        const salary = parseInt(numbers[0].replace(/,/g, ""));
        const range = newFilters.salary_range;

        if (range.max === null) {
          return salary >= range.min;
        }
        return salary >= range.min && salary <= range.max;
      });
    }

    setFilteredData(results);
    setTotalItems(results.length);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle filter change
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Apply pagination to filtered data
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = filteredData.slice(startIndex, endIndex);
    setDisplayData(paginatedResults);
  }, [currentPage, filteredData, itemsPerPage]);

  // Pagination functions
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Fetch data on mount
  useEffect(() => {
    fetchAllLokerData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-2">💼 Lowongan Kerja</h1>
            <p className="text-xl opacity-90">
              Temukan peluang karir terbaik di RW 16 Desa Ciwaruga
            </p>
            <div className="mt-4 text-lg">
              {loading ? (
                <span>Memuat data...</span>
              ) : (
                <span>{totalItems} lowongan tersedia</span>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-8 py-8">
          {/* Filter Options */}
          <FirebaseFilterOptions
            onFilterChange={handleFilterChange}
            currentFilters={filters}
            allData={allLokerData}
          />

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button
                onClick={fetchAllLokerData}
                className="ml-4 underline hover:no-underline"
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Memuat lowongan kerja...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              {totalItems > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">
                      Menampilkan{" "}
                      <span className="font-semibold">{indexOfFirstItem}</span>{" "}
                      -<span className="font-semibold">{indexOfLastItem}</span>{" "}
                      dari
                      <span className="font-semibold"> {totalItems}</span>{" "}
                      lowongan
                    </p>
                    <div className="text-sm text-gray-500">
                      Halaman {currentPage} dari {totalPages}
                    </div>
                  </div>
                </div>
              )}

              {/* Loker Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative">
                      <Image
                        src={
                          item.image ||
                          "https://placehold.co/600x400/1f2937/white?text=Lowongan+Kerja"
                        }
                        alt={item.company || "Company"}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/600x400/1f2937/white?text=Error";
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-green-500 text-white px-2 py-1 text-xs rounded-full">
                          Aktif
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <h4 className="text-lg font-semibold text-blue-600 mb-3">
                        {item.company}
                      </h4>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="w-16 font-medium">💰 Gaji:</span>
                          <span className="text-green-600 font-semibold">
                            {item.salary}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className="w-16 font-medium">📍 Lokasi:</span>
                          <span>{item.location}</span>
                        </div>

                        {item.original_data?.waktu_kerja && (
                          <div className="flex items-center">
                            <span className="w-16 font-medium">⏰ Waktu:</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {item.original_data.waktu_kerja}
                            </span>
                          </div>
                        )}

                        {item.original_data?.tempat_kerja && (
                          <div className="flex items-center">
                            <span className="w-16 font-medium">🏢 Tempat:</span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                              {item.original_data.tempat_kerja}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-700 mb-3">
                          <span className="font-medium">Syarat:</span>{" "}
                          {item.requirements}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            📞 {item.contact}
                          </div>
                          <a
                            href={`https://wa.me/${item.contact.replace(
                              /\D/g,
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            💬 Hubungi
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Data State */}
              {!loading && displayData.length === 0 && !error && (
                <div className="text-center py-20">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Tidak ada lowongan ditemukan
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Coba ubah filter atau kata kunci pencarian Anda
                  </p>
                  <button
                    onClick={() =>
                      handleFilterChange({
                        search: "",
                        waktu_kerja: "",
                        tempat_kerja: "",
                        salary_range: "",
                        location: "",
                        company: "",
                      })
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 py-8">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    ⏮ Prev
                  </button>

                  {getPageNumbers().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === pageNumber
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    Next ⏭
                  </button>
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
