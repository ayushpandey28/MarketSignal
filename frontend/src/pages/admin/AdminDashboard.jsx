import AdminShell from './AdminShell.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { adminService } from '../../services/sellerService.js';
import Loading from '../../components/common/Loading.jsx';
import DemandHeatmap from '../../components/demand/DemandHeatmap.jsx';

export default function AdminDashboard() {
  const { data, loading } = useFetch(() => adminService.analytics(), []);
  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">Admin dashboard</h1>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(data?.totals || {}).map(([key, value]) => (
              <div key={key} className="card p-4">
                <p className="muted capitalize">{key}</p>
                <p className="text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <DemandHeatmap regions={data?.regions} />
        </>
      )}
    </AdminShell>
  );
}
