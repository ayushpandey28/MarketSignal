import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BarChart3, Menu, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Button from './Button.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const link = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <header className="topbar">
      <div className="container nav-shell">
        <Link to="/" className="brand-mark" aria-label="MarketSignal home">
          <span className="brand-mark__icon"><Sparkles size={14} /></span>
          <span>MarketSignal</span>
        </Link>

        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(false)}>
          <NavLink to="/explore" className={link}>Explore</NavLink>
          <NavLink to="/insights" className={link}>Insights</NavLink>
          <NavLink to="/how-it-works" className={link}>How it works</NavLink>
          <NavLink to="/about" className={link}>About</NavLink>
          {user?.role === 'consumer' && <NavLink to="/app" className={link}>Dashboard</NavLink>}
          {user?.role === 'seller' && <NavLink to="/seller" className={link}>Seller</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={link}>Admin</NavLink>}
        </nav>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user">{user.name}</span>
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login">Login</Link>
              <Link to="/register">
                <Button><BarChart3 size={14} /> Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
