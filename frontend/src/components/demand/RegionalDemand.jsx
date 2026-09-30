import GrowthIndicator from './GrowthIndicator.jsx';

export default function RegionalDemand({ rows }) {
  if (!rows?.length) return <p className="muted">No regional split yet.</p>;
  return (
    <div className="card p-4">
      <h3 className="mb-3 font-medium">Regional demand</h3>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.region} className="flex items-center justify-between text-sm">
            <span>{row.region}</span>
            <GrowthIndicator value={row.growthPercent} trend={row.trend} />
          </li>
        ))}
      </ul>
    </div>
  );
}
