# Architecture Document
## Project: Resumax

---

## 1. High-Level Architecture

```
[ Browser (React frontend) ]
        |
        |  HTTPS requests
        v
[ Backend API (Node.js/Express) ]
        |
        |-----> [ Firebase / Supabase ]  --> Auth + Database (users, resumes, chat history)
        |
        '-----> [ AI Provider API ]      --> Claude API or Gemini API
                 (resume generation, ATS scoring, chatbot replies)
```

The frontend never calls the AI provider directly — all AI calls are routed
through the backend so the API key stays private and is never exposed in the
browser.

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React | Responsive, single web app (no native app) |
| Styling | CSS variables / Tailwind | Needed to support light/dark theme switching cleanly |
| Backend | Node.js + Express | Thin API layer between frontend and Firebase/AI provider |
| Auth | Firebase Authentication | Email + password only, no OTP/mobile |
| Database | Firebase Firestore (or Supabase Postgres) | Stores users, resumes, chat history |
| AI Provider | Claude API or Gemini API | Powers resume generation, ATS scoring, chatbot |
| PDF Export | html2pdf.js | Client-side PDF generation from the rendered template |
| Hosting | Vercel or Netlify (frontend) + a small Node host (e.g. Render) for backend | Free tiers available |

## 3. Data Model (simplified)

**Users**
```
users/{userId}
  - fullName: string
  - email: string
  - passwordHash: (handled by Firebase Auth, not stored manually)
  - createdAt: timestamp
  - theme: "light" | "dark" (last selected, optional — can also live in localStorage only)
```

**Resumes**
```
resumes/{resumeId}
  - userId: string (owner)
  - answers: { fullName, contact, targetJobTitle, experience[], education[], skills[] }
  - generatedContent: { summary, bulletPoints[] }
  - selectedTemplate: "modern" | "classic" | "minimal"
  - createdAt / updatedAt: timestamp
```

**ATS Reports**
```
atsReports/{reportId}
  - resumeId: string
  - jobDescription: string (optional)
  - formattingScore: number
  - contentScore: number
  - overallScore: number
  - missingKeywords: string[]
  - suggestions: string[]
  - createdAt: timestamp
```

**Chat History**
```
chats/{userId}/messages/{messageId}
  - role: "user" | "assistant"
  - content: string
  - resumeContext: resumeId (optional link)
  - createdAt: timestamp
```

## 4. Backend API Endpoints (suggested)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create a new user account (delegates to Firebase Auth) |
| POST | `/api/auth/login` | Log in existing user |
| POST | `/api/resume/generate` | Send Q&A answers to AI, return generated resume content |
| GET | `/api/resume/:id` | Fetch a saved resume |
| POST | `/api/ats/check` | Run formatting + AI content checks, return score and suggestions |
| POST | `/api/chatbot/message` | Send user message + resume context to AI, return reply |

## 5. Frontend Structure (suggested folder layout)

```
/src
  /components
    /auth        (LoginForm, RegisterForm)
    /builder     (QAStepForm, ResumePreview)
    /templates   (ModernTemplate, ClassicTemplate, MinimalTemplate)
    /ats         (ScoreCard, SuggestionsList)
    /chatbot     (ChatPanel, ChatMessage)
    /theme       (ThemeToggle)
  /context
    ThemeContext.js
    AuthContext.js
  /services
    api.js       (calls to backend endpoints)
  /pages
    Login.jsx
    Register.jsx
    Dashboard.jsx
    Builder.jsx
    AtsChecker.jsx
```

## 6. Theming Architecture

- Use a `ThemeContext` in React holding `theme: "light" | "dark"`
- CSS variables (e.g. `--bg-color`, `--text-color`) defined for both themes at the root
- Theme choice persisted in `localStorage`; system preference used as the default on first visit

## 7. Security Notes

- Passwords are handled entirely by Firebase Authentication — never stored or hashed manually in application code
- AI API keys live only in backend environment variables, never in frontend code or committed to source control
- All backend routes that touch user data must verify the requester's Firebase auth token before responding

## 8. Deployment

- Frontend: deploy to Vercel/Netlify, connected to the GitHub repo for auto-deploys
- Backend: deploy to a small Node-friendly host (Render, Railway, or Firebase Cloud Functions if going fully Firebase)
- Environment variables (AI API keys, Firebase config) set in the hosting provider's dashboard, never committed to the repo
