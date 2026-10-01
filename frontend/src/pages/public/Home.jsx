import { ArrowRight, BarChart3, BrainCircuit, MapPinned, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { demandService } from '../../services/demandService.js';
import ProductImage from '../../components/products/ProductImage.jsx';

export default function Home() {
  const { data: trending } = useFetch(() => demandService.trending({ limit: 4 }), []);
  const products = trending || [];
  const highestDemand = products[0]?.demandScore || 0;
  const averageGrowth = products.length
    ? products.reduce((total, item) => total + Number(item.growthPercent || 0), 0) / products.length
    : 0;
  const risingProducts = products.filter((item) => item.trend === 'rising').length;
  const metrics = [
    { label: 'Highest demand', value: Math.round(highestDemand), icon: TrendingUp },
    { label: 'Average growth', value: `${averageGrowth >= 0 ? '+' : ''}${averageGrowth.toFixed(1)}%`, icon: BarChart3 },
    { label: 'Products shown', value: products.length, icon: Users },
    { label: 'Rising signals', value: risingProducts, icon: MapPinned },
  ];

  return (
    <div>
      <Navbar />
      <main className="container page-shell">
        <section className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow-row">
              <span className="eyebrow">Demand intelligence</span>
            </div>
            <h1>Know What People Are About to Buy.</h1>
            <p>
              MarketSignal turns real customer signals into a clean, explainable view of demand — helping teams spot the next rise before the market catches up.
            </p>

            <div className="hero-actions">
              <Link to="/explore" className="primary-btn">
                Explore Market Demand <ArrowRight size={16} />
              </Link>
              <Link to="/register" className="secondary-btn">
                Get Started
              </Link>
            </div>

            <div className="metric-grid">
              {metrics.map(({ label, value, icon: Icon }) => (
                <div key={label} className="card stat-card">
                  <Icon size={16} />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="card preview-card">
            <div className="panel-header">
              <span className="panel-label">Market pulse</span>
              <span className="status-dot">Current sample</span>
            </div>
            <div className="pulse-list">
              {products.map((item) => (
                <div key={item.product._id} className="pulse-row">
                  <div className="pulse-item__left">
                    <ProductImage product={item.product} alt={item.product.name} className="pulse-thumb" />
                    <div className="pulse-copy">
                      <strong>{item.product.name}</strong>
                      <small>{item.product.category}</small>
                    </div>
                  </div>
                  <div className="pulse-score">
                    <span>{Math.round(item.demandScore)}</span>
                    <small className={item.trend === 'rising' ? 'success' : item.trend === 'declining' ? 'danger' : 'neutral'}>
                      {item.growthPercent > 0 ? '+' : ''}{Number(item.growthPercent || 0).toFixed(1)}%
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="feature-row">
          {[
            ['How It Works', 'User signals become weighted demand scores and clear trend labels.'],
            ['Trending Products', 'See what consumers are actively showing interest in.'],
            ['Regional Intelligence', 'Discover where the strongest demand is emerging.'],
          ].map(([title, text]) => (
            <div key={title} className="card feature-card">
              <Sparkles size={18} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </section>

        <section className="section-block">
          <div className="section-head">
            <div>
              <span className="eyebrow">Trending products</span>
              <h2>Demand is rising where it matters most.</h2>
            </div>
            <Link to="/explore" className="text-link">View all products</Link>
          </div>

          <div className="mini-product-grid">
            {products.map((item) => (
              <Link key={item.product._id} to={`/products/${item.product._id}`} className="mini-card card">
                <ProductImage product={item.product} alt={item.product.name} className="mini-card__image" />
                <div className="mini-card__body">
                  <p>{item.product.name}</p>
                  <span>{Math.round(item.demandScore)} demand</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="content-grid">
          <div className="card info-card">
            <h2>Consumer benefits</h2>
            <ul>
              <li>Detect early surges before products become crowded.</li>
              <li>Compare category and regional demand without noise.</li>
              <li>Track interests, alerts, and wishlist activity in one place.</li>
            </ul>
          </div>
          <div className="card info-card">
            <h2>Seller benefits</h2>
            <ul>
              <li>Focus on categories with strongest momentum.</li>
              <li>Monitor emerging demand against current inventory.</li>
              <li>Use AI as a summarizer, not as the source of truth.</li>
            </ul>
          </div>
        </section>

        <section className="section-block ai-panel">
          <div className="section-head">
            <div>
              <span className="eyebrow">Gemini AI</span>
              <h2>Optional market insight, built to stay isolated.</h2>
            </div>
            <BrainCircuit size={20} />
          </div>
          <p>
            Gemini can explain why a product trend is accelerating, but demand score logic remains deterministic and backend-driven.
          </p>
        </section>

        <section className="cta-panel">
          <div>
            <span className="eyebrow">Start now</span>
            <h2>Turn signals into market advantage.</h2>
          </div>
          <Link to="/register" className="primary-btn">
            Join MarketSignal <ArrowRight size={16} />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
