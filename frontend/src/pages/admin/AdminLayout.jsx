import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../admin.css';

const NAV_ITEMS = [
  { to: '/admin/dashboard',    icon: '📊', label: 'Dashboard'    },
  { to: '/admin/bookings',     icon: '📅', label: 'Booking'      },
  { to: '/admin/services',     icon: '💅', label: 'Layanan'      },
  { to: '/admin/gallery',      icon: '🖼️',  label: 'Galeri'      },
  { to: '/admin/testimonials', icon: '⭐', label: 'Testimoni'    },
  { to: '/admin/articles',     icon: '📝', label: 'Artikel'      },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="adm-root">
      {/* ── Sidebar ── */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <h2>✦ Kokuro Admin</h2>
          <span>Beauty Space Management</span>
        </div>

        <nav className="adm-nav">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `adm-nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <div style={{fontSize:'.75rem', color:'var(--adm-muted)', padding:'.5rem .875rem .75rem'}}>
            👤 {user?.name ?? 'Admin'}
          </div>
          <button className="adm-logout-btn" onClick={handleLogout}>
            🚪 Keluar
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  );
}
