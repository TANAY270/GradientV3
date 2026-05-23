import ThemeToggle from './ThemeToggle';

export default function SettingsPanel({
  awsKey,
  setAwsKey,
  gcpProject,
  setGcpProject,
  azureSub,
  setAzureSub,
  connectionStatus,
  onConnect,
  scanFrequency,
  setScanFrequency,
  autopilot,
}) {
  const freqs = [
    { id: '1m', label: '1 min' },
    { id: '5m', label: '5 min' },
    { id: '1h', label: 'Hourly' },
    { id: '24h', label: 'Daily' },
  ];

  const scopes = [
    { label: 'Safe storage cleanups', on: true },
    { label: 'Staging compute downscale', on: autopilot },
    { label: 'Production resize (MFA required)', on: false },
  ];

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <h3 className="card__title">Configuration</h3>
          <p className="card__subtitle">Credentials, scan policy, and autopilot scope</p>
        </div>
      </div>
      <div className="card__body">
        <div className="settings-appearance">
          <label className="form-label">Appearance</label>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Choose light or dark interface. Your preference is saved locally.
          </p>
          <ThemeToggle />
        </div>
        <div className="settings-grid">
          <form className="card" style={{ padding: 20 }} onSubmit={onConnect}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Cloud credentials</h4>
            <div className="form-group">
              <label className="form-label">AWS access key</label>
              <input className="input input--mono" value={awsKey} onChange={(e) => setAwsKey(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">GCP project ID</label>
              <input className="input input--mono" value={gcpProject} onChange={(e) => setGcpProject(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Azure subscription</label>
              <input className="input input--mono" value={azureSub} onChange={(e) => setAzureSub(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={connectionStatus === 'connecting'}>
              {connectionStatus === 'connecting' ? 'Syncing…' : connectionStatus === 'connected' ? 'Update bindings' : 'Connect accounts'}
            </button>
          </form>

          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Scan policy</h4>
            <div className="form-group">
              <label className="form-label">Scan frequency</label>
              <div className="freq-grid">
                {freqs.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`freq-btn${scanFrequency === f.id ? ' freq-btn--active' : ''}`}
                    onClick={() => setScanFrequency(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Autopilot scope</label>
              {scopes.map((s) => (
                <div key={s.label} className="scope-row">
                  <span>{s.label}</span>
                  <span className={`scope-status${s.on ? ' scope-status--on' : ' scope-status--off'}`}>
                    {s.on ? 'ACTIVE' : 'OFF'}
                  </span>
                </div>
              ))}
            </div>
            <div className="info-callout" style={{ marginTop: 16 }}>
              When autopilot is engaged, high-confidence remediations run automatically. All actions stream to the agent shell.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
