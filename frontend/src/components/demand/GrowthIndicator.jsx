export default function GrowthIndicator({ value = 0, trend = 'stable' }) {
  const color = trend === 'rising' ? 'text-emerald-400' : trend === 'declining' ? 'text-rose-400' : 'text-slate-300';
  const sign = value > 0 ? '+' : '';
  return (
    <span className={`text-sm ${color}`}>
      {sign}
      {Number(value || 0).toFixed(1)}% · {trend}
    </span>
  );
}
