import { useEffect, useState } from 'react';
import { api } from '../api/kokuro';

const STATIC_ITEMS = [
  { id:1, title:'Nail Art Design 1',  category:'nail',    image_url:'/images/nail-hero.png',    alt:'Nail Art Design 1'   },
  { id:2, title:'Eyelash Extension',  category:'lash',    image_url:'/images/lash-service.png', alt:'Eyelash Extension'   },
  { id:3, title:'Press-on Nails',     category:'presson', image_url:'/images/press-on.png',     alt:'Press-on Nails'      },
  { id:4, title:'Nail Art Design 2',  category:'nail',    image_url:'/images/nail-hero.png',    alt:'Nail Art Design 2'   },
  { id:5, title:'Wispy Lash',         category:'lash',    image_url:'/images/lash-service.png', alt:'Wispy Lash'          },
  { id:6, title:'Custom Press-on',    category:'presson', image_url:'/images/press-on.png',     alt:'Custom Press-on Nails'},
];

const FILTERS = [
  { id:'all',     label:'Semua'   },
  { id:'nail',    label:'Nail Art'},
  { id:'lash',    label:'Eyelash' },
  { id:'presson', label:'Press-on'},
];

const CAT_LABELS = { nail:'Nail Art', lash:'Eyelash Extension', presson:'Press-on Nails' };

export default function Gallery() {
  const [items, setItems]   = useState(STATIC_ITEMS);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getGallery()
      .then(data => { if (data?.length) setItems(data); })
      .catch(() => {/* use static */});
  }, []);

  const visible = filter === 'all' ? items : items.filter(i => i.category === filter);

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">📸 Portfolio</span>
          <h2 className="section-title">Hasil Karya Kami</h2>
          <p className="section-desc">Setiap kuku &amp; bulu mata adalah karya seni yang kami cintai</p>
        </div>

        <div className="gallery-filter">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`gallery-btn${filter === f.id ? ' active' : ''}`}
              onClick={() => setFilter(f.id)}
              id={`filter-${f.id}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="gallery-grid" id="galleryGrid">
          {visible.map(item => (
            <div className="gallery-item" key={item.id} data-cat={item.category}>
              <img src={item.image_url} alt={item.alt} loading="lazy" />
              <div className="gallery-overlay">
                <span className="gallery-tag">{CAT_LABELS[item.category] || item.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="gallery-cta">
          <a
            href="https://www.instagram.com/kokurobeautyy/"
            target="_blank" rel="noopener noreferrer"
            className="btn btn-outline"
            id="igLink"
          >
            📷 Lihat Lebih Banyak di Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
