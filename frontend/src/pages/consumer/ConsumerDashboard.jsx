import ConsumerLayout from './ConsumerLayout.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { demandService } from '../../services/demandService.js';
import { wishlistService } from '../../services/wishlistService.js';
import { alertService } from '../../services/alertService.js';
import DemandChart from '../../components/demand/DemandChart.jsx';
import DemandHeatmap from '../../components/demand/DemandHeatmap.jsx';
import DonutChart from '../../components/charts/DonutChart.jsx';
import TrendCard from '../../components/demand/TrendCard.jsx';
import Loading from '../../components/common/Loading.jsx';
import AIChat from '../../components/ai/AIChat.jsx';
import { Link } from 'react-router-dom';

export default function ConsumerDashboard() {
  const trending = useFetch(() => demandService.trending({ limit: 6 }), []);
  const regions = useFetch(() => demandService.regions(), []);
  const categories = useFetch(() => demandService.categories(), []);
  const timeline = useFetch(() => demandService.timeline(), []);
  const wishlist = useFetch(() => wishlistService.list(), []);
  const alerts = useFetch(() => alertService.list(), []);

  if (trending.loading) {
    return (
      <ConsumerLayout>
        <Loading />
      </ConsumerLayout>
    );
  }

  return (
    <ConsumerLayout>
      <h1 className="text-2xl font-semibold">Consumer dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <TrendCard title="Wishlist items" score={wishlist.data?.length} growth={0} trend="stable" />
        <TrendCard title="Active alerts" score={alerts.data?.filter((a) => a.active).length} growth={0} trend="stable" />
        <TrendCard title="Rising products" score={trending.data?.filter((t) => t.trend === 'rising').length} growth={0} trend="rising" />
      </div>
      <DemandChart data={timeline.data} />
      <div className="grid gap-4 lg:grid-cols-2">
        <DemandHeatmap regions={regions.data} />
        <div className="card p-4">
          <h3 className="mb-3 font-medium">Category demand</h3>
          <DonutChart data={(categories.data || []).map((c) => ({ name: c.category, value: c.demandScore }))} />
        </div>
      </div>
      <div className="card p-4">
        <h3 className="mb-3 font-medium">Trending products</h3>
        <ul className="space-y-2 text-sm">
          {(trending.data || []).map((item) => (
            <li key={item.product._id} className="flex justify-between">
              <Link to={`/products/${item.product._id}`}>{item.product.name}</Link>
              <span className="text-slate-400">
                {Math.round(item.demandScore)} · {item.growthPercent}%
              </span>
            </li>
          ))}
        </ul>
      </div>
      <AIChat role="consumer" title="Ask MarketSignal AI" placeholder="Ask about trending products or regions" />
    </ConsumerLayout>
  );
}
