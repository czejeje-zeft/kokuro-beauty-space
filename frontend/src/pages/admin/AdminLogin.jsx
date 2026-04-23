import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../admin.css';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message ?? 'Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adm-login-page">
      <div className="adm-login-card">
        <div className="adm-login-logo">
          <h1>✦ Kokuro Admin</h1>
          <p>Dashboard Manajemen Kokuro Beauty Space</p>
        </div>

        {error && <div className="adm-login-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="adm-form">
          <div className="adm-field">
            <label className="adm-label">Email</label>
            <input className="adm-input" type="email" placeholder="admin@kokurobeauty.com"
              value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
              required autoFocus />
          </div>
          <div className="adm-field">
            <label className="adm-label">Password</label>
            <input className="adm-input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
              required />
          </div>
          <button className="adm-btn adm-btn-primary" type="submit" disabled={loading}
            style={{marginTop:'.5rem', justifyContent:'center', padding:'.75rem'}}>
            {loading ? 'Masuk...' : '🔐 Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
