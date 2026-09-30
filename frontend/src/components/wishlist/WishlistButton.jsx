import { useState } from 'react';
import Button from '../common/Button.jsx';
import { wishlistService } from '../../services/wishlistService.js';

export default function WishlistButton({ productId }) {
  const [message, setMessage] = useState('');

  async function add() {
    try {
      const res = await wishlistService.add(productId);
      setMessage(res.message || 'Added to wishlist');
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div>
      <Button variant="ghost" onClick={add}>
        Add to wishlist
      </Button>
      {message && <p className="muted mt-2">{message}</p>}
    </div>
  );
}
