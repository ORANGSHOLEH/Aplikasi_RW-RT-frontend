"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface LokerFormData {
  title: string;
  company: string;
  description: string;
  requirements: string;
  salary: string;
  contact: string;
  location: string;
  is_active: boolean;
  image: string;
}

function EditLokerContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<LokerFormData>({
    title: "",
    company: "",
    description: "",
    requirements: "",
    salary: "",
    contact: "",
    location: "",
    is_active: true,
    image: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
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
      router.push("/admin/loker");
    }
  }, [loading, id, router]);

  // Fetch Loker data by ID
  useEffect(() => {
    if (user && id) {
      fetchLokerData();
    }
  }, [user, id]);

  const fetchLokerData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const docRef = doc(db, "loker", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm({
          title: data.title || "",
          company: data.company || "",
          description: data.description || "",
          requirements: data.requirements || "",
          salary: data.salary || "",
          contact: data.contact || "",
          location: data.location || "",
          is_active: data.is_active || false,
          image:
            data.image ||
            "https://placehold.co/600x400/1f2937/white?text=Lowongan+Kerja",
        });
      } else {
        setNotFound(true);
        setError("Lowongan kerja tidak ditemukan");
      }
    } catch (error) {
      console.error("Error fetching Loker:", error);
      setError("Failed to fetch Loker data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError("");

    try {
      const docRef = doc(db, "loker", id);
      await updateDoc(docRef, {
        ...form,
        updated_at: new Date().toISOString(),
      });

      alert("Lowongan kerja berhasil diperbarui!");
      router.push("/admin/loker");
    } catch (error) {
      console.error("Error updating Loker:", error);
      setError("Failed to update Loker");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lowongan kerja...</p>
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
            Lowongan Kerja Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Lowongan kerja yang Anda cari tidak ada atau telah dihapus.
          </p>
          <button
            onClick={() => router.push("/admin/loker")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            ← Kembali ke Daftar Lowongan
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
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Lowongan Kerja
              </h1>
              <p className="text-gray-600">
                Perbarui data lowongan:{" "}
                <span className="font-medium">{form.title}</span>
              </p>
            </div>
            <button
              onClick={() => router.push("/admin/loker")}
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
            {/* Status Badge */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-3">
                  Status Lowongan:
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    form.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {form.is_active ? "🟢 Aktif" : "🔴 Nonaktif"}
                </span>
              </div>
            </div>

            {/* Posisi */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Posisi / Jabatan *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Contoh: Marketing Executive, Admin, dll"
              />
            </div>

            {/* Perusahaan */}
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Perusahaan *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Masukkan nama perusahaan"
              />
            </div>

            {/* Lokasi & Gaji - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lokasi *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Bandung, Jakarta, Remote"
                />
              </div>

              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gaji *
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Rp 3.000.000 - 5.000.000"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Deskripsi Pekerjaan *
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Deskripsikan tugas dan tanggung jawab pekerjaan"
              />
            </div>

            {/* Requirements */}
            <div>
              <label
                htmlFor="requirements"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Persyaratan *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="S1 semua jurusan, pengalaman 2 tahun, dll"
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
                Opsional. URL gambar untuk lowongan ini.
              </p>
            </div>

            {/* Status Aktif */}
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_active"
                className="ml-3 block text-sm font-medium text-gray-900"
              >
                📢 Publikasikan lowongan (tampilkan di website)
              </label>
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
                        "https://placehold.co/600x400/1f2937/white?text=Error";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push("/admin/loker")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  "💾 Perbarui Lowongan"
                )}
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

export default function EditLokerPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EditLokerContent />
    </Suspense>
  );
}
