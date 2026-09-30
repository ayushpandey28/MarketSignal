import SellerShell from './SellerShell.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { sellerService } from '../../services/sellerService.js';
import SellerAnalytics from '../../components/seller/SellerAnalytics.jsx';
import Loading from '../../components/common/Loading.jsx';

export default function SellerAnalyticsPage() {
  const { data, loading } = useFetch(() => sellerService.analytics(), []);
  return (
    <SellerShell>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      {loading ? <Loading /> : <SellerAnalytics timeline={data?.timeline} categories={data?.categories} />}
    </SellerShell>
  );
}
