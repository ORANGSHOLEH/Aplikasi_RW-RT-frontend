"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, API_ENDPOINTS } from "../../../lib/config";

interface LokerFormData {
  nama_perusahaan: string;
  alamat_perusahaan: string;
  kontak: string;
  posisi: string;
  gaji: string;
  syarat: string;
  waktu_kerja: string;
  tempat_kerja: string;
  gambar?: File | null;
  is_active: boolean;
}

export default function InputLokerPage() {
  const [form, setForm] = useState<LokerFormData>({
    nama_perusahaan: "",
    alamat_perusahaan: "",
    kontak: "",
    posisi: "",
    gaji: "",
    syarat: "",
    waktu_kerja: "",
    tempat_kerja: "",
    gambar: null,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
      setForm({ ...form, gambar: file || null });

      // Preview gambar
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token tidak ditemukan. Silakan login ulang.");
        router.push("/login");
        return;
      }

      // Gunakan FormData untuk upload file
      const formData = new FormData();
      formData.append("nama_perusahaan", form.nama_perusahaan);
      formData.append("alamat_perusahaan", form.alamat_perusahaan);
      formData.append("kontak", form.kontak);
      formData.append("posisi", form.posisi);
      formData.append("gaji", form.gaji);
      formData.append("syarat", form.syarat);
      formData.append("waktu_kerja", form.waktu_kerja);
      formData.append("tempat_kerja", form.tempat_kerja);

      // Convert boolean ke string yang benar untuk Laravel
      formData.append("is_active", form.is_active ? "1" : "0");

      if (form.gambar) {
        formData.append("gambar", form.gambar);
      }

      console.log("Sending request to:", `${API_BASE_URL}/loker`);
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await fetch(`${API_BASE_URL}/loker`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok && data.success) {
        setSuccess(data.message || "Data loker berhasil disimpan.");
        setForm({
          nama_perusahaan: "",
          alamat_perusahaan: "",
          kontak: "",
          posisi: "",
          gaji: "",
          syarat: "",
          waktu_kerja: "",
          tempat_kerja: "",
          gambar: null,
          is_active: true,
        });
        setImagePreview(null);
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(", ");
          setError(`Validation errors: ${errorMessages}`);
        } else {
          setError(data.message || "Gagal menyimpan data loker.");
        }
      }
    } catch (err: any) {
      console.error("Full error:", err);
      setError(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl text-black font-bold mb-6 text-center">
          Input Data Lowongan Kerja
        </h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 bg-green-50 p-3 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload Gambar */}
          <div>
            <label
              htmlFor="gambar"
              className="block mb-1 font-medium text-black"
            >
              Gambar Perusahaan
            </label>
            <input
              type="file"
              id="gambar"
              name="gambar"
              accept="image/*"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>

          {/* Nama Perusahaan */}
          <div>
            <label
              htmlFor="nama_perusahaan"
              className="block mb-1 font-medium text-black"
            >
              Nama Perusahaan
            </label>
            <input
              type="text"
              id="nama_perusahaan"
              name="nama_perusahaan"
              value={form.nama_perusahaan}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={255}
            />
          </div>

          {/* Posisi */}
          <div>
            <label
              htmlFor="posisi"
              className="block mb-1 font-medium text-black"
            >
              Posisi
            </label>
            <input
              type="text"
              id="posisi"
              name="posisi"
              value={form.posisi}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={255}
            />
          </div>

          {/* Alamat Perusahaan */}
          <div>
            <label
              htmlFor="alamat_perusahaan"
              className="block mb-1 font-medium text-black"
            >
              Alamat Perusahaan
            </label>
            <textarea
              id="alamat_perusahaan"
              name="alamat_perusahaan"
              value={form.alamat_perusahaan}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border px-3 py-2 rounded text-black"
            />
          </div>

          {/* Kontak */}
          <div>
            <label
              htmlFor="kontak"
              className="block mb-1 font-medium text-black"
            >
              Kontak
            </label>
            <input
              type="text"
              id="kontak"
              name="kontak"
              value={form.kontak}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={255}
              placeholder="email@perusahaan.com / 021-12345678"
            />
          </div>

          {/* Gaji */}
          <div>
            <label htmlFor="gaji" className="block mb-1 font-medium text-black">
              Gaji
            </label>
            <input
              type="text"
              id="gaji"
              name="gaji"
              value={form.gaji}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={255}
              placeholder="Rp 5.000.000 - Rp 8.000.000"
            />
          </div>

          {/* Waktu Kerja */}
          <div>
            <label
              htmlFor="waktu_kerja"
              className="block mb-1 font-medium text-black"
            >
              Waktu Kerja
            </label>
            <select
              id="waktu_kerja"
              name="waktu_kerja"
              value={form.waktu_kerja}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
            >
              <option value="">Pilih Waktu Kerja</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          {/* Tempat Kerja */}
          <div>
            <label
              htmlFor="tempat_kerja"
              className="block mb-1 font-medium text-black"
            >
              Tempat Kerja
            </label>
            <select
              id="tempat_kerja"
              name="tempat_kerja"
              value={form.tempat_kerja}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
            >
              <option value="">Pilih Tempat Kerja</option>
              <option value="On-Site">On-Site</option>
              <option value="Work From Home">Work From Home</option>
            </select>
          </div>

          {/* Syarat */}
          <div>
            <label
              htmlFor="syarat"
              className="block mb-1 font-medium text-black"
            >
              Syarat dan Kualifikasi
            </label>
            <textarea
              id="syarat"
              name="syarat"
              value={form.syarat}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border px-3 py-2 rounded text-black"
              placeholder="S1 Teknik Informatika, Menguasai React/Vue.js, Pengalaman minimal 2 tahun..."
            />
          </div>

          {/* Status Aktif */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="is_active" className="font-medium text-black">
              Lowongan Aktif
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan Data Loker"}
          </button>
        </form>
      </div>
    </div>
  );
}
