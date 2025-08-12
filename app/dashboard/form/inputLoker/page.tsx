"use client";
import { useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "@/app/lib/config";

export default function LokerForm({ initialData, onClose, onSave }: any) {
  const [form, setForm] = useState({
    nama_perusahaan: initialData?.nama_perusahaan || "",
    alamat_perusahaan: initialData?.alamat_perusahaan || "",
    kontak: initialData?.kontak || "",
    posisi: initialData?.posisi || "",
    gaji: initialData?.gaji || "",
    syarat: initialData?.syarat || "",
    waktu_kerja: initialData?.waktu_kerja || "",
    tempat_kerja: initialData?.tempat_kerja || "",
    gambar: null as File | null,
    is_active: initialData?.is_active ?? true,
  });
  const [preview, setPreview] = useState(initialData?.url_gambar || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") setForm({ ...form, [name]: checked });
    else if (type === "file") {
      const file = files[0];
      setForm({ ...form, gambar: file });
      setPreview(URL.createObjectURL(file));
    } else setForm({ ...form, [name]: value });
  };

  
const handleSubmit = async (e: any) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token tidak ditemukan");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "gambar") {
        // Hanya kirim gambar jika ada file baru
        if (value) formData.append("gambar", value as File);
      } else if (key === "is_active") {
        formData.append("is_active", value ? "1" : "0");
      } else {
        formData.append(key, value as string);
      }
    });

    // Cek mode edit atau tambah
    const isEdit = !!initialData?.id;
    const url = isEdit
      ? `${API_BASE_URL}${API_ENDPOINTS.LOKER}/${initialData.id}`
      : `${API_BASE_URL}${API_ENDPOINTS.LOKER}`;
    const method = isEdit ? "POST" : "POST"; // Laravel: POST + _method=PUT

    if (isEdit) formData.append("_method", "PUT");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Gagal menyimpan data loker");
    }

    onSave();
    onClose();
  } catch (err: any) {
    setError(err.message || "Terjadi kesalahan saat menyimpan");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full z-10">
          <h3 className="text-lg font-medium mb-4">{initialData ? "Edit Loker" : "Tambah Loker"}</h3>
          {error && <div className="mb-2 text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="nama_perusahaan" value={form.nama_perusahaan} onChange={handleChange} placeholder="Nama Perusahaan" className="w-full border px-3 py-2 rounded" required />
            <input name="posisi" value={form.posisi} onChange={handleChange} placeholder="Posisi" className="w-full border px-3 py-2 rounded" required />
            <textarea name="alamat_perusahaan" value={form.alamat_perusahaan} onChange={handleChange} placeholder="Alamat Perusahaan" className="w-full border px-3 py-2 rounded" required />
            <input name="kontak" value={form.kontak} onChange={handleChange} placeholder="Kontak" className="w-full border px-3 py-2 rounded" required />
            <input name="gaji" value={form.gaji} onChange={handleChange} placeholder="Gaji" className="w-full border px-3 py-2 rounded" required />
            <select name="waktu_kerja" value={form.waktu_kerja} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
              <option value="">Pilih Waktu Kerja</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Freelance">Freelance</option>
            </select>
            <select name="tempat_kerja" value={form.tempat_kerja} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
              <option value="">Pilih Tempat Kerja</option>
              <option value="On-Site">On-Site</option>
              <option value="Work From Home">Work From Home</option>
            </select>
            <textarea name="syarat" value={form.syarat} onChange={handleChange} placeholder="Syarat dan Kualifikasi" className="w-full border px-3 py-2 rounded" required />
            <input type="file" name="gambar" accept="image/*" onChange={handleChange} className="w-full" />
            {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded border" />}
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
              <span>Lowongan Aktif</span>
            </label>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}