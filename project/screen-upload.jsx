// Step 1 — Upload screen.

const ScreenUpload = ({ onNext }) => {
  const { MOCK_FILES } = window.AUDIT_DATA;
  const [files, setFiles] = React.useState(MOCK_FILES);
  const [drag, setDrag] = React.useState(false);

  const totalRows = files.reduce((s, f) => s + (f.rows || 0), 0);

  return (
    <main className="work" data-screen-label="01 Wczytaj dane">
      <div className="section-head">
        <div>
          <div className="kicker">Krok 1 z 3</div>
          <h1>Wczytaj <em>dane z Web-Sat</em></h1>
          <p>Załaduj raporty telematyczne pojazdu — paliwo, GPS, prędkość, tachograf, CAN. Kalkulacje (przepalone paliwo, mandaty, emisja CO₂, nacisk na oś) zostaną wyliczone automatycznie wg szablonu paliwo audyt v1.1.</p>
        </div>
        <button className="btn btn--primary" onClick={onNext}>
          Dalej — wyliczenia <window.UI.Icon name="arrow-right" />
        </button>
      </div>

      <div className="upload-grid">
        <div>
          <div
            className={`dropzone ${drag ? "is-drag" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); }}
          >
            <div className="glyph"><window.UI.Icon name="upload" size={22} /></div>
            <h2>Przeciągnij pliki lub <span style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: 4 }}>wybierz z dysku</span></h2>
            <p>Akceptujemy raporty z systemów ERP, eksporty z arkuszy kalkulacyjnych oraz pliki wsadowe. Wielkość pojedynczego pliku do 50 MB.</p>
            <div className="types">
              {["CSV","XLSX","JSON","PDF","XML","TSV"].map(t => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>

          <div className="file-list">
            {files.map((f, i) => (
              <div className="file-row" key={i}>
                <div className={`ext ${f.ext}`}>{f.ext.toUpperCase()}</div>
                <div className="name">
                  {f.name}
                  <small>{f.size}{f.rows ? ` · ${f.rows.toLocaleString("pl-PL")} wierszy` : ""}</small>
                </div>
                <div className="rows">{f.rows ? `${f.rows.toLocaleString("pl-PL")}` : "—"}</div>
                <div className="status"><window.UI.Icon name="check" size={12} /> {f.status}</div>
                <button className="btn btn--ghost btn--icon" title="Usuń"><window.UI.Icon name="x" size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <aside className="upload-side">
          <h3>Co policzymy</h3>
          <div className="req">
            <h4>Paliwo i koszty</h4>
            <p>Spalanie ponad normę, zużycie na postoju, strata PLN, estymacja dla floty.</p>
            <span className="check"><window.UI.Icon name="check" size={12} /> Cena ON: 6,40 zł/L</span>
          </div>
          <div className="req">
            <h4>Prędkość i mandaty</h4>
            <p>Przekroczenia &gt; 20 km/h, taryfikator PL+DE, punkty karne, ryzyko prawa jazdy.</p>
            <span className="check"><window.UI.Icon name="check" size={12} /> Norma: 28 L/100km</span>
          </div>
          <div className="req">
            <h4>Compliance i środowisko</h4>
            <p>Kontrole e-TOLL, emisja CO₂ (CSRD), nacisk na oś (CAN FD), tachograf G2V2, LTC.</p>
            <span className="check"><window.UI.Icon name="check" size={12} /> Wzorzec: Web-Sat 2026</span>
          </div>

          <div style={{ padding: "14px 18px", fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)", display: "block", marginBottom: 4, fontWeight: 500 }}>Przetworzono</strong>
            {files.length} plików · {totalRows.toLocaleString("pl-PL")} wierszy danych
          </div>
        </aside>
      </div>
    </main>
  );
};

window.ScreenUpload = ScreenUpload;
