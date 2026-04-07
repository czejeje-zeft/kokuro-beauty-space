import { useEffect, useRef, useState } from 'react';
import { api } from '../api/kokuro';

const STATIC = [
  { id:1, name:'Anisa R.',  service_type:'Pelanggan Nail Art',    avatar_letter:'A', rating:5, text:'"Hasilnya bagus banget! Kukuku jadi cantik dan rapi. Ellen orangnya ramah, sabar, dan teliti banget. Pasti balik lagi! 💅"' },
  { id:2, name:'Siti N.',   service_type:'Pelanggan Eyelash',     avatar_letter:'S', rating:5, text:'"Bulu matanya natural banget, cocok buat daily pakai. Harganya worth it apalagi home service, gak perlu keluar rumah!"' },
  { id:3, name:'Dina K.',   service_type:'Pelanggan Press-on',    avatar_letter:'D', rating:5, text:'"Press-on nails-nya keren banget! Custom sesuai request, packagingnya lucu. Recommended untuk yang mau nails cantik tapi gak sempat salon!"' },
  { id:4, name:'Rina P.',   service_type:'Pelanggan Eyelash',     avatar_letter:'R', rating:5, text:'"Wispy lash-nya bagus dan tahan lama! Sudah 3 minggu masih oke. Ellen juga fast respon dan jadwalnya bisa disesuaikan. 10/10!"' },
  { id:5, name:'Mega F.',   service_type:'Pelanggan Nail 3D Art', avatar_letter:'M', rating:5, text:'"Nail art dengan 3D design pernikahan, hasilnya melebihi ekspektasi! Detailnya rapi sekali. Semua tamu pujian terus sama kukuku 🥰"' },
];

export default function Testimonials() {
  const [items, setItems]     = useState(STATIC);
  const [current, setCurrent] = useState(0);
  const trackRef              = useRef(null);
  const timerRef              = useRef(null);

  useEffect(() => {
    api.getTestimonials()
      .then(data => { if (data?.length) setItems(data); })
      .catch(() => {});
  }, []);

  function getVisible() { return window.innerWidth <= 768 ? 1 : 3; }
  function getMax()     { return Math.max(0, items.length - getVisible()); }

  function go(idx) {
    const max = getMax();
    const next = Math.max(0, Math.min(idx, max));
    setCurrent(next);
    if (trackRef.current) {
      const cardW = trackRef.current.parentElement.offsetWidth / getVisible();
      trackRef.current.style.transform = `translateX(-${next * (cardW + 24)}px)`;
    }
  }

  function reset() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go(current >= getMax() ? 0 : current + 1), 4000);
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(c => {
        const next = c >= getMax() ? 0 : c + 1;
        if (trackRef.current) {
          const cardW = trackRef.current.parentElement.offsetWidth / getVisible();
          trackRef.current.style.transform = `translateX(-${next * (cardW + 24)}px)`;
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [items]);

  // Touch support
  const startX = useRef(0);
  const handleTouchStart = e => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = e => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? go(current + 1) : go(current - 1);
      reset();
    }
  };

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">💬 Kata Mereka</span>
          <h2 className="section-title">Testimoni Pelanggan</h2>
          <p className="section-desc">Kepercayaan pelanggan adalah prioritas utama kami</p>
        </div>

        <div className="testi-slider">
          <div
            className="testi-track"
            ref={trackRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {items.map(t => (
              <div className="testi-card" key={t.id}>
                <div className="testi-stars">{'⭐'.repeat(t.rating)}</div>
                <p className="testi-text">{t.text}</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.avatar_letter}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-loc">{t.service_type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testi-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`testi-dot${i === current ? ' active' : ''}`}
              onClick={() => { go(i); reset(); }}
              id={`dot${i}`}
            />
          ))}
        </div>
        <div className="testi-nav">
          <button className="testi-prev" id="testiPrev" aria-label="Previous" onClick={() => { go(current - 1); reset(); }}>‹</button>
          <button className="testi-next" id="testiNext" aria-label="Next"     onClick={() => { go(current + 1); reset(); }}>›</button>
        </div>
      </div>
    </section>
  );
}
