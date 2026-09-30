import BarChart from '../charts/BarChart.jsx';

export default function DemandHeatmap({ regions }) {
  const data = (regions || []).map((r) => ({ name: r._id, value: Math.round(r.demandScore || 0) }));
  return (
    <div className="card p-4">
      <h3 className="mb-3 font-medium">Regional demand</h3>
      <BarChart data={data} />
    </div>
  );
}
