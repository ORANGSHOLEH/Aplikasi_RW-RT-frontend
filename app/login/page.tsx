// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.post('/login', { email, password });
      const data = res.data;

      if (data.status === 'success') {
        setSuccess(data.message);
        
        if (data.data && data.data.token) {
          localStorage.setItem('authToken', data.data.token); 
          localStorage.setItem('userRole', data.data.user.role);
          localStorage.setItem('userRW', data.data.user.rw || '');
          localStorage.setItem('userRT', data.data.user.rt || '');
          // Simpan NIK user jika role-nya 'warga' untuk pengecekan nanti
          if (data.data.user.role === 'warga' && data.data.user.nik) {
            localStorage.setItem('userNik', data.data.user.nik);
          } else {
            localStorage.removeItem('userNik'); // Hapus jika bukan warga
          }

          console.log('Token dan info user berhasil disimpan:', data.data);

        } else {
          console.warn('Login sukses, tapi token tidak ditemukan di respons:', data);
          setError('Login sukses, tapi token otentikasi tidak diterima. Silakan coba lagi.');
          setLoading(false);
          return;
        }

        router.push('/dashboard');

      } else {
        // Ini mungkin tidak akan terpicu jika backend selalu mengirim 401 untuk error
        setError(data.message || 'Login gagal.');
      }
    } catch (err: any) {
      console.error('Terjadi kesalahan saat login:', err.response?.data || err.message);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat().join(' ');
        setError(validationErrors);
      } else {
        setError('Terjadi kesalahan jaringan atau server. Pastikan backend berjalan.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#333' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', color: '#555' }}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', color: '#555' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#888',
                fontSize: '0.9em',
                padding: '5px',
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 16,
            fontWeight: 'bold',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
        {error && 
          <div style={{ color: 'red', marginTop: 16, textAlign: 'center' }}>
            {error}
            {error.includes('Password salah') && (
              <p style={{ marginTop: 8, fontSize: '0.9em' }}>
                <a href="/reset-password" style={{ color: '#007bff', textDecoration: 'underline' }}>Lupa password? Reset di sini.</a>
              </p>
            )}
            {error.includes('Email tidak terdaftar') && (
              <p style={{ marginTop: 8, fontSize: '0.9em' }}>
                <a href="/register" style={{ color: '#007bff', textDecoration: 'underline' }}>Belum punya akun? Daftar sekarang.</a>
              </p>
            )}
          </div>
        }
        {success && <div style={{ color: 'green', marginTop: 16, textAlign: 'center' }}>{success}</div>}
      </form>
    </div>
  );
}