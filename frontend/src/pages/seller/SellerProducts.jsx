import { useState } from 'react';
import SellerShell from './SellerShell.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { sellerService } from '../../services/sellerService.js';
import { productService } from '../../services/productService.js';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import { REGION_OPTIONS } from '../../constants/regions.js';
import { Pencil, Package, Trash2, X } from 'lucide-react';

const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

const empty = {
  name: '',
  category: '',
  brand: '',
  price: '',
  stock: '',
  region: '',
  description: '',
  competition: 'medium',
};

export default function SellerProducts() {
  const { data, loading, error: loadError, setData } = useFetch(() => sellerService.products(), []);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function save(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!form.name.trim() || !form.brand.trim()) {
      setError('Product name and brand are required.');
      return;
    }
    if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) {
      setError('Enter a price greater than 0.');
      return;
    }
    if (form.stock !== '' && (!Number.isFinite(Number(form.stock)) || Number(form.stock) < 0)) {
      setError('Stock cannot be negative.');
      return;
    }
    if (!form.category || !form.region) {
      setError('Choose a category and country/region.');
      return;
    }
    if (image && image.size > 2 * 1024 * 1024) {
      setError('Product images must be 2 MB or smaller.');
      return;
    }

    const payload = new FormData();
    Object.entries(form).forEach(([k, v]) => payload.append(k, v));
    if (image) payload.append('image', image);

    try {
      if (editing) {
        await productService.update(editing, payload);
      } else {
        await productService.create(payload);
      }
      const res = await sellerService.products();
      setData(res.data);
      setMessage(editing ? 'Product updated successfully.' : 'Product added successfully.');
      setForm(empty);
      setImage(null);
      setEditing(null);
    } catch (err) {
      setError(err.message || 'Unable to save product.');
    }
  }

  async function remove(id) {
    setError('');
    setMessage('');
    try {
      await productService.remove(id);
      setData(data.filter((p) => p._id !== id));
      setMessage('Product deleted successfully.');
    } catch (err) {
      setError(err.message || 'Unable to delete product.');
    }
  }

  function startEdit(product) {
    setEditing(product._id);
    setForm({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      region: product.region,
      description: product.description,
      competition: product.competition,
    });
    setImage(null);
    setError('');
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setForm(empty);
    setImage(null);
    setEditing(null);
    setError('');
  }

  return (
    <SellerShell>
      <main className="seller-products-page">
        <header className="seller-products-heading">
          <div>
            <span className="eyebrow">Catalog management</span>
            <h1>My Products</h1>
            <p>Manage your products and keep your inventory connected with market demand.</p>
          </div>
          {!loading && <span className="product-count">{data?.length || 0} products</span>}
        </header>

        {error && <p className="product-feedback is-error" role="alert">{error}</p>}
        {message && <p className="product-feedback is-success" role="status">{message}</p>}

        <section className="card seller-product-form-card">
          <div className="seller-product-section-heading">
            <div>
              <h2>{editing ? 'Edit product' : 'Add new product'}</h2>
              <p>Product details help connect your catalog to demand signals.</p>
            </div>
            {editing && (
              <Button type="button" variant="ghost" onClick={cancelEdit}>
                <X size={15} /> Cancel edit
              </Button>
            )}
          </div>

          <form onSubmit={save} className="seller-product-form">
            <label className="seller-product-field">
              <span>Product name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Portable monitor" required />
            </label>
            <label className="seller-product-field">
              <span>Brand</span>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Brand name" required />
            </label>
            <label className="seller-product-field">
              <span>Price</span>
              <input type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" required />
            </label>
            <label className="seller-product-field">
              <span>Stock</span>
              <input type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" />
            </label>
            <label className="seller-product-field">
              <span>Category</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                <option value="">Choose a category</option>
                {['Electronics', 'Home Office', 'Gaming', 'Fitness', 'Travel', 'Smart Home', 'Accessories', 'Lifestyle'].map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="seller-product-field">
              <span>Country/Region</span>
              <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} required>
                <option value="">Choose a country/region</option>
                {REGION_OPTIONS.map((region) => <option key={region}>{region}</option>)}
              </select>
            </label>
            <label className="seller-product-field">
              <span>Competition</span>
              <select value={form.competition} onChange={(e) => setForm({ ...form, competition: e.target.value })}>
                {['low', 'medium', 'high'].map((level) => <option key={level} value={level}>{level[0].toUpperCase() + level.slice(1)}</option>)}
              </select>
            </label>
            <label className="seller-product-field">
              <span>Product image <small>Optional · JPEG, PNG or WebP · up to 2 MB</small></span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImage(e.target.files[0] || null)} />
            </label>
            <label className="seller-product-field is-wide">
              <span>Description</span>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add a short product description" />
            </label>
            <div className="seller-product-form-actions is-wide">
              <Button type="submit">{editing ? 'Save changes' : 'Add product'}</Button>
            </div>
          </form>
        </section>

        <section className="seller-products-list">
          <div className="seller-product-section-heading">
            <div>
              <h2>Product list</h2>
              <p>Your active products and their latest platform demand.</p>
            </div>
          </div>
          {loading ? <Loading /> : loadError ? (
            <p className="product-feedback is-error" role="alert">Unable to load products: {loadError}</p>
          ) : data?.length ? (
            <div className="seller-product-grid">
              {data.map((product) => (
                <article className="card seller-product-card" key={product._id}>
                  {product.imageUrl ? (
                    <img
                      className="seller-product-image"
                      src={product.imageUrl.startsWith('http') ? product.imageUrl : `${API_ROOT}${product.imageUrl}`}
                      alt={product.name}
                    />
                  ) : (
                    <div className="seller-product-image-placeholder"><Package size={22} /></div>
                  )}
                  <div className="seller-product-card-body">
                    <div className="seller-product-card-title">
                      <div>
                        <h3>{product.name}</h3>
                        <p>{product.brand} · {product.category}</p>
                      </div>
                      <strong>{formatPrice(product.price)}</strong>
                    </div>
                    <div className="seller-product-details">
                      <span>{product.region}</span>
                      <span>{product.stock} in stock</span>
                      <span>Demand {Math.round(product.demandScore || 0)}</span>
                      <span>{Number(product.growthPercent || 0).toFixed(1)}% · {product.trend || 'stable'}</span>
                    </div>
                    <div className="seller-product-actions">
                      <Button type="button" variant="ghost" onClick={() => startEdit(product)}><Pencil size={14} /> Edit</Button>
                      <Button type="button" variant="danger" onClick={() => remove(product._id)}><Trash2 size={14} /> Delete</Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="card seller-products-empty">
              <Package size={25} />
              <h3>No products added yet</h3>
              <p>Add your first product to start tracking demand.</p>
            </div>
          )}
        </section>
      </main>
    </SellerShell>
  );
}
