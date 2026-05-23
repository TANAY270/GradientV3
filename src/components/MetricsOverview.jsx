import React from 'react';
import { DollarSign, AlertTriangle, ShieldAlert, Sparkles, TrendingDown } from 'lucide-react';

export default function MetricsOverview({ resources, recommendations }) {
  // Compute metrics from current resources state
  const totalSpend = resources.reduce((acc, r) => acc + r.costPerMonth, 0);
  
  // Calculate total waste from pending recommendations
  const pendingRecs = recommendations.filter(r => r.status === 'pending');
  const potentialSavings = pendingRecs.reduce((acc, r) => acc + r.potentialSavings, 0);
  
  const completedRecs = recommendations.filter(r => r.status === 'completed');
  const realizedSavings = completedRecs.reduce((acc, r) => acc + r.potentialSavings, 0);

  const wasteRatio = totalSpend > 0 ? ((potentialSavings / (totalSpend + potentialSavings)) * 100).toFixed(1) : 0;
  
  const totalOptimizationsCount = recommendations.length;
  const completedOptimizationsCount = completedRecs.length;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      width: '100%'
    }}>
      {/* Total Cloud Spend */}
      <div className="glass-panel" style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid var(--accent-cyan)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Monthly Cloud Runrate</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(6, 182, 212, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <DollarSign size={18} />
          </div>
        </div>
        <h3 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          ${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <TrendingDown size={14} color="var(--color-success)" />
          <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>-${realizedSavings.toFixed(2)}/mo</span>
          <span style={{ color: 'var(--text-muted)' }}>saved this scan</span>
        </div>
      </div>

      {/* AI-Detected Waste */}
      <div className="glass-panel" style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid var(--color-error)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>AI-Detected Waste</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-error)'
          }}>
            <AlertTriangle size={18} />
          </div>
        </div>
        <h3 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px', color: potentialSavings > 0 ? 'var(--color-error)' : 'var(--text-primary)' }}>
          ${potentialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ 
            color: potentialSavings > 0 ? 'var(--color-error)' : 'var(--color-success)', 
            fontWeight: '600',
            background: potentialSavings > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            padding: '1px 6px',
            borderRadius: '4px'
          }}>
            {wasteRatio}% waste ratio
          </span>
          <span style={{ color: 'var(--text-muted)' }}>across cloud environments</span>
        </div>
      </div>

      {/* Potential Savings */}
      <div className="glass-panel" style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid var(--color-success)',
        boxShadow: potentialSavings > 0 ? '0 0 15px rgba(16, 185, 129, 0.08)' : 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Remediation Savings</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-success)'
          }}>
            <Sparkles size={18} />
          </div>
        </div>
        <h3 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px', color: 'var(--color-success)' }}>
          ${potentialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            Applying recommendations will save 
          </span>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
            ${(potentialSavings * 12).toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr
          </span>
        </div>
      </div>

      {/* Optimization Progress */}
      <div className="glass-panel" style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid var(--accent-purple)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Agent Progress</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-purple)'
          }}>
            <ShieldAlert size={18} />
          </div>
        </div>
        <h3 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          {completedOptimizationsCount} / {totalOptimizationsCount}
        </h3>
        
        {/* Progress bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${totalOptimizationsCount > 0 ? (completedOptimizationsCount / totalOptimizationsCount * 100) : 0}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
            transition: 'width 0.5s ease-out'
          }} />
        </div>
      </div>
    </div>
  );
}
