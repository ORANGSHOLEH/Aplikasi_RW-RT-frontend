"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import Image from "next/image";

interface UMKMItem {
  id: number;
  name: string;
  description: string;
  image: string;
  contact: string;
  address: string;
}

export default function UMKMPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(false);
  const [allUMKMData, setAllUMKMData] = useState<UMKMItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fungsi untuk mengambil data dari API
  const fetchUMKMData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/umkm?page=${page}&per_page=${itemsPerPage}`
      );
      const data = await response.json();
      
      setAllUMKMData(data.data);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Error fetching UMKM data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Menghitung data untuk halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Fungsi untuk pindah halaman
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchUMKMData(pageNumber);
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

  useEffect(() => {
    fetchUMKMData(currentPage);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="p-8 bg-gray-100">
          <h1 className="text-3xl text-black font-bold">UMKM</h1>
          <p className="text-black">
            Welcome to the UMKM application. Here you can manage your UMKM data.
          </p>
        </div>

        <div className="container mx-auto px-8">
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* UMKM Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {allUMKMData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        <strong>Contact:</strong> {item.contact}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>Address:</strong> {item.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <>
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

                  {/* Pagination Info */}
                  <div className="text-center text-gray-600 pb-8">
                    Menampilkan {indexOfFirstItem + 1} sampai{" "}
                    {Math.min(indexOfLastItem, totalItems)} dari{" "}
                    {totalItems} hasil
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}