import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <a href="#home" className="nav-logo" onClick={close}>
          <img src="/images/logo.png" alt="Kokuro Beauty Space Logo" className="logo-img" />
          <span className="logo-text">Kokuro Beauty Space</span>
        </a>

        <ul className={`nav-links${open ? ' open' : ''}`} id="navLinks">
          {[['#home','Home'],['#services','Services'],['#pricelist','Price List'],
            ['#gallery','Gallery'],['#testimonials','Testimoni']].map(([href, label]) => (
            <li key={href}><a href={href} onClick={close}>{label}</a></li>
          ))}
          <li><a href="#booking" className="nav-cta" onClick={close}>Book Now</a></li>
        </ul>

        <button
          className={`hamburger${open ? ' open' : ''}`}
          id="hamburger"
          aria-label="Toggle menu"
          onClick={() => setOpen(v => !v)}
        >
          <span/><span/><span/>
        </button>
      </div>
    </nav>
  );
}
