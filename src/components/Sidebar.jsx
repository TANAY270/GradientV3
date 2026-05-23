import { Activity, CloudLightning, Layers, MessageSquare, Server, Settings, TrendingUp } from 'lucide-react';

const NAV = [
  { id: 'overview', label: 'Dashboard', icon: Activity },
  { id: 'map', label: 'Resource Map', icon: Layers },
  { id: 'recommendations', label: 'Optimizations', icon: CloudLightning, badge: true },
  { id: 'forecaster', label: 'Cost Forecaster', icon: TrendingUp },
  { id: 'chat', label: 'Agent Console', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const PROVIDERS = [
  { name: 'AWS · us-east-1', color: '#ff9900' },
  { name: 'GCP · europe-west3', color: '#4285f4' },
  { name: 'Azure · eastus', color: '#0078d4' },
];

export default function Sidebar({ activeTab, setActiveTab, autopilot, isScanning, totalWaste }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <Server size={18} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="sidebar__name">Gradient</div>
          <div className="sidebar__tagline">Cloud Agent</div>
        </div>
      </div>

      <div className="sidebar__status">
        <div className="sidebar__status-row">
          <span style={{ color: 'var(--text-secondary)' }}>Telemetry</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600 }}>
            <span className={`status-dot ${isScanning ? 'status-dot--scan' : 'status-dot--ok'}`} />
            {isScanning ? 'Scanning' : 'Idle'}
          </span>
        </div>
        <div className="sidebar__status-row">
          <span style={{ color: 'var(--text-secondary)' }}>Autopilot</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: autopilot ? 'var(--cyan)' : 'var(--text-muted)' }}>
            {autopilot ? 'Engaged' : 'Off'}
          </span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV.map(({ id, label, icon: Icon, badge }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              className={`sidebar__nav-btn${active ? ' sidebar__nav-btn--active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <span className="sidebar__nav-left">
                <Icon size={17} className="sidebar__nav-icon" />
                {label}
              </span>
              {badge && totalWaste > 0 && (
                <span className="sidebar__badge">{totalWaste}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar__providers">
        <div className="sidebar__providers-title">Connected</div>
        {PROVIDERS.map((p) => (
          <div key={p.name} className="sidebar__provider">
            <span className="sidebar__provider-left">
              <span className="sidebar__provider-dot" style={{ background: p.color }} />
              {p.name}
            </span>
            <span className="sidebar__live">LIVE</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
