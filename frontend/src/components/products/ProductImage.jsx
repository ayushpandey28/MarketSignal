import { useState } from 'react';
import { resolveImageUrl } from '../../utils/apiUrl.js';

export default function ProductImage({ product, alt, className = '' }) {
  const source = product?.images?.[0] || product?.imageUrl || product?.image || '';
  const resolvedSource = resolveImageUrl(source);

  const [broken, setBroken] = useState(false);

  if (!resolvedSource || broken) {
    return (
      <div className={`product-image fallback ${className}`} aria-label={alt || 'Product image'}>
        <span>{product?.category || 'MarketSignal'}</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSource}
      alt={alt || product?.name || 'Product'}
      className={`product-image ${className}`}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}
