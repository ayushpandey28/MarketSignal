import { Activity, MapPin, PackageCheck, TrendingUp } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice.js';
import DemandScore from '../demand/DemandScore.jsx';
import ProductImage from './ProductImage.jsx';

export default function ProductDetails({ product, demand }) {
  const overall = demand?.find((d) => d.region === 'All') || {};
  const signalBreakdown = [
    { label: 'Search', value: overall?.counts?.search || 0 },
    { label: 'Views', value: overall?.counts?.view || 0 },
    { label: 'Wishlist', value: overall?.counts?.wishlist || 0 },
    { label: 'Alerts', value: overall?.counts?.price_alert || 0 },
    { label: 'Interest', value: overall?.counts?.interest || 0 },
  ];

  return (
    <div className="detail-layout">
      <div className="card detail-hero">
        <ProductImage product={product} alt={product.name} className="detail-hero__image" />
        <div className="detail-hero__copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="muted large">{product.description || 'Demand intelligence for this product is based on observed consumer activity and weighted platform signals.'}</p>
          <div className="detail-hero__meta">
            <span><MapPin size={14} /> {product.region}</span>
            <span><PackageCheck size={14} /> {product.stock || 0} in stock</span>
          </div>
          <div className="detail-price-row">
            <span className="price huge">{formatPrice(product.price)}</span>
            <span className="trend-pill big">
              <TrendingUp size={14} />
              {Number(overall.growthPercent || 0).toFixed(1)}% growth
            </span>
          </div>
        </div>
      </div>

      <div className="detail-sidebar">
        <div className="card panel">
          <DemandScore score={overall.currentScore || product.demandScore || 0} large />
          <div className="panel-metrics">
            <div>
              <span className="muted small">Trend</span>
              <strong>{overall.trend || product.trend || 'stable'}</strong>
            </div>
            <div>
              <span className="muted small">Interested</span>
              <strong>{product.interestCount || 0}</strong>
            </div>
          </div>
        </div>

        <div className="card panel">
          <div className="panel-title">
            <Activity size={16} />
            <span>Signal breakdown</span>
          </div>
          <div className="signal-list">
            {signalBreakdown.map((signal) => (
              <div key={signal.label} className="signal-item">
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
