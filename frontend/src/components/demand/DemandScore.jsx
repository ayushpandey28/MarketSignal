export default function DemandScore({ score = 0, large = false }) {
  const value = Math.round(score || 0);
  const safeValue = Math.min(Math.max(value, 0), 500);
  const max = 500;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const progress = (safeValue / max) * circumference;
  const trend = safeValue >= 300 ? 'Rising' : safeValue >= 180 ? 'Stable' : 'Declining';

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90">
          <circle cx="40" cy="40" r={radius} stroke="rgba(148,163,184,0.2)" strokeWidth="8" fill="none" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={safeValue >= 300 ? '#34d399' : safeValue >= 180 ? '#38bdf8' : '#f87171'}
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
        <p className={large ? 'text-xl font-semibold text-white' : 'text-sm font-medium text-white'}>{trend}</p>
      </div>
    </div>
  );
}
