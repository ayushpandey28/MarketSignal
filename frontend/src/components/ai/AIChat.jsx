import { useState } from 'react';
import Button from '../common/Button.jsx';
import { aiService } from '../../services/aiService.js';

const QUESTIONS = {
  seller: [
    'Which products are gaining demand?',
    'Which region has the strongest demand?',
    'Which products have high demand and low competition?',
    'What should I investigate next?',
    'Explain the current demand trend.',
  ],
  consumer: [
    'Which products are currently trending?',
    'Why is this product gaining demand?',
    'Which products are becoming popular?',
    'What products have rising interest?',
    'Explain this product’s demand score.',
    'Which products are popular in India?',
  ],
};

const UNAVAILABLE = 'AI service is temporarily unavailable. Other MarketSignal features are still working.';

export default function AIChat({ role = 'consumer', title = 'Ask MarketSignal AI', placeholder = 'Ask about MarketSignal data' }) {
  const questions = QUESTIONS[role] || QUESTIONS.consumer;
  const [question, setQuestion] = useState(questions[0]);
  const [answer, setAnswer] = useState(null);
  const [busy, setBusy] = useState(false);

  async function ask(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setBusy(true);
    setAnswer(null);
    try {
      const res = await aiService.chat(question.trim());
      setAnswer(res.data);
    } catch {
      setAnswer({ answer: UNAVAILABLE });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card ai-chat">
      <header className="ai-chat-heading">
        <div>
          <h2>{title}</h2>
          <p>Ask about the available MarketSignal platform data.</p>
        </div>
      </header>
      <form onSubmit={ask} className="ai-chat-form">
        <input
          className="input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholder}
          maxLength={500}
          required
        />
        <Button type="submit" disabled={busy}>{busy ? 'Thinking...' : 'Ask AI'}</Button>
      </form>
      <div className="ai-suggestions" aria-label="Suggested questions">
        {questions.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => setQuestion(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
      {answer && (
        <div className="ai-response" aria-live="polite">
          <h3>AI insight</h3>
          <p>{answer.answer || UNAVAILABLE}</p>
          {answer.keyPoints?.length > 0 && (
            <div>
              <h4>Key points</h4>
              <ul>{answer.keyPoints.map((point, index) => <li key={index}>{point}</li>)}</ul>
            </div>
          )}
          {answer.disclaimer && <p className="ai-disclaimer">{answer.disclaimer}</p>}
        </div>
      )}
    </section>
  );
}
