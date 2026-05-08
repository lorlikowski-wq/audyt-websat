// Reusable bits — sparkline, ring, severity chip, icons.

const Icon = ({ name, size = 16, stroke = 1.6 }) => {
  const s = size;
  const common = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "upload": return <svg {...common}><path d="M12 16V4M12 4l-5 5M12 4l5 5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>;
    case "file": return <svg {...common}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>;
    case "check": return <svg {...common}><path d="M5 13l4 4L19 7"/></svg>;
    case "arrow-right": return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case "arrow-left": return <svg {...common}><path d="M19 12H5M11 19l-7-7 7-7"/></svg>;
    case "arrow-up": return <svg {...common}><path d="M7 17l5-5 5 5M7 11l5-5 5 5"/></svg>;
    case "arrow-down": return <svg {...common}><path d="M7 7l5 5 5-5M7 13l5 5 5-5"/></svg>;
    case "trend-up": return <svg {...common}><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>;
    case "trend-down": return <svg {...common}><path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/></svg>;
    case "alert": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16v.01"/></svg>;
    case "info": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 12v4"/></svg>;
    case "download": return <svg {...common}><path d="M12 4v12M12 16l-5-5M12 16l5-5"/><path d="M4 20h16"/></svg>;
    case "print": return <svg {...common}><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="9" rx="2"/><path d="M6 18h12v3H6z"/></svg>;
    case "edit": return <svg {...common}><path d="M14 4l6 6L8 22H2v-6z"/></svg>;
    case "share": return <svg {...common}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>;
    case "x": return <svg {...common}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "settings": return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19 12c0-.7-.1-1.4-.3-2l2-1.5-2-3.5-2.4.8c-1-.8-2.2-1.4-3.5-1.7L12.5 2h-1l-.4 2.1c-1.3.3-2.5.9-3.5 1.7l-2.4-.8-2 3.5L5.3 10c-.2.6-.3 1.3-.3 2s.1 1.4.3 2l-2 1.5 2 3.5 2.4-.8c1 .8 2.2 1.4 3.5 1.7l.4 2.1h1l.4-2.1c1.3-.3 2.5-.9 3.5-1.7l2.4.8 2-3.5-2-1.5c.2-.6.3-1.3.3-2z"/></svg>;
    default: return null;
  }
};

const Sparkline = ({ values, color = "var(--accent)", height = 28, fill = true }) => {
  if (!values || !values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 120, H = height;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return [x, y];
  });
  const path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const fillPath = path + ` L ${W} ${H} L 0 ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
      {fill && <path d={fillPath} fill={color} opacity="0.12" />}
      <path d={path} stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => i === pts.length - 1 ? (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={color} />
      ) : null)}
    </svg>
  );
};

const Ring = ({ value, max = 100, size = 220, stroke = 14, color = "var(--accent)", track = "var(--hair-2)" }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round" />
    </svg>
  );
};

const SevChip = ({ sev }) => {
  const m = {
    crit: { cls: "crit", label: "Krytyczny" },
    warn: { cls: "warn", label: "Uwaga" },
    good: { cls: "good", label: "Pozytywny" },
    info: { cls: "info", label: "Info" },
  }[sev] || { cls: "", label: sev };
  return <span className={`chip ${m.cls}`}><span className="dot" />{m.label}</span>;
};

const Delta = ({ dir, value, size = "sm" }) => (
  <span className={`delta ${dir === "up" ? "up" : "down"}`}>
    <Icon name={dir === "up" ? "trend-up" : "trend-down"} size={12} />
    {value}
  </span>
);

window.UI = { Icon, Sparkline, Ring, SevChip, Delta };
