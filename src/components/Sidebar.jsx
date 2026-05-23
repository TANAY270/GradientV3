import React from 'react';
import { 
  Terminal, 
  TrendingUp, 
  Layers, 
  Settings, 
  MessageSquare, 
  Activity,
  CloudLightning,
  ShieldCheck,
  Server
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, autopilot, isScanning, totalWaste }) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'map', label: 'Resource Map', icon: Layers },
    { id: 'recommendations', label: 'AI Optimizations', icon: CloudLightning, badge: totalWaste > 0 ? 'waste' : null },
    { id: 'forecaster', label: 'Cost Forecaster', icon: TrendingUp },
    { id: 'chat', label: 'Agent Console', icon: MessageSquare },
    { id: 'settings', label: 'Configuration', icon: Settings },
  ];

  return (
    <aside className="glass-panel" style={{
      borderRadius: '0',
      borderLeft: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      padding: '24px',
      position: 'sticky',
      top: '0',
      zIndex: 100
    }}>
      {/* Brand logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
        }}>
          <Server size={18} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', tracking: '0.5px' }} className="text-gradient-purple-cyan">GRADIENT</h1>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '2px', fontWeight: 'bold' }}>AI CLOUD AGENT</span>
        </div>
      </div>

      {/* Agent Telemetry status */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '12px',
        marginBottom: '28px',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Agent Status</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isScanning ? 'var(--color-warning)' : 'var(--color-success)',
              boxShadow: isScanning 
                ? '0 0 8px var(--color-warning)' 
                : '0 0 8px var(--color-success)',
              animation: isScanning ? 'pulse-glow 1.5s infinite' : 'none'
            }} />
            <span style={{ 
              color: isScanning ? 'var(--color-warning)' : 'var(--color-success)', 
              fontWeight: '600',
              fontSize: '11px',
              textTransform: 'uppercase'
            }}>
              {isScanning ? 'Scanning' : 'Active'}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Autopilot</span>
          <span style={{ 
            color: autopilot ? 'var(--accent-cyan)' : 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '11px',
            textTransform: 'uppercase'
          }}>
            {autopilot ? 'Autopilot On' : 'Autopilot Off'}
          </span>
        </div>
      </div>

      {/* Navigation menu items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-sans)',
                fontWeight: '500',
                transition: 'all var(--transition-fast)',
                borderLeft: isActive ? '3px solid var(--accent-purple)' : '3px solid transparent',
              }}
              className={isActive ? '' : 'nav-hover-sidebar'}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} style={{ color: isActive ? 'var(--accent-purple)' : 'inherit' }} />
                <span>{item.label}</span>
              </div>
              
              {item.badge === 'waste' && totalWaste > 0 && (
                <span style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: 'var(--color-error)',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  animation: 'pulse-error 2s infinite'
                }}>
                  {totalWaste}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Cloud Integrations Status widget */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
        <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
          MONITORED PROVIDERS
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { name: 'AWS (us-east-1)', active: true, color: '#FF9900' },
            { name: 'Google Cloud (eu-w3)', active: true, color: '#4285F4' },
            { name: 'Azure (eastus)', active: true, color: '#0089D6' }
          ].map((prov, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: prov.color
                }} />
                <span style={{ color: 'var(--text-secondary)' }}>{prov.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} color="var(--color-success)" />
                <span style={{ color: 'var(--color-success)', fontSize: '10px', fontWeight: 'bold' }}>LIVE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
