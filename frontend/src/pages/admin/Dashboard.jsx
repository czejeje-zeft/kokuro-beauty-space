import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';

const STATUS_COLORS = { pending:'yellow', confirmed:'green', done:'accent', cancelled:'cancelled' };
const STATUS_LABELS = { pending:'Menunggu', confirmed:'Dikonfirmasi', done:'Selesai', cancelled:'Dibatalkan' };

export default function Dashboard() {
  const [stats,    setStats]    = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [detail,   setDetail]   = useState(null);

  useEffect(() => {
    Promise.all([
      adminApi.getBookingStats(),
      adminApi.getBookings({ per_page: 8 }),
    ]).then(([s, b]) => {
      setStats(s.stats);
      setBookings(b.data ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Booking Hari Ini', value: stats?.today      ?? 0, cls: 'accent' },
    { label: 'Minggu Ini',       value: stats?.this_week  ?? 0, cls: 'green'  },
    { label: 'Bulan Ini',        value: stats?.this_month ?? 0, cls: 'pink'   },
    { label: 'Menunggu Konfirm', value: stats?.pending    ?? 0, cls: 'yellow' },
  ];

  function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  }

  if (loading) return (
    <div className="adm-content" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',color:'var(--adm-muted)'}}>
      Memuat data...
    </div>
  );

  return (
    <div className="adm-content">
      {/* Header */}
      <div className="adm-page-header">
        <h1>Dashboard</h1>
        <span style={{fontSize:'.85rem', color:'var(--adm-muted)', fontWeight:600}}>
          {new Date().toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
        </span>
      </div>

      {/* Stats */}
      <div className="adm-stats-grid">
        {statCards.map(s => (
          <div key={s.label} className={`adm-stat-card ${s.cls}`}>
            <div className="adm-stat-label">{s.label}</div>
            <div className="adm-stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings — with full data */}
      <div className="adm-card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
          <span className="adm-card-title" style={{margin:0}}>📅 Booking Terbaru</span>
          <Link to="/admin/bookings" className="adm-btn adm-btn-ghost adm-btn-sm">Lihat Semua →</Link>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Tanggal & Waktu</th>
                <th>Alamat</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} style={{textAlign:'center',color:'var(--adm-muted)',padding:'2rem'}}>
                    Belum ada booking masuk.
                  </td>
                </tr>
              )}
              {bookings.map(b => (
                <tr key={b.id}>
                  {/* Pelanggan */}
                  <td>
                    <div style={{fontWeight:700,color:'var(--adm-text)'}}>{b.name}</div>
                    <div style={{fontSize:'.78rem',color:'var(--adm-muted)',marginTop:'.1rem'}}>📱 {b.phone}</div>
                  </td>

                  {/* Layanan */}
                  <td>
                    <div style={{fontWeight:600,color:'var(--adm-mid)'}}>{b.service}</div>
                    {b.addons && (
                      <div style={{fontSize:'.75rem',color:'var(--adm-muted)',marginTop:'.1rem'}}>+ {b.addons}</div>
                    )}
                  </td>

                  {/* Tanggal & Waktu */}
                  <td style={{whiteSpace:'nowrap'}}>
                    <div style={{fontWeight:600}}>
                      {new Date(b.date).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}
                    </div>
                    <div style={{fontSize:'.78rem',color:'var(--adm-muted)',marginTop:'.1rem'}}>
                      🕐 {b.time ? b.time + ' WIB' : 'Fleksibel'}
                    </div>
                  </td>

                  {/* Alamat */}
                  <td style={{maxWidth:'180px'}}>
                    <div style={{fontSize:'.82rem',color:'var(--adm-mid)',lineHeight:1.4,
                      overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
                      📍 {b.address}
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`adm-badge ${STATUS_COLORS[b.status] ?? 'draft'}`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>

                  {/* Detail */}
                  <td>
                    <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setDetail(b)}>
                      Lihat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem',marginTop:'1rem'}}>
        {[
          {to:'/admin/articles/new', icon:'✍️', label:'Tulis Artikel Baru',   sub:'Buat konten baru'},
          {to:'/admin/gallery',      icon:'🖼️',  label:'Upload ke Galeri',     sub:'Tambah foto portofolio'},
          {to:'/admin/services',     icon:'💅',  label:'Edit Harga Layanan',   sub:'Update pricelist'},
          {to:'/admin/bookings',     icon:'📋',  label:'Kelola Semua Booking', sub:'Konfirmasi jadwal'},
        ].map(q => (
          <Link key={q.to} to={q.to} className="adm-card"
            style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'.875rem',cursor:'pointer',transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(26,148,243,.14)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
            <span style={{fontSize:'1.75rem'}}>{q.icon}</span>
            <div>
              <div style={{fontWeight:700,fontSize:'.875rem',color:'var(--adm-text)'}}>{q.label}</div>
              <div style={{fontSize:'.75rem',color:'var(--adm-muted)',marginTop:'.1rem'}}>{q.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="adm-modal-backdrop" onClick={() => setDetail(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3>Detail Booking #{detail.id}</h3>
              <button className="adm-modal-close" onClick={() => setDetail(null)}>✕</button>
            </div>

            <div style={{marginBottom:'1rem'}}>
              <span className={`adm-badge ${STATUS_COLORS[detail.status]??'draft'}`}>
                {STATUS_LABELS[detail.status] ?? detail.status}
              </span>
            </div>

            {[
              ['👤 Nama',      detail.name],
              ['📱 WhatsApp',  detail.phone],
              ['💅 Layanan',   detail.service],
              ['✨ Add-on',    detail.addons || '-'],
              ['📅 Tanggal',   formatDate(detail.date)],
              ['🕐 Waktu',     detail.time ? detail.time + ' WIB' : 'Fleksibel'],
              ['📍 Alamat',    detail.address],
              ['📝 Catatan',   detail.notes || '-'],
              ['🕒 Dibuat',    formatDate(detail.created_at)],
            ].map(([k, v]) => (
              <div key={k} className="adm-detail-row">
                <span className="adm-detail-key">{k}</span>
                <span className="adm-detail-val">{v}</span>
              </div>
            ))}

            <div style={{marginTop:'1.25rem',display:'flex',gap:'.75rem',justifyContent:'flex-end'}}>
              <a
                href={`https://wa.me/${detail.phone?.replace(/\D/g,'')}`}
                target="_blank" rel="noopener noreferrer"
                className="adm-btn adm-btn-primary adm-btn-sm"
              >
                💬 Chat WA
              </a>
              <Link to="/admin/bookings" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setDetail(null)}>
                Kelola Booking →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
