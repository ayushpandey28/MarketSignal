import { useState } from 'react';
import AdminShell from './AdminShell.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { adminService } from '../../services/sellerService.js';
import Button from '../../components/common/Button.jsx';

export default function Categories() {
  const { data, loading, error: loadError, setData } = useFetch(() => adminService.categories(), []);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function add(e) {
    e.preventDefault();
    const category = name.trim();
    if (!category) return;
    setError('');
    setMessage('');
    try {
      const res = await adminService.addCategory(category);
      setData((current) => [...new Set([...(current || []), res.data])].sort());
      setMessage(res.message || 'Category added.');
      setName('');
    } catch (err) {
      setError(err.message || 'Unable to add category.');
    }
  }

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">Categories</h1>
      {loadError && <p className="product-feedback is-error" role="alert">Unable to load categories: {loadError}</p>}
      {error && <p className="product-feedback is-error" role="alert">{error}</p>}
      {message && <p className="product-feedback is-success" role="status">{message}</p>}
      <form onSubmit={add} className="flex flex-wrap gap-2">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="New category" required />
        <Button>Add</Button>
      </form>
      {loading ? <p className="muted">Loading categories...</p> : <ul className="grid gap-2 sm:grid-cols-2">
        {(data || []).map((c) => (
          <li key={c} className="card p-3">
            {c}
          </li>
        ))}
      </ul>}
    </AdminShell>
  );
}
