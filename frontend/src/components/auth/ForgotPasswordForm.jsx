import { useState } from 'react';
import Button from '../common/Button.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import { authService } from '../../services/authService.js';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function requestToken(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await authService.forgotPassword({ email });
      setResetToken(res.data?.resetToken || '');
      setMessage(res.message);
    } catch (err) {
      setError(err.message);
    }
  }

  async function reset(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await authService.resetPassword({ email, token, password });
      setMessage(res.message);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-form-wrap">
      <ErrorMessage message={error} />
      {message && <p className="auth-success">{message}</p>}

      <form onSubmit={requestToken} className="auth-form auth-form-split">
        <div className="form-group">
          <label htmlFor="forgot-email" className="form-label">Email</label>
          <input id="forgot-email" className="form-input" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button className="auth-button">Send reset token</Button>
      </form>

      {resetToken && <p className="demo-token">Demo token: {resetToken}</p>}

      <form onSubmit={reset} className="auth-form auth-form-split">
        <div className="form-group">
          <label htmlFor="forgot-token" className="form-label">Reset token</label>
          <input id="forgot-token" className="form-input" placeholder="Paste reset token" value={token} onChange={(e) => setToken(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="forgot-password" className="form-label">New password</label>
          <input id="forgot-password" className="form-input" type="password" placeholder="Create a new password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button variant="ghost" className="auth-button">
          Update password
        </Button>
      </form>
    </div>
  );
}
