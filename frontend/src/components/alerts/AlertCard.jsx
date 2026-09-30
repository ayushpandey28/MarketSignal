import Button from '../common/Button.jsx';
import { formatPrice } from '../../utils/formatPrice.js';

export default function AlertCard({ alert, onRemove }) {
  const product = alert.productId;
  return (
    <div className="card flex items-center justify-between p-4">
      <div>
        <p className="font-medium">{product.name}</p>
        <p className="muted">
          Target {formatPrice(alert.targetPrice)} · {alert.active ? 'watching' : 'triggered'}
        </p>
      </div>
      <Button variant="ghost" onClick={() => onRemove(alert._id)}>
        Remove
      </Button>
    </div>
  );
}
