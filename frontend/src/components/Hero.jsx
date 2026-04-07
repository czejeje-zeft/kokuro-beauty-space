export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" />

      <div className="hero-content">
        {/* ── Left text ── */}
        <div>
          <div className="hero-badge">
            <span className="badge-dot" />
            Home Service • Pontianak
          </div>
          <h1 className="hero-title">
            Beauty That <em>Comes</em><br />To You
          </h1>
          <p className="hero-subtitle">
            Nail art &amp; eyelash extension bersertifikat.<br />
            Kami hadir langsung ke rumah kamu di Pontianak.
          </p>
          <div className="hero-features">
            {[['🏆','Bersertifikat'],['🏠','Home Service'],['📅','Booking H-1']].map(([icon,label]) => (
              <div className="feat-item" key={label}>
                <span className="feat-icon">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="hero-buttons">
            <a href="#booking" className="btn btn-primary" id="heroBookBtn">Book Sekarang</a>
            <a href="#pricelist" className="btn btn-secondary">Lihat Harga</a>
          </div>
        </div>

        {/* ── Right visual ── */}
        <div className="hero-visual">
          <div className="hero-img-wrapper">
            <img src="/images/nail-hero.png" alt="Nail Art Kokuro Beauty" className="hero-main-img" />
            <div className="hero-card hc1">
              <span className="hc-icon">⭐</span>
              <div>
                <div className="hc-title">Top Rated</div>
                <div className="hc-sub">Certified artist</div>
              </div>
            </div>
            <div className="hero-card hc2">
              <span className="hc-icon">🎨</span>
              <div>
                <div className="hc-title">50+ Designs</div>
                <div className="hc-sub">Custom art</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

