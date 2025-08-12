"use client";
import Image from "next/image";
import { useState } from "react";
import LokerForm from "../dashboard/form/inputLoker/page";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function LokerTab({
  lokerData,
  loading,
  fetchLokerData,
  deleteLoker,
  toggleLokerStatus
}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLoker, setCurrentLoker] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Data Lowongan Kerja</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setCurrentLoker(null);
              setIsModalOpen(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Tambah Loker
          </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posisi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perusahaan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gaji</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tempat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lokerData.map((loker: any) => (
                <tr key={loker.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {loker.url_gambar ? (
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                        <Image src={loker.url_gambar} alt={loker.nama_perusahaan} fill className="object-cover" sizes="64px" />
                      </div>
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{loker.posisi}</td>
                  <td className="px-6 py-4 text-sm">{loker.nama_perusahaan}</td>
                  <td className="px-6 py-4 text-sm">{loker.gaji}</td>
                  <td className="px-6 py-4 text-sm">{loker.waktu_kerja}</td>
                  <td className="px-6 py-4 text-sm">{loker.tempat_kerja}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleLokerStatus(loker.id, loker.is_active)}
                      className={`px-2 py-1 rounded text-xs ${loker.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {loker.is_active ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => {
                        setCurrentLoker(loker);
                        setIsDetailOpen(true);
                      }}
                      className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 px-2 py-1 rounded transition"
                      title="Detail"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLoker(loker);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center justify-center bg-yellow-50 hover:bg-yellow-100 text-yellow-600 hover:text-yellow-800 px-2 py-1 rounded transition"
                      title="Edit"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteLoker(loker.id)}
                      className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 px-2 py-1 rounded transition"
                      title="Hapus"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">Tidak ada data loker</div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <LokerForm
          initialData={currentLoker}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            fetchLokerData();
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Detail Modal */}
      {isDetailOpen && currentLoker && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsDetailOpen(false)}></div>
            <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full z-10">
              <h3 className="text-lg font-medium mb-4">Detail Loker</h3>
              {currentLoker.url_gambar && (
                <Image src={currentLoker.url_gambar} alt={currentLoker.nama_perusahaan} width={200} height={200} className="rounded mb-4" />
              )}
              <p><strong>Posisi:</strong> {currentLoker.posisi}</p>
              <p><strong>Perusahaan:</strong> {currentLoker.nama_perusahaan}</p>
              <p><strong>Gaji:</strong> {currentLoker.gaji}</p>
              <p><strong>Alamat:</strong> {currentLoker.alamat_perusahaan}</p>
              <p><strong>Kontak:</strong> {currentLoker.kontak}</p>
              <p><strong>Status:</strong> {currentLoker.is_active ? "Aktif" : "Nonaktif"}</p>
              <div className="flex justify-end mt-4">
                <button onClick={() => setIsDetailOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}