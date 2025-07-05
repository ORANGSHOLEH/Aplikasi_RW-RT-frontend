// app/dashboard/page.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'ketua_rw' | 'ketua_rt' | 'warga';
  rw: string | null;
  rt: string | null;
  nik: string | null;
  warga?: { // Relasi 'warga' bisa di-load jika user adalah 'warga'
    nik: string;
    no_kk: string;
    nama: string;
    // ... properti warga lainnya yang ingin Anda tampilkan untuk diri sendiri
  } | null;
}

interface WargaData {
  nik: string;
  no_kk: string;
  nama: string;
  jenis_kelamin: 'L' | 'P';
  tempat_lahir: string | null;
  tanggal_lahir: string;
  agama: string | null;
  pendidikan: string | null;
  pekerjaan: string | null;
  status_perkawinan: string | null;
  kewarganegaraan: string | null;
  no_paspor: string | null;
  no_kitap: string | null;
  hubungan_dalam_keluarga: string | null;
  nama_ayah: string | null;
  nama_ibu: string | null;
  kk: { // Informasi KK terkait
    no_kk: string;
    alamat: string;
    rt: string | null;
    rw: string | null;
    kelurahan: string | null;
    kecamatan: string | null;
    kabupaten: string | null;
    provinsi: string | null;
    kode_pos: string | null;
    // ... properti kk lainnya
  } | null;
  // Jika Anda menambahkan no_hp di backend, tambahkan di sini juga:
  // no_hp?: string | null; 
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [wargaList, setWargaList] = useState<WargaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fetchDashboardData = useCallback(async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setAccessDenied(true);
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }

    try {
      const userRes = await api.get('/profile'); //
      if (userRes.data.status === 'success') {
        const fetchedUser = userRes.data.data;
        setUser(fetchedUser);

        // Perbarui localStorage dengan data user terbaru jika ada perubahan
        localStorage.setItem('userRole', fetchedUser.role);
        localStorage.setItem('userRW', fetchedUser.rw || '');
        localStorage.setItem('userRT', fetchedUser.rt || '');
        if (fetchedUser.role === 'warga' && fetchedUser.nik) {
            localStorage.setItem('userNik', fetchedUser.nik);
        } else {
            localStorage.removeItem('userNik');
        }
        
        // Fetch warga data
        const wargaRes = await api.get('/warga'); //
        if (wargaRes.data.status === 'success') {
          setWargaList(wargaRes.data.data); // Data sudah difilter dan dmasking oleh backend
        }
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err.response?.data || err.message);
      if (err.response && err.response.status === 401) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userRW');
        localStorage.removeItem('userRT');
        localStorage.removeItem('userNik');
        const timer = setTimeout(() => {
          router.push('/login');
        }, 200);
        return () => clearTimeout(timer);
      } else {
        setError('Gagal memuat data dashboard. Terjadi kesalahan.');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post('/logout'); //
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userRW');
      localStorage.removeItem('userRT');
      localStorage.removeItem('userNik');
      router.push('/login');
      setLoading(false);
    }
  };

  const handleEdit = (nik: string) => {
    alert(`Admin: Mengedit data warga dengan NIK: ${nik}. Implementasikan modal atau halaman edit di sini.`);
    // TODO: Implement actual edit logic: navigate to an edit form or open a modal
  };

  if (accessDenied) {
    return (
      <div style={{
        maxWidth: 500, margin: '50px auto', padding: 30, border: '2px solid #dc3545',
        borderRadius: 8, backgroundColor: '#f8d7da', color: '#721c24', textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)', fontSize: '1.1em', fontWeight: 'bold'
      }}>
        <h2 style={{ marginBottom: 15, color: '#dc3545' }}>⚠️ Akses Ditolak!</h2>
        <p style={{ marginBottom: 10 }}>Anda harus login terlebih dahulu untuk mengakses halaman ini.</p>
        <p>Mengalihkan Anda ke halaman Login...</p>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '24px', color: '#555' }}>
        Memuat dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red', fontSize: '1.2em' }}>
        {error}
        <button onClick={() => router.push('/login')} style={{ display: 'block', margin: '20px auto', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Kembali ke Login
        </button>
      </div>
    );
  }

  const roleColors = {
    admin: 'red',
    ketua_rw: 'blue',
    ketua_rt: 'green',
    warga: 'purple',
  };

  const currentRoleColor = roleColors[user.role] || 'gray';
  const displayRoleName = {
    admin: 'Super Admin',
    ketua_rw: `Ketua RW ${user.rw || ''}`,
    ketua_rt: `Ketua RT ${user.rt || ''}`,
    warga: `Warga (${user.name})`, // Menampilkan nama untuk warga
  }[user.role];

  // Fungsi untuk menentukan kolom yang terlihat berdasarkan peran
  const getVisibleColumns = () => {
    if (user.role === 'admin') {
      return ['No', 'Nama', 'Alamat Lengkap', 'RT/RW', 'L/P', 'Umur', 'Pekerjaan', 'NIK', 'No. KK', 'Aksi'];
    } else if (user.role === 'warga') {
      return ['No', 'Nama', 'Alamat Lengkap', 'RT/RW', 'L/P', 'Umur', 'Pekerjaan', 'NIK', 'No. KK']; // Warga bisa lihat NIK/KK sendiri
    } else { // Ketua RW, Ketua RT
      return ['No', 'Nama', 'Alamat Lengkap', 'RT/RW', 'L/P', 'Umur', 'Pekerjaan']; // No NIK/KK for masking demo
    }
  };

  const visibleColumns = getVisibleColumns();

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Sistem Informasi Warga RW/RT</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      {/* Current User Info */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div id="userInfo" className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`bg-${currentRoleColor}-100 p-3 rounded-full`}>
                <svg className={`w-6 h-6 text-${currentRoleColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Login sebagai: {displayRoleName}</h3>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                {user.role === 'warga' && user.warga && (
                  <p className="text-sm text-gray-600">NIK Anda: {user.warga.nik} (Data Lengkap)</p>
                )}
                <p className="text-sm text-gray-600">Akses data: {
                    user.role === 'admin' ? 'Semua warga di semua RT/RW' :
                    user.role === 'ketua_rw' ? `Semua warga di RW ${user.rw}` :
                    user.role === 'ketua_rt' ? `Warga di RT ${user.rt} RW ${user.rw}` :
                    'Data diri sendiri'
                }</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Data Sensitif (NIK/No. KK):</p>
              <span className={`text-sm font-semibold ${user.role === 'admin' || user.role === 'warga' ? 'text-green-600' : 'text-red-600'}`}>
                {user.role === 'admin' ? '✅ Dapat Melihat Semua' : user.role === 'warga' ? '✅ Dapat Melihat Milik Sendiri' : '❌ Tidak Dapat Melihat'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Warga Table */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Data Warga ({displayRoleName})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  {visibleColumns.map(col => (
                    <th key={col} className="p-4 text-sm font-semibold text-gray-700">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wargaList.length > 0 ? (
                  wargaList.map((warga, index) => (
                    <tr key={warga.nik} className="hover:bg-gray-50 transition-colors">
                      {visibleColumns.includes('No') && <td className="p-4 text-center">{index + 1}</td>}
                      {visibleColumns.includes('Nama') && (
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`bg-${currentRoleColor}-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium`}>
                              {warga.nama.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">{warga.nama}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.includes('Alamat Lengkap') && (
                        <td className="p-4 text-sm text-gray-700">
                          {`${warga.kk?.alamat || 'N/A'}${warga.kk?.kelurahan ? ', ' + warga.kk.kelurahan : ''}${warga.kk?.kecamatan ? ', ' + warga.kk.kecamatan : ''}${warga.kk?.kabupaten ? ', ' + warga.kk.kabupaten : ''}${warga.kk?.provinsi ? ', ' + warga.kk.provinsi : ''}${warga.kk?.kode_pos ? ' (' + warga.kk.kode_pos + ')' : ''}`}
                        </td>
                      )}
                      {visibleColumns.includes('RT/RW') && (
                        <td className="p-4 text-center">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                            RT {warga.kk?.rt || 'N/A'} RW {warga.kk?.rw || 'N/A'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.includes('L/P') && (
                        <td className="p-4 text-center">
                          <span className={`text-${warga.jenis_kelamin === 'L' ? 'blue' : 'pink'}-600 font-medium`}>
                            {warga.jenis_kelamin}
                          </span>
                        </td>
                      )}
                      {visibleColumns.includes('Umur') && <td className="p-4 text-center">{calculateAge(warga.tanggal_lahir)}</td>}
                      {visibleColumns.includes('Pekerjaan') && <td className="p-4 text-sm text-gray-700">{warga.pekerjaan}</td>}
                      {visibleColumns.includes('No. HP') && (
                        <td className="p-4 text-sm text-gray-700">
                          {/* Asumsi: Tambahkan kolom no_hp di tabel warga jika ingin menampilkan */}
                          {/* {warga.no_hp || 'N/A'} */}
                          N/A
                        </td>
                      )}
                      {visibleColumns.includes('NIK') && <td className="p-4 text-sm">{warga.nik}</td>}
                      {visibleColumns.includes('No. KK') && <td className="p-4 text-sm">{warga.no_kk}</td>}
                      {visibleColumns.includes('Aksi') && user.role === 'admin' && (
                        <td className="p-4">
                          <button
                            onClick={() => handleEdit(warga.nik)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={visibleColumns.length} className="p-4 text-center text-gray-500">Tidak ada data warga yang tersedia atau dapat diakses.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Permission Matrix - Hanya tampilkan untuk Admin */}
      {user.role === 'admin' && (
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Permission Matrix (Untuk Admin)</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Role</th>
                      <th className="border p-3 text-center">Akses Data</th>
                      <th className="border p-3 text-center">Lihat NIK/No. KK</th>
                      <th className="border p-3 text-center">Update Data</th>
                      <th className="border p-3 text-center">Hapus Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3 font-semibold text-red-600">Admin</td>
                      <td className="border p-3 text-center">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Semua Warga</span>
                      </td>
                      <td className="border p-3 text-center">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">✅ Ya</span>
                      </td>
                      <td className="border p-3 text-center">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">✅ Ya</span>
                      </td>
                      <td className="border p-3 text-center">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">✅ Ya</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-semibold text-blue-600">Ketua RW</td>
                      <td className="border p-3 text-center">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Seluruh RW</span>
                      </td>
                      <td className="border p-3 text-center">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">❌ Tidak</span>
                      </td>
                      <td className="border p-3 text-center">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">⚠️ Terbatas</span>
                      </td>
                      <td className="border p-3 text-center">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">❌ Tidak</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-semibold text-green-600">Ketua RT</td>
                      <td className="border p-3 text-center">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">RT Sendiri</span>
                      </td>
                      <td className="border p-3 text-center">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">❌ Tidak</span>
                      </td>
                      <td className="border p-3 text-center">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">⚠️ Terbatas</span>
                      </td>
                      <td className="border p-3 text-center">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">❌ Tidak</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-semibold text-purple-600">Warga</td>
                      <td className="border p-3 text-center">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Data Diri Sendiri</span>
                      </td>
                      <td className="border p-3 text-center">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">✅ Milik Sendiri</span>
                      </td>
                      <td className="border p-3 text-center">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">⚠️ Terbatas</span>
                      </td>
                      <td className="border p-3 text-center">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">❌ Tidak</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}