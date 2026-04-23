import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/admin';

const STATUS_OPTS = ['', 'pending', 'confirmed', 'done', 'cancelled'];
const STATUS_LABELS = { pending:'Menunggu', confirmed:'Dikonfirmasi', done:'Selesai', cancelled:'Dibatalkan' };
const STATUS_COLORS = { pending:'yellow', confirmed:'green', done:'accent', cancelled:'red' };

function Toast({ msg, type }) {
  return msg ? <div className={`adm-toast ${type}`}>{msg}</div> : null;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState({ status: '', date: '' });
  const [page,     setPage]     = useState(1);
  const [meta,     setMeta]     = useState({});
  const [toast,    setToast]    = useState(null);
  const [detail,   setDetail]   = useState(null);

  const showToast = (msg, type='success') => { setToast({msg, type}); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(() => {
    setLoading(true);
    adminApi.getBookings({ ...filter, page }).then(res => {
      setBookings(res.data ?? []);
      setMeta({ last_page: res.last_page, total: res.total });
    }).finally(() => setLoading(false));
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  async function changeStatus(booking, status) {
    try {
      await adminApi.updateBookingStatus(booking.id, status);
      showToast(`Status diubah ke "${STATUS_LABELS[status]}"`);
      load();
      if (detail?.id === booking.id) setDetail({ ...detail, status });
    } catch { showToast('Gagal ubah status.', 'error'); }
  }

  return (
    <div className="adm-content">
      <Toast {...(toast ?? {})} />
      <div className="adm-page-header">
        <h1>📅 Manajemen Booking</h1>
        <span style={{fontSize:'.8rem', color:'var(--adm-muted)'}}>Total: {meta.total ?? 0}</span>
      </div>

      {/* Filters */}
      <div className="adm-filters">
        <select className="adm-select" value={filter.status}
          onChange={e => { setFilter(f=>({...f,status:e.target.value})); setPage(1); }}>
          <option value="">Semua Status</option>
          {STATUS_OPTS.slice(1).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <input className="adm-input" type="date" value={filter.date}
          onChange={e => { setFilter(f=>({...f,date:e.target.value})); setPage(1); }} />
        {(filter.status||filter.date) &&
          <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={()=>{setFilter({status:'',date:''});setPage(1);}}>✕ Reset</button>}
      </div>

      <div className="adm-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr>
              <th>#</th><th>Nama</th><th>Layanan</th><th>Tanggal</th><th>Alamat</th><th>Status</th><th>Aksi</th>
            </tr></thead>
            <tbody>
              {loading && <tr><td colSpan={6} style={{color:'var(--adm-muted)',textAlign:'center'}}>Memuat...</td></tr>}
              {!loading && bookings.length === 0 && <tr><td colSpan={6} style={{color:'var(--adm-muted)',textAlign:'center'}}>Tidak ada data.</td></tr>}
              {!loading && bookings.map(b => (
                <tr key={b.id}>
                  <td style={{color:'var(--adm-muted)',fontSize:'.75rem'}}>{b.id}</td>
                  <td>
                    <div style={{fontWeight:600}}>{b.name}</div>
                    <div style={{fontSize:'.75rem',color:'var(--adm-muted)'}}>{b.phone}</div>
                  </td>
                  <td>{b.service}</td>
                  <td style={{whiteSpace:'nowrap'}}>
                    {new Date(b.date).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}
                    {b.time && <div style={{fontSize:'.75rem',color:'var(--adm-muted)'}}>{b.time} WIB</div>}
                  </td>
                  <td style={{maxWidth:'180px'}}>
                    <div style={{fontSize:'.82rem',color:'var(--adm-mid)',lineHeight:1.4,
                      overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
                      {b.address}
                    </div>
                  </td>
                  <td>
                    <select value={b.status}
                      onChange={e => changeStatus(b, e.target.value)}
                      style={{background:'transparent',border:'none',color:'inherit',fontFamily:'inherit',fontSize:'.85rem',cursor:'pointer'}}>
                      {STATUS_OPTS.slice(1).map(s =>
                        <option key={s} value={s} style={{background:'#1a1d27'}}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={()=>setDetail(b)}>Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="adm-pagination">
            <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
            {Array.from({length:meta.last_page},(_,i)=>i+1).map(p=>(
              <button key={p} className={p===page?'active':''} onClick={()=>setPage(p)}>{p}</button>
            ))}
            <button disabled={page===meta.last_page} onClick={()=>setPage(p=>p+1)}>›</button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="adm-modal-backdrop" onClick={()=>setDetail(null)}>
          <div className="adm-modal" onClick={e=>e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3>Detail Booking #{detail.id}</h3>
              <button className="adm-modal-close" onClick={()=>setDetail(null)}>✕</button>
            </div>
            {[
              ['Nama',     detail.name],
              ['WhatsApp', detail.phone],
              ['Layanan',  detail.service],
              ['Tanggal',  new Date(detail.date).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})],
              ['Waktu',    detail.time ? detail.time+' WIB' : 'Fleksibel'],
              ['Add-on',   detail.addons || '-'],
              ['Alamat',   detail.address],
              ['Catatan',  detail.notes || '-'],
              ['Status',   detail.status],
            ].map(([k,v]) => (
              <div key={k} style={{display:'flex',gap:'1rem',padding:'.5rem 0',borderBottom:'1px solid var(--adm-border)',fontSize:'.875rem'}}>
                <span style={{color:'var(--adm-muted)',minWidth:'80px'}}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
            <div style={{marginTop:'1rem',display:'flex',gap:'.5rem',flexWrap:'wrap'}}>
              {STATUS_OPTS.slice(1).filter(s=>s!==detail.status).map(s=>(
                <button key={s} className={`adm-btn adm-btn-sm adm-btn-${s==='cancelled'?'danger':'ghost'}`}
                  onClick={()=>changeStatus(detail,s)}>
                  → {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
