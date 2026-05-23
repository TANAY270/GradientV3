import { useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Database, HardDrive, Server } from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All providers' },
  { id: 'aws', label: 'AWS' },
  { id: 'gcp', label: 'GCP' },
  { id: 'azure', label: 'Azure' },
];

const ZONES = {
  aws: { label: 'AWS · us-east-1', cls: 'zone--aws' },
  gcp: { label: 'GCP · europe-west3', cls: 'zone--gcp' },
  azure: { label: 'Azure · eastus', cls: 'zone--azure' },
};

function ServiceIcon({ service }) {
  const s = service.toLowerCase();
  if (s === 'database') return <Database size={14} />;
  if (s === 'storage') return <HardDrive size={14} />;
  return <Server size={14} />;
}

export default function ResourceMap({ resources, recommendations, onExecuteRecommendation }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [provider, setProvider] = useState('all');

  const filtered = resources.filter((r) => provider === 'all' || r.provider === provider);

  const getAlert = (id) =>
    recommendations.find((rec) => rec.resourceId === id && rec.status === 'pending');

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <h3 className="card__title">Infrastructure map</h3>
          <p className="card__subtitle">Resources grouped by cloud region with live diagnostics</p>
        </div>
        <div className="map-filters">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-chip${provider === f.id ? ' filter-chip--active' : ''}`}
              onClick={() => setProvider(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card__body">
        <div className="map-grid">
          {['aws', 'gcp', 'azure'].map((key) => {
            if (provider !== 'all' && provider !== key) return null;
            const nodes = filtered.filter((r) => r.provider === key);
            if (!nodes.length) return null;
            const zone = ZONES[key];

            return (
              <div key={key} className={`card zone ${zone.cls}`}>
                <div className="zone__head">
                  <span className="zone__name">{zone.label}</span>
                  <span className="zone__count">{nodes.length} nodes</span>
                </div>

                {nodes.map((res) => {
                  const alert = getAlert(res.id);
                  const hover = hoveredId === res.id;

                  return (
                    <div
                      key={res.id}
                      className={`resource-node${alert ? ' resource-node--alert' : ''}`}
                      onMouseEnter={() => setHoveredId(res.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div className="resource-node__left">
                        <div className="resource-node__icon">
                          <ServiceIcon service={res.service} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div className="resource-node__name">{res.name}</div>
                          <div className="resource-node__id">{res.id}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="resource-node__cost">
                          ${res.costPerMonth.toFixed(2)}
                          <span>/mo</span>
                        </div>
                        <span className={`resource-node__dot${alert ? ' resource-node__dot--alert' : ' resource-node__dot--ok'}`} />
                      </div>

                      {hover && (
                        <div className="resource-popover" onClick={(e) => e.stopPropagation()}>
                          <div className="resource-popover__label">
                            Diagnostic
                            <span className={`status-pill status-pill--${res.status === 'idle' ? 'idle' : 'running'}`}>
                              {res.status}
                            </span>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{res.name}</div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 10 }}>
                            {res.id} · {res.type}
                          </div>

                          {(res.service === 'Compute' || res.service === 'Database') && (
                            <>
                              <div className="util-bar">
                                <div className="util-bar__head">
                                  <span>CPU</span>
                                  <span>{res.utilization.cpu}%</span>
                                </div>
                                <div className="util-bar__track">
                                  <div
                                    className="util-bar__fill"
                                    style={{
                                      width: `${res.utilization.cpu}%`,
                                      background: res.utilization.cpu < 5 ? 'var(--danger)' : 'var(--accent)',
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="util-bar">
                                <div className="util-bar__head">
                                  <span>Memory</span>
                                  <span>{res.utilization.memory}%</span>
                                </div>
                                <div className="util-bar__track">
                                  <div
                                    className="util-bar__fill"
                                    style={{
                                      width: `${res.utilization.memory}%`,
                                      background: res.utilization.memory < 15 ? 'var(--warning)' : 'var(--cyan)',
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>
                            Network: <span style={{ fontFamily: 'var(--mono)', color: 'var(--text)' }}>{res.utilization.network}</span>
                          </div>

                          {alert ? (
                            <div className="alert-box">
                              <div className="alert-box__title">
                                <AlertTriangle size={12} />
                                Waste detected
                              </div>
                              <p style={{ color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.4 }}>
                                {alert.description}
                              </p>
                              <button
                                type="button"
                                className="btn btn--danger btn--sm"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onExecuteRecommendation(alert);
                                }}
                              >
                                Execute cleanup
                                <ArrowRight size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="ok-box">
                              <CheckCircle2 size={12} />
                              Optimally configured
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
