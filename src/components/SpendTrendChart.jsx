const SPEND_DATA = [
  { month: 'Nov', aws: 4820, azure: 1240, gcp: 980 },
  { month: 'Dec', aws: 5140, azure: 1380, gcp: 1120 },
  { month: 'Jan', aws: 5680, azure: 1520, gcp: 1340 },
  { month: 'Feb', aws: 6120, azure: 1640, gcp: 1480 },
  { month: 'Mar', aws: 6890, azure: 1820, gcp: 1620 },
  { month: 'Apr', aws: 7240, azure: 1960, gcp: 1840 },
];

const PROVIDERS = [
  { key: 'aws', name: 'AWS', color: '#ff9900' },
  { key: 'azure', name: 'Azure', color: '#0078d4' },
  { key: 'gcp', name: 'GCP', color: '#4285f4' },
];

export default function SpendTrendChart() {
  const maxVal = Math.max(...SPEND_DATA.flatMap((d) => [d.aws, d.azure, d.gcp]));
  const height = 120;
  const barW = 11;
  const gap = 3;
  const groupGap = 22;
  const groupW = 3 * barW + 2 * gap;
  const totalW = SPEND_DATA.length * (groupW + groupGap) - groupGap;

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <h4 className="card__title">Multi-cloud spend</h4>
          <p className="card__subtitle">Grouped monthly runrate by provider</p>
        </div>
        <span className="spend-chart__growth">+19% MoM</span>
      </div>
      <div className="card__body" style={{ paddingTop: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${totalW + 44} ${height + 36}`} width="100%" style={{ display: 'block', minWidth: 360 }}>
            {[0, 0.5, 1].map((t, i) => {
              const y = height - t * height + 8;
              return (
              <g key={i}>
                <line x1={0} y1={y} x2={totalW} y2={y} stroke="var(--chart-grid)" strokeWidth="0.5" strokeDasharray="3 3" />
                  <text x={totalW + 8} y={y + 3} fill="var(--text-muted)" fontSize="9" fontFamily="var(--mono)">
                    ${((maxVal * t) / 1000).toFixed(1)}k
                  </text>
                </g>
              );
            })}
            {SPEND_DATA.map((d, gi) => {
              const gx = gi * (groupW + groupGap);
              return (
                <g key={d.month}>
                  {PROVIDERS.map((prov, i) => {
                    const val = d[prov.key];
                    const h = (val / maxVal) * height;
                    const bx = gx + i * (barW + gap);
                    const by = height - h + 8;
                    return (
                      <rect
                        key={prov.key}
                        x={bx}
                        y={by}
                        width={barW}
                        height={h}
                        rx={2}
                        fill={prov.color}
                        opacity={0.9}
                      >
                        <title>{`${prov.name}: $${val.toLocaleString()}`}</title>
                      </rect>
                    );
                  })}
                  <text
                    x={gx + groupW / 2}
                    y={height + 24}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="10"
                    fontFamily="var(--mono)"
                  >
                    {d.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="spend-chart__legend">
          {PROVIDERS.map((p) => (
            <span key={p.key} className="spend-chart__legend-item">
              <span className="spend-chart__swatch" style={{ background: p.color }} />
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
