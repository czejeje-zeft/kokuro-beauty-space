import { useEffect, useRef } from 'react';

const STATS = [
  { value: '2+',  label: 'Tahun Pengalaman' },
  { value: '100+',label: 'Pelanggan Puas'   },
  { value: '50+', label: 'Desain Tersedia'  },
  { value: '5⭐', label: 'Rating'           },
];

export default function Stats() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid" ref={ref}>
          {STATS.map(({ value, label }) => (
            <div className="stat-item reveal" key={label}>
              <div className="stat-number">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

