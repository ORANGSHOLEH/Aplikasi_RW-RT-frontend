"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, API_ENDPOINTS } from "../../../lib/config"; // Pastikan path ini benar ke utils/api.ts/js Anda

// Interface untuk tipe data form agar lebih rapi (TypeScript)
interface WargaFormData {
  nik: string;
  no_kk: string; // Menggantikan 'alamat' karena warga ditautkan ke KK
  nama: string;
  jenis_kelamin: "L" | "P" | ""; // Menambahkan string kosong untuk default option
  tempat_lahir: string;
  tanggal_lahir: string; // Format YYYY-MM-DD
  agama: string;
  pendidikan: string;
  pekerjaan: string;
  status_perkawinan: string;
  kewarganegaraan: string;
  no_paspor: string;
  no_kitap: string;
  hubungan_dalam_keluarga: string;
  nama_ayah: string;
  nama_ibu: string;
  // Jika Anda menambahkan 'no_hp' di tabel warga dan model, tambahkan di sini juga:
  // no_hp: string;
}

export default function InputWargaPage() {
  const [form, setForm] = useState<WargaFormData>({
    nik: "",
    no_kk: "", // Menggantikan alamat
    nama: "",
    jenis_kelamin: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    agama: "",
    pendidikan: "",
    pekerjaan: "",
    status_perkawinan: "",
    kewarganegaraan: "",
    no_paspor: "",
    no_kitap: "",
    hubungan_dalam_keluarga: "",
    nama_ayah: "",
    nama_ibu: "",
    // no_hp: "", // Tambahkan jika sudah ada di backend
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login"); // atau "/" jika ingin ke home
    }
  }, [router]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.WARGA}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.status === "success") {
        setSuccess(data.message || "Data warga berhasil disimpan.");
        setForm({
          nik: "",
          no_kk: "",
          nama: "",
          jenis_kelamin: "",
          tempat_lahir: "",
          tanggal_lahir: "",
          agama: "",
          pendidikan: "",
          pekerjaan: "",
          status_perkawinan: "",
          kewarganegaraan: "",
          no_paspor: "",
          no_kitap: "",
          hubungan_dalam_keluarga: "",
          nama_ayah: "",
          nama_ibu: "",
          // no_hp: "", // Reset juga jika ada
        });
        setTimeout(() => router.push("/dashboard"), 1200);
      } else {
        setError(data.message || "Gagal menyimpan data warga.");
      }
    } catch (err: any) {
      setError("Terjadi kesalahan koneksi atau server.");
      console.error("Error saat menyimpan data warga:", err);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl text-black font-bold mb-6 text-center">Input Data Warga</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NIK */}
          <div>
            <label htmlFor="nik" className="block mb-1 font-medium text-black">NIK</label>
            <input
              type="text"
              id="nik"
              name="nik"
              value={form.nik}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={20} // Sesuai migrasi: string max 20
            />
          </div>

          {/* No. KK */}
          <div>
            <label htmlFor="no_kk" className="block mb-1 font-medium text-black">No. KK</label>
            <input
              type="text"
              id="no_kk"
              name="no_kk"
              value={form.no_kk}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={20} // Sesuai migrasi: string max 20
            />
          </div>

          {/* Nama */}
          <div>
            <label htmlFor="nama" className="block mb-1 font-medium text-black">Nama Lengkap</label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={100} // Sesuai migrasi: string max 100
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label htmlFor="jenis_kelamin" className="block mb-1 font-medium text-black">Jenis Kelamin</label>
            <select
              id="jenis_kelamin"
              name="jenis_kelamin"
              value={form.jenis_kelamin}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Tempat Lahir */}
          <div>
            <label htmlFor="tempat_lahir" className="block mb-1 font-medium text-black">Tempat Lahir</label>
            <input
              type="text"
              id="tempat_lahir"
              name="tempat_lahir"
              value={form.tempat_lahir}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={50} // Sesuai migrasi: string max 50
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label htmlFor="tanggal_lahir" className="block mb-1 font-medium text-black">Tanggal Lahir</label>
            <input
              type="date"
              id="tanggal_lahir"
              name="tanggal_lahir"
              value={form.tanggal_lahir}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
            />
          </div>

          {/* Agama */}
          <div>
            <label htmlFor="agama" className="block mb-1 font-medium text-black">Agama</label>
            <input
              type="text"
              id="agama"
              name="agama"
              value={form.agama}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={20} // Sesuai migrasi: string max 20
            />
          </div>

          {/* Pendidikan */}
          <div>
            <label htmlFor="pendidikan" className="block mb-1 font-medium text-black">Pendidikan</label>
            <input
              type="text"
              id="pendidikan"
              name="pendidikan"
              value={form.pendidikan}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={50} // Sesuai migrasi: string max 50
            />
          </div>

          {/* Pekerjaan */}
          <div>
            <label htmlFor="pekerjaan" className="block mb-1 font-medium text-black">Pekerjaan</label>
            <input
              type="text"
              id="pekerjaan"
              name="pekerjaan"
              value={form.pekerjaan}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={50} // Sesuai migrasi: string max 50
            />
          </div>

          {/* Status Perkawinan */}
          <div>
            <label htmlFor="status_perkawinan" className="block mb-1 font-medium text-black">Status Perkawinan</label>
            <input
              type="text"
              id="status_perkawinan"
              name="status_perkawinan"
              value={form.status_perkawinan}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={20} // Sesuai migrasi: string max 20
            />
          </div>

          {/* Kewarganegaraan */}
          <div>
            <label htmlFor="kewarganegaraan" className="block mb-1 font-medium text-black">Kewarganegaraan</label>
            <input
              type="text"
              id="kewarganegaraan"
              name="kewarganegaraan"
              value={form.kewarganegaraan}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={30} // Sesuai migrasi: string max 30
            />
          </div>

          {/* No. Paspor */}
          <div>
            <label htmlFor="no_paspor" className="block mb-1 font-medium text-black">No. Paspor</label>
            <input
              type="text"
              id="no_paspor"
              name="no_paspor"
              value={form.no_paspor}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={20} // Sesuai migrasi: string max 20
            />
          </div>

          {/* No. Kitap */}
          <div>
            <label htmlFor="no_kitap" className="block mb-1 font-medium text-black">No. KITAP</label>
            <input
              type="text"
              id="no_kitap"
              name="no_kitap"
              value={form.no_kitap}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={20} // Sesuai migrasi: string max 20
            />
          </div>

          {/* Hubungan Dalam Keluarga */}
          <div>
            <label htmlFor="hubungan_dalam_keluarga" className="block mb-1 font-medium text-black">Hubungan Dalam Keluarga</label>
            <input
              type="text"
              id="hubungan_dalam_keluarga"
              name="hubungan_dalam_keluarga"
              value={form.hubungan_dalam_keluarga}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={20} // Sesuai migrasi: string max 20
            />
          </div>

          {/* Nama Ayah */}
          <div>
            <label htmlFor="nama_ayah" className="block mb-1 font-medium text-black">Nama Ayah</label>
            <input
              type="text"
              id="nama_ayah"
              name="nama_ayah"
              value={form.nama_ayah}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={100} // Sesuai migrasi: string max 100
            />
          </div>

          {/* Nama Ibu */}
          <div>
            <label htmlFor="nama_ibu" className="block mb-1 font-medium text-black">Nama Ibu</label>
            <input
              type="text"
              id="nama_ibu"
              name="nama_ibu"
              value={form.nama_ibu}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-black"
              maxLength={100} // Sesuai migrasi: string max 100
            />
          </div>

          {/* No. HP (Jika sudah ditambahkan di backend) */}
          {/*
          <div>
            <label htmlFor="no_hp" className="block mb-1 font-medium">No. HP</label>
            <input
              type="text"
              id="no_hp"
              name="no_hp"
              value={form.no_hp}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              maxLength={20} // Sesuaikan dengan panjang di migrasi
            />
          </div>
          */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan Data Warga"}
          </button>
        </form>
      </div>
    </div>
  );
}