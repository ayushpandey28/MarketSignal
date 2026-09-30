import AreaChart from '../charts/AreaChart.jsx';
import BarChart from '../charts/BarChart.jsx';

export default function SellerAnalytics({ timeline, categories }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card p-4">
        <h3 className="mb-3 font-medium">Platform signal volume</h3>
        <AreaChart data={(timeline || []).map((d) => ({ name: d._id, value: d.count }))} />
      </div>
      <div className="card p-4">
        <h3 className="mb-3 font-medium">Category demand</h3>
        <BarChart data={(categories || []).map((c) => ({ name: c.category, value: c.demandScore }))} />
      </div>
    </div>
  );
}
