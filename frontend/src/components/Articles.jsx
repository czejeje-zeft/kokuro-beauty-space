import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = (import.meta.env.VITE_API_URL ?? '') + '/api/v1';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/articles/latest`)
      .then(r => r.json())
      .then(res => setArticles(res.articles ?? []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || articles.length === 0) return null;

  return (
    <section className="articles-section" id="artikel">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">📝 Artikel</span>
          <h2 className="section-title">Tips & Inspirasi Kecantikan</h2>
          <p className="section-desc">Temukan tips merawat kuku, tren nail art terbaru, dan inspirasi kecantikan dari kami</p>
        </div>

        <div className="articles-grid">
          {articles.map(a => (
            <Link key={a.id} to={`/blog/${a.slug}`} className="article-card">
              {a.cover_image && (
                <div className="article-cover">
                  <img src={a.cover_image} alt={a.title} loading="lazy" />
                </div>
              )}
              <div className="article-body">
                <div className="article-date">
                  {a.published_at
                    ? new Date(a.published_at).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
                    : ''}
                </div>
                <h3 className="article-title">{a.title}</h3>
                {a.excerpt && <p className="article-excerpt">{a.excerpt}</p>}
                <span className="article-read-more">Baca Selengkapnya →</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/blog" className="btn btn-outline">Lihat Semua Artikel →</Link>
        </div>
      </div>
    </section>
  );
}
