import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../../api/admin';
import { api } from '../../api/kokuro';

const CATEGORIES = { nail:'💅 Nail Art', lash:'👁️ Eyelash', presson:'📦 Press-on' };
function Toast({ msg, type }) { return msg ? <div className={`adm-toast ${type}`}>{msg}</div> : null; }

export default function GalleryPage() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ title:'', category:'nail', alt:'', sort_order:0 });
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState(null);
  const fileRef = useRef();

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  function loadGallery() { api.getGallery().then(res => { setItems(Array.isArray(res)?res:res.data??[]); }).finally(()=>setLoading(false)); }
  useEffect(() => { loadGallery(); }, []);

  function pickFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function upload() {
    if (!file) { showToast('Pilih foto terlebih dahulu.', 'error'); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append('image', file);
    fd.append('title', form.title || file.name);
    fd.append('category', form.category);
    fd.append('alt', form.alt || form.title);
    fd.append('sort_order', String(form.sort_order));
    try {
      await adminApi.createGallery(fd);
      showToast('Foto berhasil diunggah!');
      setFile(null); setPreview(null); setForm({title:'',category:'nail',alt:'',sort_order:0});
      setShowForm(false); loadGallery();
    } catch { showToast('Gagal upload.', 'error'); }
    finally { setSaving(false); }
  }

  async function del(item) {
    if (!confirm('Hapus foto ini?')) return;
    try { await adminApi.deleteGallery(item.id); showToast('Foto dihapus.'); loadGallery(); }
    catch { showToast('Gagal hapus.', 'error'); }
  }

  return (
    <div className="adm-content">
      <Toast {...(toast??{})} />
      <div className="adm-page-header">
        <h1>🖼️ Manajemen Galeri</h1>
        <button className="adm-btn adm-btn-primary" onClick={()=>setShowForm(s=>!s)}>
          {showForm ? '✕ Tutup' : '+ Upload Foto'}
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="adm-card" style={{marginBottom:'1.5rem'}}>
          <div className="adm-card-title">Upload Foto Baru</div>
          <div className="adm-form">
            <div
              className="adm-upload-box"
              onClick={() => fileRef.current.click()}
            >
              {preview
                ? <div className="adm-upload-preview"><img src={preview} alt="preview" /></div>
                : <div>🖼️ Klik untuk pilih foto (JPG/PNG/WebP, maks. 4MB)</div>}
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={pickFile} />
            </div>
            <div className="adm-form-row">
              <div className="adm-field">
                <label className="adm-label">Judul Foto</label>
                <input className="adm-input" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Nail Art Pastel..." />
              </div>
              <div className="adm-field">
                <label className="adm-label">Kategori</label>
                <select className="adm-select" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                  {Object.entries(CATEGORIES).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end'}}>
              <button className="adm-btn adm-btn-ghost" onClick={()=>{setShowForm(false);setFile(null);setPreview(null);}}>Batal</button>
              <button className="adm-btn adm-btn-primary" onClick={upload} disabled={saving}>{saving?'Mengupload...':'Upload'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? <p style={{color:'var(--adm-muted)'}}>Memuat...</p> : (
        <div className="adm-gallery-grid">
          {items.map(item => (
            <div key={item.id} className="adm-gallery-item">
              <img src={item.image_url} alt={item.alt ?? item.title} loading="lazy" />
              <div className="adm-gallery-overlay">
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={()=>del(item)}>🗑️ Hapus</button>
              </div>
              <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'.4rem .5rem',background:'rgba(0,0,0,.6)',fontSize:'.7rem',color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {item.title}
              </div>
            </div>
          ))}
          {items.length === 0 && <p style={{color:'var(--adm-muted)',gridColumn:'1/-1'}}>Belum ada foto di galeri.</p>}
        </div>
      )}
    </div>
  );
}
