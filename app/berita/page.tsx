"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import Image from "next/image";

interface BeritaArtikel {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  author: string;
  views: number;
  date: string;
}

export default function BeritaPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(false);

  const allBeritaData: BeritaArtikel[] = [
    {
      id: 1,
      category: "Pemerintahan",
      title: "Penyaluran BLT Dana Desa 2025",
      description:
        "Desa Ciwaruga aktif dalam menjalankan program BLT Dana Desa...",
      image: "/berita1.jpeg",
      author: "Administrator",
      views: 76,
      date: "02 Jul 2025",
    },
    {
      id: 2,
      category: "Kegiatan Desa",
      title: "PERINGATAN 1 MUHARAM 1447H DESA CIWARUGA",
      description: "Kegiatan peringatan Tahun Baru Islam di Desa Ciwaruga...",
      image: "/berita2.jpeg",
      author: "Administrator",
      views: 36,
      date: "02 Jul 2025",
    },
    {
      id: 3,
      category: "Infrastruktur",
      title: "Pengecoran Jalan Kabupaten",
      description:
        "Pemerintah Desa bersama Kabupaten Bandung Barat melaksanakan...",
      image: "/berita3.jpeg",
      author: "Administrator",
      views: 43,
      date: "20 Jun 2025",
    },
    {
      id: 4,
      category: "Kunjungan Kerja",
      title: "Peninjauan Langsung oleh Dewan Komisi 3",
      description:
        "Komisi 3 DPRD Kabupaten Bandung Barat meninjau progres perbaikan...",
      image: "/berita4.jpeg",
      author: "Administrator",
      views: 55,
      date: "12 Jun 2025",
    },
    {
      id: 5,
      category: "Pembinaan",
      title: "Pembinaan RT, RW, dan Linmas",
      description:
        "Pembinaan bagi Ketua RT, RW, dan Linmas di Desa Ciwaruga...",
      image: "/berita5.jpeg",
      author: "Administrator",
      views: 46,
      date: "12 Jun 2025",
    },
    {
      id: 6,
      category: "Pertanian",
      title: "Pertanian Melon Hydroponic",
      description: "Lahan tak produktif disulap jadi kebun melon organik...",
      image: "/berita6.jpeg",
      author: "Administrator",
      views: 120,
      date: "28 May 2025",
    },
  ];

  const fetchBeritaData = async (page: number) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLoading(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allBeritaData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(allBeritaData.length / itemsPerPage);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchBeritaData(currentPage);
  }, [currentPage]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 ">
        {/* Section Header */}
        <div className="container mx-auto px-6 py-10 text-center pt-30">
          <h2 className="text-sm uppercase font-semibold text-emerald-500">
            Ciwaruga News
          </h2>
          <h1 className="text-3xl md:text-4xl font-bold text-[#004B50] mt-2">
            Berita <span className="text-emerald-500">Terbaru</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Informasi terbaru seputar Desa Ciwaruga
          </p>
        </div>

        {/* Grid Berita */}
        <div className="container mx-auto px-6 pb-12 pt-25 pb-25">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-[#004B50] rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={250}
                    className="object-cover w-full h-48"
                  />
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                        {item.category}
                      </span>
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#004B50] mb-2 hover:text-emerald-600 cursor-pointer">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {item.description}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500 border-t pt-3">
                      <span>✍ {item.author}</span>
                      <span>👁 {item.views}x</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400"
                  : "bg-white border hover:bg-gray-100"
              }`}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => goToPage(num)}
                className={`px-3 py-2 rounded ${
                  currentPage === num
                    ? "bg-[#004B50] text-white"
                    : "bg-white border hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400"
                  : "bg-white border hover:bg-gray-100"
              }`}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
