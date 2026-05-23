import { ArrowUpDown, PowerOff, ShieldCheck, Sparkles, Terminal, Trash2 } from 'lucide-react';

const IMPACT_CLASS = { high: 'rec-card--high', medium: 'rec-card--medium', low: 'rec-card--low' };
const IMPACT_COLOR = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--cyan)' };

function ActionIcon({ type }) {
  const props = { size: 14 };
  switch (type) {
    case 'resize': return <ArrowUpDown {...props} />;
    case 'terminate':
    case 'delete': return <Trash2 {...props} />;
    case 'stop': return <PowerOff {...props} />;
    case 'archive': return <ShieldCheck {...props} />;
    default: return <Sparkles {...props} />;
  }
}

export default function RecommendationsList({
  recommendations,
  onExecuteRecommendation,
  onIgnoreRecommendation,
  compact = false,
}) {
  const pending = recommendations.filter((r) => r.status === 'pending');
  const resolved = recommendations.filter((r) => r.status === 'completed');

  const renderCard = (rec) => {
    const executing = rec.status === 'executing';
    return (
      <div key={rec.id} className={`card rec-card ${IMPACT_CLASS[rec.impact] || ''}`}>
        <div className="rec-card__top">
          <div>
            <div className="rec-card__meta">
              <span className={`provider-tag provider-tag--${rec.provider}`}>{rec.provider.toUpperCase()}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rec.service}</span>
            </div>
            <h4 className="rec-card__title">{rec.title}</h4>
          </div>
          <div className="rec-card__savings">
            <div className="rec-card__savings-val">+${rec.potentialSavings.toFixed(2)}</div>
            <div className="rec-card__savings-label">/month</div>
          </div>
        </div>
        <p className="rec-card__desc">{rec.description}</p>
        <div className="rec-card__cmd">
          <span className="rec-card__cmd-left">
            <Terminal size={12} style={{ opacity: 0.5, flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{rec.cliCommand}</span>
          </span>
          <span className="rec-card__cmd-label">CLI</span>
        </div>
        <div className="rec-card__actions">
          <div className="rec-card__impact">
            <span className="rec-card__impact-dot" style={{ background: IMPACT_COLOR[rec.impact] }} />
            {rec.impact} priority
          </div>
          <div className="rec-card__btns">
            <button type="button" className="btn btn--ghost btn--sm" disabled={executing} onClick={() => onIgnoreRecommendation(rec.id)}>
              Ignore
            </button>
            <button type="button" className="btn btn--primary btn--sm" disabled={executing} onClick={() => onExecuteRecommendation(rec)}>
              {executing ? 'Running…' : (
                <>
                  <ActionIcon type={rec.actionType} />
                  Execute
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (compact) {
    return (
      <div className="rec-list">
        {pending.length === 0 ? (
          <div className="card rec-empty">
            <div className="rec-empty__icon"><ShieldCheck size={24} /></div>
            <h4 style={{ fontWeight: 700, marginBottom: 6 }}>All clear</h4>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No pending optimizations.</p>
          </div>
        ) : (
          pending.map(renderCard)
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card__header">
          <div>
            <h3 className="card__title">Optimization queue</h3>
            <p className="card__subtitle">AI-suggested remediations awaiting approval</p>
          </div>
          <span className="badge badge--pending">{pending.length} pending</span>
        </div>
        <div className="card__body">
          <div className="rec-list">
            {pending.length === 0 ? (
              <div className="rec-empty">
                <div className="rec-empty__icon"><ShieldCheck size={24} /></div>
                <h4 style={{ fontWeight: 700, marginBottom: 6 }}>Infrastructure optimized</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto' }}>
                  No wasteful resources detected. Gradient will alert you when new waste appears.
                </p>
              </div>
            ) : (
              pending.map(renderCard)
            )}
          </div>
        </div>
      </div>

      {resolved.length > 0 && (
        <div className="card rec-resolved" style={{ marginTop: 16, borderColor: 'var(--success-border)' }}>
          <div className="card__body">
            <h4 className="rec-resolved__title">
              <ShieldCheck size={16} />
              Resolved ({resolved.length})
            </h4>
            {resolved.map((rec) => (
              <div key={rec.id} className="rec-resolved__item">
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="badge badge--resolved">DONE</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{rec.title}</span>
                </span>
                <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: 12 }}>
                  ${rec.potentialSavings.toFixed(2)}/mo
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
