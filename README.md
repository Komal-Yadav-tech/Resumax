# 🚀 Resumax — 100% Free AI-Powered Resume Builder & Career Toolkit

**Resumax** is a modern, web-only AI career platform designed to help job seekers transition from a blank page to a downloadable, ATS-optimized resume in one seamless session. 

All features are **100% free with unlimited access for every user** — no paywalls, no subscriptions, and no hidden limitations.

---

## ✨ Features

- **⚡ Conversational Resume Builder**: Guided, step-by-step Q&A flow collecting contact info, experience, education, and skills. Automatically rewrites raw answers into high-impact bullet points using power action verbs and the Google XYZ metrics formula.
- **🎨 3 Free Resume Templates**:
  - **Classic**: Strict single-column ATS-safe layout with standard headers (guaranteed ATS parseability).
  - **Modern**: Contemporary design featuring header accents, contact badge pills, and skill capsules.
  - **Minimal**: Refined whitespace, minimalist typography, and understated section dividers.
- **📄 Instant PDF Export**: High-resolution client-side PDF export powered by `html2pdf.js` with sanitized filenames.
- **🛡️ ATS Strength Checker**: Comprehensive 0–100 score combining rule-based layout checks and AI content scoring (bullet action verb ratings, quantifiable metric detection, and target job description keyword-gap analysis with actionable suggestions).
- **💬 AI Career Advisor Chatbot**: 24/7 personalized coaching grounded in the candidate's actual resume data. Helps explain employment gaps, rewrite difficult bullet points, and simulate role-tailored interview questions (STAR framework).
- **🌓 Light / Dark Mode Toggle**: Instant theme switching across all pages with system preference detection on first visit and `localStorage` persistence.
- **🔐 Immediate Authentication**: Instant registration with email & password (no phone field, no verification delay) powered by Firebase Authentication with local development fallback.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | Responsive Single Page Web Application |
| **Icons** | Lucide React | Modern, clean UI iconography |
| **PDF Export** | html2pdf.js | Client-side crisp A4 PDF generation |
| **Styling** | Vanilla CSS + CSS Variables | Light/Dark design system with zero Tailwind overhead |
| **Backend API** | Node.js + Express | Private API gateway for AI services |
| **AI Provider** | Google Gemini API (`@google/generative-ai`) | Resume generation, ATS analysis, and career chatbot |
| **Authentication** | Firebase Auth (with LocalStorage dev fallback) | User session management & password reset |

---

## 📁 Project Structure

```
Resumax/
├── server/
│   ├── server.js              # Express API server & routes
│   └── geminiService.js       # Google Gemini API client & prompt engineering
├── src/
│   ├── components/
│   │   ├── auth/              # LoginForm, RegisterForm
│   │   ├── ats/               # ScoreCard, SuggestionsList
│   │   ├── builder/           # QAStepForm, ResumePreview, StepIndicator
│   │   ├── chatbot/           # ChatPanel, ChatMessage, FloatingChatWidget
│   │   ├── layout/            # Navbar with active tabs
│   │   ├── templates/         # ClassicTemplate, ModernTemplate, MinimalTemplate, TemplatePicker
│   │   └── theme/             # ThemeToggle (Sun/Moon switch)
│   ├── context/
│   │   ├── AuthContext.jsx    # Session state & auth provider
│   │   └── ThemeContext.jsx   # Light/dark theme provider
│   ├── pages/
│   │   ├── Dashboard.jsx      # Central user hub
│   │   ├── Builder.jsx        # Conversational resume builder & preview
│   │   ├── AtsChecker.jsx     # ATS strength evaluation & job description matcher
│   │   ├── CareerAdvisor.jsx  # Full-page AI career coaching hub
│   │   ├── Login.jsx          # Login view
│   │   └── Register.jsx       # Instant registration view
│   ├── services/
│   │   ├── aiService.js       # Backend AI API client with resilient fallback
│   │   ├── atsService.js      # ATS scoring engine & rule calculations
│   │   ├── chatService.js     # Chat history persistence & starter prompts
│   │   ├── firebase.js        # Firebase Auth client & local mock storage
│   │   └── pdfService.js      # html2pdf export service
│   ├── App.jsx                # Router & global component mount
│   ├── index.css              # Design system tokens & responsive CSS
│   └── main.jsx               # React DOM root entry
├── .env.example               # Environment variables template
├── package.json               # Scripts & dependencies
├── vercel.json                # Vercel deployment & routing config
└── vite.config.js             # Vite configuration & backend proxy
```

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/your-username/resumax.git
cd resumax
npm install
```

### 3. Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Populate your environment variables (optional for local fallback mode):
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Config (Optional - will use mock local auth if not supplied)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 4. Running Locally
Start the backend AI server and frontend client concurrently:

**Terminal 1 (Backend API):**
```bash
npm run server
```

**Terminal 2 (Frontend Dev Server):**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Verification & Testing

Run all automated test suites across all 7 phases:
```bash
node test_all_phases.js
```

Or run individual phase suites:
- **Phase 0 (Auth):** `node test_auth_phase0.js`
- **Phase 2 (Templates & PDF):** `node test_templates_phase2.js`
- **Phase 3 (ATS Checker):** `node test_ats_phase3.js`
- **Phase 4 (AI Chatbot):** `node test_chatbot_phase4.js`
- **Phase 5 (Theme Toggle):** `node test_theme_phase5.js`
- **Phase 6 (Real AI Backend):** `node test_ai_phase6.js`

To verify the production bundle build:
```bash
npm run build
```

---

## 🌐 Step-by-Step Instructions to Deploy to Vercel

Follow these steps to deploy Resumax for free on [Vercel](https://vercel.com/):

### Method A: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Resumax v1.0"
   git branch -M main
   git remote add origin https://github.com/<your-username>/resumax.git
   git push -u origin main
   ```

2. **Import Project into Vercel**:
   - Log in to your [Vercel Dashboard](https://vercel.com/).
   - Click **"Add New..."** > **"Project"**.
   - Select your `resumax` GitHub repository and click **"Import"**.

3. **Configure Project Settings**:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   In the **Environment Variables** section on Vercel, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `PORT`: `5000` (optional).
   - *(Optional)* Add your Firebase client variables if using live Firebase Authentication (`VITE_FIREBASE_API_KEY`, etc.).

5. **Deploy**:
   - Click **"Deploy"**.
   - Vercel will build and publish your site in ~30 seconds, generating a live production URL (e.g. `https://resumax.vercel.app`).

---

### Method B: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Log in and deploy:
   ```bash
   vercel
   ```

3. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## 📄 License

MIT License — free for personal and commercial educational use.
