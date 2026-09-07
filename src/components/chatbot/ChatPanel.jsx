import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Trash2,
  Briefcase,
  Layers,
  CornerDownLeft,
  ArrowRight,
  Loader2,
  Maximize2,
  X
} from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import logoImg from '../../assets/logo.png';
import { askResumeChatbot } from '../../services/aiService';
import { chatService, STARTER_PROMPTS } from '../../services/chatService';

export const ChatPanel = ({
  resumeContext = {},
  userName = 'Friend',
  isCompact = false,
  onNavigate
}) => {
  const [messages, setMessages] = useState(() => {
    const targetRole = resumeContext?.targetJobTitle || 'your target role';
    return chatService.getHistory(userName, targetRole);
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef(null);

  const targetRole = resumeContext?.targetJobTitle || 'Senior Frontend Engineer';

  // Prevent background scrolling and enable Esc key in full-screen mode
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsFullScreen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isFullScreen]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Persist messages whenever they change
  useEffect(() => {
    chatService.saveHistory(messages);
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMessage = {
      id: 'msg_user_' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const replyContent = await askResumeChatbot(query, resumeContext, updatedMessages);
      const assistantMessage = {
        id: 'msg_ai_' + Date.now(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const errorMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: 'I encountered an issue generating a reply. Please check your connection and try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear your conversation history?')) {
      const reset = chatService.clearHistory(userName, targetRole);
      setMessages(reset);
    }
  };

  return (
    <div
      className={`chat-panel-container ${isCompact ? 'chat-panel-compact' : ''} ${isFullScreen ? 'chat-panel-fullscreen' : ''}`}
      onClick={(e) => {
        if (!isFullScreen && e.target === e.currentTarget) {
          setIsFullScreen(true);
        }
      }}
      style={
        isFullScreen
          ? {
              position: 'fixed',
              inset: 0,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              maxWidth: '100vw',
              maxHeight: '100vh',
              zIndex: 9999,
              borderRadius: 0,
              border: 'none',
              boxShadow: 'none',
              margin: 0
            }
          : undefined
      }
    >
      {/* Chat Header */}
      <div
        className="chat-panel-header"
        onClick={() => setIsFullScreen((prev) => !prev)}
        style={{ cursor: 'pointer' }}
        title={isFullScreen ? "Click header or (X) to exit full screen" : "Click header to expand to full screen"}
      >
        <div className="chat-header-left">
          <div className="chat-ai-status-dot" />
          <div>
            <div className="chat-title-row">
              <h3>AI Career Advisor</h3>
            </div>
            <span className="chat-context-sub">
              Context: <strong>{targetRole}</strong>
            </span>
          </div>
        </div>

        <div className="chat-header-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleClearHistory}
            title="Clear Chat History"
            style={{ padding: '0.35rem 0.55rem' }}
          >
            <Trash2 size={14} />
            {!isCompact && <span>Clear</span>}
          </button>

          {isFullScreen ? (
            <button
              type="button"
              className="btn btn-outline btn-sm chat-fullscreen-close-btn"
              onClick={() => setIsFullScreen(false)}
              title="Exit Full Screen (Esc)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem'
              }}
            >
              <X size={15} />
              <span>Close</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline btn-sm chat-fullscreen-toggle-btn"
              onClick={() => setIsFullScreen(true)}
              title="Expand to Full Screen"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.55rem'
              }}
            >
              <Maximize2 size={14} />
              {!isCompact && <span>Full Screen</span>}
            </button>
          )}
        </div>
      </div>

      {/* Suggested Starter Prompt Chips */}
      <div className="starter-prompts-bar">
        {STARTER_PROMPTS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="starter-chip-btn"
            onClick={() => handleSendMessage(item.prompt)}
            disabled={isTyping}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="chat-messages-viewport">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <div className="chat-message-row msg-assistant">
            <div className="chat-avatar">
              <div className="avatar-icon-ai" style={{ overflow: 'hidden', padding: 0 }}>
                <img src={logoImg} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
            </div>
            <div className="chat-bubble-wrapper">
              <div className="typing-indicator-box">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="chat-input-container">
        <div className="chat-input-box">
          <textarea
            className="chat-textarea"
            placeholder={`Ask about your ${targetRole} resume, job gaps, or interview prep...`}
            rows={isCompact ? 2 : 2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="btn btn-primary chat-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            title="Send message (Enter)"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="chat-input-hint">
          <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line</span>
        </div>
      </div>
    </div>
  );
};
