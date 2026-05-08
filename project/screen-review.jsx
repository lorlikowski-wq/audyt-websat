// Step 2 — Review screen: KPIs, findings, side summary.

const ScreenReview = ({ onNext, onBack }) => {
  const { KPIS, FINDINGS, OVERALL_SCORE, VERDICT } = window.AUDIT_DATA;
  const [tab, setTab] = React.useState("all");
  const [notes, setNotes] = React.useState(
    Object.fromEntries(FINDINGS.map(f => [f.id, f.note]))
  );

  const filtered = FINDINGS.filter(f => tab === "all" ? true : f.sev === tab);
  const counts = {
    all: FINDINGS.length,
    crit: FINDINGS.filter(f => f.sev === "crit").length,
    warn: FINDINGS.filter(f => f.sev === "warn").length,
    good: FINDINGS.filter(f => f.sev === "good").length,
    info: FINDINGS.filter(f => f.sev === "info").length,
  };

  return (
    <main className="work" data-screen-label="02 Wyliczenia">
      <div className="section-head">
        <div>
          <div className="kicker">Krok 2 z 3</div>
          <h1>Sprawdź <em>wyliczone wartości</em></h1>
          <p>Wskaźniki i ustalenia zostały policzone z wczytanych danych. Sprawdź, dopisz komentarze audytora — będą widoczne w finalnym dokumencie.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={onBack}><window.UI.Icon name="arrow-left" /> Wstecz</button>
          <button className="btn btn--primary" onClick={onNext}>Generuj audyt <window.UI.Icon name="arrow-right" /></button>
        </div>
      </div>

      <div className="kpi-grid">
        {KPIS.map(k => (
          <div className="kpi" key={k.id}>
            <div className="label">{k.label}</div>
            <div className="v">{k.value}<span className="unit">{k.unit}</span></div>
            <window.UI.Delta dir={k.dir} value={k.delta} />
            <div className="spark">
              <window.UI.Sparkline values={k.spark} color={k.dir === "up" ? "var(--good)" : "var(--crit)"} />
            </div>
          </div>
        ))}
      </div>

      <div className="review-grid">
        <div>
          <div className="tabs">
            {[
              ["all", "Wszystkie", counts.all],
              ["crit", "Krytyczne", counts.crit],
              ["warn", "Uwaga", counts.warn],
              ["good", "Pozytywne", counts.good],
              ["info", "Info", counts.info],
            ].map(([k, lbl, n]) => (
              <button key={k} className={tab === k ? "is-active" : ""} onClick={() => setTab(k)}>
                {lbl} <span style={{ color: "var(--muted-2)", marginLeft: 4, fontVariantNumeric: "tabular-nums" }}>{n}</span>
              </button>
            ))}
          </div>

          <div className="findings">
            {filtered.map(f => (
              <div className={`finding sev-${f.sev}`} key={f.id}>
                <div className="bar"></div>
                <div>
                  <h4>{f.title}</h4>
                  <div className="meta">
                    <window.UI.SevChip sev={f.sev} />
                    <span>Obszar: <b>{f.area}</b></span>
                    <span>Wartość: <b>{f.metric}</b></span>
                  </div>
                  <textarea
                    value={notes[f.id]}
                    onChange={(e) => setNotes(n => ({ ...n, [f.id]: e.target.value }))}
                    placeholder="Komentarz audytora — pojawi się w finalnym dokumencie"
                  />
                </div>
                <button className="btn btn--ghost btn--icon" title="Edytuj"><window.UI.Icon name="edit" size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 96 }}>
          <div className="summary-box">
            <h3>Wynik wstępny</h3>
            <div className="score">
              {OVERALL_SCORE}<small>/ 100</small>
            </div>
            <div className="verdict">
              <window.UI.SevChip sev={VERDICT.tone === "good" ? "good" : VERDICT.tone === "warn" ? "warn" : "crit"} />
              <span style={{ marginLeft: 8, fontWeight: 500 }}>{VERDICT.label}</span>
            </div>
            <hr />
            {[
              ["Klient", "Kowalczyk & Szarejko Trans"],
              ["Pojazd", "DAF"],
              ["Kierowca", "K. Szarejko"],
              ["Okres", "20.04 – 03.05.2026"],
              ["Dystans", "4 105 km"],
              ["Numer audytu", "OKT-2643"],
            ].map(([k, v]) => (
              <div className="row" key={k}><span className="k">{k}</span><span className="v">{v}</span></div>
            ))}
          </div>

          <div className="summary-box">
            <h3>Obszary audytu</h3>
            <div className="bar-chart" style={{ marginTop: 12, marginBottom: 0 }}>
              {window.AUDIT_DATA.AREAS.map(a => (
                <div className={`row ${a.sev}`} key={a.name}>
                  <div className="k">{a.name}</div>
                  <div className="track"><div className="fill" style={{ width: `${a.score}%` }}></div></div>
                  <div className="v">{a.score}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

window.ScreenReview = ScreenReview;
