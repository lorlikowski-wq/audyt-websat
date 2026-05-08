// Real fleet/fuel audit data — extracted from Nobelica audit example.
// Calculations follow the Excel template (szablon paliwo audyt v1.1).

// ── Inputs (would be parsed from uploaded reports) ──────────────────────
const INPUTS = {
  dystans_km: 4105,
  norma_L_per_100km: 28.00,
  srednie_spalanie_L_per_100km: 31.06,
  zuzycie_na_postoju_L: 28.25,
  zuzycie_can_total_L: 1316.5 + 28.25,
  cena_on: 6.4,
  flota_pojazdow: 10,
  okres_estymacji_dni: 30,
  okres_audytu_dni: 14,
};

// ── Calculations (mirroring the Excel formulas) ─────────────────────────
const zuzycie_wg_normy_L = (INPUTS.dystans_km / 100) * INPUTS.norma_L_per_100km;
const przepalone_L = (INPUTS.dystans_km / 100) * (INPUTS.srednie_spalanie_L_per_100km - INPUTS.norma_L_per_100km);
const strata_przepal = przepalone_L * INPUTS.cena_on;
const strata_postoj = INPUTS.zuzycie_na_postoju_L * INPUTS.cena_on;
const strata_calkowita = strata_przepal + strata_postoj;
const strata_flota_miesiac = strata_calkowita * (INPUTS.flota_pojazdow / 1) * (INPUTS.okres_estymacji_dni / INPUTS.okres_audytu_dni);
const procent_postoj = (INPUTS.zuzycie_na_postoju_L / INPUTS.zuzycie_can_total_L) * 100;

const fmt_pln = (n) => n.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł";
const fmt_n = (n, d = 2) => n.toLocaleString("pl-PL", { minimumFractionDigits: d, maximumFractionDigits: d });

// ── Computed KPIs ───────────────────────────────────────────────────────
const KPIS = [
  { id: "fuel",  label: "Przepalone paliwo ponad normę", value: fmt_n(strata_przepal + strata_postoj, 2), unit: "zł", delta: `+${fmt_n(przepalone_L,1)} L`, dir: "down",
    spark: [120, 140, 145, 138, 152, 160, 158, 165, 174] },
  { id: "speed", label: "Przekroczenia prędkości > 20 km/h", value: "14", unit: "x", delta: "6 000 zł mandat", dir: "down",
    spark: [1, 2, 1, 3, 2, 1, 2, 1, 1] },
  { id: "co2",   label: "Emisja CO₂ (audyt)",  value: "3 417", unit: "kg", delta: "CSRD", dir: "down",
    spark: [240, 245, 248, 250, 252, 254, 255, 258, 260] },
  { id: "etoll", label: "Kontrole e-TOLL", value: "0", unit: "razy", delta: "kara: 1 500 zł / dzień", dir: "down",
    spark: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
];

// ── Findings (vehicle audit table from page 4 of PDF) ───────────────────
const FINDINGS = [
  { id: "f1", sev: "crit",
    title: "Norma zużycia paliwa /100 km — przekroczona",
    area: "Spalanie",
    metric: `${fmt_n(INPUTS.srednie_spalanie_L_per_100km,2)} L /100km vs ${fmt_n(INPUTS.norma_L_per_100km,2)} L`,
    note: `Średnie spalanie przekracza przyjętą normę o ${fmt_n(INPUTS.srednie_spalanie_L_per_100km - INPUTS.norma_L_per_100km, 2)} L/100km. Strata na dystansie ${INPUTS.dystans_km.toLocaleString("pl-PL")} km: ${fmt_pln(strata_przepal)}.`,
  },
  { id: "f2", sev: "crit",
    title: "Zużycie paliwa na postoju — przekroczone",
    area: "Spalanie",
    metric: `${fmt_n(INPUTS.zuzycie_na_postoju_L,2)} L → ${fmt_n(procent_postoj, 2)} %`,
    note: `Pojazd zużył na postoju ${fmt_n(INPUTS.zuzycie_na_postoju_L,2)} L paliwa, co stanowi ${fmt_n(procent_postoj,2)}% całkowitego zużycia. Strata: ${fmt_pln(strata_postoj)}.`,
  },
  { id: "f3", sev: "warn",
    title: "Czas pracy silnika na postoju powyżej 5 min",
    area: "Eksploatacja",
    metric: "4 godz 1 min",
    note: "Łączny czas pracy silnika na postoju w segmentach > 5 min: 4 godz 1 min. Najdłuższy postój: 21 min.",
  },
  { id: "f4", sev: "warn",
    title: "Niski udział tempomatu",
    area: "Styl jazdy",
    metric: "31,6% / 43%",
    note: "Tempomat — wg czasu jazdy: 31,6%, wg dystansu: 43%. Rekomendowany udział to ≥ 60% dystansu na trasach pozamiejskich.",
  },
  { id: "f5", sev: "good",
    title: "Współczynnik hamowania silnikiem — w normie",
    area: "Styl jazdy",
    metric: "70% / 30%",
    note: "Udział hamowania hamulcem silnikowym: 70%, hamulcem zasadniczym: 30%. Wartość prawidłowa — sprzyja oszczędzaniu układu hamulcowego.",
  },
  { id: "f6", sev: "crit",
    title: "Brak kontroli systemu e-TOLL",
    area: "Compliance",
    metric: "0 kontroli / 14 dni",
    note: "Przez cały okres audytu nie odnotowano żadnej kontroli systemu e-TOLL. Kara administracyjna: 1 500 zł za każdy dzień. KAS ma 5 lat na przeprowadzenie kontroli.",
  },
  { id: "f7", sev: "crit",
    title: "Przekroczenie DMC 40 t",
    area: "Nacisk na oś",
    metric: "27.04.2026",
    note: "Odnotowano przekroczenie dopuszczalnej masy całkowitej 40 t w dniu 27.04.2026. Rekordowa kara dla polskiego przewoźnika w 2026 r.: 124 000 zł.",
  },
  { id: "f8", sev: "info",
    title: "Tachograf — dane legalizacji",
    area: "Tachograf",
    metric: "VDO 1381 · G2V2",
    note: "Model: VDO 1381.7550333013 (4.1). Generacja: G2V2. Termin legalizacji: 18.03.2028. Termin wymiany: nie dotyczy.",
  },
  { id: "f9", sev: "good",
    title: "Czas pracy kierowcy (LTC) — bez naruszeń",
    area: "Tachograf",
    metric: "0 naruszeń",
    note: "Technologia LTC (Live Tacho Counters) — odczyt > 20 parametrów CPK bezpośrednio z tachografu, bez plików *.DDD. W okresie audytu brak naruszeń.",
  },
  { id: "f10", sev: "warn",
    title: "Pojazd jeździł w strefach wyłączania 2G",
    area: "Łączność",
    metric: "PL · LT",
    note: "W badanym okresie pojazd poruszał się w krajach z planowanym wyłączeniem sieci 2G: Polska (do 2028), Litwa (2025/2028). Ryzyko utraty łączności urządzeń 2G.",
  },
];

// ── Speeding violations (PDF pages 5-6) ─────────────────────────────────
const SPEEDING = [
  { dt: "2026-04-20 09:58:18", max: 68, lim: 40, fine: 400, pts: 7 },
  { dt: "2026-04-20 17:30:43", max: 83, lim: 50, fine: 800, pts: 9 },
  { dt: "2026-04-21 12:38:45", max: 75, lim: 50, fine: 300, pts: 5 },
  { dt: "2026-04-22 10:19:27", max: 75, lim: 50, fine: 300, pts: 5 },
  { dt: "2026-04-23 04:54:42", max: 72, lim: 50, fine: 300, pts: 5 },
  { dt: "2026-04-23 05:13:24", max: 77, lim: 50, fine: 400, pts: 7 },
  { dt: "2026-04-24 11:44:40", max: 72, lim: 50, fine: 300, pts: 5 },
  { dt: "2026-04-24 11:56:48", max: 74, lim: 50, fine: 300, pts: 5 },
  { dt: "2026-04-27 14:31:57", max: 74, lim: 50, fine: 300, pts: 5 },
  { dt: "2026-04-28 11:58:42", max: 85, lim: 50, fine: 800, pts: 9 },
  { dt: "2026-04-29 09:41:53", max: 72, lim: 50, fine: 300, pts: 5 },
  { dt: "2026-04-29 20:42:11", max: 83, lim: 50, fine: 800, pts: 9 },
  { dt: "2026-04-30 17:02:37", max: 72, lim: 50, fine: 300, pts: 5 },
  { dt: "2026-04-30 18:25:44", max: 79, lim: 50, fine: 400, pts: 7 },
];
const SPEED_TOTAL_FINE = SPEEDING.reduce((s, v) => s + v.fine, 0);
const SPEED_TOTAL_PTS = SPEEDING.reduce((s, v) => s + v.pts, 0);

// ── Speed distribution (PDF page 5) ─────────────────────────────────────
const SPEED_DIST = [
  { range: "0–60 km/h",  pct: 7.02, color: "var(--good)" },
  { range: "61–75 km/h", pct: 8.42, color: "var(--good)" },
  { range: "76–80 km/h", pct: 12.11, color: "var(--warn)" },
  { range: "81–85 km/h", pct: 23.39, color: "var(--warn)" },
  { range: "86+ km/h",   pct: 49.06, color: "var(--crit)" },
];

// ── Recommendations ────────────────────────────────────────────────────
const RECOMMENDATIONS = [
  { title: "Wdrożyć kontrolę spalania ponad normę", body: "Stałe monitorowanie odchylenia od normy 28 L/100km. Alerty dla zarządcy floty przy przekroczeniu progu 5%.", prio: "Krytyczny", eff: "1–2 tyg." },
  { title: "Zredukować pracę silnika na postoju", body: "Wdrożyć politykę \"silnik wyłączony przy postoju > 3 min\". Szkolenia kierowców, alerty w czasie rzeczywistym.", prio: "Krytyczny", eff: "1 m-c" },
  { title: "Aktywować kontrolę systemu e-TOLL", body: "Włączyć w Web-Sat moduł monitorowania e-TOLL na wszystkich pojazdach. Eliminuje ryzyko kary 1 500 zł/dzień.", prio: "Krytyczny", eff: "1 tydz." },
  { title: "Zwiększyć udział tempomatu do ≥ 60%", body: "Szkolenia i premiowanie kierowców za udział tempomatu. Cel: 60% wg dystansu na trasach pozamiejskich.", prio: "Wysoki", eff: "1 kw." },
  { title: "Wdrożyć monitoring nacisku na oś (CAN FD)", body: "Odczyt parametrów wagowych z szyny CAN/CAN FD do 5 osi + masa brutto. Eliminuje ryzyko kar do 124 tys. zł.", prio: "Wysoki", eff: "2 m-ce" },
  { title: "Migracja urządzeń z 2G na 4G", body: "Wymiana lokalizatorów 2G na 4G/LTE-M przed wyłączeniem sieci w Niemczech, Czechach, Skandynawii (31.12.2025).", prio: "Wysoki", eff: "Q4 2026" },
];

// ── Audit areas (sub-scores) ───────────────────────────────────────────
const AREAS = [
  { name: "Spalanie i koszty paliwa",  score: 42, sev: "crit" },
  { name: "Bezpieczeństwo (prędkość)", score: 28, sev: "crit" },
  { name: "Compliance (e-TOLL)",       score: 0,  sev: "crit" },
  { name: "Styl jazdy (tempomat, hamowanie)", score: 64, sev: "warn" },
  { name: "Tachograf i CPK",           score: 92, sev: "good" },
  { name: "Emisja CO₂ i CSRD",         score: 58, sev: "warn" },
];

// ── Trend (fuel price × overuse over time, fictitious) ─────────────────
const TREND = {
  months: ["20.04","22.04","24.04","26.04","28.04","30.04","02.05"],
  norma: [320, 320, 320, 320, 320, 320, 320],   // L wg normy / 2-day window
  rzecz: [340, 348, 360, 370, 378, 388, 392],   // L rzeczywiste
};

// ── Fleet estimation ───────────────────────────────────────────────────
const FLEET = {
  pojazdow: 10,
  okres: "30 dni",
  strata_miesiac: 20809.00,
  strata_rok: 20809.00 * 12,
};

// Overall score (weighted avg, leaning critical due to e-TOLL = 0)
const OVERALL_SCORE = Math.round(AREAS.reduce((s, a) => s + a.score, 0) / AREAS.length);

const VERDICT =
  OVERALL_SCORE >= 75 ? { label: "Zadowalający", tone: "good" } :
  OVERALL_SCORE >= 50 ? { label: "Wymagający uwagi", tone: "warn" } :
                        { label: "Wymagający pilnych działań", tone: "crit" };

// Mock files (typical fleet telemetry exports)
const MOCK_FILES = [
  { name: "raport_paliwo_DAF_kwiecien.csv",      ext: "csv",  size: "3.1 MB", rows: 18430, status: "Sparsowane" },
  { name: "tracking_GPS_20-30.04.json",          ext: "json", size: "8.4 MB", rows: 412300, status: "Sparsowane" },
  { name: "raport_predkosc_DAF.xlsx",            ext: "xlsx", size: "612 KB", rows: 1240, status: "Sparsowane" },
  { name: "tachograf_LTC_export.json",           ext: "json", size: "184 KB", rows: 220, status: "Sparsowane" },
  { name: "CAN_axle_load_DAF.csv",               ext: "csv",  size: "1.2 MB", rows: 7820, status: "Sparsowane" },
  { name: "polityka_paliwowa_2026.pdf",          ext: "pdf",  size: "0.8 MB", rows: null, status: "Załączono" },
];

window.AUDIT_DATA = {
  INPUTS, MOCK_FILES, KPIS, FINDINGS, SPEEDING, SPEED_TOTAL_FINE, SPEED_TOTAL_PTS,
  SPEED_DIST, RECOMMENDATIONS, AREAS, TREND, FLEET,
  OVERALL_SCORE, VERDICT, fmt_pln, fmt_n,
  // Calc results (so the audit doc can display them)
  CALC: {
    zuzycie_wg_normy_L,
    przepalone_L,
    strata_przepal,
    strata_postoj,
    strata_calkowita,
    strata_flota_miesiac,
    procent_postoj,
  },
};
