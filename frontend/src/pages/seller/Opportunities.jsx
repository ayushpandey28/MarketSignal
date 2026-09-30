import SellerShell from './SellerShell.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { sellerService } from '../../services/sellerService.js';
import OpportunityCard from '../../components/seller/OpportunityCard.jsx';
import Loading from '../../components/common/Loading.jsx';

export default function Opportunities() {
  const { data, loading } = useFetch(() => sellerService.opportunities(), []);
  return (
    <SellerShell>
      <h1 className="text-2xl font-semibold">Opportunities</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {(data || []).map((item) => (
            <OpportunityCard key={item.product._id} item={item} />
          ))}
        </div>
      )}
    </SellerShell>
  );
}
