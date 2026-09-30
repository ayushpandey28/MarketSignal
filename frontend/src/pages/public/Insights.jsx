import { ArrowRight, BarChart3, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';

const highlights = [
  { label: 'Trending products', value: 'Mechanical Keyboard', change: '+62%' },
  { label: 'Fastest rising', value: 'Noise Cancel Headset', change: '+35%' },
  { label: 'Top category', value: 'Electronics', change: 'High demand' },
  { label: 'Regional trend', value: 'United States', change: '+24%' },
];

const categories = [
  { name: 'Electronics', score: 342 },
  { name: 'Gaming', score: 311 },
  { name: 'Smart Home', score: 280 },
  { name: 'Travel', score: 197 },
];

export default function Insights() {
  return (
    <div>
      <Navbar />
      <main className="container page-shell">
        <section className="section-block intro-block narrow">
          <div>
            <span className="eyebrow">Market insights</span>
            <h1>Current demand signal across the catalog.</h1>
          </div>
          <p>These views highlight the strongest product traction, category movement, and regional energy shaping buyer behavior.</p>
        </section>

        <section className="grid-4">
          {highlights.map(({ label, value, change }) => (
            <div key={label} className="card feature-card insight-card">
              <span className="muted small">{label}</span>
              <h3>{value}</h3>
              <strong>{change}</strong>
            </div>
          ))}
        </section>

        <section className="content-grid">
          <div className="card info-card">
            <div className="panel-title">
              <BarChart3 size={16} />
              <span>Category momentum</span>
            </div>
            <div className="bars-list">
              {categories.map(({ name, score }) => (
                <div key={name} className="bar-row">
                  <div className="bar-row__meta">
                    <span>{name}</span>
                    <strong>{score}</strong>
                  </div>
                  <div className="bar-track">
                    <span style={{ width: `${(score / 360) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card info-card">
            <div className="panel-title">
              <TrendingUp size={16} />
              <span>Fastest rising products</span>
            </div>
            <ul className="plain-list">
              <li><strong>Mechanical Keyboard</strong><span>+62%</span></li>
              <li><strong>Noise Cancel Headset</strong><span>+35%</span></li>
              <li><strong>Smart LED Strip</strong><span>+28%</span></li>
              <li><strong>USB-C Docking Station</strong><span>+22%</span></li>
            </ul>
          </div>
        </section>

        <section className="cta-panel compact">
          <div>
            <span className="eyebrow">View detailed demand</span>
            <h2>Browse the full product catalog.</h2>
          </div>
          <Link to="/explore" className="primary-btn">
            Explore catalog <ArrowRight size={16} />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
