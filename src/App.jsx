import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Cpu, Database, HardDrive, ShieldCheck, Play, ArrowRight, Check } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MetricsOverview from './components/MetricsOverview';
import AgentTerminal from './components/AgentTerminal';
import ResourceMap from './components/ResourceMap';
import RecommendationsList from './components/RecommendationsList';
import CostForecaster from './components/CostForecaster';
import AgentChat from './components/AgentChat';
import { INITIAL_RESOURCES, INITIAL_RECOMMENDATIONS, MOCK_TELEMETRY_LOGS } from './data/mockCloudData';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [recommendations, setRecommendations] = useState(INITIAL_RECOMMENDATIONS);
  const [logs, setLogs] = useState(MOCK_TELEMETRY_LOGS);
  const [isScanning, setIsScanning] = useState(true);
  const [autopilot, setAutopilot] = useState(false);
  const [scanFrequency, setScanFrequency] = useState('5m');
  
  // Credentials States
  const [awsKey, setAwsKey] = useState('AKIAIOSFODNN7EXAMPLE');
  const [gcpProject, setGcpProject] = useState('gradient-prod-analytics');
  const [azureSub, setAzureSub] = useState('sub-4bc0-9c22-prod');
  const [connectionStatus, setConnectionStatus] = useState('connected'); // connected, connecting, idle

  // Simulating active scanning background telemetry logs
  useEffect(() => {
    if (!isScanning) return;

    const mockScanIntervals = [
      "SCANNING aws (us-east-1): Polling EC2 telemetry metadata...",
      "INFO - aws (us-east-1): Compute instances CPU utilization stable.",
      "SCANNING gcp (us-central1): Fetching BigQuery usage audits...",
      "INFO - gcp (us-central1): Database capacity scaling remains optimized.",
      "SCANNING azure (eastus): Polling Azure Blob storage retrieves...",
      "INFO - azure (eastus): Blob read operations in target baseline bounds.",
      "AI Analysis Engine: Correlating usage spikes against baseline templates...",
      "AI Analysis Engine: All monitored nodes verified. Awaiting instructions."
    ];

    const interval = setInterval(() => {
      // Pick a random log from mockScanIntervals
      const randomLog = mockScanIntervals[Math.floor(Math.random() * mockScanIntervals.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, `[${timestamp}] ${randomLog}`]);
    }, 12000);

    return () => clearInterval(interval);
  }, [isScanning]);

  // Simulating Autopilot background remediation loops
  useEffect(() => {
    if (!autopilot) return;

    const autopilotInterval = setInterval(() => {
      // Find the first pending recommendation
      const nextPending = recommendations.find(r => r.status === 'pending');
      
      if (nextPending) {
        // Trigger automated autopilot execution
        executeRemediation(nextPending, true);
      }
    }, 20000);

    return () => clearInterval(autopilotInterval);
  }, [autopilot, recommendations]);

  // Core execution script simulation
  const executeRemediation = (rec, isAutopilotCall = false) => {
    // Set executing state
    setRecommendations(prev => 
      prev.map(r => r.id === rec.id ? { ...r, status: 'executing' } : r)
    );

    const timestamp1 = new Date().toLocaleTimeString();
    const prefix = isAutopilotCall ? "AUTOPILOT ACTION" : "USER APPROVED ACTION";
    
    // Add logs to terminal
    setLogs(prev => [
      ...prev,
      `[${timestamp1}] ${prefix} - Starting remediation: ${rec.title}...`,
      `[${timestamp1}] RUNNING COMMAND: ${rec.cliCommand}`
    ]);

    // Simulate script running stages
    setTimeout(() => {
      const timestamp2 = new Date().toLocaleTimeString();
      setLogs(prev => [
        ...prev,
        `[${timestamp2}] TELEMETRY - Detaching target resource: ${rec.resourceId}...`,
        `[${timestamp2}] TELEMETRY - Applying configuration parameters...`
      ]);
    }, 1000);

    // Resolve recommendation after 2.5 seconds
    setTimeout(() => {
      const timestamp3 = new Date().toLocaleTimeString();
      
      // Update recommendation status to completed
      setRecommendations(prev => 
        prev.map(r => r.id === rec.id ? { ...r, status: 'completed' } : r)
      );

      // Modify resource inventory
      setResources(prev => {
        return prev.map(res => {
          if (res.id === rec.resourceId) {
            if (rec.actionType === 'terminate' || rec.actionType === 'delete') {
              // Delete or stop resource
              return {
                ...res,
                status: 'terminated',
                costPerMonth: 0,
                wasteLevel: 'none',
                savingAmount: 0,
                detectedReason: "Resource terminated by AI Agent optimization script."
              };
            } else if (rec.actionType === 'stop') {
              return {
                ...res,
                status: 'stopped',
                costPerMonth: 0,
                wasteLevel: 'none',
                savingAmount: 0,
                detectedReason: "Resource stopped by AI Agent optimization script."
              };
            } else if (rec.actionType === 'resize') {
              // Scale down instance cost
              const originalCost = res.costPerMonth;
              const newCost = Math.max(originalCost - rec.potentialSavings, originalCost * 0.1);
              return {
                ...res,
                type: rec.newType || res.type,
                costPerMonth: newCost,
                status: 'running',
                wasteLevel: 'none',
                savingAmount: 0,
                detectedReason: `Resized and optimized to ${rec.newType || 'smaller class'}.`
              };
            } else if (rec.actionType === 'archive') {
              // Reduce storage class rate
              return {
                ...res,
                type: 'Archive Storage class',
                costPerMonth: res.costPerMonth - rec.potentialSavings,
                status: 'running',
                wasteLevel: 'none',
                savingAmount: 0,
                detectedReason: "Storage bucket archived and rate-optimized."
              };
            }
          }
          return res;
        });
      });

      // Terminal success report
      setLogs(prev => [
        ...prev,
        `[${timestamp3}] SUCCESS - Optimization applied successfully!`,
        `[${timestamp3}] RESULT - Realized savings of $${rec.potentialSavings.toFixed(2)}/month. Inventory recalculated.`
      ]);

    }, 2500);
  };

  const handleIgnoreRecommendation = (id) => {
    setRecommendations(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'ignored' } : r)
    );
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] INFO - Recommendation ${id} ignored by user.`]);
  };

  // Mock cloud connection scanning trigger
  const handleConnectAccount = (e) => {
    e.preventDefault();
    setConnectionStatus('connecting');
    const timestamp = new Date().toLocaleTimeString();
    
    setLogs(prev => [
      ...prev,
      `[${timestamp}] CONNECTION - Initializing credentials handshake...`,
      `[${timestamp}] CONNECTION - AWS Key validated, GCP Project recognized, Azure Subscription pinged...`
    ]);

    setTimeout(() => {
      const timestamp2 = new Date().toLocaleTimeString();
      setConnectionStatus('connected');
      setLogs(prev => [
        ...prev,
        `[${timestamp2}] SUCCESS - Handshake completed! Gradient secure telemetry agents successfully deployed.`,
        `[${timestamp2}] INFO - Full accounts synchronization finished. All nodes marked [ACTIVE].`
      ]);
    }, 2000);
  };

  const activeWasteCount = recommendations.filter(r => r.status === 'pending').length;

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        autopilot={autopilot} 
        isScanning={isScanning}
        totalWaste={activeWasteCount}
      />

      {/* Main Panel Viewport */}
      <main className="main-content">
        
        {/* Top Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '20px'
        }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--accent-purple)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Cloud Agent Center
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Gradient AI Optimizer
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                setIsScanning(true);
                const time = new Date().toLocaleTimeString();
                setLogs(prev => [...prev, `[${time}] SCAN - User forced immediate infrastructure poll...`]);
              }}
              className="btn-outline"
            >
              <RefreshCw size={14} className={isScanning ? 'spin-logo' : ''} />
              <span>Sync Telemetry</span>
            </button>
            
            <button
              onClick={() => {
                setAutopilot(!autopilot);
                const time = new Date().toLocaleTimeString();
                setLogs(prev => [
                  ...prev, 
                  `[${time}] CONFIG - Autopilot mode toggled to ${!autopilot ? 'ENABLED (Safe Actions Auto-apply)' : 'DISABLED'}`
                ]);
              }}
              className="btn-primary"
              style={{
                background: autopilot 
                  ? 'linear-gradient(135deg, var(--color-success) 0%, #047857 100%)' 
                  : 'linear-gradient(135deg, var(--accent-purple) 0%, #7c3aed 100%)',
                boxShadow: autopilot 
                  ? '0 0 15px var(--color-success-glow)' 
                  : '0 0 15px var(--accent-purple-glow)'
              }}
            >
              <Sparkles size={14} />
              <span>{autopilot ? 'Autopilot Engaged' : 'Engage Autopilot'}</span>
            </button>
          </div>
        </header>

        {/* Global Overview Metrics */}
        <MetricsOverview resources={resources} recommendations={recommendations} />

        {/* TAB CONTENTS VIEW SWITCH */}
        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            {/* Top recommendations summary card */}
            <div className="col-8" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <RecommendationsList 
                recommendations={recommendations.slice(0, 3)} 
                onExecuteRecommendation={(rec) => executeRemediation(rec)}
                onIgnoreRecommendation={handleIgnoreRecommendation}
              />
            </div>

            {/* Side dashboard utility boxes */}
            <div className="col-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Agent Terminal shell console */}
              <AgentTerminal 
                logs={logs} 
                isScanning={isScanning} 
                onToggleScan={() => setIsScanning(!isScanning)} 
                onClearLogs={() => setLogs([])}
              />

              {/* Resource Distribution by Vendor widget */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Infrastructure Health Ratio
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Compute Instances (VMs)', value: 82, color: 'var(--accent-purple)' },
                    { label: 'Relational DBs (RDS/SQL)', value: 92, color: 'var(--accent-cyan)' },
                    { label: 'Storage Buckets (S3/Blob)', value: 68, color: 'var(--color-success)' }
                  ].map((stat, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <span>{stat.label}</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}% optimized</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${stat.value}%`, height: '100%', backgroundColor: stat.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Waste by Category widget */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Waste by Category
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Zombie / unused resources', value: 1058, pct: 47, color: 'var(--color-error)' },
                    { label: 'Oversized instances', value: 687, pct: 31, color: 'var(--accent-purple)' },
                    { label: 'Idle workloads', value: 417, pct: 19, color: 'var(--color-warning)' },
                    { label: 'Orphaned storage', value: 66, pct: 3, color: 'var(--accent-cyan)' }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <span>{item.label}</span>
                        <span style={{ fontWeight: 'bold', color: item.color }}>${item.value}/mo</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${item.pct}%`, 
                          height: '100%', 
                          backgroundColor: item.color,
                          borderRadius: '2px',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <ResourceMap 
            resources={resources} 
            recommendations={recommendations}
            onExecuteRecommendation={(rec) => executeRemediation(rec)}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsList 
            recommendations={recommendations} 
            onExecuteRecommendation={(rec) => executeRemediation(rec)}
            onIgnoreRecommendation={handleIgnoreRecommendation}
          />
        )}

        {activeTab === 'forecaster' && (
          <CostForecaster resources={resources} recommendations={recommendations} />
        )}

        {activeTab === 'chat' && (
          <AgentChat 
            recommendations={recommendations} 
            onExecuteRecommendation={(rec) => executeRemediation(rec)}
          />
        )}

        {activeTab === 'settings' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Global Credentials & Agent Policy</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Configure multi-cloud credential bindings and continuous scan boundaries</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              {/* Credentials Connect Form */}
              <form onSubmit={handleConnectAccount} className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>Multi-Cloud Credentials Bindings</h4>
                
                {/* AWS Key */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' }}>
                    AWS Access Key ID
                  </label>
                  <input 
                    type="text" 
                    value={awsKey}
                    onChange={(e) => setAwsKey(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: 'white',
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                </div>

                {/* GCP Project */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' }}>
                    GCP Project ID
                  </label>
                  <input 
                    type="text" 
                    value={gcpProject}
                    onChange={(e) => setGcpProject(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: 'white',
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                </div>

                {/* Azure Subscription */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' }}>
                    Azure Subscription ID
                  </label>
                  <input 
                    type="text" 
                    value={azureSub}
                    onChange={(e) => setAzureSub(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: 'white',
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={connectionStatus === 'connecting'}
                  className="btn-primary"
                  style={{ marginTop: '6px', justifyContent: 'center' }}
                >
                  {connectionStatus === 'connecting' ? 'Synchronizing Bindings...' : connectionStatus === 'connected' ? 'Update Credentials bindings' : 'Deploy credentials bindings'}
                </button>
              </form>

              {/* Optimization Scope Configurations */}
              <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>Agent Scanning Policies</h4>

                {/* Telemetry Polling Rate */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>
                    Continuous Scanning Frequency
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                      { id: '1m', label: '1 Min' },
                      { id: '5m', label: '5 Min (Default)' },
                      { id: '1h', label: 'Hourly' },
                      { id: '24h', label: 'Daily' }
                    ].map(freq => (
                      <button
                        key={freq.id}
                        type="button"
                        onClick={() => {
                          setScanFrequency(freq.id);
                          const time = new Date().toLocaleTimeString();
                          setLogs(prev => [...prev, `[${time}] CONFIG - Telemetry scanning rate configured to: ${freq.id}`]);
                        }}
                        style={{
                          flexGrow: 1,
                          background: scanFrequency === freq.id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                          border: '1px solid',
                          borderColor: scanFrequency === freq.id ? 'var(--accent-purple)' : 'var(--border-color)',
                          color: scanFrequency === freq.id ? 'var(--accent-purple)' : 'var(--text-secondary)',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '6px 4px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Autopilot Toggles */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>
                    Optimization Autopilot Scope
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'storage', label: 'Safe Storage Cleanups (Unattached volumes / transitions)', active: true },
                      { id: 'compute', label: 'Moderate Compute downscaling (Staging resizing)', active: autopilot },
                      { id: 'prod', label: 'Production instances downscaling (Always requires dual MFA)', active: false }
                    ].map((scope, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{scope.label}</span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: scope.active ? 'var(--color-success)' : 'var(--text-muted)',
                          backgroundColor: scope.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {scope.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Autopilot quick switch info */}
                <div style={{
                  background: 'rgba(139, 92, 246, 0.03)',
                  border: '1px solid rgba(139, 92, 246, 0.12)',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4'
                }}>
                  When **Autopilot** is engaged, Gradient automatically initiates CLI execution sequences on high-confidence resources. Active scanning feeds are reported live in the dashboard.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
