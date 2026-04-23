import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = (import.meta.env.VITE_API_URL ?? '') + '/api/v1';

export default function BlogList() {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [meta,     setMeta]     = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/articles?page=${page}`)
      .then(r => r.json())
      .then(res => { setArticles(res.data ?? []); setMeta({ last_page: res.last_page }); })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-bg, #fdf8f5)', fontFamily: 'var(--font-body, sans-serif)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #ffe4ef, #e8d5ff)', padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontSize: '.85rem', opacity: .7, display: 'block', marginBottom: '1rem' }}>
          ← Kembali ke Beranda
        </Link>
        <h1 style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', fontWeight: 800, background: 'linear-gradient(135deg,#a855f7,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ✨ Blog Kokuro
        </h1>
        <p style={{ color: '#6b5b73', marginTop: '.75rem', fontSize: '.95rem' }}>Tips kecantikan, inspirasi nail art, dan tren terbaru</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {loading && <p style={{ textAlign: 'center', color: '#9a8ea5' }}>Memuat artikel...</p>}

        {!loading && articles.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9a8ea5' }}>Belum ada artikel yang dipublikasikan.</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.5rem' }}>
          {articles.map(a => (
            <Link key={a.id} to={`/blog/${a.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(168,85,247,.08)', transition: 'transform .2s, box-shadow .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(168,85,247,.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 2px 16px rgba(168,85,247,.08)'; }}>
              {a.cover_image
                ? <img src={a.cover_image} alt={a.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                : <div style={{ height: '160px', background: 'linear-gradient(135deg,#ffe4ef,#e8d5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>💅</div>}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '.75rem', color: '#a855f7', fontWeight: 600, marginBottom: '.5rem' }}>
                  {a.published_at ? new Date(a.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#2d1b38', marginBottom: '.5rem', lineHeight: 1.4 }}>{a.title}</h2>
                {a.excerpt && <p style={{ fontSize: '.85rem', color: '#6b5b73', lineHeight: 1.6, flex: 1 }}>{a.excerpt}</p>}
                <span style={{ marginTop: '1rem', fontSize: '.8rem', fontWeight: 700, color: '#a855f7' }}>Baca →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '2rem' }}>
            <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
              style={{ padding: '.5rem 1rem', borderRadius: '8px', border: '1px solid #e2d0f0', background: '#fff', cursor: 'pointer' }}>‹</button>
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{ padding: '.5rem 1rem', borderRadius: '8px', border: '1px solid #e2d0f0', background: p === page ? '#a855f7' : '#fff', color: p === page ? '#fff' : 'inherit', cursor: 'pointer' }}>{p}</button>
            ))}
            <button disabled={page===meta.last_page} onClick={()=>setPage(p=>p+1)}
              style={{ padding: '.5rem 1rem', borderRadius: '8px', border: '1px solid #e2d0f0', background: '#fff', cursor: 'pointer' }}>›</button>
          </div>
        )}
      </div>
    </div>
  );
}
