import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import ProductGrid from '../../components/products/ProductGrid.jsx';
import { productService } from '../../services/productService.js';
import { signalService } from '../../services/demandService.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { REGION_OPTIONS } from '../../constants/regions.js';

const CATEGORY_CHIPS = ['All', 'Electronics', 'Gaming', 'Smart Home', 'Travel', 'Fitness', 'Office', 'Lifestyle'];

export default function Explore() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', region: '', sort: 'demand' });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);
  const debounced = useDebounce(search);

  useEffect(() => {
    productService.categories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setVisibleCount(9);
    productService
      .list({ search: debounced, category: filters.category, region: filters.region })
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debounced, filters.category, filters.region]);

  useEffect(() => {
    if (debounced) signalService.search({ query: debounced }).catch(() => {});
  }, [debounced]);

  const sorted = useMemo(() => {
    const list = [...products];
    if (filters.sort === 'growth') list.sort((a, b) => (b.growthPercent || 0) - (a.growthPercent || 0));
    else if (filters.sort === 'price') list.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (filters.sort === 'interest') list.sort((a, b) => (b.interestCount || 0) - (a.interestCount || 0));
    else list.sort((a, b) => (b.demandScore || 0) - (a.demandScore || 0));
    return list;
  }, [products, filters.sort]);

  const visibleProducts = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <div>
      <Navbar />
      <main className="container page-shell">
        <section className="section-block intro-block narrow">
          <div>
            <span className="eyebrow">Market explorer</span>
            <h1>Track what buyers are starting to want.</h1>
          </div>
          <p>Demo catalog data is synthetic and labeled for local product demos, while demand scores are computed from weighted platform signals.</p>
        </section>

        <section className="card filter-panel">
          <div className="search-input">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands, categories"
            />
          </div>

          <div className="filter-grid">
            <div className="field">
              <label>Category</label>
              <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                <option value="">All categories</option>
                {(categories.length ? categories : ['Electronics', 'Gaming', 'Smart Home', 'Travel', 'Fitness', 'Office', 'Lifestyle']).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Region</label>
              <select value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })}>
                <option value="">All regions</option>
                {REGION_OPTIONS.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Sort</label>
              <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
                <option value="demand">Highest demand</option>
                <option value="growth">Fastest rising</option>
                <option value="interest">Most interested</option>
                <option value="price">Lowest price</option>
              </select>
            </div>
          </div>
        </section>

        <section className="chip-row">
          {CATEGORY_CHIPS.map((chip) => {
            const active = chip === 'All' ? !filters.category : filters.category === chip;
            return (
              <button
                key={chip}
                type="button"
                className={`chip ${active ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, category: chip === 'All' ? '' : chip })}
              >
                {chip}
              </button>
            );
          })}
        </section>

        <div className="toolbar-row">
          <span className="muted">Showing {sorted.length} products</span>
          <span className="muted inline-flex align-center gap-2"><SlidersHorizontal size={14} /> Filtered market view</span>
        </div>

        {error && <div className="error-panel">{error}</div>}

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card skeleton-card" />
            ))}
          </div>
        ) : !sorted.length ? (
          <div className="empty-state card">
            <h3>No products found</h3>
            <p>Try a different search term or reset your filters.</p>
          </div>
        ) : (
          <>
            <ProductGrid products={visibleProducts} />
            {hasMore && (
              <div className="load-more-wrap">
                <button type="button" className="secondary-btn" onClick={() => setVisibleCount((count) => count + 6)}>
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
