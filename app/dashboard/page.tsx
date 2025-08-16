"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

// Firebase imports
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
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

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Admin",
          email: firebaseUser.email,
          role: "admin",
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch dashboard stats
  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const [umkmSnapshot, lokerSnapshot] = await Promise.all([
        getDocs(collection(db, "umkm")),
        getDocs(collection(db, "loker")),
      ]);

      const totalUmkm = umkmSnapshot.size;
      const allLokers = lokerSnapshot.docs.map((doc) => doc.data());
      const totalLoker = lokerSnapshot.size;
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
      setError("Failed to fetch dashboard statistics");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
          onTabChange={(tab) => {
            if (tab === "umkm") {
              router.push("/admin/umkm");
            } else if (tab === "loker") {
              router.push("/admin/loker");
            } else {
              setActiveTab(tab);
            }
          }}
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
              onTabChange={(tab) => {
                if (tab === "umkm") {
                  router.push("/admin/umkm");
                } else if (tab === "loker") {
                  router.push("/admin/loker");
                } else {
                  setActiveTab(tab);
                }
                setSidebarOpen(false);
              }}
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

        {/* Dashboard Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Dashboard</h3>
            <button
              onClick={fetchDashboardStats}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Refresh Data
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                      {dashboardStats.totalUmkm}
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
                      Total Lowongan
                    </dt>
                    <dd className="text-3xl font-bold text-white">
                      {dashboardStats.totalLoker}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

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
                      {dashboardStats.activeLoker}
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
                      {dashboardStats.inactiveLoker}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push("/admin/umkm")}
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
                onClick={() => router.push("/admin/loker")}
                className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💼</div>
                  <div className="text-sm font-medium text-gray-900">
                    Kelola Lowongan Kerja
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push("/")}
                className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="text-sm font-medium text-gray-900">
                    Lihat Website
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
