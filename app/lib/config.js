export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/login",
  LOGOUT: "/logout",
  PROFILE: "/profile",

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

  // Loker endpoints
  LOKER: "/loker",
  LOKER_STORE: "/loker",
  LOKER_SHOW: (id) => `/loker/${id}`,
  LOKER_UPDATE: (id) => `/loker/${id}`,
  LOKER_DELETE: (id) => `/loker/${id}`,
  LOKER_UPLOAD_IMAGE: "/loker-upload-image",
  LOKER_FILTER_OPTIONS: "/loker-filter-options",

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
