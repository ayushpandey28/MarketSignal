import ConsumerLayout from './ConsumerLayout.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { signalService } from '../../services/demandService.js';
import { Link } from 'react-router-dom';
import Loading from '../../components/common/Loading.jsx';

export default function MyInterests() {
  const { data, loading, error } = useFetch(() => signalService.interests(), []);
  return (
    <ConsumerLayout>
      <h1 className="text-2xl font-semibold">My interests</h1>
      <p className="muted">Products you have marked as interesting.</p>
      {loading ? <Loading /> : error ? (
        <p className="product-feedback is-error" role="alert">Unable to load your interests: {error}</p>
      ) : data?.length ? (
        <ul className="mt-4 space-y-2">
          {data.map((item) => (
            <li key={item._id} className="card p-3">
              <Link to={`/products/${item.product._id}`}>{item.product.name}</Link>
              <p className="muted">{item.product.category} · {item.product.region}</p>
            </li>
          ))}
        </ul>
      ) : <p className="muted">No products in your interests yet.</p>}
    </ConsumerLayout>
  );
}
