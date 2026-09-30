import GrowthIndicator from './GrowthIndicator.jsx';

export default function TrendCard({ title, score, growth, trend }) {
  return (
    <div className="card p-4">
      <p className="muted">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{Math.round(score || 0)}</p>
      <GrowthIndicator value={growth} trend={trend} />
    </div>
  );
}
