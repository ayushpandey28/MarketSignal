import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-shell">
        <div>
          <div className="brand-mark small">
            <span className="brand-mark__icon">S</span>
            <span>MarketSignal</span>
          </div>
          <p>Consumer demand intelligence for product, pricing, and growth teams.</p>
        </div>

        <div className="footer-links">
          <Link to="/explore">Explore</Link>
          <Link to="/insights">Insights</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
    </footer>
  );
}
