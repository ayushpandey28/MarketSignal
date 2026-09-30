import { useState } from 'react';
import Button from '../common/Button.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <ErrorMessage message={error} />

      <div className="form-group">
        <label htmlFor="login-email" className="form-label">Email</label>
        <input
          id="login-email"
          className="form-input"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password" className="form-label">Password</label>
        <input
          id="login-password"
          className="form-input"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>

      <Button className="auth-button" disabled={busy}>
        {busy ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
