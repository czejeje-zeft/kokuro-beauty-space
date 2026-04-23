import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const API_BASE = (import.meta.env.VITE_API_URL ?? '') + '/api/v1';

export default function BlogDetail() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/articles/${slug}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(res => setArticle(res.article))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf8f5', fontFamily: 'sans-serif', color: '#9a8ea5' }}>
      Memuat artikel...
    </div>
  );

  if (notFound || !article) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', background: '#fdf8f5', fontFamily: 'sans-serif' }}>
      <div style={{ fontSize: '3rem' }}>😿</div>
      <h1 style={{ fontSize: '1.25rem', color: '#2d1b38' }}>Artikel tidak ditemukan</h1>
      <Link to="/blog" style={{ color: '#a855f7' }}>← Kembali ke Blog</Link>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fdf8f5', fontFamily: 'var(--font-body, sans-serif)' }}>
      {/* Hero / Cover */}
      {article.cover_image && (
        <div style={{ width: '100%', maxHeight: '420px', overflow: 'hidden' }}>
          <img src={article.cover_image} alt={article.title} style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '.8rem', color: '#9a8ea5', marginBottom: '1.5rem', display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Beranda</Link>
          <span>/</span>
          <Link to="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link>
          <span>/</span>
          <span style={{ color: '#2d1b38' }}>{article.title}</span>
        </nav>

        {/* Meta */}
        {article.published_at && (
          <div style={{ fontSize: '.8rem', color: '#a855f7', fontWeight: 600, marginBottom: '.75rem' }}>
            {new Date(article.published_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        )}

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#2d1b38', lineHeight: 1.3, marginBottom: '1rem' }}>
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p style={{ fontSize: '1.05rem', color: '#6b5b73', lineHeight: 1.7, borderLeft: '3px solid #a855f7', paddingLeft: '1rem', marginBottom: '2rem', fontStyle: 'italic' }}>
            {article.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="blog-content"
          style={{ fontSize: '1rem', lineHeight: 1.85, color: '#3d2b4a' }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Footer */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e8d5ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/blog" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 600, fontSize: '.9rem' }}>← Kembali ke Blog</Link>
          <Link to="/#booking" style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', padding: '.6rem 1.25rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '.85rem' }}>
            💅 Booking Sekarang
          </Link>
        </div>
      </div>

      {/* Blog content styles */}
      <style>{`
        .blog-content h2 { font-size: 1.4rem; font-weight: 700; color: #2d1b38; margin: 2rem 0 .75rem; }
        .blog-content h3 { font-size: 1.15rem; font-weight: 700; color: #2d1b38; margin: 1.5rem 0 .5rem; }
        .blog-content p  { margin-bottom: 1.25rem; }
        .blog-content ul, .blog-content ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .blog-content li { margin-bottom: .4rem; }
        .blog-content img { max-width: 100%; border-radius: 12px; margin: 1rem 0; }
        .blog-content a  { color: #a855f7; }
        .blog-content blockquote { border-left: 3px solid #a855f7; padding-left: 1rem; color: #6b5b73; margin: 1.5rem 0; font-style: italic; }
        .blog-content hr { border: none; border-top: 1px solid #e8d5ff; margin: 2rem 0; }
        .blog-content strong { font-weight: 700; color: #2d1b38; }
      `}</style>
    </div>
  );
}
