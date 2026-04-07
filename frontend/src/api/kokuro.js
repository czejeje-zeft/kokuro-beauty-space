// src/api/kokuro.js
// Centralized API client for Kokuro Beauty Space
// In production, VITE_API_URL points to the deployed Laravel backend.
// If the env var is not set, falls back to same-origin (Vite proxy in dev).

const API_BASE = (import.meta.env.VITE_API_URL ?? '') + '/api/v1';

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getServices:     () => fetchJson('/services'),
  getPricelist:    () => fetchJson('/pricelist'),
  getTestimonials: () => fetchJson('/testimonials'),
  getGallery:      () => fetchJson('/gallery'),

  submitBooking: async (data) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json;
  },
};

// ── Client-side WhatsApp URL generator (used as fallback when API is down) ──
export function buildWhatsAppUrl(form) {
  const dateStr = form.date
    ? new Date(form.date).toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
    : form.date;

  const lines = [
    'Halo Kak Ellen! Saya ingin booking layanan di Kokuro Beauty Space 💅',
    '',
    '📌 *Detail Booking:*',
    `• Nama      : ${form.name}`,
    `• WhatsApp  : ${form.phone}`,
    `• Layanan   : ${form.service}`,
    `• Tanggal   : ${dateStr}`,
    form.time    ? `• Waktu     : ${form.time} WIB`   : null,
    form.addons  ? `• Add-on    : ${form.addons}`      : null,
    `• Alamat    : ${form.address}`,
    form.notes   ? `• Catatan   : ${form.notes}`       : null,
    '',
    'Mohon konfirmasi jadwal yang tersedia ya Kak! 🙏',
  ].filter(l => l !== null);

  return `https://wa.me/6283838938922?text=${encodeURIComponent(lines.join('\n'))}`;
}
