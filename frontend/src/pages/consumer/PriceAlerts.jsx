import ConsumerLayout from './ConsumerLayout.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { alertService } from '../../services/alertService.js';
import AlertCard from '../../components/alerts/AlertCard.jsx';
import Loading from '../../components/common/Loading.jsx';

export default function PriceAlerts() {
  const { data, loading, setData } = useFetch(() => alertService.list(), []);

  async function remove(id) {
    await alertService.remove(id);
    setData(data.filter((item) => item._id !== id));
  }

  return (
    <ConsumerLayout>
      <h1 className="text-2xl font-semibold">Price alerts</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {(data || []).map((alert) => (
            <AlertCard key={alert._id} alert={alert} onRemove={remove} />
          ))}
          {!data?.length && <p className="muted">No alerts yet.</p>}
        </div>
      )}
    </ConsumerLayout>
  );
}
