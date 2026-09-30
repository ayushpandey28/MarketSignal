import { ArrowRight, BrainCircuit, Layers3, Search, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';

const steps = [
  { icon: Search, title: 'User actions', text: 'Searches, views, wishlist saves, alerts, and interest actions create product demand signals.' },
  { icon: Layers3, title: 'Signals', text: 'Each interaction is counted and normalized into platform activity for a specific product.' },
  { icon: Sparkles, title: 'Weighted demand engine', text: 'The backend applies a transparent weighted scoring model to turn raw signals into a demand score.' },
  { icon: TrendingUp, title: 'Demand score', text: 'A demand score captures current momentum and compares it against the previous period.' },
  { icon: BrainCircuit, title: 'Market intelligence', text: 'Growth, trend status, regional demand, and category comparison become product insights.' },
];

export default function HowItWorks() {
  return (
    <div>
      <Navbar />
      <main className="container page-shell">
        <section className="section-block intro-block narrow">
          <div>
            <span className="eyebrow">How it works</span>
            <h1>Signals become market clarity.</h1>
          </div>
          <p>MarketSignal is intentionally simple: user actions feed a deterministic engine, and AI can explain the result without replacing it.</p>
        </section>

        <section className="steps-grid">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="card step-card">
              <div className="step-number">0{index + 1}</div>
              <Icon size={20} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </section>

        <section className="cta-panel compact">
          <div>
            <span className="eyebrow">Next step</span>
            <h2>Explore the live product intelligence.</h2>
          </div>
          <Link to="/explore" className="primary-btn">
            Explore demand <ArrowRight size={16} />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
