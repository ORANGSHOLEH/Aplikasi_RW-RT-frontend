"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { umkmService } from "../lib/services/umkmService";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface UMKM {
  id?: string;
  name: string;
  description: string;
  image?: string;
  contact: string;
  address: string;
  created_at?: string;
  updated_at?: string;
  laravel_id?: number;
}

export default function UMKMPage() {
  const [umkmList, setUmkmList] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUMKM();
  }, []);

  const fetchUMKM = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await umkmService.getAll();
      if (result.success && result.data) {
        setUmkmList(result.data);
      } else {
        setError(result.error || "Failed to fetch UMKM data");
        setUmkmList([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setUmkmList([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUMKM = umkmList.filter(
    (umkm) =>
      umkm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      umkm.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data UMKM...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Terjadi Kesalahan
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchUMKM}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="py-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h2 className="text-sm uppercase font-semibold text-emerald-100 mb-2">
                Ciwaruga Business
              </h2>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">UMKM</h1>
              <h2 className="text-2xl lg:text-3xl font-medium text-gray-100 mb-4">
                RW 16 DESA CIWARUGA
              </h2>
              <p className="text-gray-100 max-w-2xl mx-auto">
                Dukung ekonomi lokal dengan berbelanja di UMKM sekitar kita
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari UMKM..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {filteredUMKM.length} UMKM ditemukan
              </div>
            </div>
          </div>
        </section>

        {/* UMKM Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {filteredUMKM.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredUMKM.map((umkm) => (
                  <div
                    key={umkm.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative h-48">
                      <Image
                        src={umkm.image || "/placeholder-umkm.jpg"}
                        alt={umkm.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          UMKM
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {umkm.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {umkm.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 mt-1 mr-2 text-emerald-500 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{umkm.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span>{umkm.contact}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`tel:${umkm.contact}`}
                          className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-emerald-600 transition-colors"
                        >
                          Hubungi
                        </a>
                        <a
                          href={`https://wa.me/${umkm.contact.replace(
                            /[^0-9]/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-green-600 transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tidak ada UMKM ditemukan
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? `Tidak ada hasil untuk "${searchTerm}"`
                    : "Data UMKM belum tersedia"}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
