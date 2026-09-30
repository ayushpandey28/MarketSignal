import { Link, Navigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import RegisterForm from '../../components/auth/RegisterForm.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function Register() {
  const { user } = useAuth();
  if (user) return <Navigate to="/app" replace />;

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
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Start exploring consumer demand signals.</p>
          </div>

          <RegisterForm />

          <div className="auth-footer">
            <span>Already have an account?</span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
