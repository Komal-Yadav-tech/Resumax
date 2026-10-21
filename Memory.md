# Memory.md
## Project: Resumax — Persistent Context File

This file exists so Antigravity (or any AI coding agent) can quickly recall
the current state of the project and the decisions already made, without
needing the full conversation history. Update this file whenever a major
decision changes. Always treat this file as the source of truth if it ever
conflicts with an older instruction.

---

## 1. Project Identity

- **Name:** Resumax
- **What it is:** A 100% free, web-only AI-powered resume builder and career toolkit
- **Platform:** Website only — Single Page Web Application (React + Vite + Vanilla CSS) — no mobile app, no React Native
- **Pricing model:** 100% free — no subscriptions, no paywalls, no locked features

## 2. Final Confirmed Feature Set

- Registration + login with email and password (with demo account auto-fill)
- **No OTP / no email verification step** — registration is immediate
- No mobile number field anywhere in auth
- Light mode / dark mode toggle, available site-wide with system preference detection and localStorage persistence
- Conversational Q&A resume builder (not a static form) with live split preview
- All templates unlocked for everyone (Modern, Classic, Minimal — Classic is ATS-safe single-column)
- Unlimited resume generations
- Full ATS strength checker (0–100 score breakdown, action verbs, quantifiable metrics, keyword gap matcher against job descriptions)
- AI career chatbot — free, unlimited, available to every user via dedicated page (`#advisor`) and floating quick launcher
- **Multiple Resume Download Formats**:
  - **PDF** (`.pdf`): High-resolution ATS layout via `html2pdf.js`.
  - **Word DOCX** (`.docx`): Word-compatible structured document preserving sections, headings, and bullet points via `docx`.
  - **Plain Text** (`.txt`): Clean ASCII format with standard headers and bullets for direct copy-pasting into text job portal fields.
  - Dropdown selector in Resume Builder topbar.
- **Review / Feedback Popup**:
  - 5-Star interactive rating selector + optional text comments.
  - Triggered after resume download (any format) and after ATS score evaluation.
  - Limited to **once per session** via `sessionStorage` tracking (`resumax_feedback_shown`).
  - Dismissible via "X" / "Maybe later" without marking as submitted.
  - Stored in database via `POST /api/feedback` and fallback `localStorage` (`resumax_reviews`).
- Backend API server (Node.js/Express) connecting to Google Gemini API (`@google/generative-ai`) keeping API keys private

## 3. Explicitly Removed / Rejected Features

Keep these out unless the user explicitly reintroduces them:

- ❌ Mobile app version — decided web-only
- ❌ Free vs Paid subscription tiers — removed, everything is free
- ❌ Payment integration (Razorpay or otherwise) — removed along with subscriptions
- ❌ "Choose your plan" onboarding step — removed
- ❌ Terms of Use / Privacy Policy acceptance step — removed from onboarding
- ❌ Email OTP verification — removed
- ❌ Mobile/SMS OTP or phone number field — removed

## 4. Decision History (chronological, for context)

1. Started as a broader idea: AI resume builder with Free + Paid subscription tiers
2. Added ATS strength checker as a core differentiator
3. Added login + email OTP verification, then a Terms acceptance step, then a
   "Choose your plan" step — building toward a 4-step onboarding flow
4. **Pivot 1:** Confirmed website only, not an app
5. **Pivot 2:** Removed the Free/Paid split entirely — all features made free
   for all users; subscription/payment logic removed
6. **Pivot 3:** Project renamed to **Resumax**; Terms of Use/Privacy Policy
   acceptance step removed; light/dark mode toggle added
7. **Pivot 4:** Email OTP verification removed entirely — registration is now
   immediate with just name, email, and password
8. **Implementation Milestone:** Completed all 7 phases with 100% passing unit tests, Vite production builds, Gemini AI backend, and Vercel deployment configuration.
9. **Enhancement:** Added DOCX and TXT resume download formats with dropdown menu, and 5-star session feedback popup modal with backend API storage.

## 5. Current Build & Phase Status (All Phases Completed & Verified)

- [x] **Phase 0 — Registration + Login (no OTP)**: Instant registration, session persistence, logout, password reset, demo auto-fill (`test_auth_phase0.js`).
- [x] **Phase 1 — Core Q&A Resume Generator**: Step-by-step wizard, Google XYZ power-verb generation, live split preview (`localStorage` persistence).
- [x] **Phase 2 — Resume Templates (Classic, Modern, Minimal) & PDF**: Template switcher, A4 print styling, sanitized PDF downloads (`test_templates_phase2.js`).
- [x] **Phase 3 — ATS Strength Checker**: 0–100 score engine (rule format checks + AI action verbs + quantifiable metrics + job description keyword gap matcher) (`test_ats_phase3.js`).
- [x] **Phase 4 — AI Career Chatbot**: Resume-grounded coaching, bullet rewrites, employment gap scripts, STAR interview prep (`test_chatbot_phase4.js`).
- [x] **Phase 5 — Light Mode / Dark Mode Toggle**: System preference detection, animated Sun/Moon toggle in navbar, print sheet color preservation (`test_theme_phase5.js`).
- [x] **Phase 6 — Connect Real AI**: Node.js & Express server (`server/server.js`), Google Gemini API (`server/geminiService.js`), backend API key isolation (`test_ai_phase6.js`).
- [x] **Phase 7 — Deployment & Production Readiness**: `README.md`, `vercel.json`, `.env.example`, clean Vite production build, master test runner (`test_all_phases.js`).
- [x] **Feature Enhancements — Multi-Format Export & Feedback Popup**: DOCX/TXT/PDF dropdown selector, 5-star session feedback modal, `POST /api/feedback` (`test_export_feedback.js`).
- [x] **Comprehensive Upgrades (Phases 1 to 7)**:
  - **Phase 1 — Design Studio**: Custom HEX palette generator + presets, font family/size/weight, heading & divider styles, line & section spacing, margins, icon styles, 1-click reset to defaults (`ResumeCustomizerToolbar.jsx`, `themeConstants.js`).
  - **Phase 2 & 3 — Live Preview & Smart Page Management**: Instant preview update, A4 (297mm) and US Letter (279.4mm) sizes, real-time overflow tracking with 1-click resolution banner, visual page-break preview line, no automatic unreadable font-shrinking (`ResumeCanvasWrapper.jsx`, `ResumePreview.jsx`).
  - **Phase 4 — Resume Content & Multi-Resume Manager**: Drag-and-drop section reordering, custom sections, multi-resume management (create, duplicate, rename, delete, versioning), template switching with data preservation (`resumeStorageService.js`, `Dashboard.jsx`, `Builder.jsx`).
  - **Phase 5 — ATS Checker**: Multi-category compliance audit (contact details, headings, template safety, readability, dates & chronology, links), simulated plain text extraction viewer, actionable fixes, and prominent disclaimer (`atsService.js`, `AtsChecker.jsx`).
  - **Phase 6 — AI Assistant**: Professional summary generator (3 styles), bullet optimizer (Google XYZ formula), grammar & active voice polish, keyword suggestion engine, template recommender, and strict user approval diff workflow (`AiAssistantModal.jsx`).
  - **Phase 7 — Export & Quality**: Pre-download Quality Inspection modal (`ExportQualityModal.jsx`), selectable text PDF with clickable links, DOCX export supporting custom sections (`docxService.js`, `pdfService.js`).
  - All verified with unit tests (`test_all_upgrades.js`, `test_all_phases.js`) and clean Vite production build.

## 6. Related Documentation & Core Files

- `Memory.md` — persistent context and decision history (source of truth)
- `PRD.md` — full product requirements
- `Architecture.md` — tech stack, data model, API structure
- `rules.md` — standing build rules (security, scope, code quality)
- `design.md` — visual design system (colors, typography, layout)
- `phases.md` — step-by-step build prompts, in order
- `README.md` — project setup, features, and Vercel deployment guide
- `vercel.json` — Vercel SPA routing and security headers

## 7. Standing Instruction for the AI Agent

If any future prompt seems to contradict Section 2 or Section 3 above, pause
and ask for confirmation before building — don't silently reintroduce a
removed feature (like OTP or payments) just because it seems like a common
best practice. This project has deliberately chosen simplicity and zero cost
over those patterns.
