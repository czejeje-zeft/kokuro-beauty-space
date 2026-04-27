import { Link } from 'react-router-dom';
import Booking from '../components/Booking';
import FloatingDecorations from '../components/FloatingDecorations';
import WhatsAppFAB from '../components/WhatsAppFAB';

export default function BookingPage() {
  return (
    <>
      <FloatingDecorations />

      {/* Minimal Header */}
      <header style={{
        background: 'rgba(255,255,255,0.90)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(201,227,250,0.6)',
        padding: '.875rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 16px rgba(26,148,243,.07)',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>✦</span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.15rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #1A94F3, #5ECFCD)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Kokuro Beauty Space
          </span>
        </Link>
        <Link to="/" style={{
          fontSize: '.8rem',
          fontWeight: 600,
          color: 'var(--blue-500, #1A94F3)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '.3rem',
          opacity: 0.8,
        }}>
          ← Kembali ke Beranda
        </Link>
      </header>

      {/* Hero mini */}
      <div style={{
        background: 'linear-gradient(160deg, #EFF8FF 0%, #DBEEFE 60%, #E8F7FD 100%)',
        padding: '2.5rem 1.5rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(26,148,243,.1)',
          border: '1px solid rgba(26,148,243,.2)',
          borderRadius: '50px',
          padding: '.3rem 1rem',
          fontSize: '.78rem',
          fontWeight: 700,
          color: '#1A94F3',
          marginBottom: '1rem',
          letterSpacing: '.05em',
          textTransform: 'uppercase',
        }}>
          📅 Booking Online
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
          fontWeight: 600,
          color: '#0F2B4D',
          margin: '0 0 .5rem',
        }}>
          Reservasi Home Service
        </h1>
        <p style={{
          fontSize: '.95rem',
          color: '#6B94BC',
          maxWidth: '440px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Isi form di bawah — kami akan konfirmasi jadwal via WhatsApp dalam 1×24 jam.
        </p>
      </div>

      {/* Booking Form */}
      <main style={{ background: 'linear-gradient(180deg, #E8F7FD 0%, #F7FBFF 80px)' }}>
        <Booking standalone />
      </main>

      {/* Simple Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid rgba(201,227,250,.6)',
        fontSize: '.8rem',
        color: '#9ABFDA',
        background: '#F7FBFF',
      }}>
        © {new Date().getFullYear()} Kokuro Beauty Space · Nail Art & Eyelash Home Service Pontianak
      </footer>

      <WhatsAppFAB />
    </>
  );
}
