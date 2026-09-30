import { useEffect, useState } from 'react';
import ConsumerLayout from './ConsumerLayout.jsx';
import SellerShell from '../seller/SellerShell.jsx';
import AdminShell from '../admin/AdminShell.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { authService } from '../../services/authService.js';
import { useAppContext } from '../../context/AppContext.jsx';
import { sellerService } from '../../services/sellerService.js';
import { REGION_OPTIONS } from '../../constants/regions.js';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { flash } = useAppContext();
  const [form, setForm] = useState({ name: user?.name || '', region: user?.region || 'United States' });
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({ name: user?.name || '', region: user?.region || 'United States' });
    setCompanyName(user?.companyName || '');
    if (user?.role === 'seller' && !user.companyName) {
      sellerService.dashboard().then((res) => setCompanyName(res.data.seller.companyName)).catch(() => {});
    }
  }, [user]);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await authService.updateProfile(form);
      setUser(res.data);
      flash('Profile updated');
    } catch (err) {
      setError(err.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  }

  const Layout = user?.role === 'seller' ? SellerShell : user?.role === 'admin' ? AdminShell : ConsumerLayout;

  return (
    <Layout>
      <section className="profile-page">
        <header className="profile-heading">
          <span className="eyebrow">Account</span>
          <h1>Profile</h1>
          <p>Manage your personal information and account details.</p>
        </header>

        <form onSubmit={save} className="profile-card">
          <div className="profile-card-heading">
            <div>
              <h2>Personal information</h2>
              <p>Your account details are kept private.</p>
            </div>
            <span className={`profile-status ${user?.isActive ? 'is-active' : 'is-inactive'}`}>
              {user?.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {error && <p className="profile-error" role="alert">{error}</p>}

          <div className="profile-fields">
            <label className="profile-field">
              <span>Full name</span>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="profile-field">
              <span>Email</span>
              <input className="form-input profile-readonly" value={user?.email || ''} readOnly />
            </label>
            <label className="profile-field">
              <span>Account type</span>
              <input className="form-input profile-readonly" value={user?.role ? user.role[0].toUpperCase() + user.role.slice(1) : ''} readOnly />
            </label>
            <label className="profile-field">
              <span>Country</span>
              <select className="form-select" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                {REGION_OPTIONS.map((region) => <option key={region}>{region}</option>)}
              </select>
            </label>
            {user?.role === 'seller' && companyName && (
              <label className="profile-field">
                <span>Company name</span>
                <input className="form-input profile-readonly" value={companyName} readOnly />
              </label>
            )}
          </div>

          <footer className="profile-card-footer">
            {user?.createdAt && <span>Member since {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(user.createdAt))}</span>}
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </footer>
        </form>
      </section>
    </Layout>
  );
}
