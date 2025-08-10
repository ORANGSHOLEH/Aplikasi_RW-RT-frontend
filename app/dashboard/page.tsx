"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, API_ENDPOINTS } from "../lib/config";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import Image from "next/image";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [kkData, setKkData] = useState([]);
  const [wargaData, setWargaData] = useState([]);
  const [umkmData, setUmkmData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUmkm, setCurrentUmkm] = useState<any>(null);
  const router = useRouter();

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Check authentication and fetch user profile
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        router.push("/login");
        return;
      }

      setUser(JSON.parse(userData));
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'umkm') {
      fetchUmkmData();
    } else if (activeTab === 'kk' && kkData.length === 0) {
      fetchKkData();
    } else if (activeTab === 'warga' && wargaData.length === 0) {
      fetchWargaData();
    }
  }, [activeTab]);

  // API call function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(fullUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error("API call error:", err);
      setError(`Terjadi kesalahan koneksi: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    }
  };

  // Data fetching functions
  const fetchUserProfile = async () => {
    const data = await apiCall(API_ENDPOINTS.PROFILE);
    if (data?.status === "success") {
      setUser(data.data);
      localStorage.setItem("user", JSON.stringify(data.data));
    }
  };

  const fetchKkData = async () => {
    setLoading(true);
    const data = await apiCall(API_ENDPOINTS.KK);
    if (data?.status === "success") {
      setKkData(data.data || []);
    }
    setLoading(false);
  };

  const fetchWargaData = async () => {
    setLoading(true);
    const data = await apiCall(API_ENDPOINTS.WARGA);
    if (data?.status === "success") {
      setWargaData(data.data || []);
    }
    setLoading(false);
  };

  const fetchUmkmData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UMKM}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch UMKM data');
      
      const data = await response.json();
      setUmkmData(data.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch UMKM data');
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations for UMKM
  const createUmkm = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UMKM}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create UMKM');
      
      await fetchUmkmData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create UMKM');
      throw error;
    }
  };

  const updateUmkm = async (id: string, formData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UMKM}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update UMKM');
      
      await fetchUmkmData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update UMKM');
      throw error;
    }
  };

  const deleteUmkm = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus UMKM ini?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UMKM}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete UMKM');
      
      await fetchUmkmData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete UMKM');
    }
  };

  // Handlers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setError("");
  };

  const handleLogout = async () => {
    await apiCall(API_ENDPOINTS.LOGOUT, { method: "POST" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Navbar */}
      <AdminNavbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        user={user} 
        onLogout={handleLogout}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 w-64 h-full">
            <AdminSidebar 
              activeTab={activeTab} 
              onTabChange={handleTabChange}
              collapsed={false}
              onToggleCollapse={() => {}}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`pt-16 p-6 transition-all duration-300 ${
        sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={() => setError('')}
              className="mt-2 text-sm underline text-red-600"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          {/* Profile Tab */}
          {activeTab === "profile" && user && (
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informasi Profil
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Nama
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Role
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.role === 'admin' ? 'Administrator' : user.role}
                  </p>
                </div>
                {user.rw && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      RW
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{user.rw}</p>
                  </div>
                )}
                {user.rt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      RT
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{user.rt}</p>
                  </div>
                )}
                {user.nik && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      NIK
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{user.nik}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* KK Tab */}
          {activeTab === "kk" && (
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Data Kartu Keluarga
                </h3>
                <button
                  onClick={fetchKkData}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : kkData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No. KK
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alamat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          RT/RW
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kepala Keluarga
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {kkData.map((kk: any, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {kk.no_kk}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {kk.alamat}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {kk.rt}/{kk.rw}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {kk.kepala_keluarga?.nama || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada data KK</p>
                </div>
              )}
            </div>
          )}

          {/* Warga Tab */}
          {activeTab === "warga" && (
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Data Warga
                </h3>
                <button
                  onClick={fetchWargaData}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : wargaData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NIK
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jenis Kelamin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hubungan Keluarga
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {wargaData.map((warga: any, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {warga.nik}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {warga.nama}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {warga.jenis_kelamin === "L"
                              ? "Laki-laki"
                              : "Perempuan"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {warga.hubungan_dalam_keluarga}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada data warga</p>
                </div>
              )}
            </div>
          )}

          {/* UMKM Tab */}
          {activeTab === "umkm" && (
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Data UMKM
                </h3>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {umkmData.map((umkm: any) => (
                    <div key={umkm.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={umkm.image || '/default-umkm.jpg'}
                          alt={umkm.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-lg mb-2">{umkm.name}</h4>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setCurrentUmkm(umkm);
                                setIsModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteUmkm(umkm.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {umkm.description?.length > 100 
                            ? `${umkm.description.substring(0, 100)}...` 
                            : umkm.description}
                        </p>
                        
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Kontak:</span> {umkm.contact}</p>
                          <p><span className="font-medium">Alamat:</span> {umkm.address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada data UMKM</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal Form UMKM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {currentUmkm ? 'Edit UMKM' : 'Tambah UMKM Baru'}
                </h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = {
                    name: e.currentTarget.name.valueOf,
                    description: e.currentTarget.description.value,
                    contact: e.currentTarget.contact.value,
                    address: e.currentTarget.address.value,
                    image: '/umkm-default.jpeg'
                  };
                  
                  try {
                    if (currentUmkm) {
                      await updateUmkm(currentUmkm.id, formData);
                    } else {
                      await createUmkm(formData);
                    }
                    setIsModalOpen(false);
                  } catch (error) {
                    console.error("Error saving UMKM:", error);
                  }
                }}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama UMKM</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={currentUmkm?.name || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      defaultValue={currentUmkm?.description || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Kontak</label>
                    <input
                      type="text"
                      name="contact"
                      id="contact"
                      defaultValue={currentUmkm?.contact || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat</label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      defaultValue={currentUmkm?.address || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}