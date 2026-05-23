import { useEffect, useRef } from 'react';
import { Pause, Play, Terminal, Trash2 } from 'lucide-react';

function parseLog(log) {
  if (log.includes('WARN')) return { tag: 'WARN', cls: 'terminal__tag--warn' };
  if (log.includes('SCANNING')) return { tag: 'SCAN', cls: 'terminal__tag--scan' };
  if (log.includes('AI Analysis') || log.includes('AI Agent') || log.includes('AUTOPILOT')) {
    return { tag: 'AGENT', cls: 'terminal__tag--agent' };
  }
  if (log.includes('SUCCESS') || log.includes('established') || log.includes('RESULT')) {
    return { tag: 'OK', cls: 'terminal__tag--ok' };
  }
  if (log.includes('Initializing') || log.includes('Authenticating') || log.includes('CONNECTION')) {
    return { tag: 'SYS', cls: 'terminal__tag--sys' };
  }
  if (log.includes('RUNNING') || log.includes('TELEMETRY') || log.includes('USER APPROVED')) {
    return { tag: 'EXEC', cls: 'terminal__tag--agent' };
  }
  return { tag: 'INFO', cls: 'terminal__tag--sys' };
}

export default function AgentTerminal({ logs, isScanning, onToggleScan, onClearLogs }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="card terminal card--glow">
      <div className="terminal__bar">
        <div className="terminal__title">
          <Terminal size={14} />
          Agent shell
        </div>
        <div className="terminal__controls">
          <button type="button" className="terminal__ctrl-btn" onClick={onToggleScan} title={isScanning ? 'Pause scan' : 'Resume scan'}>
            {isScanning ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button type="button" className="terminal__ctrl-btn" onClick={onClearLogs} title="Clear">
            <Trash2 size={14} />
          </button>
          <div className="terminal__dots">
            <span style={{ background: '#f43f5e' }} />
            <span style={{ background: '#f59e0b' }} />
            <span style={{ background: '#10b981' }} />
          </div>
        </div>
      </div>

      <div className="terminal__viewport">
        {isScanning && <div className="terminal__scan" />}
        {logs.map((log, i) => {
          const { tag, cls } = parseLog(log);
          const text = log.replace(/^\[[\d:]+\]\s*/, '').replace(/^[A-Z\s]+\s*-\s*/, '');
          return (
            <div key={i} className="terminal__line">
              <span className={`terminal__tag ${cls}`}>[{tag}]</span>
              <span>{text}</span>
            </div>
          );
        })}
        <div className="terminal__cursor">
          <span>gradient$</span>
          <span className="terminal__cursor-block" />
        </div>
        <div ref={endRef} />
      </div>

      <div className="terminal__footer">
        <span>TLS 1.3 · encrypted telemetry</span>
        <span>poll: 5m</span>
      </div>
    </div>
  );
}
