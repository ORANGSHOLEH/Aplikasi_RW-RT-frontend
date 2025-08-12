"use client";
import { useState } from "react";

export default function UmkmForm({ initialData, onClose, onSave }: any) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    contact: initialData?.contact || "",
    address: initialData?.address || "",
    image: "/umkm-default.jpeg"
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full z-10">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {initialData ? "Edit UMKM" : "Tambah UMKM Baru"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nama UMKM" className="w-full border px-3 py-2 rounded" required />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" className="w-full border px-3 py-2 rounded" required />
            <input name="contact" value={form.contact} onChange={handleChange} placeholder="Kontak" className="w-full border px-3 py-2 rounded" required />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Alamat" className="w-full border px-3 py-2 rounded" required />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
