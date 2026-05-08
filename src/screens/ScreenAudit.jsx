import {
  KPIS, FINDINGS, SPEEDING, SPEED_TOTAL_FINE, SPEED_TOTAL_PTS,
  SPEED_DIST, RECOMMENDATIONS, AREAS, TREND, FLEET,
  OVERALL_SCORE, VERDICT, INPUTS, CALC, fmt_pln, fmt_n,
} from '../data.js';
import { Icon } from '../ui.jsx';

function SpeedDistChart() {
  return (
    <div style={{ display: 'flex', height: 38, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--hair)', margin: '12px 0 8px' }}>
      {SPEED_DIST.map((d, i) => (
        <div key={i} style={{
          width: `${d.pct}%`, background: d.color,
          display: 'grid', placeItems: 'center', color: 'white',
          fontSize: 11, fontWeight: 500, fontFamily: 'var(--mono)',
        }}>{d.pct}%</div>
      ))}
    </div>
  );
}

function TrendChart() {
  const W = 720, H = 200, P = 28;
  const all = [...TREND.norma, ...TREND.rzecz];
  const min = Math.min(...all) * 0.92;
  const max = Math.max(...all) * 1.05;
  const range = max - min;
  const xAt = (i) => P + (i / (TREND.months.length - 1)) * (W - 2 * P);
  const yAt = (v) => H - P - ((v - min) / range) * (H - 2 * P);
  const linePath = (vals) => vals.map((v, i) => (i ? 'L' : 'M') + xAt(i).toFixed(1) + ' ' + yAt(v).toFixed(1)).join(' ');
  const areaPath = (vals) => linePath(vals) + ` L ${xAt(vals.length - 1)} ${H - P} L ${xAt(0)} ${H - P} Z`;
  return (
    <div className="trend">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map(t => {
          const y = P + t * (H - 2 * P);
          return <line key={t} x1={P} x2={W-P} y1={y} y2={y} stroke="var(--hair)" strokeDasharray="2 4" />;
        })}
        <path d={areaPath(TREND.rzecz)} fill="var(--crit)" opacity="0.10" />
        <path d={linePath(TREND.rzecz)} stroke="var(--crit)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d={linePath(TREND.norma)} stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
        {TREND.rzecz.map((v, i) => <circle key={i} cx={xAt(i)} cy={yAt(v)} r={i === TREND.rzecz.length - 1 ? 4 : 2.5} fill="var(--crit)" />)}
        {TREND.months.map((m, i) => <text key={m} x={xAt(i)} y={H - 8} fontSize="10" fill="var(--muted)" textAnchor="middle">{m}</text>)}
        <text x={W - P} y={yAt(TREND.rzecz[TREND.rzecz.length - 1]) - 8} fontSize="11" fill="var(--crit)" textAnchor="end" fontWeight="500">rzeczywiste</text>
        <text x={W - P} y={yAt(TREND.norma[0]) - 8} fontSize="11" fill="var(--accent)" textAnchor="end">norma</text>
      </svg>
    </div>
  );
}

export default function ScreenAudit({ onBack }) {
  const today = new Date().toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <main className="work" data-screen-label="03 Audyt">
      <div className="audit-actionbar">
        <div className="left">
          <span className="dot"></span>
          <div className="info"><b>Audyt floty Web-Sat</b> · Kowalczyk &amp; Szarejko Trans · DAF · 14 dni · gotowy</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn" onClick={onBack}><Icon name="arrow-left" /> Wróć do edycji</button>
          <button className="btn"><Icon name="share" /> Udostępnij</button>
          <button className="btn" onClick={() => window.print()}><Icon name="print" /> Drukuj</button>
          <button className="btn btn--primary"><Icon name="download" /> Pobierz PDF</button>
        </div>
      </div>

      <article className="audit-doc" id="audit-doc">

        {/* COVER */}
        <section className="audit-page cover">
          <div className="top">
            <div className="brand">
              <img src="/logo-websat.png" alt="web-sat" className="brand-logo" />
              <span className="brand-sep">·</span>
              <span className="brand-sub">Nobelica</span>
            </div>
            <div className="ref">
              Numer audytu
              <strong>OKT-2643</strong>
            </div>
          </div>

          <div className="center">
            <div className="kicker">Audyt floty · {INPUTS.okres_audytu_dni} dni · DAF</div>
            <h1>Co kosztuje Was<br/><em>brak nadzoru</em>.</h1>
            <p className="sub">Niezależny audyt operacyjny pojazdu DAF prowadzonego przez kierowcę Kamila Szarejko, w okresie 20.04.2026 – 03.05.2026. Analiza paliwa, prędkości, czasu pracy silnika, e-TOLL, nacisku na oś, tachografu i emisji CO₂ — w oparciu o dane telematyki Web-Sat.</p>
          </div>

          <div className="bottom">
            <div className="meta-block"><div className="k">Klient</div><div className="v">Kowalczyk &amp; Szarejko Trans</div></div>
            <div className="meta-block"><div className="k">Pojazd / Kierowca</div><div className="v">DAF · K. Szarejko</div></div>
            <div className="meta-block"><div className="k">Dystans audytu</div><div className="v">{INPUTS.dystans_km.toLocaleString('pl-PL')} km</div></div>
            <div className="meta-block"><div className="k">Wynik ogólny</div><div className="v" style={{ color: 'var(--crit)' }}>{OVERALL_SCORE} / 100</div></div>
          </div>
        </section>

        {/* EXECUTIVE SUMMARY */}
        <section className="audit-page">
          <div className="pgnum"><em>02</em> · Streszczenie</div>
          <div className="doc-eyebrow">Najważniejsze wnioski</div>
          <h2 className="doc-h2">Kierowca samochodu DAF<br/>w analizowanym okresie <em>14 dni</em>:</h2>

          <div className="rec-list" style={{ marginTop: 28 }}>
            <div className="rec">
              <div className="idx">01</div>
              <div>
                <h4>Przepalone paliwo ponad normę</h4>
                <p>Pojazd zużył o {fmt_n(CALC.przepalone_L,1)} L więcej niż wynika z normy 28 L/100km. Strata: <strong>{fmt_pln(CALC.strata_calkowita)}</strong> w 14 dni.</p>
              </div>
              <div className="meta"><span className="chip crit"><span className="dot" />Krytyczny</span></div>
            </div>

            <div className="rec">
              <div className="idx">02</div>
              <div>
                <h4>Liczba przekroczeń ograniczeń prędkości o ponad 20 km/h</h4>
                <p>{SPEEDING.length}× w okresie audytu. W przypadku kontroli prędkości kierowca dostałby mandat w wysokości <strong>{fmt_pln(SPEED_TOTAL_FINE)}</strong> oraz <strong>{SPEED_TOTAL_PTS} punktów karnych</strong>.</p>
              </div>
              <div className="meta"><span className="chip crit"><span className="dot" />Krytyczny</span></div>
            </div>

            <div className="rec">
              <div className="idx">03</div>
              <div>
                <h4>Ryzyko utraty prawa jazdy</h4>
                <p>Liczba punktów karnych ({SPEED_TOTAL_PTS}) ponad 3-krotnie przekracza próg 24 pkt. Kierowca ryzykował utratę prawa jazdy <strong>ponad 3×</strong> w ciągu 14 dni.</p>
              </div>
              <div className="meta"><span className="chip crit"><span className="dot" />Krytyczny</span></div>
            </div>

            <div className="rec">
              <div className="idx">04</div>
              <div>
                <h4>Brak kontroli systemu e-TOLL</h4>
                <p>Przez cały okres nie kontrolowano działania systemu e-TOLL. <strong>Kara: 1 500 zł za każdy dzień</strong>, KAS ma 5 lat na przeprowadzenie kontroli.</p>
              </div>
              <div className="meta"><span className="chip crit"><span className="dot" />Krytyczny</span></div>
            </div>

            <div className="rec">
              <div className="idx">05</div>
              <div>
                <h4>Estymacja straty dla całej floty</h4>
                <p>Jeżeli wszyscy kierowcy w {FLEET.pojazdow}-pojazdowej flocie marnują paliwo w ten sam sposób, w skali miesiąca kosztuje to firmę <strong>{fmt_pln(FLEET.strata_miesiac)}</strong>.</p>
              </div>
              <div className="meta"><span className="chip warn"><span className="dot" />Estymacja</span></div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--hair)', margin: '28px 0 16px' }}/>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, fontSize: 13 }}>
            <div>
              <div className="field-label" style={{ marginBottom: 8 }}>Wyliczenia dla 1 samochodu</div>
              <table className="doc-table" style={{ marginTop: 0 }}>
                <thead><tr><th>Liczba pojazdów</th><th>Czas trwania</th><th className="num">Przepalone paliwo</th></tr></thead>
                <tbody><tr><td>1</td><td>{INPUTS.okres_audytu_dni*2} dni</td><td className="num" style={{ color: 'var(--crit)', fontWeight: 500 }}>{fmt_pln(CALC.strata_calkowita)}</td></tr></tbody>
              </table>
            </div>
            <div>
              <div className="field-label" style={{ marginBottom: 8 }}>Estymacja dla całej floty w miesiącu</div>
              <table className="doc-table" style={{ marginTop: 0 }}>
                <thead><tr><th>Liczba pojazdów</th><th>Czas</th><th className="num">Strata miesięczna</th></tr></thead>
                <tbody><tr><td>{FLEET.pojazdow}</td><td>{FLEET.okres}</td><td className="num" style={{ color: 'var(--crit)', fontWeight: 500 }}>{fmt_pln(FLEET.strata_miesiac)}</td></tr></tbody>
              </table>
            </div>
          </div>
        </section>

        {/* VEHICLE AUDIT TABLE */}
        <section className="audit-page">
          <div className="pgnum"><em>03</em> · Audyt pojazdu</div>
          <div className="doc-eyebrow">Audyt pojazdu — DAF</div>
          <h2 className="doc-h2">Analiza <em>spalania, postoju i stylu jazdy</em>.</h2>
          <p>Analizowane dane: 20.04.2026 – 03.05.2026 · Przejechany dystans: {INPUTS.dystans_km.toLocaleString('pl-PL')} km · Cena ON: {fmt_n(INPUTS.cena_on,2)} zł/L</p>

          <table className="doc-table">
            <thead>
              <tr><th>Analizowane dane</th><th>Opinia</th><th>Wartość</th><th className="num">Strata</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><div style={{ fontWeight: 500 }}>Norma zużycia paliwa na 100 km</div><div style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 400 }}>Przyjęta norma: {fmt_n(INPUTS.norma_L_per_100km,2)} L/100km</div></td>
                <td><span className="chip crit"><span className="dot" />Przekroczona</span></td>
                <td>{fmt_n(INPUTS.srednie_spalanie_L_per_100km,2)} L/100km</td>
                <td className="num" style={{ color: 'var(--crit)', fontWeight: 500 }}>{fmt_pln(CALC.strata_przepal)}</td>
              </tr>
              <tr>
                <td><div style={{ fontWeight: 500 }}>Zużyte paliwo na postoju</div><div style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 400 }}>{fmt_n(CALC.procent_postoj,2)} % całkowitego zużycia</div></td>
                <td><span className="chip crit"><span className="dot" />Przekroczona</span></td>
                <td>{fmt_n(INPUTS.zuzycie_na_postoju_L,2)} L</td>
                <td className="num" style={{ color: 'var(--crit)', fontWeight: 500 }}>{fmt_pln(CALC.strata_postoj)}</td>
              </tr>
              <tr>
                <td colSpan="3" style={{ fontWeight: 500, textAlign: 'right', borderTop: '2px solid var(--ink)' }}>Suma utraconych pieniędzy przez kierowcę:</td>
                <td className="num" style={{ borderTop: '2px solid var(--ink)', color: 'var(--crit)', fontFamily: 'var(--serif)', fontSize: 20 }}>{fmt_pln(CALC.strata_calkowita)}</td>
              </tr>
              <tr>
                <td><div style={{ fontWeight: 500 }}>Czas pracy silnika na postoju &gt; 5 min</div><div style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 400 }}>Najdłuższy postój: 21 min</div></td>
                <td><span className="chip warn"><span className="dot" />Przekroczona</span></td>
                <td>4 godz 1 min</td>
                <td className="num" style={{ color: 'var(--muted)' }}>—</td>
              </tr>
              <tr>
                <td><div style={{ fontWeight: 500 }}>Jazda na tempomacie</div><div style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 400 }}>Wg dystansu: 43%</div></td>
                <td><span className="chip warn"><span className="dot" />Przekroczona</span></td>
                <td>31,6% (czas)</td>
                <td className="num" style={{ color: 'var(--muted)' }}>—</td>
              </tr>
              <tr>
                <td><div style={{ fontWeight: 500 }}>Współczynnik hamowania silnikiem</div><div style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 400 }}>Hamulec zasadniczy: 30%</div></td>
                <td><span className="chip good"><span className="dot" />W normie</span></td>
                <td>70% (silnik)</td>
                <td className="num" style={{ color: 'var(--muted)' }}>—</td>
              </tr>
              <tr><td>Czas jazdy kierowcy</td><td><span className="chip">Nie dotyczy</span></td><td>b.d.</td><td className="num">—</td></tr>
              <tr><td>Czas pracy za granicą</td><td><span className="chip">Nie dotyczy</span></td><td>b.d.</td><td className="num">—</td></tr>
              <tr><td>Pobieranie plików DDD</td><td><span className="chip">Nie dotyczy</span></td><td>b.d.</td><td className="num">—</td></tr>
            </tbody>
          </table>

          <h3 className="doc-h3">Rzeczywiste zużycie vs norma</h3>
          <TrendChart />
        </section>

        {/* SPEEDING */}
        <section className="audit-page">
          <div className="pgnum"><em>04</em> · Prędkość</div>
          <div className="doc-eyebrow">Przekroczenia prędkości</div>
          <h2 className="doc-h2">{SPEEDING.length} naruszeń · <em>{fmt_pln(SPEED_TOTAL_FINE)}</em> mandatów.</h2>
          <p>Lista przekroczeń prędkości o ponad 20 km/h w okresie audytu. Taryfikator dotyczy obszaru Polski. Dla przykładu — w Niemczech za przekroczenie o ponad 26 km/h grozi mandat 235 € (~1 000 zł) + zakaz prowadzenia 1 miesiąc; powyżej 40 km/h — 560 € (~2 500 zł) + zakaz 2 miesiące.</p>

          <h3 className="doc-h3" style={{ marginTop: 28 }}>Rozkład prędkości w czasie jazdy</h3>
          <SpeedDistChart />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 16, fontFamily: 'var(--mono)' }}>
            {SPEED_DIST.map((d,i) => <span key={i}>{d.range}</span>)}
          </div>

          <table className="doc-table">
            <thead><tr><th>Data i czas</th><th className="num">Max km/h</th><th className="num">Limit</th><th className="num">Mandat</th><th className="num">Pkt karne</th></tr></thead>
            <tbody>
              {SPEEDING.map((v,i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 400 }}>{v.dt}</td>
                  <td className="num" style={{ color: 'var(--crit)', fontWeight: 500 }}>{v.max}</td>
                  <td className="num">{v.lim}</td>
                  <td className="num">{v.fine} zł</td>
                  <td className="num">{v.pts} pkt</td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--ink)' }}>
                <td colSpan="3" style={{ fontWeight: 500, textAlign: 'right' }}>Podsumowanie</td>
                <td className="num" style={{ color: 'var(--crit)', fontWeight: 500, fontFamily: 'var(--serif)', fontSize: 18 }}>{SPEED_TOTAL_FINE.toLocaleString('pl-PL')} zł</td>
                <td className="num" style={{ color: 'var(--crit)', fontWeight: 500, fontFamily: 'var(--serif)', fontSize: 18 }}>{SPEED_TOTAL_PTS} pkt</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* CSRD / CO2 */}
        <section className="audit-page">
          <div className="pgnum"><em>05</em> · CSRD / CO₂</div>
          <div className="doc-eyebrow">Emisja CO₂ — przygotowanie do CSRD</div>
          <h2 className="doc-h2">Audytowany pojazd wyemitował<br/><em>3 417 kg CO₂</em>.</h2>

          <div className="two-col">
            <div>
              <p>Dzięki raportom dostępnym w Web-Sat możesz sprawdzić, ile CO₂ wyemitowały Twoje pojazdy. Raport może być również podstawą do raportów środowiskowych.</p>
              <p><strong>CSRD</strong> (Corporate Sustainability Reporting Directive) — dyrektywa UE wprowadzająca obowiązek raportowania w zakresie zrównoważonego rozwoju (ESG) dla firm działających w UE.</p>
              <p>CSRD jest częścią szerszej strategii UE — <strong>Fit for 55</strong>. W ciągu kilku lat liczba podmiotów zobowiązanych do raportowania emisji CO₂ będzie lawinowo rosła.</p>
            </div>
            <div>
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--hair)', borderRadius: 'var(--r-md)', padding: 24 }}>
                <div className="field-label">Emisja w okresie audytu</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 64, lineHeight: 1, letterSpacing: '-0.02em', margin: '8px 0' }}>3 417<small style={{ fontFamily: 'var(--sans)', fontSize: 18, color: 'var(--muted)' }}> kg CO₂</small></div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>Estymacja roczna dla floty {FLEET.pojazdow} pojazdów: <strong style={{ color: 'var(--ink)' }}>{Math.round(3417 * FLEET.pojazdow * 26 / 1000).toLocaleString('pl-PL')} t CO₂</strong></div>
              </div>
            </div>
          </div>
        </section>

        {/* AXLE LOAD */}
        <section className="audit-page">
          <div className="pgnum"><em>06</em> · Nacisk na oś</div>
          <div className="doc-eyebrow">Raport nacisku na oś</div>
          <h2 className="doc-h2">Czy wiesz, że kara za przeładowany pojazd<br/>może przekroczyć <em>100 tys. zł</em>?</h2>

          <div className="two-col">
            <div>
              <p>Jednym z istotnych parametrów w transporcie drogowym jest masa zestawu oraz naciski na poszczególne osie. Przekroczenie skutkuje mandatem i zakazem dalszej jazdy.</p>
              <p>W wielu przypadkach kierowca może być nieświadomy naruszenia — np. gdy dane wagowe w liście przewozowym nie pokrywają się z rzeczywistością. <strong>Odpowiedzialnością obarczony jest przewoźnik.</strong></p>
              <p>Aplikacja Web-Sat odczytuje parametry wagowe z szyny CAN lub nowszej (CAN FD) — dane z 5 osi oraz masę brutto przeliczoną przez pojazd.</p>
            </div>
            <div>
              <div style={{ background: 'color-mix(in oklab, var(--crit) 8%, var(--surface))', border: '1px solid color-mix(in oklab, var(--crit) 30%, var(--hair))', borderRadius: 'var(--r-md)', padding: 24 }}>
                <div className="field-label" style={{ color: 'var(--crit)' }}>Rekordowa kara 2026</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 64, lineHeight: 1, letterSpacing: '-0.02em', margin: '8px 0', color: 'var(--crit)' }}>124 000<small style={{ fontFamily: 'var(--sans)', fontSize: 18, color: 'var(--muted)' }}> zł</small></div>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>Kara dla polskiego przewoźnika za przeładowany pojazd. Nadzór nad przeładowaniem może uchronić Twoją firmę przed karami w Polsce i Europie.</div>
              </div>
            </div>
          </div>

          <div className="pull">
            <div className="q">„Odnotowano przekroczenie DMC 40 t w dn. 27.04.2026."</div>
            <div className="src">— wykres i alert z Web-Sat</div>
          </div>
        </section>

        {/* TACHO + LTC */}
        <section className="audit-page">
          <div className="pgnum"><em>07</em> · Tachograf · LTC</div>
          <div className="doc-eyebrow">Tachograf i czas pracy kierowcy</div>
          <h2 className="doc-h2">Weryfikacja zdalna<br/><em>bez plików *.DDD</em>.</h2>

          <div className="two-col">
            <div>
              <h3 className="doc-h3" style={{ marginTop: 0 }}>Tachograf</h3>
              <table className="doc-table" style={{ marginTop: 0 }}>
                <tbody>
                  <tr><td>Model</td><td className="num" style={{ fontFamily: 'var(--mono)' }}>VDO 1381.7550333013 (4.1)</td></tr>
                  <tr><td>Generacja</td><td className="num">G2V2</td></tr>
                  <tr><td>Następna legalizacja</td><td className="num">18.03.2028</td></tr>
                  <tr><td>Wymiana na nowy</td><td className="num">n.d.</td></tr>
                </tbody>
              </table>
              <p style={{ marginTop: 12, fontSize: 13 }}>Dzięki technologii Web-Sat weryfikujemy model tachografu oraz termin legalizacji <strong>zdalnie</strong>, bez konieczności pobierania plików *.ddd.</p>
            </div>
            <div>
              <h3 className="doc-h3" style={{ marginTop: 0 }}>LTC — Live Tacho Counters</h3>
              <p style={{ fontSize: 13 }}>Technologia szybkiej weryfikacji danych CPK kierowcy odczytywanych bezpośrednio z tachografu. W zależności od modelu — ponad 20 parametrów. Dane nie są obarczone błędem narzędzi bazujących wyłącznie na CAN.</p>
              <div style={{ marginTop: 16, padding: 18, border: '1px solid color-mix(in oklab, var(--good) 30%, var(--hair))', background: 'color-mix(in oklab, var(--good) 6%, var(--surface))', borderRadius: 'var(--r-md)' }}>
                <div className="field-label" style={{ color: 'var(--good)' }}>Naruszenia w okresie audytu</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 36, lineHeight: 1.1, color: 'var(--good)', marginTop: 4 }}>Brak naruszeń</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2G */}
        <section className="audit-page">
          <div className="pgnum"><em>08</em> · Wyłączenia 2G</div>
          <div className="doc-eyebrow">Łączność i wyłączenia 2G w Europie</div>
          <h2 className="doc-h2">Czy Twoja flota jest gotowa<br/>na <em>wyłączenia sieci 2G</em>?</h2>
          <p>Od 1.01.2026 przestaje funkcjonować znaczna część nadajników 2G w Europie zachodniej. W badanym okresie pojazd poruszał się w krajach z planowanym wyłączeniem.</p>

          <div className="method-grid">
            {[
              ['Anglia','31.12.2025'],['Niemcy','31.12.2025'],['Holandia','31.12.2025'],
              ['Czechy','31.12.2025'],['Dania','31.12.2025'],['Estonia','31.12.2025'],
              ['Finlandia','31.12.2025'],['Francja','koniec 2025/2026'],['Irlandia','31.12.2025'],
              ['Norwegia','31.12.2025'],['Szwecja','31.12.2025'],['Litwa','koniec 2025/2028'],
            ].map(([k,v]) => (
              <div className="method-card" key={k}>
                <h5 style={{ marginTop: 0 }}>{k}</h5>
                <p style={{ fontFamily: 'var(--mono)', color: 'var(--crit)' }}>{v}</p>
              </div>
            ))}
          </div>

          <div className="pull" style={{ borderColor: 'var(--warn)' }}>
            <div className="q">W badanym okresie pojazd jeździł po: <em>Polska</em> (do 2028) oraz <em>Litwa</em> (2025/2028).</div>
            <div className="src">— wniosek z analizy GPS</div>
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section className="audit-page">
          <div className="pgnum"><em>09</em> · Rekomendacje</div>
          <div className="doc-eyebrow">Plan działań</div>
          <h2 className="doc-h2">Sześć <em>rekomendacji</em> Web-Sat.</h2>
          <p>Rozwiązania systemu Web-Sat dają Ci kontrolę nad: spalaniem na postoju, spalaniem ponad normę, upustami paliwa, działaniem systemu e-TOLL, przekroczeniami prędkości, pobieraniem plików DDD, gotowością urządzeń po wyłączeniu 2G oraz integracjami z giełdami i spedycjami.</p>

          <div className="rec-list">
            {RECOMMENDATIONS.map((r, i) => (
              <div className="rec" key={i}>
                <div className="idx">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h4>{r.title}</h4>
                  <p>{r.body}</p>
                  <div className="meta">
                    <span className={`chip ${r.prio === 'Krytyczny' ? 'crit' : r.prio === 'Wysoki' ? 'warn' : ''}`}><span className="dot" />Priorytet: {r.prio}</span>
                    <span className="chip">Czas: {r.eff}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--hair)', margin: '32px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
            <div>
              <div className="field-label" style={{ marginBottom: 6 }}>Audytor</div>
              <div style={{ color: 'var(--ink)', fontFamily: 'var(--serif)', fontSize: 18 }}>Nobelica Sp. z o.o.</div>
              <div>ul. Sobieskiego 11/E6, 40-082 Katowice</div>
              <div>KRS 0000478746 · NIP 6342821832</div>
            </div>
            <div>
              <div className="field-label" style={{ marginBottom: 6 }}>Wersja dokumentu</div>
              <div style={{ color: 'var(--ink)', fontFamily: 'var(--serif)', fontSize: 18 }}>OKT-2643 · {today}</div>
              <div>Wygenerowano automatycznie z systemu Web-Sat</div>
              <div>web-sat.pl</div>
            </div>
          </div>
        </section>

      </article>
    </main>
  );
}
