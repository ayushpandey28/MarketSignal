import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm.jsx';

export default function ForgotPassword() {
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
            <h1 className="auth-title">Reset password</h1>
            <p className="auth-subtitle">Use your email to receive a reset token.</p>
          </div>

          <ForgotPasswordForm />

          <div className="auth-footer">
            <span>Back to</span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
