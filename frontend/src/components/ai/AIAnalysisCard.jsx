export default function AIAnalysisCard({ title, children }) {
  return (
    <div className="card p-5">
      <h3 className="mb-3 font-medium">{title}</h3>
      {children}
    </div>
  );
}
