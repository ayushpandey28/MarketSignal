import { useState } from 'react';
import Button from '../common/Button.jsx';
import { aiService } from '../../services/aiService.js';
import AIAnalysisCard from './AIAnalysisCard.jsx';

const UNAVAILABLE = 'AI service is temporarily unavailable. Other MarketSignal features are still working.';

function toList(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value).flatMap(toList);
  return value ? [value] : [];
}

function itemText(item) {
  if (typeof item === 'string') return item;
  if (item?.category) {
    const details = [
      item.demandScore != null && `demand ${Math.round(item.demandScore)}`,
      (item.avgGrowthPercent ?? item.avgGrowth) != null && `growth ${item.avgGrowthPercent ?? item.avgGrowth}%`,
    ].filter(Boolean);
    return `${item.category}${details.length ? `: ${details.join(', ')}` : ''}`;
  }
  return item?.insight || item?.name || item?.category || '';
}

export default function MarketReport() {
  const [report, setReport] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const res = await aiService.marketReport();
      setReport(res.data);
    } catch {
      setReport({ marketSummary: UNAVAILABLE });
    } finally {
      setBusy(false);
    }
  }

  const demandChanges = report?.demandChanges && typeof report.demandChanges === 'object' ? report.demandChanges : {};
  const competition = report?.competitionObservations || report?.competition || {};
  const demandTrends = toList(report?.demandChanges).map(itemText).filter(Boolean);
  const lowCompetition = toList(competition.lowCompetitionNiches || competition.lowCompetition);
  const mediumCompetition = toList(competition.mediumCompetition);
  const highCompetition = toList(competition.highCompetitionSegments || competition.highCompetition);
  const opportunities = toList(report?.opportunitiesToInvestigate || report?.opportunities);
  const risks = toList(report?.risks);

  return (
    <AIAnalysisCard title="AI Market Report">
      <p className="muted ai-report-intro">Summarize current demand signals, regional activity, and product opportunities.</p>
      <Button onClick={run} disabled={busy}>
        {busy ? 'Generating...' : 'Generate AI Market Report'}
      </Button>
      {report && (
        <div className="ai-report-content">
          <section>
            <h4>Summary</h4>
            <p>{report.marketSummary || UNAVAILABLE}</p>
          </section>
          {demandTrends.length > 0 && (
            <section>
              <h4>Key demand trends</h4>
              <ul>{demandTrends.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul>
            </section>
          )}
          {report.strongestRegions?.length > 0 && (
            <section>
              <h4>Regional insights</h4>
              <ul>
                {report.strongestRegions.slice(0, 4).map((region) => (
                  <li key={region.region}>
                    {region.region}: demand {Math.round(region.demandScore)}
                    {(region.avgGrowthPercent ?? region.avgGrowth) != null && `, growth ${region.avgGrowthPercent ?? region.avgGrowth}%`}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {(report.topRisingProducts?.length > 0 || opportunities.length > 0) && (
            <section>
              <h4>Opportunity signals</h4>
              <ul>
                {(report.topRisingProducts || []).map((product, index) => (
                  <li key={`${index}-${itemText(product)}`}>
                    {product.name || itemText(product)}
                    {product.demandScore != null && `: demand ${product.demandScore}, growth ${product.growthPercent}%`}
                  </li>
                ))}
                {opportunities.map((item, index) => <li key={`${index}-${itemText(item)}`}>{itemText(item)}</li>)}
              </ul>
            </section>
          )}
          {(risks.length > 0 || lowCompetition.length > 0 || mediumCompetition.length > 0 || highCompetition.length > 0) && (
            <section>
              <h4>Things to watch</h4>
              <ul>
                {lowCompetition.map((item, index) => <li key={`low-${index}`}>Low-competition niche: {itemText(item)}</li>)}
                {mediumCompetition.map((item, index) => <li key={`medium-${index}`}>Medium competition: {itemText(item)}</li>)}
                {highCompetition.map((item, index) => <li key={`high-${index}`}>Higher competition: {itemText(item)}</li>)}
                {risks.map((item, index) => <li key={`risk-${index}`}>{itemText(item)}</li>)}
              </ul>
            </section>
          )}
          {report.disclaimer && <p className="muted">{report.disclaimer}</p>}
        </div>
      )}
    </AIAnalysisCard>
  );
}
