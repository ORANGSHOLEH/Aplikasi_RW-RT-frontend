"use client";

import { useState, useEffect, Suspense } from "react";
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
import { importDataToFirebase } from "../../lib/importData";
import Image from "next/image";
import Link from "next/link";

interface LokerData {
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
}

// 👈 MOVE COMPONENT CONTENT TO SEPARATE FUNCTION
function LokerContent() {
  const [user, setUser] = useState<any>(null);
  const [lokerData, setLokerData] = useState<LokerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams(); // Now inside Suspense
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

  // Fetch Loker data
  useEffect(() => {
    if (user) {
      fetchLokerData();
    }
  }, [user]);

  // Handle delete from edit page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const deleteId = urlParams.get("delete");

    if (deleteId && user) {
      handleDeleteFromEdit(deleteId);
    }
  }, [user]);

  // Also add debug console logs in fetchLokerData:
  const fetchLokerData = async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching loker data...");
      const querySnapshot = await getDocs(collection(db, "loker"));

      console.log("📊 Query snapshot size:", querySnapshot.size);
      console.log("📋 Raw docs:", querySnapshot.docs);

      const lokerList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("📄 Doc data:", doc.id, data);
        return {
          id: doc.id,
          ...data,
        };
      }) as LokerData[];

      console.log("✅ Final loker list:", lokerList);
      setLokerData(lokerList);
    } catch (error) {
      console.error("❌ Error fetching Loker:", error);
      setError("Failed to fetch Loker data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFromEdit = async (id: string) => {
    try {
      const loker = lokerData.find((item) => item.id === id);
      if (!loker) return;

      const confirmed = confirm(
        `Apakah Anda yakin ingin menghapus lowongan "${loker.title}"?`
      );
      if (!confirmed) {
        router.replace("/admin/loker");
        return;
      }

      await deleteDoc(doc(db, "loker", id));
      await fetchLokerData();
      alert("Lowongan berhasil dihapus!");

      router.replace("/admin/loker");
    } catch (error) {
      console.error("Error deleting Loker:", error);
      setError("Failed to delete Loker");
      router.replace("/admin/loker");
    }
  };

  const deleteLoker = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus lowongan "${title}"?`))
      return;

    try {
      await deleteDoc(doc(db, "loker", id));
      await fetchLokerData();
      alert("Lowongan berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting Loker:", error);
      setError("Failed to delete Loker");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const docRef = doc(db, "loker", id);
      await updateDoc(docRef, {
        is_active: !currentStatus,
        updated_at: new Date().toISOString(),
      });
      await fetchLokerData();
    } catch (error) {
      console.error("Error updating Loker status:", error);
      setError("Failed to update Loker status");
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
              <h1 className="text-2xl font-bold text-gray-900">
                Kelola Lowongan Kerja
              </h1>
              <p className="text-gray-600">
                Manage data lowongan kerja RW 16 Desa Ciwaruga
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
                onClick={() => router.push("/admin/loker/create")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                + Tambah Lowongan
              </button>
              <button
                onClick={async () => {
                  try {
                    const result = await importDataToFirebase();
                    if (result.success) {
                      alert("Data imported successfully!");
                      fetchLokerData();
                    } else {
                      alert("Import failed: " + result.error);
                    }
                  } catch (error) {
                    console.error("Import error:", error);
                    alert("Import failed!");
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                📥 Import Laravel Data
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl text-blue-500 mr-4">💼</div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Lowongan
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {lokerData.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl text-green-500 mr-4">✅</div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Lowongan Aktif
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {lokerData.filter((item) => item.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl text-red-500 mr-4">❌</div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Lowongan Nonaktif
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {lokerData.filter((item) => !item.is_active).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loker List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Data Lowongan Kerja ({lokerData.length})
              </h3>
              <button
                onClick={fetchLokerData}
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
          ) : lokerData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posisi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perusahaan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gaji
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lokerData.map((loker) => (
                    <tr key={loker.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            toggleActive(loker.id, loker.is_active)
                          }
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            loker.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {loker.is_active ? "Aktif" : "Nonaktif"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {loker.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {loker.company}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {loker.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {loker.salary}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {loker.contact}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/loker/edit?id=${loker.id}`} // Query param instead of [id]
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => deleteLoker(loker.id, loker.title)}
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
              <div className="text-gray-400 text-6xl mb-4">💼</div>
              <p className="text-gray-500 mb-4">
                Belum ada data lowongan kerja
              </p>
              <button
                onClick={() => router.push("/admin/loker/create")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Tambah Lowongan Pertama
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

export default function LokerManagementPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LokerContent />
    </Suspense>
  );
}
