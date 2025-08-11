"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, API_ENDPOINTS } from "../lib/config";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import Image from "next/image";

interface LokerData {
  id: string;
  nama_perusahaan: string;
  alamat_perusahaan: string;
  kontak: string;
  posisi: string;
  gaji: string;
  syarat: string;
  waktu_kerja: string;
  tempat_kerja: string;
  is_active: boolean;
  url_gambar?: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [umkmData, setUmkmData] = useState([]);
  const [lokerData, setLokerData] = useState<LokerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUmkm, setCurrentUmkm] = useState<any>(null);
  const [currentLoker, setCurrentLoker] = useState<any>(null);
  const [isLokerModalOpen, setIsLokerModalOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalUmkm: 0,
    totalLoker: 0,
    activeLoker: 0,
    inactiveLoker: 0,
  });
  const router = useRouter();

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
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
    if (activeTab === "dashboard") {
      fetchDashboardStats();
    } else if (activeTab === "umkm") {
      fetchUmkmData();
    } else if (activeTab === "loker") {
      fetchLokerData();
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
      setError(
        `Terjadi kesalahan koneksi: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
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

  const fetchUmkmData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UMKM}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch UMKM data");

      const data = await response.json();
      setUmkmData(data.data || []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch UMKM data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchLokerData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOKER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch Loker data");

      const data = await response.json();
      if (data.success) {
        setLokerData(data.data.data || []); // Karena response punya structure data.data.data
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch Loker data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch only UMKM and Loker data
      const [umkmResponse, lokerResponse] = await Promise.all([
        fetch(`${API_BASE_URL}${API_ENDPOINTS.UMKM}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}${API_ENDPOINTS.LOKER}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [umkmData, lokerData] = await Promise.all([
        umkmResponse.json(),
        lokerResponse.json(),
      ]);

      // Calculate statistics
      const totalUmkm = umkmData?.data?.length || 0;
      const allLokers = lokerData?.data?.data || [];
      const totalLoker = allLokers.length;
      const activeLoker = allLokers.filter(
        (loker: any) => loker.is_active
      ).length;
      const inactiveLoker = totalLoker - activeLoker;

      setDashboardStats({
        totalUmkm,
        totalLoker,
        activeLoker,
        inactiveLoker,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  // CRUD operations for Loker
  const deleteLoker = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus loker ini?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.LOKER}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete Loker");

      await fetchLokerData();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete Loker"
      );
    }
  };

  const toggleLokerStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");

      // Get the current loker data first
      const loker = lokerData.find((l: any) => l.id === id);
      if (!loker) {
        throw new Error("Loker not found");
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.LOKER}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nama_perusahaan: loker.nama_perusahaan,
            alamat_perusahaan: loker.alamat_perusahaan,
            kontak: loker.kontak,
            posisi: loker.posisi,
            gaji: loker.gaji,
            syarat: loker.syarat,
            waktu_kerja: loker.waktu_kerja,
            tempat_kerja: loker.tempat_kerja,
            is_active: !currentStatus,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update Loker status");

      await fetchLokerData();

      // Update modal data if it's the same loker
      if (currentLoker && currentLoker.id === id) {
        setCurrentLoker({ ...currentLoker, is_active: !currentStatus });
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update Loker status"
      );
    }
  };

  // CRUD operations for UMKM
  const createUmkm = async (formData: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UMKM}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create UMKM");

      await fetchUmkmData();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create UMKM"
      );
      throw error;
    }
  };

  const updateUmkm = async (id: string, formData: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.UMKM}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update UMKM");

      await fetchUmkmData();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update UMKM"
      );
      throw error;
    }
  };

  const deleteUmkm = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus UMKM ini?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.UMKM}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete UMKM");

      await fetchUmkmData();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete UMKM"
      );
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
      <main
        className={`pt-16 p-6 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
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

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Dashboard Overview
                </h3>
                <button
                  onClick={fetchDashboardStats}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Refresh Data
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Total UMKM Card */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-800 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">🏪</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-purple-100 truncate">
                          Total UMKM
                        </dt>
                        <dd className="text-3xl font-bold text-white">
                          {dashboardStats.totalUmkm.toLocaleString("id-ID")}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                {/* Total Loker Card */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-800 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">💼</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-orange-100 truncate">
                          Total Lowongan Kerja
                        </dt>
                        <dd className="text-3xl font-bold text-white">
                          {dashboardStats.totalLoker.toLocaleString("id-ID")}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loker Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Loker Card */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-emerald-800 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">✅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-emerald-100 truncate">
                          Loker Aktif
                        </dt>
                        <dd className="text-3xl font-bold text-white">
                          {dashboardStats.activeLoker.toLocaleString("id-ID")}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Inactive Loker Card */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-800 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">❌</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-red-100 truncate">
                          Loker Nonaktif
                        </dt>
                        <dd className="text-3xl font-bold text-white">
                          {dashboardStats.inactiveLoker.toLocaleString("id-ID")}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab("umkm")}
                    className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏪</div>
                      <div className="text-sm font-medium text-gray-900">
                        Kelola UMKM
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("loker")}
                    className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">💼</div>
                      <div className="text-sm font-medium text-gray-900">
                        Kelola Lowongan Kerja
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Summary Info */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Ringkasan Sistem
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Data Kependudukan
                    </h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Tidak ada data kependudukan</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Data Ekonomi
                    </h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Total UMKM:</span>
                        <span className="font-medium">
                          {dashboardStats.totalUmkm}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lowongan Kerja Aktif:</span>
                        <span className="font-medium text-green-600">
                          {dashboardStats.activeLoker}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lowongan Kerja Nonaktif:</span>
                        <span className="font-medium text-red-600">
                          {dashboardStats.inactiveLoker}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    {user.role === "admin" ? "Administrator" : user.role}
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
          {/* {activeTab === "kk" && (
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
          )} */}

          {/* Warga Tab */}
          {/* {activeTab === "warga" && (
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
          )} */}

          {/* UMKM Tab */}
          {activeTab === "umkm" && (
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gambar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama UMKM
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deskripsi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kontak
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alamat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {umkmData.map((umkm: any) => (
                        <tr key={umkm.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                              <Image
                                src={umkm.image || "/default-umkm.jpg"}
                                alt={umkm.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {umkm.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs">
                              {umkm.description?.length > 100
                                ? `${umkm.description.substring(0, 100)}...`
                                : umkm.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {umkm.contact}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs">
                              {umkm.address}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setCurrentUmkm(umkm);
                                  setIsModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteUmkm(umkm.id)}
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
                  <p className="text-gray-500">Tidak ada data UMKM</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "loker" && (
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Data Lowongan Kerja
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push("/dashboard/form/inputLoker")}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gambar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posisi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Perusahaan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gaji
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Waktu Kerja
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tempat Kerja
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kontak
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alamat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Syarat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lokerData.map((loker: any) => (
                        <tr key={loker.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {loker.url_gambar ? (
                              <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                                <Image
                                  src={loker.url_gambar}
                                  alt={loker.nama_perusahaan}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                            ) : (
                              <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-xs">
                                  No Image
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {loker.posisi}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-600">
                              {loker.nama_perusahaan}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {loker.gaji}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {loker.waktu_kerja}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {loker.tempat_kerja}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {loker.kontak}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs">
                              {loker.alamat_perusahaan}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs">
                              {loker.syarat?.length > 80
                                ? `${loker.syarat.substring(0, 80)}...`
                                : loker.syarat}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() =>
                                toggleLokerStatus(loker.id, loker.is_active)
                              }
                              className={`text-xs px-2 py-1 rounded ${
                                loker.is_active
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                            >
                              {loker.is_active ? "Aktif" : "Nonaktif"}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-500">
                              {new Date(loker.created_at).toLocaleDateString(
                                "id-ID"
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setCurrentLoker(loker);
                                  setIsLokerModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Detail
                              </button>
                              <button
                                onClick={() => deleteLoker(loker.id)}
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
                  <p className="text-gray-500 mb-4">Tidak ada data loker</p>
                  <button
                    onClick={() => router.push("/dashboard/form/inputLoker")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Tambah Loker Pertama
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Modal Form UMKM */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0 bg-gray-500 opacity-75"
                  onClick={() => setIsModalOpen(false)}
                ></div>
              </div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {currentUmkm ? "Edit UMKM" : "Tambah UMKM Baru"}
                  </h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = {
                        name: formData.get("name") as string,
                        description: formData.get("description") as string,
                        contact: formData.get("contact") as string,
                        address: formData.get("address") as string,
                        image: "/umkm-default.jpeg",
                      };

                      try {
                        if (currentUmkm) {
                          await updateUmkm(currentUmkm.id, data);
                        } else {
                          await createUmkm(data);
                        }
                        setIsModalOpen(false);
                      } catch (error) {
                        console.error("Error saving UMKM:", error);
                      }
                    }}
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nama UMKM
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={currentUmkm?.name || ""}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Deskripsi
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        defaultValue={currentUmkm?.description || ""}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="contact"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Kontak
                      </label>
                      <input
                        type="text"
                        name="contact"
                        id="contact"
                        defaultValue={currentUmkm?.contact || ""}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Alamat
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        defaultValue={currentUmkm?.address || ""}
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
        {/* Modal Detail Loker */}
        {isLokerModalOpen && currentLoker && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0 bg-gray-500 opacity-75"
                  onClick={() => setIsLokerModalOpen(false)}
                ></div>
              </div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Detail Lowongan Kerja
                    </h3>
                    <button
                      onClick={() => setIsLokerModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    {currentLoker.url_gambar && (
                      <div className="relative h-48 w-full mb-4">
                        <Image
                          src={currentLoker.url_gambar}
                          alt={currentLoker.nama_perusahaan}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Posisi
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {currentLoker.posisi}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Perusahaan
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {currentLoker.nama_perusahaan}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Gaji
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {currentLoker.gaji}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Waktu Kerja
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {currentLoker.waktu_kerja}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tempat Kerja
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {currentLoker.tempat_kerja}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {currentLoker.is_active ? "Aktif" : "Nonaktif"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Alamat Perusahaan
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentLoker.alamat_perusahaan}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Kontak
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentLoker.kontak}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Syarat dan Kualifikasi
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentLoker.syarat}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <label className="block font-medium">Dibuat</label>
                        <p>
                          {new Date(currentLoker.created_at).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="block font-medium">Diperbarui</label>
                        <p>
                          {new Date(currentLoker.updated_at).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-6">
                    <button
                      onClick={() =>
                        toggleLokerStatus(
                          currentLoker.id,
                          currentLoker.is_active
                        )
                      }
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                        currentLoker.is_active
                          ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                          : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      }`}
                    >
                      {currentLoker.is_active ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                    <button
                      onClick={() => setIsLokerModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
