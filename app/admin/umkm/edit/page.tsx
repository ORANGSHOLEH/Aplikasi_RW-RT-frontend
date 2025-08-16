"use client";

import { useState, useEffect, Suspense } from "react"; // Add Suspense
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface UMKMFormData {
  name: string;
  description: string;
  contact: string;
  address: string;
  image: string;
}

// 👈 SEPARATE COMPONENT FOR SEARCH PARAMS
function EditUMKMContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<UMKMFormData>({
    name: "",
    description: "",
    contact: "",
    address: "",
    image: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams(); // Now inside Suspense
  const id = searchParams.get("id");

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

  // Redirect if no ID
  useEffect(() => {
    if (!loading && !id) {
      router.push("/admin/umkm");
    }
  }, [loading, id, router]);

  // Fetch UMKM data by ID
  useEffect(() => {
    if (user && id) {
      fetchUMKMData();
    }
  }, [user, id]);

  const fetchUMKMData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const docRef = doc(db, "umkm", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm({
          name: data.name || "",
          description: data.description || "",
          contact: data.contact || "",
          address: data.address || "",
          image:
            data.image || "https://placehold.co/600x400/4f46e5/white?text=UMKM",
        });
      } else {
        setNotFound(true);
        setError("UMKM tidak ditemukan");
      }
    } catch (error) {
      console.error("Error fetching UMKM:", error);
      setError("Failed to fetch UMKM data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError("");

    try {
      const docRef = doc(db, "umkm", id);
      await updateDoc(docRef, {
        ...form,
        updated_at: new Date().toISOString(),
      });

      alert("UMKM berhasil diperbarui!");
      router.push("/admin/umkm");
    } catch (error) {
      console.error("Error updating UMKM:", error);
      setError("Failed to update UMKM");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading UMKM data...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            UMKM Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            UMKM yang Anda cari tidak ada atau telah dihapus.
          </p>
          <button
            onClick={() => router.push("/admin/umkm")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            ← Kembali ke Daftar UMKM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit UMKM</h1>
              <p className="text-gray-600">
                Perbarui data UMKM:{" "}
                <span className="font-medium">{form.name}</span>
              </p>
            </div>
            <button
              onClick={() => router.push("/admin/umkm")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              ← Kembali
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama UMKM */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama UMKM *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Masukkan nama UMKM"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Deskripsi *
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Deskripsikan produk atau layanan UMKM"
              />
            </div>

            {/* Kontak */}
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kontak *
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="WhatsApp, email, atau nomor telepon"
              />
            </div>

            {/* Alamat */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Alamat *
              </label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Alamat lengkap UMKM"
              />
            </div>

            {/* URL Gambar */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL Gambar
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Opsional. URL gambar untuk UMKM ini.
              </p>
            </div>

            {/* Preview */}
            {form.image && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview Gambar
                </label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x400/4f46e5/white?text=Error";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6">
              <button
                type="button"
                onClick={() => router.push("/admin/umkm")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Menyimpan..." : "💾 Perbarui UMKM"}
              </button>
            </div>
          </form>
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
export default function EditUMKMPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EditUMKMContent />
    </Suspense>
  );
}
