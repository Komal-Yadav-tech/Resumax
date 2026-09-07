import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { generateResumeWithAI, analyzeAtsWithAI, chatWithCareerAI } from './geminiService.js';
import { getAdminStore, saveAdminStore, recordAnalyticsEvent } from './adminService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static frontend assets if built
app.use(express.static(distPath));

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Resumax AI Backend',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY')
  });
});

// 2. Resume Content Generation
app.post('/api/resume/generate', async (req, res) => {
  try {
    const answers = req.body;
    if (!answers) {
      return res.status(400).json({ error: 'Resume answers payload is required.' });
    }

    const generatedData = await generateResumeWithAI(answers);
    res.json(generatedData);
  } catch (error) {
    console.error('Error in /api/resume/generate:', error);
    res.status(500).json({ error: 'Failed to generate resume content.', details: error.message });
  }
});

// 3. ATS Strength & Keyword Gap Analysis
app.post('/api/ats/check', async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data payload is required.' });
    }

    const atsResult = await analyzeAtsWithAI(resumeData, jobDescription || '');
    res.json(atsResult);
  } catch (error) {
    console.error('Error in /api/ats/check:', error);
    res.status(500).json({ error: 'Failed to evaluate ATS content.', details: error.message });
  }
});

// 4. AI Career Chatbot
app.post('/api/chatbot/message', async (req, res) => {
  try {
    const { message, resumeContext, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const reply = await chatWithCareerAI(message, resumeContext || {}, chatHistory || []);
    res.json({ reply, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error in /api/chatbot/message:', error);
    res.status(500).json({ error: 'Failed to process chatbot message.', details: error.message });
  }
});

// In-memory feedback store
const FEEDBACK_STORE = [];

// 5. Review & Feedback Submission
app.post('/api/feedback', (req, res) => {
  try {
    const { rating, comment, userId, userEmail, source, timestamp } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Valid rating (1-5) is required.' });
    }

    const reviewItem = {
      id: req.body.id || `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      rating: Number(rating),
      comment: (comment || '').trim(),
      userId: userId || 'guest_user',
      userEmail: userEmail || 'anonymous',
      source: source || 'app',
      timestamp: timestamp || new Date().toISOString()
    };

    FEEDBACK_STORE.unshift(reviewItem);
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully.',
      review: reviewItem
    });
  } catch (error) {
    console.error('Error in /api/feedback:', error);
    res.status(500).json({ error: 'Failed to process feedback.', details: error.message });
  }
});

// 6. View All Reviews (for admin/monitoring)
app.get('/api/feedback', (req, res) => {
  res.json({
    total: FEEDBACK_STORE.length,
    reviews: FEEDBACK_STORE
  });
});

// ============================================================================
// Admin Panel Endpoints
// ============================================================================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const store = getAdminStore();

    if (
      email &&
      password &&
      email.toLowerCase() === store.adminCredentials.email.toLowerCase() &&
      password === store.adminCredentials.password
    ) {
      const adminSession = {
        uid: 'admin_master_01',
        email: store.adminCredentials.email,
        displayName: store.adminCredentials.name,
        role: 'admin',
        token: `admin_tok_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
      };
      return res.json({ success: true, user: adminSession });
    }

    return res.status(401).json({ error: 'Invalid admin email or password.' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed.', details: error.message });
  }
});

// Admin Dashboard Analytics
app.get('/api/admin/stats', (req, res) => {
  try {
    const store = getAdminStore();
    const reviews = FEEDBACK_STORE;
    const avgRating = reviews.length > 0 
      ? Number((reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1))
      : 5.0;

    res.json({
      analytics: store.analytics,
      feedback: {
        total: reviews.length,
        averageRating: avgRating
      },
      registeredUsersCount: store.users?.length || store.analytics.totalRegisteredUsers
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve admin stats.', details: error.message });
  }
});

// Record analytics events (resume created, exported, user joined)
app.post('/api/admin/event', (req, res) => {
  try {
    const { eventType, details } = req.body;
    if (!eventType) {
      return res.status(400).json({ error: 'eventType is required.' });
    }
    const updatedAnalytics = recordAnalyticsEvent(eventType, details);
    res.json({ success: true, analytics: updatedAnalytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record event.', details: error.message });
  }
});

// Get Live Website Content
app.get('/api/admin/content', (req, res) => {
  try {
    const store = getAdminStore();
    res.json(store.content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve website content.', details: error.message });
  }
});

// Update Live Website Content
app.put('/api/admin/content', (req, res) => {
  try {
    const newContent = req.body;
    if (!newContent) {
      return res.status(400).json({ error: 'Content payload is required.' });
    }
    const store = getAdminStore();
    store.content = {
      ...store.content,
      ...newContent,
      hero: { ...store.content.hero, ...(newContent.hero || {}) },
      features: { ...store.content.features, ...(newContent.features || {}) },
      announcementBanner: { ...store.content.announcementBanner, ...(newContent.announcementBanner || {}) },
      pricing: { ...store.content.pricing, ...(newContent.pricing || {}) },
      footer: { ...store.content.footer, ...(newContent.footer || {}) }
    };
    saveAdminStore(store);
    res.json({ success: true, message: 'Content updated successfully.', content: store.content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content.', details: error.message });
  }
});

// Get Site-wide Theme Settings
app.get('/api/admin/theme', (req, res) => {
  try {
    const store = getAdminStore();
    res.json(store.theme);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve theme settings.', details: error.message });
  }
});

// Update Site-wide Theme Settings
app.put('/api/admin/theme', (req, res) => {
  try {
    const newTheme = req.body;
    if (!newTheme) {
      return res.status(400).json({ error: 'Theme payload is required.' });
    }
    const store = getAdminStore();
    store.theme = {
      ...store.theme,
      ...newTheme
    };
    saveAdminStore(store);
    res.json({ success: true, message: 'Theme updated successfully.', theme: store.theme });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update theme.', details: error.message });
  }
});

// Get User Directory
app.get('/api/admin/users', (req, res) => {
  try {
    const store = getAdminStore();
    res.json({
      total: store.users?.length || 0,
      users: store.users || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users list.', details: error.message });
  }
});


// Single Page Application (SPA) catch-all handler for client-side routing
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  next();
});

// Start Express server if run directly
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  app.listen(PORT, () => {
    console.log(`🚀 Resumax Backend running on http://localhost:${PORT}`);
  });
}

export default app;
