import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateResumeWithAI, analyzeAtsWithAI, chatWithCareerAI } from './geminiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));

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

// Start Express server if run directly
import { fileURLToPath } from 'node:url';

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  app.listen(PORT, () => {
    console.log(`🚀 Resumax Backend running on http://localhost:${PORT}`);
  });
}

export default app;
