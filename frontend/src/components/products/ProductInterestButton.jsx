import { useState } from 'react';
import Button from '../common/Button.jsx';
import { signalService } from '../../services/demandService.js';

export default function ProductInterestButton({ productId, count, onChange }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function markInterest() {
    setBusy(true);
    try {
      const res = await signalService.interest({ productId });
      setMessage(res.data.created ? 'Interest recorded.' : 'Interest already counted recently.');
      if (res.data.created && onChange) onChange(count + 1);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Button onClick={markInterest} disabled={busy}>
        I'm Interested
      </Button>
      {message && <p className="muted mt-2">{message}</p>}
    </div>
  );
}
