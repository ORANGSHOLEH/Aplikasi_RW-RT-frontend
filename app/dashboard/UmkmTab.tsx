"use client";
import Image from "next/image";
import { useState } from "react";
import UmkmForm from "../dashboard/form/inputUMKM/page";

export default function UmkmTab({
  umkmData,
  loading,
  fetchUmkmData,
  createUmkm,
  updateUmkm,
  deleteUmkm
}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUmkm, setCurrentUmkm] = useState<any>(null);

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Data UMKM</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setCurrentUmkm(null);
              setIsModalOpen(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Tambah UMKM
          </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama UMKM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {umkmData.map((umkm: any) => (
                <tr key={umkm.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                      <Image src={umkm.image || "/default-umkm.jpg"} alt={umkm.name} fill className="object-cover" sizes="64px" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{umkm.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    {umkm.description?.length > 100 ? `${umkm.description.substring(0, 100)}...` : umkm.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{umkm.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">{umkm.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2">
                    <button
                      onClick={() => {
                        setCurrentUmkm(umkm);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteUmkm(umkm.id)} className="text-red-600 hover:text-red-800">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada data UMKM</p>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <UmkmForm
          initialData={currentUmkm}
          onClose={() => setIsModalOpen(false)}
          onSave={async (data: any) => {
            if (currentUmkm) {
              await updateUmkm(currentUmkm.id, data);
            } else {
              await createUmkm(data);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
