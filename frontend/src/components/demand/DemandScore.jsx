export default function DemandScore({ score = 0, trend: trendValue, large = false }) {
  const value = Math.round(score || 0);
  const safeValue = Math.min(Math.max(value, 0), 500);
  const max = 500;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const progress = (safeValue / max) * circumference;
  const trend = trendValue || (safeValue >= 300 ? 'rising' : safeValue >= 180 ? 'stable' : 'declining');
  const trendLabel = trend.charAt(0).toUpperCase() + trend.slice(1);
  const trendColor = trend === 'rising' ? '#34d399' : trend === 'declining' ? '#f87171' : '#38bdf8';

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90">
          <circle cx="40" cy="40" r={radius} stroke="rgba(148,163,184,0.2)" strokeWidth="8" fill="none" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={trendColor}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={large ? 'text-lg font-semibold text-white' : 'text-sm font-semibold text-white'}>{value}</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Demand score</p>
        <p className={large ? 'text-xl font-semibold text-white' : 'text-sm font-medium text-white'}>{trendLabel}</p>
      </div>
    </div>
  );
}
