import { AlertTriangle, DollarSign, Shield, Sparkles, TrendingDown } from 'lucide-react';

export default function MetricsOverview({ resources, recommendations }) {
  const totalSpend = resources.reduce((acc, r) => acc + r.costPerMonth, 0);
  const pending = recommendations.filter((r) => r.status === 'pending');
  const completed = recommendations.filter((r) => r.status === 'completed');
  const potentialSavings = pending.reduce((acc, r) => acc + r.potentialSavings, 0);
  const realizedSavings = completed.reduce((acc, r) => acc + r.potentialSavings, 0);
  const wasteRatio = totalSpend > 0
    ? ((potentialSavings / (totalSpend + potentialSavings)) * 100).toFixed(1)
    : 0;
  const total = recommendations.length;
  const done = completed.length;
  const progress = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="metrics">
      <div className="card metric metric--spend">
        <div className="metric__top">
          <span className="metric__label">Monthly runrate</span>
          <div className="metric__icon metric__icon--cyan">
            <DollarSign size={16} />
          </div>
        </div>
        <div className="metric__value">
          ${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="metric__footer">
          <TrendingDown size={13} color="var(--success)" />
          <span style={{ color: 'var(--success)', fontWeight: 600 }}>-${realizedSavings.toFixed(2)}/mo</span>
          realized this session
        </div>
      </div>

      <div className="card metric metric--waste">
        <div className="metric__top">
          <span className="metric__label">Detected waste</span>
          <div className="metric__icon metric__icon--danger">
            <AlertTriangle size={16} />
          </div>
        </div>
        <div className={`metric__value${potentialSavings > 0 ? ' metric__value--danger' : ''}`}>
          ${potentialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="metric__footer">
          <span className={`metric__pill${potentialSavings > 0 ? ' metric__pill--danger' : ' metric__pill--success'}`}>
            {wasteRatio}% of spend
          </span>
          across all providers
        </div>
      </div>

      <div className="card metric metric--savings">
        <div className="metric__top">
          <span className="metric__label">Available savings</span>
          <div className="metric__icon metric__icon--success">
            <Sparkles size={16} />
          </div>
        </div>
        <div className="metric__value metric__value--success">
          ${potentialSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="metric__footer">
          ${(potentialSavings * 12).toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr if remediated
        </div>
      </div>

      <div className="card metric metric--progress">
        <div className="metric__top">
          <span className="metric__label">Remediation progress</span>
          <div className="metric__icon metric__icon--accent">
            <Shield size={16} />
          </div>
        </div>
        <div className="metric__value">{done} / {total}</div>
        <div className="metric__bar">
          <div className="metric__bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
