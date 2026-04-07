import './index.css';
import Navbar           from './components/Navbar';
import Hero             from './components/Hero';
import Stats            from './components/Stats';
import Services         from './components/Services';
import PriceList        from './components/PriceList';
import Gallery          from './components/Gallery';
import Testimonials     from './components/Testimonials';
import Booking          from './components/Booking';
import Footer           from './components/Footer';
import WhatsAppFAB      from './components/WhatsAppFAB';
import FloatingDecorations from './components/FloatingDecorations';

export default function App() {
  return (
    <>
      {/* Fixed layer — floats above ALL sections, below navbar */}
      <FloatingDecorations />

      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <PriceList />
        <Gallery />
        <Testimonials />
        <Booking />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}

