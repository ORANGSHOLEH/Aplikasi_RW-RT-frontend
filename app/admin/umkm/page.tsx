"use client";

import { useState, useEffect, Suspense } from "react"; // Add Suspense
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

interface UMKMData {
  id: string;
  name: string;
  description: string;
  image?: string;
  contact: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}

// 👈 CREATE SEPARATE COMPONENT FOR SEARCH PARAMS
function UMKMContent() {
  const [user, setUser] = useState<any>(null);
  const [umkmData, setUmkmData] = useState<UMKMData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams(); // Now inside Suspense

  const handleDeleteFromEdit = async (id: string) => {
    try {
      const umkm = umkmData.find((item) => item.id === id);
      if (!umkm) return;

      const confirmed = confirm(
        `Apakah Anda yakin ingin menghapus UMKM "${umkm.name}"?`
      );
      if (!confirmed) {
        router.replace("/admin/umkm");
        return;
      }

      await deleteDoc(doc(db, "umkm", id));
      await fetchUmkmData();
      alert("UMKM berhasil dihapus!");
      router.replace("/admin/umkm");
    } catch (error) {
      console.error("Error deleting UMKM:", error);
      setError("Failed to delete UMKM");
      router.replace("/admin/umkm");
    }
  };

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Handle delete from edit page
  useEffect(() => {
    if (user) {
      const deleteId = searchParams.get("delete");
      if (deleteId) {
        handleDeleteFromEdit(deleteId);
      }
    }
  }, [user, searchParams]);

  // Fetch UMKM data
  useEffect(() => {
    if (user) {
      fetchUmkmData();
    }
  }, [user]);

  const fetchUmkmData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "umkm"));
      const umkmList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UMKMData[];
      setUmkmData(umkmList);
    } catch (error) {
      console.error("Error fetching UMKM:", error);
      setError("Failed to fetch UMKM data");
    } finally {
      setLoading(false);
    }
  };

  const deleteUmkm = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus UMKM "${name}"?`)) return;

    try {
      await deleteDoc(doc(db, "umkm", id));
      await fetchUmkmData();
      alert("UMKM berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting UMKM:", error);
      setError("Failed to delete UMKM");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kelola UMKM</h1>
              <p className="text-gray-600">
                Manage data UMKM RW 16 Desa Ciwaruga
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                ← Kembali ke Dashboard
              </button>
              <button
                onClick={() => router.push("/admin/umkm/create")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                + Tambah UMKM
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-2 text-sm underline text-red-600"
            >
              Tutup
            </button>
          </div>
        )}

        {/* UMKM List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Data UMKM ({umkmData.length})
              </h3>
              <button
                onClick={fetchUmkmData}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : umkmData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gambar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama UMKM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alamat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {umkmData.map((umkm) => (
                    <tr key={umkm.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                          <Image
                            src={umkm.image || "https://placehold.co/600x400"}
                            alt={umkm.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {umkm.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {umkm.description?.length > 100
                            ? `${umkm.description.substring(0, 100)}...`
                            : umkm.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {umkm.contact}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {umkm.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/umkm/edit?id=${umkm.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => deleteUmkm(umkm.id, umkm.name)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🏪</div>
              <p className="text-gray-500 mb-4">Belum ada data UMKM</p>
              <button
                onClick={() => router.push("/admin/umkm/create")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Tambah UMKM Pertama
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 👈 LOADING COMPONENT
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// 👈 MAIN COMPONENT WITH SUSPENSE
export default function UMKMManagementPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UMKMContent />
    </Suspense>
  );
}
