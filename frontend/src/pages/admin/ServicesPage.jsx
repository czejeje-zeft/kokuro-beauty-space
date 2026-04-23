import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { api } from '../../api/kokuro';

const CATEGORIES = { nail:'💅 Nail Art', lash:'👁️ Eyelash', presson:'📦 Press-on' };

function Toast({ msg, type }) { return msg ? <div className={`adm-toast ${type}`}>{msg}</div> : null; }

const EMPTY = { name:'', category:'nail', description:'', price:'', price_label:'', icon:'', badge:'', sort_order:0, is_active:true };

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [modal,    setModal]    = useState(null); // null | 'new' | service object
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  function loadServices() { api.getServices().then(setServices); }
  useEffect(() => { loadServices(); }, []);

  function openNew() {
    const maxOrder = services.length > 0 ? Math.max(...services.map(s => Number(s.sort_order) || 0)) : 0;
    setForm({...EMPTY, sort_order: maxOrder + 1});
    setModal('new');
  }
  function openEdit(s)  { setForm({...s, price: String(s.price)}); setModal(s); }
  function closeModal() { setModal(null); }

  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({...f, [name]: type==='checkbox' ? checked : value}));
  }

  async function save() {
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), sort_order: Number(form.sort_order) };
      if (modal === 'new') await adminApi.createService(payload);
      else                 await adminApi.updateService(modal.id, payload);
      showToast(modal === 'new' ? 'Layanan ditambahkan!' : 'Layanan diperbarui!');
      loadServices(); closeModal();
    } catch { showToast('Gagal menyimpan.', 'error'); }
    finally { setSaving(false); }
  }

  async function del(s) {
    if (!confirm(`Hapus layanan "${s.name}"?`)) return;
    try { await adminApi.deleteService(s.id); showToast('Layanan dihapus.'); loadServices(); }
    catch { showToast('Gagal menghapus.', 'error'); }
  }

  const grouped = Object.entries(CATEGORIES).map(([key, label]) => ({
    key, label, items: services.filter(s => s.category === key)
  }));

  return (
    <div className="adm-content">
      <Toast {...(toast??{})} />
      <div className="adm-page-header">
        <h1>💅 Manajemen Layanan</h1>
        <button className="adm-btn adm-btn-primary" onClick={openNew}>+ Tambah Layanan</button>
      </div>

      {grouped.map(group => (
        <div key={group.key} className="adm-card" style={{marginBottom:'1rem'}}>
          <div className="adm-card-title">{group.label}</div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Nama</th><th>Harga</th><th>Badge</th><th>Aktif</th><th>Urutan</th><th>Aksi</th></tr></thead>
              <tbody>
                {group.items.length === 0 && <tr><td colSpan={6} style={{color:'var(--adm-muted)',textAlign:'center'}}>Belum ada layanan.</td></tr>}
                {group.items.map(s => (
                  <tr key={s.id}>
                    <td><span style={{fontWeight:600}}>{s.icon} {s.name}</span></td>
                    <td>{s.price_label || `Rp ${s.price.toLocaleString('id-ID')}`}</td>
                    <td>{s.badge && <span className="adm-badge published">{s.badge}</span>}</td>
                    <td><span className={`adm-badge ${s.is_active?'published':'draft'}`}>{s.is_active?'Aktif':'Nonaktif'}</span></td>
                    <td>{s.sort_order}</td>
                    <td style={{display:'flex',gap:'.5rem'}}>
                      <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={()=>openEdit(s)}>Edit</button>
                      <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={()=>del(s)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Modal */}
      {modal && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal" onClick={e=>e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3>{modal==='new'?'Tambah Layanan Baru':'Edit Layanan'}</h3>
              <button className="adm-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-form">
              <div className="adm-form-row">
                <div className="adm-field">
                  <label className="adm-label">Nama Layanan *</label>
                  <input className="adm-input" name="name" value={form.name} onChange={change} placeholder="Nail Extension..." />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Kategori *</label>
                  <select className="adm-select" name="category" value={form.category} onChange={change}>
                    {Object.entries(CATEGORIES).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label className="adm-label">Harga (angka) *</label>
                  <input className="adm-input" name="price" type="number" value={form.price} onChange={change} placeholder="45000" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Label Harga (tampilan)</label>
                  <input className="adm-input" name="price_label" value={form.price_label} onChange={change} placeholder="Mulai Rp 45.000" />
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label className="adm-label">Icon (emoji)</label>
                  <input className="adm-input" name="icon" value={form.icon} onChange={change} placeholder="💅" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Badge</label>
                  <input className="adm-input" name="badge" value={form.badge} onChange={change} placeholder="Bestseller" />
                </div>
              </div>
              <div className="adm-field">
                <label className="adm-label">Deskripsi</label>
                <textarea className="adm-textarea" name="description" value={form.description} onChange={change} rows={2} />
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label className="adm-label">Urutan</label>
                  <input className="adm-input" name="sort_order" type="number" value={form.sort_order} onChange={change} />
                </div>
                <div className="adm-field" style={{justifyContent:'flex-end', flexDirection:'row', alignItems:'center', gap:'.5rem', paddingTop:'1.25rem'}}>
                  <input type="checkbox" id="is_active" name="is_active" checked={form.is_active} onChange={change} />
                  <label htmlFor="is_active" className="adm-label" style={{margin:0}}>Aktif</label>
                </div>
              </div>
              <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end',marginTop:'.5rem'}}>
                <button className="adm-btn adm-btn-ghost" onClick={closeModal}>Batal</button>
                <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>
                  {saving ? <><span className="adm-spinner" /> Menyimpan...</> : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
