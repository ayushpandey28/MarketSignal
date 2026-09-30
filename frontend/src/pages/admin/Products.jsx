import AdminShell from './AdminShell.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { adminService } from '../../services/sellerService.js';
import Loading from '../../components/common/Loading.jsx';

export default function Products() {
  const { data, loading } = useFetch(() => adminService.products(), []);
  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">Products</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-2">
          {(data || []).map((p) => (
            <div key={p._id} className="card p-3">
              <p className="font-medium">{p.name}</p>
              <p className="muted">
                {p.category} · {p.region} · {p.isActive ? 'active' : 'hidden'}
              </p>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
