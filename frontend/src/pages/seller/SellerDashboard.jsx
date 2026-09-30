import SellerShell from './SellerShell.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { sellerService } from '../../services/sellerService.js';
import { Link } from 'react-router-dom';
import SellerStats from '../../components/seller/SellerStats.jsx';
import OpportunityCard from '../../components/seller/OpportunityCard.jsx';
import InventoryTable from '../../components/seller/InventoryTable.jsx';
import Loading from '../../components/common/Loading.jsx';
import MarketReport from '../../components/ai/MarketReport.jsx';
import AIChat from '../../components/ai/AIChat.jsx';

export default function SellerDashboard() {
  const { data, loading, error } = useFetch(() => sellerService.dashboard(), []);
  if (loading) {
    return (
      <SellerShell>
        <Loading />
      </SellerShell>
    );
  }
  if (error) {
    return (
      <SellerShell>
        <p className="text-rose-300">{error}</p>
      </SellerShell>
    );
  }

  const opportunities = data.opportunities || [];
  const inventory = data.inventory || [];
  const summary = {
    risingOpportunities: opportunities.filter((item) => item.trend === 'rising').length,
    averageDemand: opportunities.length
      ? Math.round(opportunities.reduce((total, item) => total + item.demandScore, 0) / opportunities.length)
      : 0,
    lowCompetition: opportunities.filter((item) => item.competition === 'low').length,
    inventoryItems: inventory.length,
  };

  return (
    <SellerShell>
      <main className="seller-dashboard">
        <header className="dashboard-heading">
          <span className="eyebrow">Market overview</span>
          <h1>Seller Dashboard</h1>
          <p>Understand where consumer demand is increasing and identify opportunities worth investigating.</p>
          <small>Figures are observed platform signals, not guaranteed sales.</small>
        </header>
        <SellerStats totals={summary} />

        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <h2>Market opportunities</h2>
            <span>{opportunities.slice(0, 4).length} opportunities</span>
          </div>
          {opportunities.length ? (
            <div className="opportunity-grid">
              {opportunities.slice(0, 4).map((item) => (
                <OpportunityCard key={item.product._id} item={item} />
              ))}
            </div>
          ) : <p className="dashboard-empty">No market opportunities are available yet.</p>}
        </section>

        <section className="card dashboard-section inventory-section">
          <div className="dashboard-section-heading">
            <h2>Inventory snapshot</h2>
            <span>{inventory.length} items</span>
          </div>
          {inventory.length ? (
            <InventoryTable rows={inventory} />
          ) : (
            <div className="inventory-empty">
              <h3>No inventory yet</h3>
              <p>Add products to your inventory to compare inventory against current demand.</p>
              <Link to="/seller/products" className="secondary-btn">Add inventory</Link>
            </div>
          )}
        </section>

        <MarketReport />
        <AIChat role="seller" title="Ask MarketSignal AI" placeholder="Ask about current demand and opportunities" />
      </main>
    </SellerShell>
  );
}
