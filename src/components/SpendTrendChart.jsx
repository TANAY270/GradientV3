import React from 'react';

const SPEND_DATA = [
  { month: "Nov", aws: 4820, azure: 1240, gcp: 980 },
  { month: "Dec", aws: 5140, azure: 1380, gcp: 1120 },
  { month: "Jan", aws: 5680, azure: 1520, gcp: 1340 },
  { month: "Feb", aws: 6120, azure: 1640, gcp: 1480 },
  { month: "Mar", aws: 6890, azure: 1820, gcp: 1620 },
  { month: "Apr", aws: 7240, azure: 1960, gcp: 1840 },
];

const PROVIDER_INFO = [
  { key: 'aws', name: 'AWS', color: '#FF9900', gradient: 'linear-gradient(135deg, #FF9900 0%, #ff5500 100%)' },
  { key: 'azure', name: 'Azure', color: '#0089D6', gradient: 'linear-gradient(135deg, #0089D6 0%, #0052cc 100%)' },
  { key: 'gcp', name: 'GCP', color: '#4285F4', gradient: 'linear-gradient(135deg, #4285F4 0%, #34a853 100%)' },
];

export default function SpendTrendChart() {
  const maxVal = Math.max(...SPEND_DATA.flatMap(d => [d.aws, d.azure, d.gcp]));
  const height = 130;
  const barW = 12;
  const gap = 3;
  const groupGap = 24;
  const groupW = 3 * barW + 2 * gap;
  const totalW = SPEND_DATA.length * (groupW + groupGap) - groupGap;

  return (
    <div className="glass-panel" style={{ padding: '20px', background: 'rgba(15, 20, 38, 0.3)' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Multi-Cloud Spend Trend
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Grouped historical infrastructure runs</span>
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: '700',
          color: 'var(--color-error)',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          padding: '2px 8px',
          borderRadius: '4px',
        }}>
          +19% MoM Growth
        </span>
      </div>

      {/* SVG Canvas wrapper */}
      <div style={{ overflowX: 'auto', padding: '4px 0' }}>
        <svg viewBox={`0 0 ${totalW + 50} ${height + 40}`} width="100%" style={{ display: 'block', minWidth: '400px' }}>
          {/* Y Axis Grid lines and labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
            const y = height - t * height + 10;
            const labelVal = ((maxVal * t) / 1000).toFixed(1);
            return (
              <g key={idx} style={{ opacity: 0.12 }}>
                <line x1={0} y1={y} x2={totalW} y2={y} stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
                <text x={totalW + 10} y={y + 3} fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)">
                  ${labelVal}k
                </text>
              </g>
            );
          })}

          {/* Grouped Bars */}
          {SPEND_DATA.map((d, gi) => {
            const gx = gi * (groupW + groupGap);
            return (
              <g key={d.month}>
                {/* Individual provider bars */}
                {PROVIDER_INFO.map((prov, i) => {
                  const val = d[prov.key];
                  const h = (val / maxVal) * height;
                  const bx = gx + i * (barW + gap);
                  const by = height - h + 10;
                  
                  return (
                    <g key={prov.key} style={{ transition: 'opacity 0.2s' }}>
                      {/* Bar itself with nice rounded top corners */}
                      <rect 
                        x={bx} 
                        y={by} 
                        width={barW} 
                        height={h} 
                        rx={2.5} 
                        fill={prov.color} 
                        style={{
                          transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1), y 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                          filter: `drop-shadow(0px 2px 4px ${prov.color}25)`
                        }}
                      >
                        <title>{`${prov.name} Spend: $${val.toLocaleString()}`}</title>
                      </rect>
                    </g>
                  );
                })}
                {/* Month label under group */}
                <text 
                  x={gx + groupW / 2} 
                  y={height + 26} 
                  textAnchor="middle" 
                  fill="var(--text-muted)" 
                  fontSize="10" 
                  fontFamily="var(--font-mono)"
                  fontWeight="600"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Custom dynamic legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '14px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
        {PROVIDER_INFO.map(prov => (
          <span key={prov.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '2px', 
              background: prov.color,
              boxShadow: `0 0 8px ${prov.color}50`
            }} />
            <span style={{ fontWeight: '500' }}>{prov.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
