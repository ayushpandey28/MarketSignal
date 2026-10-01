import { ArrowRight, BarChart3, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { demandService } from '../../services/demandService.js';

export default function Insights() {
  const { data: trendingData, loading: trendingLoading } = useFetch(() => demandService.trending({ limit: 4 }), []);
  const { data: categoriesData, loading: categoriesLoading } = useFetch(() => demandService.categories(), []);
  const trending = trendingData || [];
  const categories = categoriesData || [];
  const topCategory = categories[0];
  const maxScore = Math.max(...categories.map((item) => item.demandScore || 0), 1);

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
          {[
            { label: 'Trending products', value: trending[0]?.product?.name || 'No data yet', change: trending[0] ? `${trending[0].growthPercent >= 0 ? '+' : ''}${trending[0].growthPercent}%` : '' },
            { label: 'Fastest rising', value: trending[1]?.product?.name || 'No data yet', change: trending[1] ? `${trending[1].growthPercent >= 0 ? '+' : ''}${trending[1].growthPercent}%` : '' },
            { label: 'Top category', value: topCategory?.category || 'No data yet', change: topCategory ? `${Math.round(topCategory.demandScore)} demand` : '' },
            { label: 'Products with data', value: categories.reduce((total, item) => total + (item.count || 0), 0), change: 'Observed sample' },
          ].map(({ label, value, change }) => (
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
              {categoriesLoading ? <p className="muted">Loading category data...</p> : categories.map((item) => (
                <div key={item.category} className="bar-row">
                  <div className="bar-row__meta">
                    <span>{item.category}</span>
                    <strong>{Math.round(item.demandScore || 0)}</strong>
                  </div>
                  <div className="bar-track">
                    <span style={{ width: `${((item.demandScore || 0) / maxScore) * 100}%` }} />
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
              {trendingLoading ? <li>Loading product data...</li> : trending.map((item) => (
                <li key={item.product._id}><strong>{item.product.name}</strong><span>{item.growthPercent >= 0 ? '+' : ''}{item.growthPercent}%</span></li>
              ))}
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
