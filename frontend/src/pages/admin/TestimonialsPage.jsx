import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { api } from '../../api/kokuro';

function Toast({ msg, type }) { return msg ? <div className={`adm-toast ${type}`}>{msg}</div> : null; }

const EMPTY = { name:'', service_type:'', avatar_letter:'', text:'', rating:5, sort_order:0, is_active:true };

export default function TestimonialsPage() {
  const [items,  setItems]  = useState([]);
  const [modal,  setModal]  = useState(null);
  const [form,   setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast,  setToast]  = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  function load() { api.getTestimonials().then(res => setItems(Array.isArray(res)?res:res.data??[])); }
  useEffect(() => { load(); }, []);

  function openNew()   { setForm({...EMPTY}); setModal('new'); }
  function openEdit(t) { setForm({...t}); setModal(t); }
  const change = e => { const {name,value,type,checked}=e.target; setForm(f=>({...f,[name]:type==='checkbox'?checked:value})); };

  async function save() {
    setSaving(true);
    try {
      const payload = { ...form, rating: Number(form.rating), sort_order: Number(form.sort_order) };
      if (modal==='new') await adminApi.createTestimonial(payload);
      else               await adminApi.updateTestimonial(modal.id, payload);
      showToast(modal==='new'?'Testimoni ditambahkan!':'Testimoni diperbarui!');
      load(); setModal(null);
    } catch { showToast('Gagal menyimpan.', 'error'); }
    finally { setSaving(false); }
  }

  async function del(t) {
    if (!confirm(`Hapus testimoni dari "${t.name}"?`)) return;
    try { await adminApi.deleteTestimonial(t.id); showToast('Testimoni dihapus.'); load(); }
    catch { showToast('Gagal hapus.', 'error'); }
  }

  return (
    <div className="adm-content">
      <Toast {...(toast??{})} />
      <div className="adm-page-header">
        <h1>⭐ Manajemen Testimoni</h1>
        <button className="adm-btn adm-btn-primary" onClick={openNew}>+ Tambah Testimoni</button>
      </div>

      <div className="adm-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Nama</th><th>Layanan</th><th>Rating</th><th>Aktif</th><th>Aksi</th></tr></thead>
            <tbody>
              {items.length===0 && <tr><td colSpan={5} style={{color:'var(--adm-muted)',textAlign:'center'}}>Belum ada testimoni.</td></tr>}
              {items.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#7c6ef5,#ec4899)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'.85rem',color:'#fff',flexShrink:0}}>
                        {t.avatar_letter}
                      </div>
                      <span style={{fontWeight:600}}>{t.name}</span>
                    </div>
                  </td>
                  <td style={{color:'var(--adm-muted)',fontSize:'.85rem'}}>{t.service_type}</td>
                  <td>{'⭐'.repeat(t.rating)}</td>
                  <td><span className={`adm-badge ${t.is_active?'published':'draft'}`}>{t.is_active?'Aktif':'Nonaktif'}</span></td>
                  <td style={{display:'flex',gap:'.5rem'}}>
                    <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={()=>openEdit(t)}>Edit</button>
                    <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={()=>del(t)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="adm-modal-backdrop" onClick={()=>setModal(null)}>
          <div className="adm-modal" onClick={e=>e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3>{modal==='new'?'Tambah Testimoni':'Edit Testimoni'}</h3>
              <button className="adm-modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="adm-form">
              <div className="adm-form-row">
                <div className="adm-field">
                  <label className="adm-label">Nama Pelanggan *</label>
                  <input className="adm-input" name="name" value={form.name} onChange={change} placeholder="Siti Rahayu" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Huruf Avatar (1 karakter)</label>
                  <input className="adm-input" name="avatar_letter" value={form.avatar_letter} onChange={change} maxLength={1} placeholder="S" />
                </div>
              </div>
              <div className="adm-field">
                <label className="adm-label">Jenis Layanan</label>
                <input className="adm-input" name="service_type" value={form.service_type} onChange={change} placeholder="Nail Art" />
              </div>
              <div className="adm-field">
                <label className="adm-label">Teks Testimoni *</label>
                <textarea className="adm-textarea" name="text" value={form.text} onChange={change} rows={3} placeholder="Hasilnya keren banget..." />
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label className="adm-label">Rating (1-5)</label>
                  <input className="adm-input" name="rating" type="number" min={1} max={5} value={form.rating} onChange={change} />
                </div>
                <div className="adm-field" style={{flexDirection:'row',alignItems:'center',gap:'.5rem',paddingTop:'1.25rem'}}>
                  <input type="checkbox" id="tis_active" name="is_active" checked={form.is_active} onChange={change} />
                  <label htmlFor="tis_active" className="adm-label" style={{margin:0}}>Tampilkan</label>
                </div>
              </div>
              <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end',marginTop:'.5rem'}}>
                <button className="adm-btn adm-btn-ghost" onClick={()=>setModal(null)}>Batal</button>
                <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>{saving?'Menyimpan...':'Simpan'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
