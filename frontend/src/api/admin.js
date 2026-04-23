// src/api/admin.js
// Admin API client — attaches Sanctum Bearer token to every request

const API_BASE = (import.meta.env.VITE_API_URL ?? '') + '/api/v1/admin';

function getToken() {
  return localStorage.getItem('kokuro_admin_token');
}

function authHeaders(isMultipart = false) {
  const headers = { Authorization: `Bearer ${getToken()}` };
  if (!isMultipart) headers['Content-Type'] = 'application/json';
  headers['Accept'] = 'application/json';
  return headers;
}

async function req(method, path, body = null, isMultipart = false) {
  const opts = { method, headers: authHeaders(isMultipart) };
  if (body) opts.body = isMultipart ? body : JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw json;
  return json;
}

export const adminApi = {
  // Auth
  login:  (email, password) =>
    fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(r => r.json()),
  logout: () => req('POST', '/logout'),
  me:     () => req('GET',  '/me'),

  // Bookings
  getBookings:        (params = {}) => req('GET', '/bookings?' + new URLSearchParams(params)),
  getBookingStats:    ()            => req('GET', '/bookings/stats'),
  getBooking:         (id)          => req('GET', `/bookings/${id}`),
  updateBookingStatus:(id, status)  => req('PATCH', `/bookings/${id}/status`, { status }),

  // Services
  createService: (data) => req('POST',  '/services',    data),
  updateService: (id, data) => req('PATCH', `/services/${id}`, data),
  deleteService: (id)   => req('DELETE', `/services/${id}`),

  // Gallery
  createGallery: (formData) => req('POST', '/gallery', formData, true),
  updateGallery: (id, data) => req('PATCH', `/gallery/${id}`, data),
  deleteGallery: (id)       => req('DELETE', `/gallery/${id}`),

  // Testimonials
  createTestimonial: (data) => req('POST',  '/testimonials',    data),
  updateTestimonial: (id, data) => req('PATCH', `/testimonials/${id}`, data),
  deleteTestimonial: (id)   => req('DELETE', `/testimonials/${id}`),

  // Articles
  getAdminArticles: (page = 1) => req('GET', `/articles?page=${page}`),
  getAdminArticle:  (id)       => req('GET', `/articles/${id}`),
  createArticle:    (formData) => req('POST', '/articles', formData, true),
  updateArticle:    (id, formData) => req('POST', `/articles/${id}`, formData, true),
  deleteArticle:    (id)       => req('DELETE', `/articles/${id}`),
};
