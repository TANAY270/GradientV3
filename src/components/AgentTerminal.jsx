import React, { useEffect, useRef } from 'react';
import { Terminal, Shield, Play, Pause, Trash2 } from 'lucide-react';

export default function AgentTerminal({ logs, isScanning, onToggleScan, onClearLogs }) {
  const terminalEndRef = useRef(null);

  // Automatically scroll to bottom of the terminal on new logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Utility to color-code prefix in logs
  const renderLogLine = (log, index) => {
    let style = { color: 'var(--text-secondary)' };
    let tag = '';

    if (log.includes('WARN')) {
      style = { color: '#fbbf24' }; // Amber
      tag = '[WARN]';
    } else if (log.includes('SCANNING')) {
      style = { color: '#22d3ee' }; // Cyan
      tag = '[SCAN]';
    } else if (log.includes('AI Analysis') || log.includes('AI Agent')) {
      style = { color: '#c084fc' }; // Purple
      tag = '[AGENT]';
    } else if (log.includes('SUCCESS') || log.includes('Done') || log.includes('established')) {
      style = { color: '#34d399' }; // Emerald
      tag = '[OK]';
    } else if (log.includes('Initializing') || log.includes('Authenticating')) {
      style = { color: '#9ca3af' }; // Muted
      tag = '[SYS]';
    }

    return (
      <div key={index} style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '6px', 
        fontSize: '12px',
        lineHeight: '1.5',
        fontFamily: 'var(--font-mono)'
      }}>
        {tag && (
          <span style={{ 
            color: style.color, 
            fontWeight: 'bold', 
            opacity: 0.8,
            minWidth: '55px',
            display: 'inline-block'
          }}>
            {tag}
          </span>
        )}
        <span style={style}>{log.replace(/^[A-Z\s]+\s*-\s*/, '')}</span>
      </div>
    );
  };

  return (
    <div className="glass-panel glow-purple" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '350px',
      background: 'rgba(5, 7, 15, 0.95)',
      border: '1px solid var(--border-active)',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Terminal Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={14} className="text-gradient-purple-cyan" />
          <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            AGENT TERMINAL SHELL
          </span>
        </div>
        
        {/* Terminal Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onToggleScan}
            title={isScanning ? "Pause Telemetry Scan" : "Resume Telemetry Scan"}
            style={{
              background: 'transparent',
              border: 'none',
              color: isScanning ? '#fbbf24' : '#34d399',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              transition: 'all 0.2s'
            }}
          >
            {isScanning ? <Pause size={14} /> : <Play size={14} />}
          </button>
          
          <button 
            onClick={onClearLogs}
            title="Clear Logs Console"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Trash2 size={14} />
          </button>

          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          </div>
        </div>
      </div>

      {/* Terminal Core Viewport */}
      <div style={{
        flexGrow: 1,
        padding: '16px',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Scan Laser effect overlay */}
        {isScanning && (
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.4), transparent)',
            boxShadow: '0 0 8px rgba(6, 182, 212, 0.8)',
            animation: 'scan-line 3s linear infinite',
            pointerEvents: 'none'
          }} />
        )}

        {/* Output lines */}
        {logs.map((log, index) => renderLogLine(log, index))}

        {/* Pulse cursor indicating live system */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
          <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>gradient-agent$</span>
          <span style={{
            width: '8px',
            height: '14px',
            backgroundColor: 'var(--accent-cyan)',
            animation: 'blink 1s step-end infinite',
            boxShadow: '0 0 5px var(--accent-cyan)'
          }} />
        </div>
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer info bar */}
      <div style={{
        padding: '6px 16px',
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '10px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Shield size={10} color="var(--color-success)" />
          <span>Security Engine: Active (TLS 1.3 Encryption)</span>
        </div>
        <span>Rate: 5s telemetry poll</span>
      </div>
    </div>
  );
}
