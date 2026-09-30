import { Activity, ArrowRight, BrainCircuit, Layers3, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';

const pillars = [
  {
    icon: Target,
    title: 'What is MarketSignal?',
    text: 'It is a demand intelligence platform that tracks product interest, search intent, and wishlist actions to estimate which products are gaining traction.',
  },
  {
    icon: TrendingUp,
    title: 'Why it exists',
    text: 'Teams need early warning signs before a product trend becomes obvious in broad market sales data.',
  },
  {
    icon: Layers3,
    title: 'Core signal system',
    text: 'Searches, product views, wishlists, price alerts, and interest selections are weighted into a deterministic demand score.',
  },
  {
    icon: BrainCircuit,
    title: 'AI analysis layer',
    text: 'Gemini can explain the trend and summarize why demand is changing, but it never replaces the deterministic score engine.',
  },
];

export default function About() {
  return (
    <div>
      <Navbar />
      <main className="container page-shell">
        <section className="section-block intro-block">
          <div>
            <span className="eyebrow">About MarketSignal</span>
            <h1>Understanding demand before it becomes obvious.</h1>
          </div>
          <p>
            MarketSignal converts consumer actions into a shared market signal. The core model is designed to be transparent, understandable, and easy to explain in interviews or product demos.
          </p>
        </section>

        <section className="grid-4">
          {pillars.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card feature-card">
              <Icon size={18} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </section>

        <section className="content-grid">
          <div className="card info-card">
            <h2>Consumer value</h2>
            <ul>
              <li>Discover products that are gaining interest earlier.</li>
              <li>Track wishlists and price alerts without noise.</li>
              <li>Learn which categories and regions are heating up.</li>
            </ul>
          </div>
          <div className="card info-card">
            <h2>Seller value</h2>
            <ul>
              <li>Spot emerging demand before inventory becomes tight.</li>
              <li>Compare category demand against risk and stock.</li>
              <li>Use AI summaries to explain trends without depending on AI for the score itself.</li>
            </ul>
          </div>
        </section>

        <section className="card stack-card">
          <div className="stack-card__header">
            <ShieldCheck size={18} />
            <h2>Technology stack</h2>
          </div>
          <div className="mini-grid">
            <span>React + Vite</span>
            <span>Tailwind CSS</span>
            <span>Express + MongoDB</span>
            <span>JWT auth</span>
            <span>Gemini optional AI</span>
            <span>Deterministic demand engine</span>
          </div>
        </section>

        <section className="cta-panel compact">
          <div>
            <span className="eyebrow">Built for startup demos</span>
            <h2>See the product signals in action.</h2>
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
