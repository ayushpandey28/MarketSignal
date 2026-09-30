import { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import { alertService } from '../../services/alertService.js';

export default function PriceAlertModal({ open, onClose, product }) {
  const [targetPrice, setTargetPrice] = useState(product?.price ? Number((product.price * 0.8).toFixed(2)) : '');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTargetPrice(product?.price ? Number((product.price * 0.8).toFixed(2)) : '');
    setError('');
    setMessage('');
  }, [open, product?._id, product?.price]);

  async function save(e) {
    e.preventDefault();

    const value = Number(targetPrice);
    if (!targetPrice || Number.isNaN(value) || value <= 0) {
      setError('Enter a valid target price.');
      setMessage('');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const res = await alertService.create({ productId: product._id, targetPrice: value });
      setMessage(res?.message || 'Price alert created.');
      setTimeout(() => {
        setSaving(false);
        onClose && onClose();
      }, 500);
    } catch (err) {
      setSaving(false);
      setMessage(err.message || 'Unable to create price alert.');
    }
  }

  function handleClose() {
    if (!saving) {
      setError('');
      setMessage('');
      onClose && onClose();
    }
  }

  return (
    <Modal open={open} title="Set price alert" onClose={handleClose}>
      <form onSubmit={save} className="price-alert-form">
        <p className="price-alert-current">Current price: ${Number(product?.price || 0).toFixed(2)}</p>

        <div className="price-alert-field">
          <label htmlFor="target-price" className="price-alert-label">Target price</label>
          <input
            id="target-price"
            className="price-alert-input"
            type="number"
            min="0"
            step="0.01"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="31.00"
            aria-invalid={Boolean(error)}
          />
          <small className="price-alert-helper">You'll be notified when the product reaches this price.</small>
        </div>

        {error && <p className="price-alert-error">{error}</p>}
        {message && !error && <p className="price-alert-success">{message}</p>}

        <div className="price-alert-actions">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save alert'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
