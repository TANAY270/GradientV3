import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, MessageSquare, Terminal, AlertTriangle, ArrowRight } from 'lucide-react';
import { MOCK_CHAT_RESPONSES } from '../data/mockCloudData';

export default function AgentChat({ recommendations, onExecuteRecommendation }) {
  const [messages, setMessages] = useState([
    { sender: 'agent', text: MOCK_CHAT_RESPONSES.welcome, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const presets = [
    { label: 'List all idle compute servers', key: 'list_servers' },
    { label: 'Break down cost waste by provider', key: 'breakdown' },
    { label: 'Explain database resizing safety risks', key: 'db_safety' },
    { label: 'How does autopilot work?', key: 'autopilot' }
  ];

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const simulateResponse = (userQuery, responseText) => {
    setIsTyping(true);
    
    // Simulate thinking delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { sender: 'agent', text: responseText, timestamp: new Date() }
      ]);
    }, 1200);
  };

  const handleSend = (text, customKey = null) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Determine mock response
    let response = "I'm analyzing your infrastructure logs... Currently I support cloud cost waste list, vendor cost breakdowns, safety protocols, and autopilot triggers. Could you try one of the query shortcuts above?";
    
    if (customKey && MOCK_CHAT_RESPONSES[customKey]) {
      response = MOCK_CHAT_RESPONSES[customKey];
    } else {
      const normalized = text.toLowerCase();
      if (normalized.includes('server') || normalized.includes('idle') || normalized.includes('compute')) {
        response = MOCK_CHAT_RESPONSES.list_servers;
      } else if (normalized.includes('breakdown') || normalized.includes('provider') || normalized.includes('aws') || normalized.includes('waste')) {
        response = MOCK_CHAT_RESPONSES.breakdown;
      } else if (normalized.includes('db') || normalized.includes('database') || normalized.includes('resize') || normalized.includes('safety')) {
        response = MOCK_CHAT_RESPONSES.db_safety;
      } else if (normalized.includes('autopilot')) {
        response = MOCK_CHAT_RESPONSES.autopilot;
      }
    }

    simulateResponse(text, response);
  };

  // Render text with markdown-like highlights
  const formatMessageText = (text) => {
    // Simple parser for bold **text** and `code` styles
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content = line;
      
      // Parse bold tags
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        // text before bold
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        // bold text
        parts.push(
          <strong key={match.index} style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      // Re-join line contents
      const lineNode = parts.length > 0 ? parts : line;

      // Handle bullets
      if (line.trim().startsWith('*') || line.trim().startsWith('-') || /^\d+\./.test(line.trim())) {
        return (
          <div key={idx} style={{ 
            marginLeft: '12px', 
            marginBottom: '6px', 
            lineHeight: '1.5',
            display: 'list-item', 
            listStyleType: line.trim().startsWith('*') || line.trim().startsWith('-') ? 'disc' : 'decimal'
          }}>
            {lineNode}
          </div>
        );
      }

      return (
        <p key={idx} style={{ marginBottom: '8px', lineHeight: '1.5' }}>
          {lineNode}
        </p>
      );
    });
  };

  return (
    <div className="glass-panel" style={{
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      height: '520px',
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-purple)'
          }}>
            <MessageSquare size={14} />
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>AI Optimization Advisory</span>
            <span style={{ fontSize: '10px', color: 'var(--color-success)', display: 'block', fontWeight: '600' }}>
              ● AGENT ONLINE
            </span>
          </div>
        </div>
        
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Direct Telemetry Chat
        </span>
      </div>

      {/* Chat Messages Body */}
      <div style={{
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: 'rgba(5, 7, 15, 0.2)'
      }}>
        {messages.map((msg, index) => {
          const isAgent = msg.sender === 'agent';
          
          return (
            <div key={index} style={{
              display: 'flex',
              justifyContent: isAgent ? 'flex-start' : 'flex-end',
              width: '100%'
            }}>
              <div style={{
                maxWidth: '85%',
                backgroundColor: isAgent ? 'rgba(255, 255, 255, 0.03)' : 'rgba(139, 92, 246, 0.12)',
                border: '1px solid',
                borderColor: isAgent ? 'var(--border-color)' : 'rgba(139, 92, 246, 0.3)',
                padding: '14px 18px',
                borderRadius: isAgent ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
                fontSize: '13px',
                color: 'var(--text-secondary)'
              }}>
                {/* Agent Icon */}
                {isAgent && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-purple)', fontWeight: 'bold', marginBottom: '8px', fontSize: '11px' }}>
                    <Sparkles size={12} />
                    <span>GRADIENT AI AGENT</span>
                  </div>
                )}
                
                {/* Text Content */}
                <div>{formatMessageText(msg.text)}</div>

                {/* Inline Action Card - ONLY if listing idle compute instances in the chat */}
                {isAgent && msg.text.includes('staging-api-server') && recommendations.some(r => r.id === 'rec-01' && r.status === 'pending') && (
                  <div className="glass-panel" style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'rgba(239, 68, 68, 0.04)',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-error)', fontWeight: 'bold', fontSize: '11px' }}>
                      <AlertTriangle size={12} />
                      <span>Immediate Remediation Available</span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Downscaling **staging-api-server** to `t3.medium` saves **$252.56/mo**.
                    </p>
                    <button
                      onClick={() => {
                        const rec = recommendations.find(r => r.id === 'rec-01');
                        if (rec) onExecuteRecommendation(rec);
                      }}
                      style={{
                        alignSelf: 'flex-start',
                        background: 'linear-gradient(135deg, var(--accent-purple) 0%, #7c3aed 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 0 10px rgba(139, 92, 246, 0.15)'
                      }}
                    >
                      <span>Apply Fix Now</span>
                      <ArrowRight size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing Loader Indicator */}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              padding: '12px 16px',
              borderRadius: '12px 12px 12px 2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Agent is typing</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                <span className="dot" style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)', animation: 'pulse-glow 1s infinite' }} />
                <span className="dot" style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)', animation: 'pulse-glow 1s infinite 0.2s' }} />
                <span className="dot" style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)', animation: 'pulse-glow 1s infinite 0.4s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Footer Input & Presets */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.01)',
        borderTop: '1px solid var(--border-color)'
      }}>
        {/* Preset Query Badges */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}>
          {presets.map((pre, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pre.label, pre.key)}
              style={{
                whiteSpace: 'nowrap',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '6px 12px',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-purple)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              {pre.label}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }} style={{
          display: 'flex',
          gap: '10px'
        }}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask agent for custom cost optimization advice..."
            style={{
              flexGrow: 1,
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '10px 16px',
              color: 'white',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <button 
            type="submit"
            style={{
              background: 'linear-gradient(135deg, var(--accent-purple) 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
