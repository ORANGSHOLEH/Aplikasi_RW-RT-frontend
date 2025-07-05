'use client'; // Jika menggunakan App Router Next.js 13+

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // atau 'next/router' untuk Pages Router

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [kkData, setKkData] = useState([]);
  const [wargaData, setWargaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState('');
  
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.107:8000/api';

  useEffect(() => {
    checkAuth();
    fetchUserProfile();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  };

 const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const fullUrl = ${API_BASE_URL}${endpoint};
  
  console.log('🔍 API Call Debug:', {
    url: fullUrl,
    method: options.method || 'GET',
    token: token ? ${token.substring(0, 10)}... : 'No token',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? Bearer ${token} : 'No auth',
      ...options.headers,
    }
  });
  
  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Bearer ${token},
        ...options.headers,
      },
      ...options,
    });

    console.log('📡 Response Status:', response.status);
    console.log('📡 Response Headers:', [...response.headers.entries()]);

    if (response.status === 401) {
      console.log('🚫 Unauthorized - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
      return null;
    }

    const data = await response.json();
    console.log('📦 Response Data:', data);
    return data;
    
  } catch (err) {
    console.error('❌ API call error:', err);
    console.error('❌ Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    setError(Terjadi kesalahan koneksi: ${err.message});
    return null;
  }
};
  const fetchUserProfile = async () => {
    setLoading(true);
    const data = await apiCall('/profile');
    
    if (data && data.status === 'success') {
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    
    setLoading(false);
  };

  const fetchKkData = async () => {
    setLoading(true);
    const data = await apiCall('/kk');
    
    if (data && data.status === 'success') {
      setKkData(data.data || []);
    } else if (data) {
      setError(data.message || 'Gagal mengambil data KK');
    }
    
    setLoading(false);
  };

  const fetchWargaData = async () => {
    setLoading(true);
    const data = await apiCall('/warga');
    
    if (data && data.status === 'success') {
      setWargaData(data.data || []);
    } else if (data) {
      setError(data.message || 'Gagal mengambil data Warga');
    }
    
    setLoading(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    
    if (tab === 'kk' && kkData.length === 0) {
      fetchKkData();
    } else if (tab === 'warga' && wargaData.length === 0) {
      fetchWargaData();
    }
  };

  const handleLogout = async () => {
    await apiCall('/logout', { method: 'POST' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      ketua_rw: 'bg-blue-100 text-blue-800',
      ketua_rt: 'bg-green-100 text-green-800',
      warga: 'bg-purple-100 text-purple-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleDisplayName = (role) => {
    const names = {
      admin: 'Administrator',
      ketua_rw: 'Ketua RW',
      ketua_rt: 'Ketua RT',
      warga: 'Warga'
    };
    return names[role] || role;
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">🏠</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Sistem RW-RT</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user?.role)}`}>
                  {getRoleDisplayName(user?.role)}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {['profile', 'kk', 'warga'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'profile' ? 'Profil' : tab === 'kk' ? 'Data KK' : 'Data Warga'}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Profil</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nama</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Role</label>
                  <p className="mt-1 text-sm text-gray-900">{getRoleDisplayName(user?.role)}</p>
                </div>
                {user?.rw && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">RW</label>
                    <p className="mt-1 text-sm text-gray-900">{user.rw}</p>
                  </div>
                )}
                {user?.rt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">RT</label>
                    <p className="mt-1 text-sm text-gray-900">{user.rt}</p>
                  </div>
                )}
                {user?.nik && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">NIK</label>
                    <p className="mt-1 text-sm text-gray-900">{user.nik}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* KK Tab */}
          {activeTab === 'kk' && (
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Data Kartu Keluarga</h3>
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
                      {kkData.map((kk, index) => (
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
                            {kk.kepala_keluarga?.nama || '-'}
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
          {activeTab === 'warga' && (
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Data Warga</h3>
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
                      {wargaData.map((warga, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {warga.nik}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {warga.nama}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {warga.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
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
        </div>
      </main>
    </div>
  );
}
