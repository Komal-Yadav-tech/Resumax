// Chat Storage & Management Service for Resumax (Phase 4)

const CHAT_STORAGE_KEY = 'resumax_chat_history';

export const STARTER_PROMPTS = [
  {
    id: 'bullets',
    icon: '✍️',
    label: 'Improve Experience Bullets',
    prompt: 'Can you rewrite my work experience bullets with stronger action verbs and quantifiable metrics?'
  },
  {
    id: 'gap',
    icon: '💬',
    label: 'Explain a Job Gap',
    prompt: 'How do I best explain a 1-year employment gap between roles in my interview and resume?'
  },
  {
    id: 'interview',
    icon: '🎙️',
    label: 'Practice Interview Questions',
    prompt: 'What are the top 4 behavioral and technical interview questions for my target role?'
  },
  {
    id: 'skills',
    icon: '🎯',
    label: 'Recommend High-Impact Skills',
    prompt: 'What skills and keywords should I add to my resume to stand out for my target role?'
  }
];

export const getInitialWelcomeMessage = (userName = 'Friend', targetRole = 'your target role') => {
  return {
    id: 'msg_welcome_' + Date.now(),
    role: 'assistant',
    content: `Hello ${userName}! 👋 I'm your AI Career Advisor. I have your active resume context loaded for **${targetRole}**.\n\nAsk me anything about tailoring your resume, explaining career transitions, interview prep, or bullet point phrasing!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

export const chatService = {
  /**
   * Loads persisted chat history for user session
   * @param {string} userName 
   * @param {string} targetRole 
   * @returns {Array}
   */
  getHistory(userName, targetRole) {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse chat history from localStorage:', e);
    }
    const welcome = [getInitialWelcomeMessage(userName, targetRole)];
    this.saveHistory(welcome);
    return welcome;
  },

  /**
   * Persists message array to localStorage
   * @param {Array} messages 
   */
  saveHistory(messages) {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat history to localStorage:', e);
    }
  },

  /**
   * Clears saved chat history
   * @param {string} userName 
   * @param {string} targetRole 
   * @returns {Array}
   */
  clearHistory(userName, targetRole) {
    const fresh = [getInitialWelcomeMessage(userName, targetRole)];
    this.saveHistory(fresh);
    return fresh;
  }
};
