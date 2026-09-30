import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products }) {
  if (!products?.length) {
    return <p className="muted">No products match these filters.</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
