import { useMemo, useState } from 'react';

const FALLBACKS = {
  'Mechanical Keyboard 75%': 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
  'Noise Cancel Headset': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  'Standing Desk Converter': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
  'Compact Travel Backpack': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  'Smart LED Strip Kit': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  'USB-C Docking Station': 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=900&q=80',
  'Portable Monitor 15.6"': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  'Gaming Mouse Lightweight': 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
  default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
};

export default function ProductImage({ product, alt, className = '' }) {
  const source = useMemo(() => {
    const images = product?.images || [];
    if (images.length) return images[0];
    if (product?.imageUrl) return product.imageUrl;
    if (product?.image) return product.image;
    if (product?.name && FALLBACKS[product.name]) return FALLBACKS[product.name];
    return FALLBACKS.default;
  }, [product]);

  const [broken, setBroken] = useState(false);

  if (!source || broken) {
    return (
      <div className={`product-image fallback ${className}`} aria-label={alt || 'Product image'}>
        <span>{product?.category || 'MarketSignal'}</span>
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={alt || product?.name || 'Product'}
      className={`product-image ${className}`}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}
