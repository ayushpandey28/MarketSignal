import LineChart from '../charts/LineChart.jsx';

export default function DemandChart({ data }) {
  const points = (data || []).map((d) => ({ name: d._id, value: d.count }));
  return (
    <div className="card p-4">
      <h3 className="mb-3 font-medium">Demand over time</h3>
      <LineChart data={points} />
    </div>
  );
}
