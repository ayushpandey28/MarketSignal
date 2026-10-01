import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice.js';
import ProductImage from './ProductImage.jsx';
import DemandScore from '../demand/DemandScore.jsx';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card__media">
        <ProductImage product={product} alt={product.name} />
        <span className="product-card__tag">{product.category}</span>
      </div>

      <div className="product-card__content">
        <div className="product-card__header">
          <div>
            <p className="product-card__brand">{product.brand}</p>
            <h3>{product.name}</h3>
          </div>
        </div>

        <div className="product-card__meta">
          <span>{product.region}</span>
          <span>{product.stock || 0} in stock</span>
        </div>

        <div className="product-card__price-row">
          <span className="price">{formatPrice(product.price)}</span>
          <DemandScore score={product.demandScore || 0} trend={product.trend} />
        </div>

        <div className="product-card__stats">
          <span className="trend-pill">
            <TrendingUp size={12} />
            {Number(product.growthPercent || 0).toFixed(1)}%
          </span>
          <span>{product.interestCount || 0} interested</span>
        </div>
      </div>
    </Link>
  );
}
