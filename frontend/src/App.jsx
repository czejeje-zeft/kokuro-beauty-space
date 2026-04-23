import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Public site
import './index.css';
import Navbar              from './components/Navbar';
import Hero                from './components/Hero';
import Stats               from './components/Stats';
import Services            from './components/Services';
import PriceList           from './components/PriceList';
import Gallery             from './components/Gallery';
import Testimonials        from './components/Testimonials';
import Articles            from './components/Articles';
import Booking             from './components/Booking';
import Footer              from './components/Footer';
import WhatsAppFAB         from './components/WhatsAppFAB';
import FloatingDecorations from './components/FloatingDecorations';

// Public blog pages
import BlogList   from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';

// Admin pages
import AdminLogin    from './pages/admin/AdminLogin';
import AdminLayout   from './pages/admin/AdminLayout';
import Dashboard     from './pages/admin/Dashboard';
import BookingsPage  from './pages/admin/BookingsPage';
import ServicesPage  from './pages/admin/ServicesPage';
import GalleryPage   from './pages/admin/GalleryPage';
import TestimonialsPage from './pages/admin/TestimonialsPage';
import ArticlesPage  from './pages/admin/ArticlesPage';
import ArticleEditor from './pages/admin/ArticleEditor';

function LandingPage() {
  return (
    <>
      <FloatingDecorations />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <PriceList />
        <Gallery />
        <Testimonials />
        <Articles />
        <Booking />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'sans-serif',color:'#888'}}>Memuat...</div>;
  return user ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/"           element={<LandingPage />} />
      <Route path="/blog"       element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />

      {/* ── Admin ── */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index                  element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"       element={<Dashboard />} />
        <Route path="bookings"        element={<BookingsPage />} />
        <Route path="services"        element={<ServicesPage />} />
        <Route path="gallery"         element={<GalleryPage />} />
        <Route path="testimonials"    element={<TestimonialsPage />} />
        <Route path="articles"        element={<ArticlesPage />} />
        <Route path="articles/new"    element={<ArticleEditor />} />
        <Route path="articles/:id"    element={<ArticleEditor />} />
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
