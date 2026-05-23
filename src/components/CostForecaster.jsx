import { useState } from 'react';
import { Info, Sparkles } from 'lucide-react';
import SpendTrendChart from './SpendTrendChart';

export default function CostForecaster({ resources, recommendations }) {
  const [growthRate, setGrowthRate] = useState(15);
  const [optimizeLevel, setOptimizeLevel] = useState(80);
  const [spotPercent, setSpotPercent] = useState(40);

  const currentCost = resources.reduce((acc, r) => acc + r.costPerMonth, 0);
  const totalSavingsPossible = recommendations.reduce((acc, r) => acc + r.potentialSavings, 0);

  const chart = (() => {
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const baseHistorical = [
      currentCost * 0.88, currentCost * 0.9, currentCost * 0.93,
      currentCost * 0.95, currentCost * 0.97, currentCost * 0.99, currentCost,
    ];
    const growthFactor = 1 + (growthRate / 100) / 4;
    const futureBaseline = [
      baseHistorical[6] * growthFactor,
      baseHistorical[6] * growthFactor ** 2,
      baseHistorical[6] * growthFactor ** 3,
    ];
    const baselineData = [...baseHistorical, ...futureBaseline];

    const immediateSaving = totalSavingsPossible * (optimizeLevel / 100);
    const spotReduction = currentCost * 0.15 * (spotPercent / 100);
    const optimizedStart = Math.max(currentCost - immediateSaving - spotReduction, currentCost * 0.4);
    const futureOptimized = [
      optimizedStart * (1 + (growthRate / 100) * 0.3 / 4),
      optimizedStart * (1 + (growthRate / 100) * 0.3 / 4) ** 2,
      optimizedStart * (1 + (growthRate / 100) * 0.3 / 4) ** 3,
    ];
    const optimizedData = [...baseHistorical.slice(0, 6), currentCost, ...futureOptimized];
    const maxVal = Math.max(...baselineData) * 1.15;

    const mapCoords = (dataList) =>
      dataList.map((val, idx) => ({
        x: 60 + idx * (610 / (dataList.length - 1)),
        y: 240 - (val / maxVal) * 190,
        val,
      }));

    const buildPath = (coords) =>
      coords.reduce((acc, p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = coords[i - 1];
        const cpX = prev.x + (p.x - prev.x) / 2;
        return `${acc} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
      }, '');

    const baselineCoords = mapCoords(baselineData);
    const optimizedCoords = mapCoords(optimizedData);
    const baselinePath = buildPath(baselineCoords);
    const optimizedPath = buildPath(optimizedCoords);
    const area = (path, coords) => {
      const last = coords[coords.length - 1];
      const first = coords[0];
      return `${path} L ${last.x} 240 L ${first.x} 240 Z`;
    };

    return {
      months,
      maxVal,
      baselinePath,
      optimizedPath,
      baselineArea: area(baselinePath, baselineCoords),
      optimizedArea: area(optimizedPath, optimizedCoords),
      baselineCoords,
      optimizedCoords,
      projectedSavings: baselineCoords[9].val - optimizedCoords[9].val,
      insightSaving: immediateSaving + spotReduction,
    };
  })();

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <h3 className="card__title">Cost forecaster</h3>
          <p className="card__subtitle">Simulate spend with growth, autopilot, and spot migration</p>
        </div>
        <span className="forecast-badge">
          <Sparkles size={14} />
          3-mo savings: ${chart.projectedSavings.toFixed(0)}/mo
        </span>
      </div>

      <div className="card__body">
        <div className="forecast-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="forecast-chart-wrap">
              <svg viewBox="0 0 700 280" width="100%" style={{ minWidth: 520, display: 'block' }}>
                <defs>
                  <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--danger)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--danger)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="optimizedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--success)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3].map((i) => {
                  const y = 50 + i * 63;
                  return (
                    <g key={i} opacity={1}>
                      <line x1="60" y1={y} x2="670" y2={y} stroke="var(--chart-grid)" strokeWidth="0.5" strokeDasharray="3,3" />
                      <text x="50" y={y + 4} fill="var(--text-muted)" fontSize="9" textAnchor="end" fontFamily="var(--mono)">
                        ${(chart.maxVal - i * (chart.maxVal / 4)).toFixed(0)}
                      </text>
                    </g>
                  );
                })}
                <path d={chart.baselineArea} fill="url(#baselineGrad)" />
                <path d={chart.optimizedArea} fill="url(#optimizedGrad)" />
                <line x1={467} y1="30" x2={467} y2="240" stroke="var(--chart-grid)" strokeDasharray="5,5" />
                <path d={chart.baselinePath} fill="none" stroke="var(--danger)" strokeWidth="2" />
                <path d={chart.optimizedPath} fill="none" stroke="var(--success)" strokeWidth="2" />
                {chart.months.map((m, idx) => (
                  <text
                    key={m}
                    x={60 + idx * (610 / (chart.months.length - 1))}
                    y="258"
                    textAnchor="middle"
                    fill={idx === 6 ? 'var(--text)' : 'var(--text-muted)'}
                    fontSize="9.5"
                    fontWeight={idx === 6 ? 700 : 400}
                  >
                    {m}
                  </text>
                ))}
              </svg>
              <div className="forecast-legend">
                <span className="forecast-legend__item">
                  <span className="forecast-legend__line forecast-legend__line--base" />
                  Baseline (no action)
                </span>
                <span className="forecast-legend__item">
                  <span className="forecast-legend__line forecast-legend__line--opt" />
                  With Gradient autopilot
                </span>
              </div>
            </div>
            <SpendTrendChart />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: 18 }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
                Variables
              </h4>
              <div className="slider-group">
                <div className="slider-group__head">
                  <span>Annual growth</span>
                  <span style={{ color: 'var(--accent-bright)', fontWeight: 700 }}>{growthRate}%</span>
                </div>
                <input type="range" min={0} max={50} value={growthRate} onChange={(e) => setGrowthRate(+e.target.value)} />
              </div>
              <div className="slider-group">
                <div className="slider-group__head">
                  <span>Autopilot strictness</span>
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>{optimizeLevel}%</span>
                </div>
                <input type="range" className="accent-success" min={10} max={100} value={optimizeLevel} onChange={(e) => setOptimizeLevel(+e.target.value)} />
              </div>
              <div className="slider-group" style={{ marginBottom: 0 }}>
                <div className="slider-group__head">
                  <span>Spot migration</span>
                  <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{spotPercent}%</span>
                </div>
                <input type="range" className="accent-cyan" min={0} max={100} value={spotPercent} onChange={(e) => setSpotPercent(+e.target.value)} />
              </div>
            </div>
            <div className="insight-box">
              <Info size={15} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p>
                At current settings, immediate runrate reduction is roughly{' '}
                <strong>${chart.insightSaving.toFixed(0)}/mo</strong> from autopilot actions and spot shifts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
