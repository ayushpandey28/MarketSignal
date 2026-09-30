import { Link, Navigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import LoginForm from '../../components/auth/LoginForm.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function Login() {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === 'seller' ? '/seller' : user.role === 'admin' ? '/admin' : '/app'} replace />;

  return (
    <div>
      <Navbar />
      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <span className="brand-mark__icon">S</span>
            <span>MarketSignal</span>
          </div>

          <div className="auth-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to continue to MarketSignal.</p>
          </div>

          <LoginForm />

          <div className="auth-links">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <div className="auth-footer">
            <span>Don’t have an account?</span>
            <Link to="/register">Create account</Link>
          </div>

          <div className="demo-box">
            <p>Demo accounts</p>
            <ul>
              <li>Consumer · consumer@marketsignal.demo</li>
              <li>Seller · seller@marketsignal.demo</li>
              <li>Admin · admin@marketsignal.demo</li>
            </ul>
            <span>Password: Password123</span>
          </div>
        </div>
      </main>
    </div>
  );
}
