import React from 'react';
import { Sparkles, Terminal, Trash2, ArrowUpDown, PowerOff, ShieldCheck, HelpCircle } from 'lucide-react';

export default function RecommendationsList({ recommendations, onExecuteRecommendation, onIgnoreRecommendation }) {
  const pendingRecs = recommendations.filter(rec => rec.status === 'pending');
  const resolvedRecs = recommendations.filter(rec => rec.status === 'completed');
  
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'var(--color-error)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--accent-cyan)';
      default: return 'var(--text-secondary)';
    }
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'resize': return <ArrowUpDown size={14} />;
      case 'terminate': return <Trash2 size={14} />;
      case 'delete': return <Trash2 size={14} />;
      case 'stop': return <PowerOff size={14} />;
      case 'archive': return <ShieldCheck size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  const renderRecommendationCard = (rec) => {
    const isExecuting = rec.status === 'executing';
    
    return (
      <div 
        key={rec.id} 
        className="glass-panel" 
        style={{
          padding: '20px',
          borderLeft: `4px solid ${getImpactColor(rec.impact)}`,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Recommendation Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '10px',
                fontWeight: '800',
                textTransform: 'uppercase',
                backgroundColor: rec.provider === 'aws' ? 'rgba(255,153,0,0.15)' : rec.provider === 'gcp' ? 'rgba(66,133,244,0.15)' : 'rgba(0,137,214,0.15)',
                color: rec.provider === 'aws' ? '#FF9900' : rec.provider === 'gcp' ? '#4285F4' : '#0089D6',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {rec.provider.toUpperCase()}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rec.service}</span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{rec.title}</h4>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-success)' }}>
              +${rec.potentialSavings.toFixed(2)}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>/month saved</span>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          {rec.description}
        </p>

        {/* CLI Command codebox */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={12} style={{ opacity: 0.6 }} />
            <span>{rec.cliCommand}</span>
          </div>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginLeft: '12px' }}>
            AGENT SHELL
          </span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: getImpactColor(rec.impact)
            }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
              {rec.impact} Priority Waste
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onIgnoreRecommendation(rec.id)}
              disabled={isExecuting}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: '600',
                padding: '6px 12px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Ignore
            </button>
            
            <button
              onClick={() => onExecuteRecommendation(rec)}
              disabled={isExecuting}
              style={{
                background: 'linear-gradient(135deg, var(--accent-purple) 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)',
                transition: 'all 0.2s',
                opacity: isExecuting ? 0.7 : 1
              }}
            >
              {isExecuting ? (
                <>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'pulse-glow 1s infinite'
                  }} />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  {getActionIcon(rec.actionType)}
                  <span>Approve & Execute</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
      
      {/* Pending recommendations */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Active Optimization Actions</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>AI Agent suggested actions to remediate infrastructure waste</p>
          </div>
          <span style={{
            background: pendingRecs.length > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: pendingRecs.length > 0 ? 'var(--color-error)' : 'var(--color-success)',
            border: '1px solid',
            borderColor: pendingRecs.length > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700'
          }}>
            {pendingRecs.length} Pending
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pendingRecs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '700' }}>Your Cloud is Fully Optimized!</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '360px' }}>
                Awesome! The Gradient AI agent detects zero wasteful expenditures or overprovisioned resources.
              </p>
            </div>
          ) : (
            pendingRecs.map(renderRecommendationCard)
          )}
        </div>
      </div>

      {/* Resolved optimizations */}
      {resolvedRecs.length > 0 && (
        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.01)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-success)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} />
            <span>Remediated & Resolved ({resolvedRecs.length})</span>
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {resolvedRecs.map(rec => (
              <div key={rec.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                backgroundColor: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.03)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--color-success)',
                    padding: '1px 5px',
                    borderRadius: '3px'
                  }}>
                    RESOLVED
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{rec.title}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-success)' }}>
                  Saved ${rec.potentialSavings.toFixed(2)}/mo
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
