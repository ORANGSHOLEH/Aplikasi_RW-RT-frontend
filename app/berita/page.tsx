"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import Image from "next/image";

// Interface untuk tipe data artikel berita
interface BeritaArtikel {
  id: number;
  title: string;
  description: string;
  image: string;
  author: string;
  views: number;
  date: string;
}

export default function BeritaPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Menampilkan 6 artikel per halaman
  const [loading, setLoading] = useState(false);

  // Data dummy - nanti akan diganti dengan API call yang sesungguhnya
  const allBeritaData: BeritaArtikel[] = [
    {
      id: 1,
      title: "Penyaluran BLT Dana Desa 2025",
      description:
        "Desa Ciwaruga, yang berada di Kecamatan Parongpong, Kabupaten Bandung Barat, merupakan desa yang aktif dalam menjalanka...",
      image: "/berita1.jpeg", // Pastikan gambar ini ada di folder public
      author: "Administrator",
      views: 76,
      date: "02 Jul 2025",
    },
    {
      id: 2,
      title: "PERINGATAN 1 MUHARAM 1447H DESA CIWARUGA",
      description:
        "Desa Ciwaruga, yang terletak di Kecamatan Parongpong, Kabupaten Bandung Barat, merupakan salah satu desa yang memiliki...",
      image: "/berita2.jpeg", // Pastikan gambar ini ada di folder public
      author: "Administrator",
      views: 36,
      date: "02 Jul 2025",
    },
    {
      id: 3,
      title: "Pengecoran Jalan Kabupaten",
      description:
        "Pada hari Rabu, tanggal 18 Juni 2025, Pemerintah Desa Ciwaruga bersama tim pelaksana dari Pemerintah Kabupaten Bandung...",
      image: "/berita3.jpeg", // Pastikan gambar ini ada di folder public
      author: "Administrator",
      views: 43,
      date: "20 Jun 2025",
    },
    {
      id: 4,
      title: "Peninjauan Langsung oleh Dewan Komisi 3 DPRD Kabupaten Bandung Barat",
      description:
        "Desa Ciwaruga, Komisi 3 DPRD Kabupaten Bandung Barat melakukan kunjungan langsung untuk meninjau progres perbaikan jalan...",
      image: "/berita4.jpeg", // Pastikan gambar ini ada di folder public
      author: "Administrator",
      views: 55,
      date: "12 Jun 2025",
    },
    {
      id: 5,
      title: "Pembinaan RT, RW, dan Linmas Desa Ciwaruga",
      description:
        "Pemerintah Kecamatan Parongpong menggelar kegiatan pembinaan bagi para Ketua RT, RW, dan anggota Linmas di Desa Ciwaruga. Kegiatan...",
      image: "/berita5.jpeg", // Pastikan gambar ini ada di folder public
      author: "Administrator",
      views: 46,
      date: "12 Jun 2025",
    },
    {
      id: 6,
      title: "Pertanian Melon Hydroponic Desa Ciwaruga",
      description:
        "Di Desa Ciwaruga, lahan tidak produktif yang sebelumnya terbengkalai kini disulap menjadi kebun melon organik yang subur dan bernilai...",
      image: "/berita6.jpeg", // Pastikan gambar ini ada di folder public
      author: "Administrator",
      views: 120,
      date: "28 May 2025",
    },
    {
      id: 7,
      title: "Lomba Kebersihan Lingkungan",
      description:
        "Dalam rangka memperingati Hari Lingkungan Hidup, Desa Ciwaruga mengadakan lomba kebersihan antar RT...",
      image: "/berita7.jpeg", // Pastikan gambar ini ada di folder public
      author: "Administrator",
      views: 99,
      date: "15 May 2025",
    },
    {
      id: 8,
      title: "Pembangunan Posyandu Terpadu",
      description:
        "Pemerintah Desa memulai pembangunan Posyandu Terpadu untuk meningkatkan layanan kesehatan ibu dan anak...",
      image: "/berita8.jpeg", // Pastikan gambar ini ada di folder public
      author: "Administrator",
      views: 85,
      date: "10 May 2025",
    },
  ];

  // Simulasi API call
  const fetchBeritaData = async (page: number) => {
    setLoading(true);
    // Simulasi penundaan
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
  };

  // Menghitung data untuk halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allBeritaData.slice(indexOfFirstItem, indexOfLastItem);

  // Menghitung total halaman
  const totalPages = Math.ceil(allBeritaData.length / itemsPerPage);

  // Fungsi untuk pindah halaman
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

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
    fetchBeritaData(currentPage);
  }, [currentPage]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="p-8 bg-white">
          <h1 className="text-3xl text-blue-600 font-bold">Berita Desa</h1>
          <p className="text-gray-600 mt-2">
            Menyajikan informasi terbaru tentang peristiwa, berita terkini, dan
            artikel-artikel jurnalistik dari Desa Ciwaruga
          </p>
        </div>

        <div className="container mx-auto px-8 py-8">
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Berita Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                      <span className="absolute bottom-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
                        {item.date}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                      <div className="flex items-center text-gray-500 text-xs mt-4 space-x-4">
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {item.author}
                        </span>
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Dilihat {item.views} kali
                        </span>
                      </div>
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
                  &lt;
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
                  &gt;
                </button>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}