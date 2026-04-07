import { useEffect, useRef } from 'react';

const SERVICE_CARDS = [
  {
    id:      'svc-nailart',
    img:     '/images/nail-hero.png',
    alt:     'Nail Art Service',
    badge:   'Terlaris',
    icon:    '💅',
    title:   'Nail Art',
    desc:    'Manikur, pedikur, nail gel, nail extension, hingga 3D art. Semua desain custom sesuai keinginanmu.',
    price:   'Rp 45.000',
    cta:     'Book Sekarang',
  },
  {
    id:      'svc-lash',
    img:     '/images/lash-service.png',
    alt:     'Eyelash Extension Service',
    badge:   null,
    icon:    '👁️',
    title:   'Eyelash Extension',
    desc:    'Single classic, YY-lash, W-lash, Hybrid, hingga Wispy. Natural hingga dramatic look, semua ada!',
    price:   'Rp 90.000',
    cta:     'Book Sekarang',
  },
  {
    id:      'svc-presson',
    img:     '/images/press-on.png',
    alt:     'Press-on Nails',
    badge:   null,
    icon:    '📦',
    title:   'Press-on Nails',
    desc:    'Kuku palsu custom desain, lengkap dengan kotak cantik & peralatan pemasangan. Pesan, terima, pasang!',
    price:   'Rp 35.000',
    cta:     'Pesan Sekarang',
  },
];

function useRevealSection() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.classList.add('reveal');
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function ServiceCard({ card }) {
  const ref = useRevealSection();
  return (
    <div className="service-card" id={card.id} ref={ref}>
      <div className="svc-img-wrap">
        <img src={card.img} alt={card.alt} className="svc-img" loading="lazy" />
        {card.badge && <div className="svc-badge">{card.badge}</div>}
      </div>
      <div className="svc-content">
        <div className="svc-icon">{card.icon}</div>
        <h3 className="svc-title">{card.title}</h3>
        <p className="svc-desc">{card.desc}</p>
        <div className="svc-price">Mulai dari <strong>Rp {card.price.replace('Rp ','')}</strong></div>
        <a href="#booking" className="btn btn-svc">{card.cta}</a>
      </div>
    </div>
  );
}

export default function Services() {
  const headerRef = useRevealSection();

  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-header" ref={headerRef}>
          <span className="section-tag">✨ Layanan Kami</span>
          <h2 className="section-title">Pilih Layanan Favoritmu</h2>
          <p className="section-desc">Semua layanan tersedia di lokasi kamu – cukup book, kami yang datang!</p>
        </div>
        <div className="services-grid">
          {SERVICE_CARDS.map(card => <ServiceCard key={card.id} card={card} />)}
        </div>
      </div>
    </section>
  );
}

