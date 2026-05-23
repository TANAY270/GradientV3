import React, { useState } from 'react';
import { TrendingUp, Sparkles, AlertCircle, Info } from 'lucide-react';
import SpendTrendChart from './SpendTrendChart';

export default function CostForecaster({ resources, recommendations }) {
  const [growthRate, setGrowthRate] = useState(15); // in %
  const [optimizeLevel, setOptimizeLevel] = useState(80); // in %
  const [spotPercent, setSpotPercent] = useState(40); // in %

  // Calculate current baseline monthly cost
  const currentCost = resources.reduce((acc, r) => acc + r.costPerMonth, 0);
  
  // Calculate potential savings
  const totalSavingsPossible = recommendations.reduce((acc, r) => acc + r.potentialSavings, 0);

  // Generate coordinates for SVG path
  // Graph will represent 9 months (6 past, 3 future)
  // X range: 0 to 600, Y range: 0 to 250 (where 0 is top, 250 is bottom)
  
  const generateChartPaths = () => {
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May (Now)', 'Jun', 'Jul', 'Aug'];
    
    // Past costs (months 0 to 6) - mock slight growth towards currentCost
    const baseHistorical = [
      currentCost * 0.88,
      currentCost * 0.90,
      currentCost * 0.93,
      currentCost * 0.95,
      currentCost * 0.97,
      currentCost * 0.99,
      currentCost // Month 6 (Now)
    ];

    // Future baseline (months 7 to 9) - increases with growth rate
    const growthFactor = 1 + (growthRate / 100) / 4; // divided by 4 for quarter-based growth
    const futureBaseline = [
      baseHistorical[6] * growthFactor,
      baseHistorical[6] * Math.pow(growthFactor, 2),
      baseHistorical[6] * Math.pow(growthFactor, 3)
    ];

    const baselineData = [...baseHistorical, ...futureBaseline];

    // Future optimized (months 7 to 9) - drops based on savings realized + optimizeLevel & spotPercent
    // Savings applied at month 7
    const immediateSaving = totalSavingsPossible * (optimizeLevel / 100);
    const spotReduction = currentCost * 0.15 * (spotPercent / 100); // Up to 15% extra compute saving
    
    const optimizedStart = Math.max(currentCost - immediateSaving - spotReduction, currentCost * 0.4);
    
    const futureOptimized = [
      optimizedStart * (1 + (growthRate / 100) * 0.3 / 4), // optimized grows much slower
      optimizedStart * Math.pow(1 + (growthRate / 100) * 0.3 / 4, 2),
      optimizedStart * Math.pow(1 + (growthRate / 100) * 0.3 / 4, 3)
    ];

    const optimizedData = [...baseHistorical.slice(0, 6), currentCost, ...futureOptimized];

    // Max value for scaling
    const maxVal = Math.max(...baselineData) * 1.15;
    
    // Map data to SVG viewBox coordinates (width=700, height=280)
    // Left padding = 60, Right padding = 30, Top padding = 30, Bottom padding = 40
    const mapCoordinates = (dataList) => {
      return dataList.map((val, idx) => {
        const x = 60 + (idx * (610 / (dataList.length - 1)));
        const y = 240 - ((val / maxVal) * 190);
        return { x, y, val };
      });
    };

    const baselineCoords = mapCoordinates(baselineData);
    const optimizedCoords = mapCoordinates(optimizedData);

    // Build SVG path commands
    const buildPathD = (coords) => {
      return coords.reduce((acc, p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        // Curve fitting
        const prev = coords[i - 1];
        const cpX1 = prev.x + (p.x - prev.x) / 2;
        const cpY1 = prev.y;
        const cpX2 = prev.x + (p.x - prev.x) / 2;
        const cpY2 = p.y;
        return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
      }, '');
    };

    const buildAreaD = (pathD, coords) => {
      const first = coords[0];
      const last = coords[coords.length - 1];
      return `${pathD} L ${last.x} 240 L ${first.x} 240 Z`;
    };

    const baselinePath = buildPathD(baselineCoords);
    const optimizedPath = buildPathD(optimizedCoords);

    return {
      baselinePath,
      baselineArea: buildAreaD(baselinePath, baselineCoords),
      optimizedPath,
      optimizedArea: buildAreaD(optimizedPath, optimizedCoords),
      baselineCoords,
      optimizedCoords,
      months,
      maxVal
    };
  };

  const {
    baselinePath,
    baselineArea,
    optimizedPath,
    optimizedArea,
    baselineCoords,
    optimizedCoords,
    months,
    maxVal
  } = generateChartPaths();

  const activeCostNow = currentCost;
  const projectedThreeMonthsBase = baselineCoords[9].val;
  const projectedThreeMonthsOpt = optimizedCoords[9].val;
  const realizedSavingsPredict = projectedThreeMonthsBase - projectedThreeMonthsOpt;

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Forecaster Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>AI Cost Forecasting & Simulator</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Model future spend based on telemetry variables and agent autopilot actions</p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '6px 12px',
          borderRadius: '8px',
          color: 'var(--color-success)',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          <Sparkles size={14} />
          <span>Projected 3-Mo Savings: ${realizedSavingsPredict.toFixed(2)}/mo</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        {/* Left Column Stacked Graphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* SVG Line Graph panel */}
          <div className="glass-panel" style={{ 
            padding: '16px', 
            background: 'rgba(5, 7, 15, 0.6)', 
            overflowX: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
          
          {/* Main Chart Canvas */}
          <svg viewBox="0 0 700 280" style={{ width: '100%', height: 'auto', minWidth: '550px' }}>
            <defs>
              {/* Gradients */}
              <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-error)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--color-error)" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="optimizedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-success)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--color-success)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 1, 2, 3].map((g, i) => {
              const y = 50 + (i * 63);
              const gridLabel = (maxVal - (i * (maxVal / 4))).toFixed(0);
              return (
                <g key={i} style={{ opacity: 0.15 }}>
                  <line x1="60" y1={y} x2="670" y2={y} stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
                  <text x="50" y={y + 4} fill="var(--text-secondary)" fontSize="9" textAnchor="end" fontFamily="var(--font-mono)">
                    ${gridLabel}
                  </text>
                </g>
              );
            })}

            {/* Area under curves */}
            <path d={baselineArea} fill="url(#baselineGrad)" style={{ transition: 'd 0.5s ease' }} />
            <path d={optimizedArea} fill="url(#optimizedGrad)" style={{ transition: 'd 0.5s ease' }} />

            {/* Divider line between past and future */}
            <line x1={60 + (6 * (610 / 9))} y1="30" x2={60 + (6 * (610 / 9))} y2="240" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="5,5" />
            <text x={60 + (6 * (610 / 9)) - 8} y="42" fill="var(--text-muted)" fontSize="9" textAnchor="end" fontWeight="bold">
              PAST TELEMETRY
            </text>
            <text x={60 + (6 * (610 / 9)) + 8} y="42" fill="var(--accent-cyan)" fontSize="9" textAnchor="start" fontWeight="bold">
              AI FORECAST
            </text>

            {/* Curves paths */}
            <path d={baselinePath} fill="none" stroke="var(--color-error)" strokeWidth="2.5" style={{ transition: 'd 0.5s ease', filter: 'drop-shadow(0px 0px 4px rgba(239, 68, 68, 0.4))' }} />
            <path d={optimizedPath} fill="none" stroke="var(--color-success)" strokeWidth="2.5" style={{ transition: 'd 0.5s ease', filter: 'drop-shadow(0px 0px 4px rgba(16, 185, 129, 0.4))' }} />

            {/* Data Nodes */}
            {baselineCoords.map((pt, idx) => {
              const isFuture = idx > 6;
              return (
                <circle 
                  key={`base-node-${idx}`} 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={isFuture ? 3.5 : 2.5} 
                  fill="var(--color-error)" 
                  style={{ transition: 'cy 0.5s ease' }}
                />
              );
            })}
            
            {optimizedCoords.map((pt, idx) => {
              const isFuture = idx > 6;
              if (idx < 6) return null; // duplicate historical nodes
              return (
                <circle 
                  key={`opt-node-${idx}`} 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={isFuture ? 3.5 : 2.5} 
                  fill="var(--color-success)" 
                  style={{ transition: 'cy 0.5s ease' }}
                />
              );
            })}

            {/* X-Axis labels */}
            {months.map((m, idx) => {
              const x = 60 + (idx * (610 / (months.length - 1)));
              return (
                <text key={idx} x={x} y="258" fill={idx === 6 ? 'var(--text-primary)' : 'var(--text-muted)'} fontSize="9.5" textAnchor="middle" fontWeight={idx === 6 ? 'bold' : 'normal'}>
                  {m}
                </text>
              );
            })}
            <line x1="60" y1="240" x2="670" y2="240" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          </svg>
          
          {/* Chart Legends */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <span style={{ width: '10px', height: '2px', backgroundColor: 'var(--color-error)', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Baseline Forecast (No Actions)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <span style={{ width: '10px', height: '2px', backgroundColor: 'var(--color-success)', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Optimized Projection (Gradient AI Autopilot)</span>
            </div>
          </div>
        </div>
          
        {/* Historical Spend Trend */}
        <SpendTrendChart />
      </div>

        {/* Sliders Console Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Simulation Variables
            </h4>
            
            {/* Slider 1: Growth Rate */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Annual Cost Growth</span>
                <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>{growthRate}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={growthRate} 
                onChange={(e) => setGrowthRate(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
              />
            </div>

            {/* Slider 2: Optimization Level */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Autopilot Strictness</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>{optimizeLevel}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={optimizeLevel} 
                onChange={(e) => setOptimizeLevel(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-success)', cursor: 'pointer' }}
              />
            </div>

            {/* Slider 3: Spot Instance Migration */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Spot Migration Rate</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{spotPercent}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={spotPercent} 
                onChange={(e) => setSpotPercent(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Savings Summary Widget */}
          <div className="glass-panel" style={{ 
            padding: '16px', 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.15)'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Info size={16} color="var(--color-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <h5 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Forecasting Insight
                </h5>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Increasing your **Autopilot Strictness** and **Spot Migration Rate** cuts compute runrates immediately by **${((totalSavingsPossible * (optimizeLevel/100)) + (currentCost * 0.15 * (spotPercent/100))).toFixed(0)}/mo**.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
