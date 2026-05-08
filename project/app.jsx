// App shell — top bar, stepper, screen routing, tweaks panel.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#144D3A",
  "bg": "#F7F5EF",
  "displayFont": "Instrument Serif",
  "density": "comfortable"
}/*EDITMODE-END*/;

const FONT_MAP = {
  "Instrument Serif": '"Instrument Serif", serif',
  "Fraktur Modern":   '"DM Serif Display", "Instrument Serif", serif',
  "Geist Display":    '"Geist", system-ui, sans-serif',
};

const App = () => {
  const [step, setStep] = React.useState(0); // 0 upload, 1 review, 2 audit
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  // Apply tweaks to root.
  React.useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--accent", tweaks.accent);
    r.style.setProperty("--accent-soft", tweaks.accent + "1A");
    r.style.setProperty("--bg", tweaks.bg);
    r.style.setProperty("--serif", FONT_MAP[tweaks.displayFont] || FONT_MAP["Instrument Serif"]);
    r.dataset.density = tweaks.density;
  }, [tweaks]);

  const steps = [
    { label: "Wczytaj dane", short: "Dane" },
    { label: "Wyliczenia", short: "Wyliczenia" },
    { label: "Audyt", short: "Audyt" },
  ];

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img src="logo-websat.png" alt="web-sat" className="brand-logo" />
          <span className="brand-sep">·</span>
          <span className="brand-sub">Audyt Nobelica</span>
        </div>
        <div className="meta">
          <span><span className="k">Klient</span><strong>Kowalczyk &amp; Szarejko Trans</strong></span>
          <span><span className="k">Pojazd</span><strong>DAF · OKT-2643</strong></span>
          <span><span className="k">Okres</span><strong>20.04 – 03.05.2026</strong></span>
        </div>
        <div className="actions">
          <button className="btn btn--ghost"><window.UI.Icon name="settings" /> Ustawienia</button>
          <button className="btn">Zapisz wersję roboczą</button>
        </div>
      </header>

      <nav className="stepper" aria-label="Etapy audytu">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <button
              className={`step ${step === i ? "is-active" : ""} ${step > i ? "is-done" : ""}`}
              onClick={() => setStep(i)}
            >
              <span className="num">{step > i ? "✓" : i + 1}</span>
              <span>{s.label}</span>
            </button>
            {i < steps.length - 1 && <span className="arr"></span>}
          </React.Fragment>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
          Krok {step + 1} z {steps.length}
        </div>
      </nav>

      {step === 0 && <window.ScreenUpload onNext={() => setStep(1)} />}
      {step === 1 && <window.ScreenReview onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && <window.ScreenAudit onBack={() => setStep(1)} />}

      {/* Tweaks panel */}
      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="Kolor i tło">
            <window.TweakColor
              label="Akcent (audytor)"
              value={tweaks.accent}
              options={["#144D3A", "#1F4068", "#7A2E1F", "#3B2E5A", "#0E1612"]}
              onChange={(v) => setTweak("accent", v)}
            />
            <window.TweakColor
              label="Tło aplikacji"
              value={tweaks.bg}
              options={["#F7F5EF", "#FFFFFF", "#F4F1E9", "#EFEBE0", "#0E1612"]}
              onChange={(v) => setTweak("bg", v)}
            />
          </window.TweakSection>

          <window.TweakSection label="Typografia">
            <window.TweakRadio
              label="Font nagłówków"
              value={tweaks.displayFont}
              options={["Instrument Serif", "Geist Display"]}
              onChange={(v) => setTweak("displayFont", v)}
            />
          </window.TweakSection>

          <window.TweakSection label="Nawigacja">
            <window.TweakRadio
              label="Skocz do kroku"
              value={String(step)}
              options={["0", "1", "2"]}
              onChange={(v) => setStep(Number(v))}
            />
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
