import GrowthIndicator from '../demand/GrowthIndicator.jsx';

export default function OpportunityCard({ item }) {
  return (
    <article className="card opportunity-card">
      <div>
        <h3>{item.product.name}</h3>
        <p className="muted">{item.product.category}</p>
      </div>
      <div className="opportunity-metrics">
        <div><span>Demand</span><strong>{Math.round(item.demandScore)}</strong></div>
        <div><span>Growth</span><GrowthIndicator value={item.growthPercent} trend={item.trend} /></div>
        <div><span>Competition</span><strong className="capitalize">{item.competition}</strong></div>
      </div>
      <p className="opportunity-insight">{item.insight}</p>
    </article>
  );
}
