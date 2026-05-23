import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import Sidebar from './components/Sidebar';
import MetricsOverview from './components/MetricsOverview';
import AgentTerminal from './components/AgentTerminal';
import ResourceMap from './components/ResourceMap';
import RecommendationsList from './components/RecommendationsList';
import CostForecaster from './components/CostForecaster';
import AgentChat from './components/AgentChat';
import SettingsPanel from './components/SettingsPanel';
import SpendTrendChart from './components/SpendTrendChart';
import { INITIAL_RESOURCES, INITIAL_RECOMMENDATIONS, MOCK_TELEMETRY_LOGS } from './data/mockCloudData';

const SCAN_LOGS = [
  'SCANNING aws (us-east-1): Polling EC2 telemetry…',
  'INFO aws: Compute utilization stable.',
  'SCANNING gcp (us-central1): Fetching usage audits…',
  'INFO gcp: Database scaling within bounds.',
  'SCANNING azure (eastus): Blob storage metrics…',
  'AI Analysis: Correlating spikes against baseline…',
  'AI Analysis: All nodes verified. Awaiting input.',
];

function timestamp() {
  return new Date().toLocaleTimeString();
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [recommendations, setRecommendations] = useState(INITIAL_RECOMMENDATIONS);
  const [logs, setLogs] = useState(MOCK_TELEMETRY_LOGS);
  const [isScanning, setIsScanning] = useState(true);
  const [autopilot, setAutopilot] = useState(false);
  const [scanFrequency, setScanFrequency] = useState('5m');

  const [awsKey, setAwsKey] = useState('AKIAIOSFODNN7EXAMPLE');
  const [gcpProject, setGcpProject] = useState('gradient-prod-analytics');
  const [azureSub, setAzureSub] = useState('sub-4bc0-9c22-prod');
  const [connectionStatus, setConnectionStatus] = useState('connected');

  const appendLog = useCallback((line) => {
    setLogs((prev) => [...prev, `[${timestamp()}] ${line}`]);
  }, []);

  useEffect(() => {
    if (!isScanning) return;
    const id = setInterval(() => {
      const line = SCAN_LOGS[Math.floor(Math.random() * SCAN_LOGS.length)];
      appendLog(line);
    }, 12000);
    return () => clearInterval(id);
  }, [isScanning, appendLog]);

  const executeRemediation = useCallback((rec, isAutopilot = false) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, status: 'executing' } : r)),
    );

    const prefix = isAutopilot ? 'AUTOPILOT' : 'USER APPROVED';
    appendLog(`${prefix} - Starting: ${rec.title}`);
    appendLog(`RUNNING: ${rec.cliCommand}`);

    setTimeout(() => appendLog(`TELEMETRY - Applying ${rec.resourceId}…`), 1000);

    setTimeout(() => {
      setRecommendations((prev) =>
        prev.map((r) => (r.id === rec.id ? { ...r, status: 'completed' } : r)),
      );

      setResources((prev) =>
        prev.map((res) => {
          if (res.id !== rec.resourceId) return res;
          if (rec.actionType === 'terminate' || rec.actionType === 'delete') {
            return { ...res, status: 'terminated', costPerMonth: 0, wasteLevel: 'none', savingAmount: 0 };
          }
          if (rec.actionType === 'stop') {
            return { ...res, status: 'stopped', costPerMonth: 0, wasteLevel: 'none', savingAmount: 0 };
          }
          if (rec.actionType === 'resize') {
            const newCost = Math.max(res.costPerMonth - rec.potentialSavings, res.costPerMonth * 0.1);
            return { ...res, type: rec.newType || res.type, costPerMonth: newCost, wasteLevel: 'none', savingAmount: 0 };
          }
          if (rec.actionType === 'archive') {
            return { ...res, costPerMonth: res.costPerMonth - rec.potentialSavings, wasteLevel: 'none', savingAmount: 0 };
          }
          return res;
        }),
      );

      appendLog(`SUCCESS - Saved $${rec.potentialSavings.toFixed(2)}/mo`);
    }, 2500);
  }, [appendLog]);

  useEffect(() => {
    if (!autopilot) return;
    const id = setInterval(() => {
      const next = recommendations.find((r) => r.status === 'pending');
      if (next) executeRemediation(next, true);
    }, 20000);
    return () => clearInterval(id);
  }, [autopilot, recommendations, executeRemediation]);

  const handleIgnore = (id) => {
    setRecommendations((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'ignored' } : r)));
    appendLog(`INFO - Recommendation ${id} ignored.`);
  };

  const handleConnect = (e) => {
    e.preventDefault();
    setConnectionStatus('connecting');
    appendLog('CONNECTION - Handshake started…');
    setTimeout(() => {
      setConnectionStatus('connected');
      appendLog('SUCCESS - All providers synchronized.');
    }, 2000);
  };

  const handleScanFreq = (freq) => {
    setScanFrequency(freq);
    appendLog(`CONFIG - Scan interval set to ${freq}`);
  };

  const pendingCount = recommendations.filter((r) => r.status === 'pending').length;

  const HEALTH_STATS = [
    { label: 'Compute (VMs)', value: 82, color: 'var(--accent)' },
    { label: 'Databases', value: 92, color: 'var(--cyan)' },
    { label: 'Storage', value: 68, color: 'var(--success)' },
  ];

  const WASTE_STATS = [
    { label: 'Zombie resources', amount: 1058, pct: 47, color: 'var(--danger)' },
    { label: 'Oversized instances', amount: 687, pct: 31, color: 'var(--accent)' },
    { label: 'Idle workloads', amount: 417, pct: 19, color: 'var(--warning)' },
    { label: 'Orphaned storage', amount: 66, pct: 3, color: 'var(--cyan)' },
  ];

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        autopilot={autopilot}
        isScanning={isScanning}
        totalWaste={pendingCount}
      />

      <div className="main">
        <header className="main-header">
          <div>
            <div className="main-header__eyebrow">FinOps command center</div>
            <h1 className="main-header__title">Gradient AI Optimizer</h1>
          </div>
          <div className="main-header__actions">
            <ThemeToggle />
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setIsScanning(true);
                appendLog('SCAN - Manual telemetry sync triggered.');
              }}
            >
              <RefreshCw size={15} className={isScanning ? 'spin' : ''} />
              Sync
            </button>
            <button
              type="button"
              className={`btn ${autopilot ? 'btn--success' : 'btn--primary'}`}
              onClick={() => {
                setAutopilot((a) => !a);
                appendLog(`CONFIG - Autopilot ${!autopilot ? 'ENABLED' : 'DISABLED'}`);
              }}
            >
              <Sparkles size={15} />
              {autopilot ? 'Autopilot on' : 'Engage autopilot'}
            </button>
          </div>
        </header>

        <div className="main-body">
          <MetricsOverview resources={resources} recommendations={recommendations} />

          {activeTab === 'overview' && (
            <>
              <SpendTrendChart />
              <div className="dashboard">
                <div>
                  <RecommendationsList
                    compact
                    recommendations={recommendations.slice(0, 3)}
                    onExecuteRecommendation={executeRemediation}
                    onIgnoreRecommendation={handleIgnore}
                  />
                </div>
                <div className="dashboard__side">
                  <AgentTerminal
                    logs={logs}
                    isScanning={isScanning}
                    onToggleScan={() => setIsScanning((s) => !s)}
                    onClearLogs={() => setLogs([])}
                  />
                  <div className="card" style={{ padding: 18 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 14 }}>
                      Health ratio
                    </h4>
                    <div className="widget-list">
                      {HEALTH_STATS.map((s) => (
                        <div key={s.label}>
                          <div className="widget-row__head">
                            <span className="widget-row__label">{s.label}</span>
                            <span className="widget-row__value">{s.value}%</span>
                          </div>
                          <div className="widget-row__track">
                            <div className="widget-row__fill" style={{ width: `${s.value}%`, background: s.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card" style={{ padding: 18 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 14 }}>
                      Waste breakdown
                    </h4>
                    <div className="widget-list">
                      {WASTE_STATS.map((s) => (
                        <div key={s.label}>
                          <div className="widget-row__head">
                            <span className="widget-row__label">{s.label}</span>
                            <span className="widget-row__value" style={{ color: s.color }}>${s.amount}/mo</span>
                          </div>
                          <div className="widget-row__track">
                            <div className="widget-row__fill" style={{ width: `${s.pct}%`, background: s.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'map' && (
            <ResourceMap
              resources={resources}
              recommendations={recommendations}
              onExecuteRecommendation={executeRemediation}
            />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationsList
              recommendations={recommendations}
              onExecuteRecommendation={executeRemediation}
              onIgnoreRecommendation={handleIgnore}
            />
          )}

          {activeTab === 'forecaster' && (
            <CostForecaster resources={resources} recommendations={recommendations} />
          )}

          {activeTab === 'chat' && (
            <AgentChat
              recommendations={recommendations}
              onExecuteRecommendation={executeRemediation}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel
              awsKey={awsKey}
              setAwsKey={setAwsKey}
              gcpProject={gcpProject}
              setGcpProject={setGcpProject}
              azureSub={azureSub}
              setAzureSub={setAzureSub}
              connectionStatus={connectionStatus}
              onConnect={handleConnect}
              scanFrequency={scanFrequency}
              setScanFrequency={handleScanFreq}
              autopilot={autopilot}
            />
          )}
        </div>
      </div>
    </div>
  );
}
