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
}

export default function UMKMPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(false);

  // Data dummy - nanti akan diganti dengan API call
  const allUMKMData: UMKMItem[] = [
    {
      id: 1,
      name: "Toko Sembako Barokah",
      description:
        "Menyediakan kebutuhan sembako sehari-hari dengan harga terjangkau dan kualitas terbaik.",
      image: "/umkm1.jpeg",
    },
    {
      id: 2,
      name: "Warung Makan Sederhana",
      description:
        "Hidangan rumahan yang lezat dengan cita rasa autentik dan harga ramah di kantong.",
      image: "/umkm1.jpeg",
    },
    {
      id: 3,
      name: "Laundry Express",
      description:
        "Jasa laundry kiloan dengan pelayanan cepat dan bersih untuk kebutuhan cucian Anda.",
      image: "/umkm1.jpeg",
    },
    {
      id: 4,
      name: "Toko Kue Manis",
      description:
        "Aneka kue basah dan kering dengan resep tradisional yang telah teruji lezat.",
      image: "/umkm1.jpeg",
    },
    {
      id: 5,
      name: "Bengkel Motor Jaya",
      description:
        "Servis motor profesional dengan teknisi berpengalaman dan spare part original.",
      image: "/umkm1.jpeg",
    },
    {
      id: 6,
      name: "Toko Baju Fashion",
      description:
        "Koleksi pakaian trendy dan berkualitas untuk pria dan wanita dengan harga terjangkau.",
      image: "/umkm1.jpeg",
    },
    {
      id: 7,
      name: "Salon Kecantikan Elok",
      description:
        "Layanan perawatan kecantikan lengkap dengan peralatan modern dan terapis profesional.",
      image: "/umkm1.jpeg",
    },
    {
      id: 8,
      name: "Toko Elektronik Murah",
      description:
        "Penjualan peralatan elektronik dengan harga kompetitif dan garansi resmi.",
      image: "/umkm1.jpeg",
    },
    {
      id: 9,
      name: "Kedai Kopi Hangat",
      description:
        "Menyajikan kopi premium dengan suasana hangat dan nyaman untuk bersantai.",
      image: "/umkm1.jpeg",
    },
    {
      id: 10,
      name: "Toko Buku Pintar",
      description:
        "Koleksi buku lengkap mulai dari buku pelajaran hingga novel terbaru.",
      image: "/umkm1.jpeg",
    },
    {
      id: 11,
      name: "Apotek Sehat",
      description:
        "Apotek lengkap dengan obat-obatan dan vitamin untuk kesehatan keluarga.",
      image: "/umkm1.jpeg",
    },
    {
      id: 12,
      name: "Toko Sepatu Berkualitas",
      description:
        "Koleksi sepatu untuk segala usia dengan model terkini dan harga terjangkau.",
      image: "/umkm1.jpeg",
    },
  ];

  // Fungsi untuk mengambil data - nanti akan diganti dengan API call
  const fetchUMKMData = async (page: number) => {
    setLoading(true);
    // Simulasi loading
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
  };

  // Menghitung data untuk halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allUMKMData.slice(indexOfFirstItem, indexOfLastItem);

  // Menghitung total halaman
  const totalPages = Math.ceil(allUMKMData.length / itemsPerPage);

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
  }, [currentPage]);

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
                {currentItems.map((item) => (
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
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
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
                {Math.min(indexOfLastItem, allUMKMData.length)} dari{" "}
                {allUMKMData.length} hasil
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
