import { useState } from 'react';
import { Icon } from './ui.jsx';
import ScreenUpload from './screens/ScreenUpload.jsx';
import ScreenReview from './screens/ScreenReview.jsx';
import ScreenAudit from './screens/ScreenAudit.jsx';

const steps = [
  { label: 'Wczytaj dane' },
  { label: 'Wyliczenia' },
  { label: 'Audyt' },
];

export default function App() {
  const [step, setStep] = useState(0);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img src="/logo-websat.png" alt="web-sat" className="brand-logo" />
          <span className="brand-sep">·</span>
          <span className="brand-sub">Audyt Nobelica</span>
        </div>
        <div className="meta">
          <span><span className="k">Klient</span><strong>Kowalczyk &amp; Szarejko Trans</strong></span>
          <span><span className="k">Pojazd</span><strong>DAF · OKT-2643</strong></span>
          <span><span className="k">Okres</span><strong>20.04 – 03.05.2026</strong></span>
        </div>
        <div className="actions">
          <button className="btn btn--ghost"><Icon name="settings" /> Ustawienia</button>
          <button className="btn">Zapisz wersję roboczą</button>
        </div>
      </header>

      <nav className="stepper" aria-label="Etapy audytu">
        {steps.map((s, i) => (
          <span key={i} style={{ display: 'contents' }}>
            <button
              className={`step ${step === i ? 'is-active' : ''} ${step > i ? 'is-done' : ''}`}
              onClick={() => setStep(i)}
            >
              <span className="num">{step > i ? '✓' : i + 1}</span>
              <span>{s.label}</span>
            </button>
            {i < steps.length - 1 && <span className="arr"></span>}
          </span>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>
          Krok {step + 1} z {steps.length}
        </div>
      </nav>

      {step === 0 && <ScreenUpload onNext={() => setStep(1)} />}
      {step === 1 && <ScreenReview onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && <ScreenAudit onBack={() => setStep(1)} />}
    </div>
  );
}
