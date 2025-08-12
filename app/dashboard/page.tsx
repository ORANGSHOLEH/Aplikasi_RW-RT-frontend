"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, API_ENDPOINTS } from "../lib/config";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import LokerTab from "./LokerTab";
import UmkmTab from "./UmkmTab";
import DashboardOverview from "./DashboardOverview";

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
  const [dashboardStats, setDashboardStats] = useState({
    totalUmkm: 0,
    totalLoker: 0,
    activeLoker: 0,
    inactiveLoker: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) setSidebarCollapsed(JSON.parse(savedState));
  }, []);
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

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

  useEffect(() => {
    if (activeTab === "dashboard") fetchDashboardStats();
    else if (activeTab === "umkm") fetchUmkmData();
    else if (activeTab === "loker") fetchLokerData();
  }, [activeTab]);

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
      setError(
        `Terjadi kesalahan koneksi: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      return null;
    }
  };

  const fetchUmkmData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UMKM}`, {
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch Loker data");
      const data = await response.json();
      if (data.success) setLokerData(data.data.data || []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch Loker data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
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
      const totalUmkm = umkmData?.data?.length || 0;
      const allLokers = lokerData?.data?.data || [];
      const totalLoker = allLokers.length;
      const activeLoker = allLokers.filter((loker: any) => loker.is_active).length;
      const inactiveLoker = totalLoker - activeLoker;
      setDashboardStats({ totalUmkm, totalLoker, activeLoker, inactiveLoker });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  const deleteLoker = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus loker ini?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.LOKER}/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
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
      const loker = lokerData.find((l: any) => l.id === id);
      if (!loker) throw new Error("Loker not found");
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
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update Loker status"
      );
    }
  };

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
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Failed to delete UMKM");
      await fetchUmkmData();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete UMKM"
      );
    }
  };

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
      <AdminNavbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onLogout={handleLogout}
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="hidden md:block">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

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

      <main
        className={`pt-16 p-6 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
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

        <div className="bg-white shadow rounded-lg">
          {activeTab === "dashboard" && (
          <DashboardOverview
          stats={dashboardStats}
          onRefresh={fetchDashboardStats}
          onTabChange={handleTabChange}
          />
          )}

          {activeTab === "umkm" && (
            <UmkmTab
              umkmData={umkmData}
              loading={loading}
              fetchUmkmData={fetchUmkmData}
              createUmkm={createUmkm}
              updateUmkm={updateUmkm}
              deleteUmkm={deleteUmkm}
            />
          )}

          {activeTab === "loker" && (
            <LokerTab
              lokerData={lokerData}
              loading={loading}
              fetchLokerData={fetchLokerData}
              deleteLoker={deleteLoker}
              toggleLokerStatus={toggleLokerStatus}
            />
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
        </div>
      </main>
    </div>
  );
}