export default function SellerStats({ totals = {} }) {
  const cards = [
    ['Rising opportunities', totals.risingOpportunities],
    ['Average demand', totals.averageDemand],
    ['Low competition', totals.lowCompetition],
    ['Inventory items', totals.inventoryItems],
  ];
  return (
    <div className="seller-stats-grid">
      {cards.map(([label, value]) => (
        <div key={label} className="card seller-stat">
          <span>{label}</span>
          <strong>{value || 0}</strong>
        </div>
      ))}
    </div>
  );
}
