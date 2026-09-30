export default function ProductSearch({ value, onChange }) {
  return (
    <input
      className="input"
      placeholder="Search products, brands, categories"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
