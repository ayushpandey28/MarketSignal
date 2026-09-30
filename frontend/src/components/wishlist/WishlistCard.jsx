import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';
import { formatPrice } from '../../utils/formatPrice.js';

export default function WishlistCard({ item, onRemove }) {
  const product = item.productId;
  return (
    <div className="card flex items-center justify-between gap-3 p-4">
      <div>
        <Link to={`/products/${product._id}`} className="font-medium">
          {product.name}
        </Link>
        <p className="muted">{formatPrice(product.price)}</p>
      </div>
      <Button variant="ghost" onClick={() => onRemove(item._id)}>
        Remove
      </Button>
    </div>
  );
}
