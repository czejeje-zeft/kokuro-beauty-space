import { useEffect, useState } from 'react';
import { api } from '../api/kokuro';

// Static fallback price data (same as backend seeder)
const NAIL_BASE = [
  { name: 'Manicure',                       desc: 'Perawatan tangan & kuku',        price: 'Rp 45.000',   featured: false },
  { name: 'Pedicure',                       desc: 'Perawatan kaki & kuku',           price: 'Rp 58.000',   featured: false },
  { name: 'Nail Gel + Manicure',            desc: 'Gel polish + perawatan tangan',   price: 'Rp 60.000',   featured: false },
  { name: 'Nail Gel + Pedicure',            desc: 'Gel polish + perawatan kaki',     price: 'Rp 70.000',   featured: false },
  { name: 'Nail Extension + Gel + Manicure',desc: 'Extension lengkap + gel + perawatan', price: 'Rp 140.000', featured: true },
];
const NAIL_ADDON = [
  { name: 'Sticker / Foil / Glitter', desc: 'per jari', price: 'Rp 2k – 4k' },
  { name: 'Chrome / Simple Art',      desc: 'per jari', price: 'Rp 2k – 7k' },
  { name: 'Cat Eye',                  desc: 'per jari', price: 'Rp 3k'       },
  { name: 'French / Ombre / Marble',  desc: 'per jari', price: 'Rp 5k – 7k' },
  { name: '3D / Hard Art / Character',desc: 'per jari', price: 'Rp 7k – 15k' },
];
const NAIL_EXTRA = [
  { name: 'Remove Nail Art', desc: 'Hapus nail art (per jari)', price: 'Rp 5k / jari' },
  { name: 'Overlay',         desc: 'Penguat / penebalan kuku',  price: 'Rp 15.000'    },
];
const LASH = [
  { name: 'Single Classic Lash', desc: '1:1 natural, rapi & ringan. Efek lebih panjang tanpa terlihat tebal. Cocok untuk daily look.',     price: 'Rp 90.000',  featured: false },
  { name: 'YY-Lash',             desc: 'Lebih tebal dari single classic tapi tetap natural. Efek volume ringan.',                           price: 'Rp 120.000', featured: false },
  { name: 'W-Lash',              desc: 'Lebih tebal & voluminous, tetap ringan dan rapi. Lebih bold dari single classic.',                  price: 'Rp 160.000', featured: false },
  { name: 'Hybrid Lash',         desc: 'Perpaduan natural dan tebal. Memberikan tekstur dan dimensi.',                                     price: 'Rp 180.000', featured: false },
  { name: 'Wispy Lash ✨',       desc: 'Ringan, bertekstur, dan sedikit dramatis. Doll look atau efek K-style natural curly.',              price: 'Rp 210.000', featured: true  },
];
const PRESSON = [
  { name: 'Plain Press-on',         desc: 'Sudah termasuk alat pemasangan, tanpa kotak',              price: 'Rp 35.000',         featured: false },
  { name: 'Custom Design Press-on', desc: 'Desain custom + kotak cantik + alat pemasangan',           price: 'Mulai Rp 45.000',   featured: true  },
];

function PriceRow({ item }) {
  return (
    <div className={`price-item${item.featured ? ' featured-item' : ''}`}>
      <div className="pi-left">
        <span className="pi-name">{item.name}</span>
        {item.desc && <span className="pi-desc">{item.desc}</span>}
      </div>
      <span className="pi-price">{item.price}</span>
    </div>
  );
}

function PriceCat({ title, items }) {
  return (
    <div className="price-cat">
      <h3 className="price-cat-title">{title}</h3>
      <div className="price-list">
        {items.map((item, i) => <PriceRow key={i} item={item} />)}
      </div>
    </div>
  );
}

export default function PriceList() {
  const [activeTab, setActiveTab] = useState('nail');

  const tabs = [
    { id: 'nail',    label: '💅 Nail Art'  },
    { id: 'lash',    label: '👁️ Eyelash'   },
    { id: 'presson', label: '📦 Press-on'  },
  ];

  return (
    <section className="pricelist-section" id="pricelist">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">💰 Harga Transparan</span>
          <h2 className="section-title">Price List</h2>
          <p className="section-desc">Harga sudah termasuk home service ke lokasi kamu di Pontianak</p>
        </div>

        <div className="price-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`price-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Nail panel */}
        <div className={`price-panel${activeTab === 'nail' ? ' active' : ''}`}>
          <div className="price-categories">
            <PriceCat title="💅 Perawatan Kuku" items={NAIL_BASE} />
            <PriceCat title="🎨 Add-on Desain (per jari)" items={NAIL_ADDON} />
            <PriceCat title="🔧 Layanan Tambahan" items={NAIL_EXTRA} />
          </div>
        </div>

        {/* Lash panel */}
        <div className={`price-panel${activeTab === 'lash' ? ' active' : ''}`}>
          <div className="price-categories">
            <PriceCat title="👁️ Eyelash Extension" items={LASH} />
          </div>
          <div className="lash-note">
            <span className="note-icon">💡</span>
            <span>Semua layanan eyelash termasuk konsultasi desain gratis. Durasi pengerjaan 1–2 jam.</span>
          </div>
        </div>

        {/* Press-on panel */}
        <div className={`price-panel${activeTab === 'presson' ? ' active' : ''}`}>
          <div className="price-categories">
            <PriceCat title="📦 Press-on Nails" items={PRESSON} />
          </div>
          <div className="lash-note">
            <span className="note-icon">📌</span>
            <span>Press-on dapat dikirim atau diambil langsung. Hubungi WhatsApp untuk konsultasi desain.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
