import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';

function Toast({ msg, type }) { return msg ? <div className={`adm-toast ${type}`}>{msg}</div> : null; }

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [meta,     setMeta]     = useState({});
  const [toast,    setToast]    = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  function load(p=page) {
    setLoading(true);
    adminApi.getAdminArticles(p).then(res => {
      setArticles(res.data ?? []);
      setMeta({ last_page: res.last_page, total: res.total });
    }).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, [page]);

  async function togglePublish(article) {
    try {
      const fd = new FormData();
      fd.append('is_published', article.is_published ? '0' : '1');
      await adminApi.updateArticle(article.id, fd);
      showToast(article.is_published ? 'Artikel disembunyikan.' : 'Artikel dipublikasikan!');
      load();
    } catch { showToast('Gagal mengubah status.', 'error'); }
  }

  async function del(article) {
    if (!confirm(`Hapus artikel "${article.title}"?`)) return;
    try { await adminApi.deleteArticle(article.id); showToast('Artikel dihapus.'); load(); }
    catch { showToast('Gagal hapus.', 'error'); }
  }

  return (
    <div className="adm-content">
      <Toast {...(toast??{})} />
      <div className="adm-page-header">
        <h1>📝 Manajemen Artikel</h1>
        <Link to="/admin/articles/new" className="adm-btn adm-btn-primary">+ Tulis Artikel</Link>
      </div>

      <div className="adm-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Judul</th><th>Status</th><th>Tanggal</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} style={{color:'var(--adm-muted)',textAlign:'center'}}>Memuat...</td></tr>}
              {!loading && articles.length===0 && <tr><td colSpan={4} style={{color:'var(--adm-muted)',textAlign:'center'}}>Belum ada artikel.</td></tr>}
              {!loading && articles.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{fontWeight:600}}>{a.title}</div>
                    {a.excerpt && <div style={{fontSize:'.75rem',color:'var(--adm-muted)',marginTop:'.2rem',overflow:'hidden',display:'-webkit-box',WebkitLineClamp:1,WebkitBoxOrient:'vertical'}}>{a.excerpt}</div>}
                  </td>
                  <td>
                    <span className={`adm-badge ${a.is_published?'published':'draft'}`}>
                      {a.is_published ? '✓ Publik' : '✎ Draft'}
                    </span>
                  </td>
                  <td style={{fontSize:'.8rem',color:'var(--adm-muted)',whiteSpace:'nowrap'}}>
                    {a.published_at
                      ? new Date(a.published_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})
                      : new Date(a.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap'}}>
                      <Link to={`/admin/articles/${a.id}`} className="adm-btn adm-btn-ghost adm-btn-sm">Edit</Link>
                      <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={()=>togglePublish(a)}>
                        {a.is_published ? 'Sembunyikan' : 'Publikasikan'}
                      </button>
                      <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={()=>del(a)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
    </div>
  );
}
