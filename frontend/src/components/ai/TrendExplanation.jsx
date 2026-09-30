import { useState } from 'react';
import Button from '../common/Button.jsx';
import { aiService } from '../../services/aiService.js';
import AIAnalysisCard from './AIAnalysisCard.jsx';

const UNAVAILABLE = 'AI service is temporarily unavailable. Other MarketSignal features are still working.';

export default function TrendExplanation({ productId }) {
  const [report, setReport] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function run() {
    setBusy(true);
    setError('');
    try {
      const res = await aiService.explainTrend(productId);
      setReport(res.data);
    } catch {
      setError(UNAVAILABLE);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AIAnalysisCard title="AI trend explanation">
      <Button onClick={run} disabled={busy}>
        ✨ Explain this trend
      </Button>
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
      {report && (
        <div className="mt-4 space-y-2 text-sm text-slate-300">
          <p>{report.trendSummary}</p>
          <p className="muted">{report.disclaimer}</p>
        </div>
      )}
    </AIAnalysisCard>
  );
}
