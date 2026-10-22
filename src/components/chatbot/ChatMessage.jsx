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

  // Formatting helper for markdown-style headings, bold, italics, code, and lists
  const formatContent = (text) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();

      // Heading 3: ### Heading
      if (trimmed.startsWith('### ')) {
        const hText = trimmed.replace(/^###\s+/, '');
        return (
          <h4
            key={idx}
            className="chat-h4"
            dangerouslySetInnerHTML={{ __html: hText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
          />
        );
      }

      // Heading 2: ## Heading
      if (trimmed.startsWith('## ')) {
        const hText = trimmed.replace(/^##\s+/, '');
        return (
          <h3
            key={idx}
            className="chat-h3"
            dangerouslySetInnerHTML={{ __html: hText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
          />
        );
      }

      // Inline code: `code`
      let formattedLine = line.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');
      // Format bold: **text**
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Format italics: *text*
      formattedLine = formattedLine.replace(/\*([^\*]+)\*/g, '<em>$1</em>');

      // Blockquotes: > quote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="chat-quote"
            dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^>\s*/, '') }}
          />
        );
      }

      // Bullet items: - or •
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        return (
          <li
            key={idx}
            className="chat-li"
            dangerouslySetInnerHTML={{
              __html: formattedLine.replace(/^[-•]\s*/, '')
            }}
          />
        );
      }

      // Numbered items: 1. 2. etc.
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <div
            key={idx}
            className="chat-numbered-item"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      }

      if (!trimmed) {
        return <div key={idx} style={{ height: '0.4rem' }} />;
      }

      return (
        <p
          key={idx}
          className="chat-p"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
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
