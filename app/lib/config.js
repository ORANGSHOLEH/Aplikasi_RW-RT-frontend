export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/login",
  LOGOUT: "/logout",
  PROFILE: "/profile",
  UMKM: '/umkm',

  // Health check
  HEALTH: "/health",

  // KK (Kartu Keluarga) endpoints
  KK: "/kk",
  KK_STORE: "/kk",
  KK_SHOW: (id) => `/kk/${id}`,
  KK_UPDATE: (id) => `/kk/${id}`,
  KK_DELETE: (id) => `/kk/${id}`,

  // Warga endpoints
  WARGA: "/warga",
  WARGA_STORE: "/warga",
  WARGA_SHOW: (id) => `/warga/${id}`,
  WARGA_UPDATE: (id) => `/warga/${id}`,
  WARGA_DELETE: (id) => `/warga/${id}`,

  // Laravel Sanctum
  CSRF_COOKIE: "/sanctum/csrf-cookie",
};

// HTTP Methods untuk referensi
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};


