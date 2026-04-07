import { useState } from 'react';
import { api, buildWhatsAppUrl } from '../api/kokuro';

export default function Booking() {
  const [form, setForm]       = useState({ name:'', phone:'', service:'', date:'', time:'', addons:'', address:'', notes:'' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null); // {type:'success'|'error', msg}

  // Set min date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  function change(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim())    errs.name    = 'Nama wajib diisi.';
    if (!form.phone.trim())   errs.phone   = 'WhatsApp wajib diisi.';
    else if (!/^[0-9+\s\-]{9,15}$/.test(form.phone.trim())) errs.phone = 'Nomor WA tidak valid.';
    if (!form.service)        errs.service = 'Pilih layanan.';
    if (!form.date)           errs.date    = 'Tanggal wajib diisi.';
    if (!form.address.trim()) errs.address = 'Alamat wajib diisi.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // ── Always generate WhatsApp URL client-side (works without backend) ──
    const waUrl = buildWhatsAppUrl(form);

    // ── Try to save to DB in background (non-blocking) ──
    api.submitBooking(form).catch(() => { /* silent – backend optional */ });

    // ── Immediately open WhatsApp & show success ──
    window.open(waUrl, '_blank');
    setToast({ type: 'success', msg: '✅ WhatsApp terbuka! Kirim pesan untuk konfirmasi booking.' });
    setForm({ name:'', phone:'', service:'', date:'', time:'', addons:'', address:'', notes:'' });
    setLoading(false);
    setTimeout(() => setToast(null), 6000);
  }



  return (
    <section className="booking-section" id="booking">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">📅 Booking</span>
          <h2 className="section-title">Reservasi Sekarang</h2>
          <p className="section-desc">Isi form di bawah, kami akan konfirmasi via WhatsApp dalam 1x24 jam</p>
        </div>

        {toast && (
          <div className={`alert-toast alert-${toast.type}`} style={{
            padding:'.875rem 1.5rem', borderRadius:'12px', marginBottom:'1.5rem',
            background: toast.type === 'success' ? 'rgba(22,163,74,.10)' : 'rgba(220,38,38,.10)',
            border: `1px solid ${toast.type === 'success' ? 'rgba(22,163,74,.30)' : 'rgba(220,38,38,.30)'}`,
            color: toast.type === 'success' ? '#15803d' : '#dc2626',
            display:'flex', alignItems:'center', gap:'.75rem',
            fontWeight: 600, fontSize: '.9rem',
          }}>
            <span>{toast.type === 'success' ? '✅' : '❌'}</span>
            <span>{toast.msg}</span>
          </div>
        )}


        <div className="booking-wrapper">
          {/* ── Form ── */}
          <div className="booking-form-wrap">
            <form className="booking-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bookName">Nama Lengkap *</label>
                  <input type="text" id="bookName" name="name" value={form.name} onChange={change}
                    placeholder="Contoh: Siti Rahayu" autoComplete="name" className={errors.name ? 'error':''} />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="bookPhone">WhatsApp *</label>
                  <input type="tel" id="bookPhone" name="phone" value={form.phone} onChange={change}
                    placeholder="08xxxxxxxxxx" autoComplete="tel" className={errors.phone ? 'error':''} />
                  {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bookService">Layanan *</label>
                  <select id="bookService" name="service" value={form.service} onChange={change} className={errors.service ? 'error':''}>
                    <option value="" disabled>Pilih layanan...</option>
                    <optgroup label="💅 Nail Art">
                      {['Manicure – Rp 45.000','Pedicure – Rp 58.000','Nail Gel + Manicure – Rp 60.000',
                        'Nail Gel + Pedicure – Rp 70.000','Nail Extension + Gel + Manicure – Rp 140.000'].map(s => (
                        <option key={s} value={s.split(' – ')[0]}>{s}</option>
                      ))}
                    </optgroup>
                    <optgroup label="👁️ Eyelash Extension">
                      {['Single Classic Lash – Rp 90.000','YY-Lash – Rp 120.000','W-Lash – Rp 160.000',
                        'Hybrid Lash – Rp 180.000','Wispy Lash – Rp 210.000'].map(s => (
                        <option key={s} value={s.split(' – ')[0]}>{s}</option>
                      ))}
                    </optgroup>
                    <optgroup label="📦 Press-on Nails">
                      {['Press-on Plain – Rp 35.000','Press-on Custom Design – Mulai Rp 45.000'].map(s => (
                        <option key={s} value={s.split(' – ')[0]}>{s}</option>
                      ))}
                    </optgroup>
                  </select>
                  {errors.service && <span className="error-msg">{errors.service}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="bookDate">Tanggal *</label>
                  <input type="date" id="bookDate" name="date" value={form.date} onChange={change}
                    min={minDate} className={errors.date ? 'error':''} />
                  {errors.date && <span className="error-msg">{errors.date}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bookTime">Waktu yang Diinginkan</label>
                  <select id="bookTime" name="time" value={form.time} onChange={change}>
                    <option value="">Pilih waktu...</option>
                    {['08.00','09.00','10.00','11.00','13.00','14.00','15.00','16.00'].map(t => (
                      <option key={t} value={t}>{t} WIB</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="bookAddons">Add-on Desain</label>
                  <input type="text" id="bookAddons" name="addons" value={form.addons} onChange={change}
                    placeholder="Contoh: French tip, cat eye..." />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="bookAddress">Alamat Lengkap *</label>
                <textarea id="bookAddress" name="address" value={form.address} onChange={change} rows={3}
                  placeholder="Tuliskan alamat lengkap untuk home service..."
                  className={errors.address ? 'error':''} />
                {errors.address && <span className="error-msg">{errors.address}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="bookNotes">Catatan Tambahan</label>
                <textarea id="bookNotes" name="notes" value={form.notes} onChange={change} rows={2}
                  placeholder="Warna, referensi gambar, atau permintaan khusus..." />
              </div>

              <div className="form-submit">
                <button type="submit" className="btn btn-primary btn-submit" id="submitBooking" disabled={loading}>
                  <span className="btn-icon">💬</span>
                  {loading ? 'Mengirim...' : 'Kirim via WhatsApp'}
                </button>
                <p className="form-note">✅ Form akan otomatis membuka WhatsApp dengan pesan siap kirim</p>
              </div>
            </form>
          </div>

          {/* ── Info ── */}
          <div className="booking-info">
            <div className="binfo-card">
              <div className="binfo-icon">📌</div>
              <h3>Cara Booking</h3>
              <ol className="binfo-steps">
                <li>Isi form dengan lengkap</li>
                <li>Klik "Kirim via WhatsApp"</li>
                <li>Konfirmasi jadwal dengan Ellen</li>
                <li>Bayar setelah layanan selesai</li>
              </ol>
            </div>
            <div className="binfo-card">
              <div className="binfo-icon">⏰</div>
              <h3>Syarat Booking</h3>
              <ul className="binfo-list">
                <li>Booking minimal <strong>H-1</strong></li>
                <li>Hanya melayani <strong>Home Service</strong></li>
                <li>Area layanan: <strong>Pontianak</strong></li>
                <li>Fast respon via <strong>WhatsApp</strong></li>
              </ul>
            </div>
            <a href="https://wa.me/6283838938922" target="_blank" rel="noopener noreferrer"
              className="wa-direct-btn" id="waDirectBtn">
              <span className="wa-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </span>
              Chat Langsung via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
