import AdminShell from './AdminShell.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { adminService } from '../../services/sellerService.js';
import BarChart from '../../components/charts/BarChart.jsx';
import Loading from '../../components/common/Loading.jsx';

export default function Analytics() {
  const analytics = useFetch(() => adminService.analytics(), []);
  const signals = useFetch(() => adminService.signals(), []);
  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      {analytics.loading ? (
        <Loading />
      ) : (
        <div className="card p-4">
          <h3 className="mb-3 font-medium">Category demand</h3>
          <BarChart
            data={(analytics.data?.categories || []).map((c) => ({ name: c.category, value: c.demandScore }))}
          />
        </div>
      )}
      <div className="card p-4">
        <h3 className="mb-3 font-medium">Recent signals</h3>
        <ul className="space-y-2 text-sm">
          {(signals.data || []).slice(0, 20).map((s) => (
            <li key={s._id} className="flex justify-between">
              <span>
                {s.type} · {s.productId?.name || 'query'}
              </span>
              <span className="text-slate-400">{s.region}</span>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}
