import SellerShell from './SellerShell.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { sellerService } from '../../services/sellerService.js';
import InventoryTable from '../../components/seller/InventoryTable.jsx';
import Loading from '../../components/common/Loading.jsx';

export default function Inventory() {
  const { data, loading } = useFetch(() => sellerService.inventory(), []);
  return (
    <SellerShell>
      <h1 className="text-2xl font-semibold">Inventory</h1>
      {loading ? <Loading /> : <div className="card p-4"><InventoryTable rows={data} /></div>}
    </SellerShell>
  );
}
