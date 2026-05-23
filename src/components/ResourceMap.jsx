import React, { useState } from 'react';
import { Server, Database, HardDrive, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ResourceMap({ resources, recommendations, onExecuteRecommendation }) {
  const [hoveredResourceId, setHoveredResourceId] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('all');

  const providers = [
    { id: 'all', label: 'All Cloud Providers' },
    { id: 'aws', label: 'Amazon Web Services' },
    { id: 'gcp', label: 'Google Cloud Platform' },
    { id: 'azure', label: 'Microsoft Azure' }
  ];

  const getServiceIcon = (service) => {
    switch (service.toLowerCase()) {
      case 'compute': return <Server size={14} />;
      case 'database': return <Database size={14} />;
      case 'storage': return <HardDrive size={14} />;
      default: return <Server size={14} />;
    }
  };

  const filteredResources = resources.filter(res => {
    if (selectedProvider === 'all') return true;
    return res.provider === selectedProvider;
  });

  // Check if a resource has an active waste alert
  const getResourceAlert = (resourceId) => {
    return recommendations.find(rec => rec.resourceId === resourceId && rec.status === 'pending');
  };

  const getProviderColor = (provider) => {
    switch (provider) {
      case 'aws': return '#FF9900';
      case 'gcp': return '#4285F4';
      case 'azure': return '#0089D6';
      default: return 'var(--accent-purple)';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
      {/* Map Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Cloud Infrastructure Explorer</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Visual cost waste map mapped across multi-cloud regions</p>
        </div>
        
        {/* Provider Filters */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {providers.map(prov => (
            <button
              key={prov.id}
              onClick={() => setSelectedProvider(prov.id)}
              style={{
                background: selectedProvider === prov.id ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: '1px solid',
                borderColor: selectedProvider === prov.id ? 'var(--accent-cyan)' : 'var(--border-color)',
                color: selectedProvider === prov.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '500',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s'
              }}
            >
              {prov.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cloud Provider Zones */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        {['aws', 'gcp', 'azure'].map(provKey => {
          if (selectedProvider !== 'all' && selectedProvider !== provKey) return null;
          
          const providerResources = filteredResources.filter(r => r.provider === provKey);
          if (providerResources.length === 0) return null;

          return (
            <div 
              key={provKey} 
              className="glass-panel" 
              style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.01)',
                border: `1px solid rgba(255,255,255, 0.04)`,
                borderTop: `3px solid ${getProviderColor(provKey)}`,
                position: 'relative'
              }}
            >
              {/* Provider Zone Banner */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '800', 
                  color: getProviderColor(provKey), 
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {provKey === 'aws' ? 'AWS (us-east-1)' : provKey === 'gcp' ? 'GCP (europe-w3)' : 'AZURE (eastus)'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {providerResources.length} Nodes monitored
                </span>
              </div>

              {/* Resource nodes list in provider zone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {providerResources.map(res => {
                  const alert = getResourceAlert(res.id);
                  const isHovered = hoveredResourceId === res.id;
                  
                  return (
                    <div
                      key={res.id}
                      onMouseEnter={() => setHoveredResourceId(res.id)}
                      onMouseLeave={() => setHoveredResourceId(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: '10px',
                        background: alert ? 'rgba(239, 68, 68, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid',
                        borderColor: alert ? 'rgba(239, 68, 68, 0.2)' : 'var(--border-color)',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s',
                        boxShadow: alert ? '0 0 10px rgba(239, 68, 68, 0.02)' : 'none',
                        animation: alert && alert.impact === 'high' ? 'border-glow-flow 3s infinite' : 'none'
                      }}
                    >
                      {/* Node Left Meta */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: alert ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255, 0.04)',
                          color: alert ? 'var(--color-error)' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getServiceIcon(res.service)}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{res.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{res.id}</div>
                        </div>
                      </div>

                      {/* Node Right Status */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>${res.costPerMonth.toFixed(2)}</span>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>/month</div>
                        </div>

                        {/* Visual alerts indicator */}
                        {alert ? (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-error)',
                            boxShadow: '0 0 10px var(--color-error)',
                            animation: 'pulse-error 1.5s infinite'
                          }} />
                        ) : (
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-success)'
                          }} />
                        )}
                      </div>

                      {/* POPUP CARD HOVER INSPECTOR */}
                      {isHovered && (
                        <div className="glass-panel" style={{
                          position: 'absolute',
                          left: '5%',
                          bottom: '105%',
                          width: '290px',
                          padding: '16px',
                          zIndex: 10,
                          backgroundColor: 'rgba(9, 12, 23, 0.98)',
                          border: '1px solid var(--border-active)',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.15)',
                          borderRadius: '12px',
                          pointerEvents: 'auto'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                              RESOURCE DIAGNOSTIC
                            </span>
                            <span style={{
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: res.status === 'idle' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: res.status === 'idle' ? 'var(--color-warning)' : 'var(--color-success)',
                              fontWeight: '600',
                              textTransform: 'uppercase'
                            }}>
                              {res.status}
                            </span>
                          </div>

                          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>{res.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
                            {res.id} ({res.type})
                          </div>

                          {/* Telemetry Utilization stats */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                            {res.service === 'Compute' || res.service === 'Database' ? (
                              <>
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                                    <span>Average CPU Utilization</span>
                                    <span>{res.utilization.cpu}%</span>
                                  </div>
                                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{
                                      width: `${res.utilization.cpu}%`,
                                      height: '100%',
                                      backgroundColor: res.utilization.cpu < 5 ? 'var(--color-error)' : 'var(--accent-purple)'
                                    }} />
                                  </div>
                                </div>
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                                    <span>RAM Utilization</span>
                                    <span>{res.utilization.memory}%</span>
                                  </div>
                                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{
                                      width: `${res.utilization.memory}%`,
                                      height: '100%',
                                      backgroundColor: res.utilization.memory < 15 ? 'var(--color-warning)' : 'var(--accent-cyan)'
                                    }} />
                                  </div>
                                </div>
                              </>
                            ) : null}

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                              <span>Network I/O Rate:</span>
                              <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{res.utilization.network}</span>
                            </div>
                          </div>

                          {/* Action Recommendation overlay */}
                          {alert ? (
                            <div style={{
                              background: 'rgba(239, 68, 68, 0.05)',
                              border: '1px solid rgba(239, 68, 68, 0.15)',
                              borderRadius: '8px',
                              padding: '8px 10px',
                              fontSize: '11px',
                              color: 'var(--text-primary)'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-error)', fontWeight: 'bold', marginBottom: '4px' }}>
                                <AlertTriangle size={12} />
                                <span>AI Agent Cost Waste Flagged</span>
                              </div>
                              <div style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '10.5px' }}>
                                {alert.description}
                              </div>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onExecuteRecommendation(alert);
                                }}
                                style={{
                                  width: '100%',
                                  background: 'linear-gradient(135deg, var(--color-error) 0%, #b91c1c 100%)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px',
                                  boxShadow: '0 0 10px var(--color-error-glow)',
                                }}
                              >
                                <span>Execute Cleanup</span>
                                <ArrowRight size={10} />
                              </button>
                            </div>
                          ) : (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '11px',
                              color: 'var(--color-success)',
                              background: 'rgba(16, 185, 129, 0.05)',
                              border: '1px solid rgba(16, 185, 129, 0.15)',
                              borderRadius: '8px',
                              padding: '6px 10px'
                            }}>
                              <CheckCircle2 size={12} />
                              <span>Efficiently Configured Node</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
