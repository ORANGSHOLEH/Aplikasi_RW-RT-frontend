"use client";

import { useState, useEffect } from "react";  
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import Image from "next/image";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image: string;
  date: string;
}

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(false);

  // Data dummy berita
  const allNewsData: NewsItem[] = [
    {
      id: 1,
      title: "Pemerintah Luncurkan Program UMKM Go Digital",
      content:
        "Program ini bertujuan membantu pelaku UMKM masuk ke pasar online dengan dukungan pelatihan dan infrastruktur digital.",
      image: "/news1.jpg",
      date: "2025-08-10",
    },
    {
      id: 2,
      title: "Festival Kuliner Nusantara Kembali Digelar",
      content:
        "Acara tahunan ini menghadirkan beragam hidangan khas daerah dari seluruh Indonesia.",
      image: "/news2.jpg",
      date: "2025-08-09",
    },
    {
      id: 3,
      title: "Startup Lokal Raih Pendanaan Series A",
      content:
        "Startup teknologi pendidikan ini berhasil mendapatkan investasi untuk ekspansi ke pasar Asia Tenggara.",
      image: "/news3.jpg",
      date: "2025-08-08",
    },
    {
      id: 4,
      title: "Harga Beras Turun di Pasar Tradisional",
      content:
        "Harga beras di beberapa daerah mengalami penurunan setelah panen raya.",
      image: "/news4.jpg",
      date: "2025-08-07",
    },
    {
      id: 5,
      title: "Perkembangan AI di Indonesia Semakin Pesat",
      content:
        "Banyak perusahaan mulai mengadopsi teknologi kecerdasan buatan untuk meningkatkan efisiensi operasional.",
      image: "/news5.jpg",
      date: "2025-08-06",
    },
    {
      id: 6,
      title: "Konser Musik Amal untuk Korban Bencana",
      content:
        "Sejumlah musisi terkenal menggelar konser untuk menggalang dana bagi korban bencana alam.",
      image: "/news6.jpg",
      date: "2025-08-05",
    },
  ];

  const fetchNewsData = async (page: number) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allNewsData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(allNewsData.length / itemsPerPage);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchNewsData(pageNumber);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pageNumbers.push(i);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++)
          pageNumbers.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++)
          pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  useEffect(() => {
    fetchNewsData(currentPage);
  }, [currentPage]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="p-8 bg-gray-100">
          <h1 className="text-3xl text-black font-bold">Berita</h1>
          <p className="text-black">
            Temukan berita terbaru dan informasi terkini di sini.
          </p>
        </div>

        <div className="container mx-auto px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* News Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <span className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-2 py-8">
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

              {/* Info */}
              <div className="text-center text-gray-600 pb-8">
                Menampilkan {indexOfFirstItem + 1} sampai{" "}
                {Math.min(indexOfLastItem, allNewsData.length)} dari{" "}
                {allNewsData.length} berita
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
