import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, MessageSquare, Send, Sparkles } from 'lucide-react';
import { MOCK_CHAT_RESPONSES } from '../data/mockCloudData';

const PRESETS = [
  { label: 'List idle servers', key: 'list_servers' },
  { label: 'Waste by provider', key: 'breakdown' },
  { label: 'DB resize risks', key: 'db_safety' },
  { label: 'How autopilot works', key: 'autopilot' },
];

function formatText(text) {
  return text.split('\n').map((line, idx) => {
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let last = 0;
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > last) parts.push(line.slice(last, match.index));
      parts.push(<strong key={match.index}>{match[1]}</strong>);
      last = regex.lastIndex;
    }
    if (last < line.length) parts.push(line.slice(last));
    const content = parts.length ? parts : line;

    if (/^[*-]/.test(line.trim()) || /^\d+\./.test(line.trim())) {
      return <div key={idx} style={{ marginLeft: 12, marginBottom: 4 }}>{content}</div>;
    }
    if (!line.trim()) return <br key={idx} />;
    return <p key={idx}>{content}</p>;
  });
}

export default function AgentChat({ recommendations, onExecuteRecommendation }) {
  const [messages, setMessages] = useState([
    { sender: 'agent', text: MOCK_CHAT_RESPONSES.welcome },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const respond = (text, key = null) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { sender: 'user', text }]);
    setInput('');

    let response = "I can help with idle servers, waste breakdowns, database safety, and autopilot. Try a preset above.";
    if (key && MOCK_CHAT_RESPONSES[key]) {
      response = MOCK_CHAT_RESPONSES[key];
    } else {
      const q = text.toLowerCase();
      if (q.includes('server') || q.includes('idle') || q.includes('compute')) response = MOCK_CHAT_RESPONSES.list_servers;
      else if (q.includes('breakdown') || q.includes('provider') || q.includes('waste')) response = MOCK_CHAT_RESPONSES.breakdown;
      else if (q.includes('db') || q.includes('database') || q.includes('resize')) response = MOCK_CHAT_RESPONSES.db_safety;
      else if (q.includes('autopilot')) response = MOCK_CHAT_RESPONSES.autopilot;
    }

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { sender: 'agent', text: response }]);
    }, 1100);
  };

  const showAction = (msg) =>
    msg.sender === 'agent' &&
    msg.text.includes('staging-api-server') &&
    recommendations.some((r) => r.id === 'rec-01' && r.status === 'pending');

  return (
    <div className="card chat">
      <div className="chat__header">
        <div className="chat__agent">
          <div className="chat__avatar">
            <MessageSquare size={15} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Gradient Agent</div>
            <div className="chat__online">● Online</div>
          </div>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Telemetry chat</span>
      </div>

      <div className="chat__messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble chat-bubble--${msg.sender}`}>
            {msg.sender === 'agent' && (
              <div className="chat-bubble__from">
                <Sparkles size={11} />
                GRADIENT
              </div>
            )}
            <div>{formatText(msg.text)}</div>
            {showAction(msg) && (
              <div className="chat-action-card">
                <div className="alert-box__title">
                  <AlertTriangle size={12} />
                  Quick fix available
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
                  Downscale staging-api-server → saves $252.56/mo
                </p>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => {
                    const rec = recommendations.find((r) => r.id === 'rec-01');
                    if (rec) onExecuteRecommendation(rec);
                  }}
                >
                  Apply fix
                  <ArrowRight size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="chat-typing">
            Agent thinking
            <span className="chat-typing__dots">
              <span /><span /><span />
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="chat__footer">
        <div className="chat__presets">
          {PRESETS.map((p) => (
            <button key={p.key} type="button" className="preset-chip" onClick={() => respond(p.label, p.key)}>
              {p.label}
            </button>
          ))}
        </div>
        <form className="chat__form" onSubmit={(e) => { e.preventDefault(); respond(input); }}>
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about waste, savings, or remediation…"
          />
          <button type="submit" className="btn btn--primary btn--icon">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
