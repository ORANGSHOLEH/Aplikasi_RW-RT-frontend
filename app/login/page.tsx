'use client'; // Jika menggunakan App Router Next.js 13+

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // atau 'next/router' untuk Pages Router

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();

  // API Base URL - sesuaikan dengan NGROK URL Anda
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.107:8000/api';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Simpan token dan user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Redirect ke dashboard
        router.push('/dashboard');
      } else {
        // Handle error dengan pesan yang informatif
        setError(getErrorMessage(data));
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Periksa koneksi internet Anda.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (data) => {
    switch (data.error_type) {
      case 'email_not_found':
        return 'Email tidak terdaftar. Periksa kembali email Anda.';
      case 'wrong_password':
        return 'Password salah. Gunakan fitur lupa password jika tidak ingat.';
      case 'validation_error':
        const errors = data.errors;
        return Object.values(errors).flat().join(', ');
      case 'rate_limit_exceeded':
        return `Terlalu banyak percobaan. Coba lagi dalam ${data.retry_after} detik.`;
      default:
        return data.message || 'Terjadi kesalahan saat login.';
    }
  };

  // Quick login buttons untuk testing
  const quickLogin = (role) => {
    const credentials = {
      admin: { email: 'admin@rwrt.com', password: 'password' },
      ketua_rw: { email: 'rw01@rwrt.com', password: 'password' },
      ketua_rt: { email: 'rt01@rwrt.com', password: 'password' },
      warga: { email: 'warga@rwrt.com', password: 'password' }
    };
    
    setFormData(credentials[role]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">🏠</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Sistem RW-RT</h2>
            <p className="text-gray-600 mt-2">Silakan login untuk melanjutkan</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Masukkan email Anda"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                  placeholder="Masukkan password Anda"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <span className="text-gray-400">🙈</span>
                  ) : (
                    <span className="text-gray-400">👁️</span>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Quick Login Buttons untuk Testing */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-4">Quick Login (untuk testing):</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Admin
              </button>
              <button
                onClick={() => quickLogin('ketua_rw')}
                className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Ketua RW
              </button>
              <button
                onClick={() => quickLogin('ketua_rt')}
                className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Ketua RT
              </button>
              <button
                onClick={() => quickLogin('warga')}
                className="px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              >
                Warga
              </button>
            </div>
          </div>

          {/* API Info */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              API: {API_BASE_URL}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
