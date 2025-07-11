

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request yang memerlukan autentikasi
api.interceptors.request.use(
  (config) => {
    // Hanya tambahkan token jika URL request bukan untuk login
    if (!config.url?.endsWith('/login')) {
      const token = localStorage.getItem('authToken'); // Ambil token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani respons error (misal: token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Jika token tidak valid atau expired, hapus token dan redirect ke login
      localStorage.removeItem('authToken');
      // Anda mungkin perlu me-redirect secara manual, karena ini di luar komponen React
      // window.location.href = '/login'; 
      // Untuk Next.js App Router, router.push() harus dipanggil dari dalam komponen
    }
    return Promise.reject(error);
  }
);

export default api;