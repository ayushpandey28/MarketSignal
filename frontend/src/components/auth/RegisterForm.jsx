import { useState } from 'react';
import Button from '../common/Button.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { REGION_OPTIONS } from '../../constants/regions.js';

export default function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'consumer',
    region: 'United States',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(form);
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
        <label htmlFor="register-name" className="form-label">Full name</label>
        <input id="register-name" className="form-input" placeholder="Enter your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>

      <div className="form-group">
        <label htmlFor="register-email" className="form-label">Email</label>
        <input id="register-email" className="form-input" type="email" placeholder="Enter your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </div>

      <div className="form-group">
        <label htmlFor="register-password" className="form-label">Password</label>
        <input id="register-password" className="form-input" type="password" minLength={6} placeholder="Create a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </div>

      <div className="form-group">
        <label htmlFor="register-role" className="form-label">Account type</label>
        <select id="register-role" className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="consumer">Consumer</option>
          <option value="seller">Seller</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="register-region" className="form-label">Country</label>
        <select id="register-region" className="form-select" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
          {REGION_OPTIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      {form.role === 'seller' && (
        <div className="form-group">
          <label htmlFor="register-company" className="form-label">Company name</label>
          <input id="register-company" className="form-input" placeholder="Enter company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        </div>
      )}

      <Button className="auth-button" disabled={busy}>
        {busy ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
