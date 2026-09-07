import React, { useState } from 'react';
import { User, Copy, Check } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const ChatMessage = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple formatting helper for markdown-style bold and bullet lists
  const formatContent = (text) => {
    return text.split('\n').map((line, idx) => {
      // Format bold: **text**
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Format italics: *text*
      const italicLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');

      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <li
            key={idx}
            dangerouslySetInnerHTML={{
              __html: italicLine.replace(/^[-•]\s*/, '')
            }}
            style={{ marginLeft: '1.25rem', marginBottom: '0.25rem' }}
          />
        );
      }

      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div
            key={idx}
            dangerouslySetInnerHTML={{ __html: italicLine }}
            style={{ marginBottom: '0.4rem', paddingLeft: '0.5rem' }}
          />
        );
      }

      if (!line.trim()) {
        return <div key={idx} style={{ height: '0.5rem' }} />;
      }

      return (
        <p
          key={idx}
          dangerouslySetInnerHTML={{ __html: italicLine }}
          style={{ marginBottom: '0.35rem' }}
        />
      );
    });
  };

  return (
    <div className={`chat-message-row ${isAssistant ? 'msg-assistant' : 'msg-user'}`}>
      <div className="chat-avatar">
        {isAssistant ? (
          <div className="avatar-icon-ai" style={{ overflow: 'hidden', padding: 0 }}>
            <img src={logoImg} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
        ) : (
          <div className="avatar-icon-user">
            <User size={16} />
          </div>
        )}
      </div>

      <div className="chat-bubble-wrapper">
        <div className="chat-bubble-header">
          <span className="chat-sender-name">
            {isAssistant ? 'AI Career Advisor' : 'You'}
          </span>
          <span className="chat-time">{message.timestamp || 'Just now'}</span>
        </div>

        <div className="chat-bubble-content">
          {formatContent(message.content)}
        </div>

        {isAssistant && (
          <div className="chat-bubble-actions">
            <button
              type="button"
              className="chat-action-btn"
              onClick={handleCopy}
              title="Copy message text"
            >
              {copied ? (
                <>
                  <Check size={12} color="var(--success)" />
                  <span style={{ color: 'var(--success)' }}>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
