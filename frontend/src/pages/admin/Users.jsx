import AdminShell from './AdminShell.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { adminService } from '../../services/sellerService.js';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';

export default function Users() {
  const { data, loading, setData } = useFetch(() => adminService.users(), []);

  async function toggle(id) {
    const res = await adminService.toggleUser(id);
    setData(data.map((u) => (u._id === id ? { ...u, isActive: res.data.isActive } : u)));
  }

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">Users</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-2">
          {(data || []).map((user) => (
            <div key={user._id} className="card flex items-center justify-between p-3">
              <div>
                <p>{user.name}</p>
                <p className="muted">
                  {user.email} · {user.role}
                </p>
              </div>
              <Button variant="ghost" onClick={() => toggle(user._id)}>
                {user.isActive ? 'Disable' : 'Enable'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
