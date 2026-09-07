# Product Requirements Document (PRD)
## Project: Resumax

---

## 1. Overview

**Resumax** is a free, web-only AI-powered resume builder. Users answer a
guided, conversational set of questions and Resumax generates a professional,
ATS-optimized resume automatically. All features are free for every user —
there is no subscription, no paywall, and no usage limit.

## 2. Problem Statement

Most job seekers struggle with:
- Not knowing how to phrase experience professionally
- Formatting resumes in a way that passes ATS (Applicant Tracking System) software
- Matching their resume's language to a specific job description
- Getting personalized, on-demand career advice without hiring a coach

Resumax solves all four with one AI-guided tool, at no cost to the user.

## 3. Target Users

- College students and recent graduates building their first resume
- Job seekers switching industries or roles
- Working professionals updating an outdated resume
- Anyone who wants to check/improve their resume's ATS compatibility

## 4. Goals

- Let a user go from "blank page" to a downloadable, professional resume in one session
- Make ATS compatibility understandable and fixable, not just a mystery score
- Keep the entire product free and frictionless — no login walls beyond basic account creation, no paywalls

## 5. Non-Goals (Out of Scope for v1)

- Mobile app (website only)
- Payments/subscriptions of any kind
- Team/recruiter-facing features (this is a job-seeker tool only)
- Multi-language resume generation (English only for v1)

## 6. Features & Requirements

### 6.1 Authentication
- Register with full name, email, password (no mobile number field)
- No email OTP or verification step — registration is immediate
- Login with email + password
- "Forgot password" flow via email reset link
- Session persists across page reloads until logout

### 6.2 Theme
- Light mode / dark mode toggle, available on every page
- Defaults to the user's system preference on first visit
- User's manual choice is remembered across sessions

### 6.3 Conversational Resume Builder
- Step-by-step Q&A flow (not a static form) collecting:
  - Full name, contact info (email, phone, location)
  - Target job title
  - Work experience (company, role, duration, achievements)
  - Education
  - Skills
- AI generates a professional summary and rewritten bullet points from raw answers
- User can go back and edit any answer before finalizing

### 6.4 Templates
- Multiple templates available to every user with no restriction: **Modern**, **Classic**, **Minimal**
- Classic template is ATS-safe: single-column, no tables/graphics/text boxes, standard section headers
- User can switch templates at any time and see a live preview

### 6.5 ATS Strength Checker
- Available to every user, unlimited use
- Produces an overall score (0–100) made of:
  - Formatting score (rule-based: layout, headers, contact completeness, length)
  - Content score (AI-based: keyword match, bullet strength, quantifiable metrics)
- Optional: user pastes a job description to get a keyword-gap analysis
- Shows specific, actionable fixes — not just a number

### 6.6 AI Career Chatbot
- Available to every user, unlimited use, no paywall
- Chat interface where the user can ask personalized questions (e.g., "how do I explain a job gap?")
- Uses the user's current resume data as context for personalized answers

### 6.7 Export
- Download the finished resume as a PDF in the selected template
- Unlimited downloads

## 7. User Stories

- *As a new user*, I want to create an account quickly without unnecessary steps, so I can start building my resume immediately.
- *As a job seeker*, I want the AI to ask me questions instead of handing me a blank form, so I don't feel stuck on what to write.
- *As a user*, I want to know exactly why my resume might get rejected by ATS software, so I can fix it before applying.
- *As a user*, I want to paste a job description and see what keywords I'm missing, so I can tailor my resume to that specific role.
- *As a user*, I want to ask follow-up questions about my resume, so I get advice without needing a human career coach.
- *As a user*, I want to switch between light and dark mode, so the app is comfortable to use at any time of day.

## 8. Success Metrics

- % of users who complete the full Q&A flow and download a resume
- Average ATS score improvement (before fixes vs after fixes applied)
- Chatbot engagement rate (messages sent per active user)
- Return-user rate (users who come back to edit/regenerate a resume)

## 9. Constraints

- Must run as a responsive website (desktop + mobile browser), not a native app
- No payment integration required or planned for v1
- AI API costs are borne by the project owner, not passed to users
