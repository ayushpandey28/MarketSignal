import { REGION_OPTIONS } from '../../constants/regions.js';

export default function ProductFilters({ categories, filters, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <select className="input" value={filters.category} onChange={(e) => onChange({ ...filters, category: e.target.value })}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <select className="input" value={filters.region} onChange={(e) => onChange({ ...filters, region: e.target.value })}>
        <option value="">All regions</option>
        {REGION_OPTIONS.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
      <select className="input" value={filters.sort} onChange={(e) => onChange({ ...filters, sort: e.target.value })}>
        <option value="demand">Highest demand</option>
        <option value="growth">Fastest growth</option>
        <option value="price">Lowest price</option>
      </select>
    </div>
  );
}
