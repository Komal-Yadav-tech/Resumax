# Project Rules
## For Antigravity (or any AI coding agent) — Project: Resumax

These are standing rules the AI agent should follow throughout the entire
build, across all phases. Treat this file as always-on context.

---

## 1. Scope Rules

- This is a **website only**. Never generate React Native, Flutter, or any
  mobile-app-specific code.
- **No payment or subscription logic anywhere** in this project. Every
  feature is free and unlocked for every user, always.
- **No OTP or email verification step.** Registration is immediate — do not
  add a verification step even if it seems like a "best practice," unless
  explicitly asked.
- Do not add features that were not explicitly requested in the current
  phase's prompt. If something seems missing, ask instead of assuming.

## 2. Security Rules

- Never store plain-text passwords. Authentication and password handling
  must go through Firebase Authentication (or the chosen auth provider) —
  do not write custom password hashing/storage logic.
- Never hardcode API keys, secrets, or credentials directly in frontend code.
  All secrets belong in backend environment variables (`.env`, excluded from
  version control via `.gitignore`).
- All AI provider calls (Claude/Gemini) must go through the backend, never
  called directly from the browser.
- Validate and sanitize all user input on the backend, not just the frontend.

## 3. Code Quality Rules

- Use React functional components with hooks — no class components.
- Keep components small and single-purpose; split large components rather
  than writing one giant file.
- Use consistent naming: camelCase for variables/functions, PascalCase for
  components.
- Every new feature must include basic error handling (e.g., failed API
  calls should show a user-friendly error message, not a blank screen or
  console crash).
- Every phase must end with the AI agent actually testing the feature in the
  browser (or via automated test) and confirming it works before reporting
  completion — not just writing code and assuming it works.

## 4. UI/UX Rules

- The entire app must support both light mode and dark mode — no
  hardcoded colors that break in either theme.
- The app must be responsive and usable on both desktop and mobile browser
  widths (even though it is not a native app, people will open it on their
  phones).
- Keep the tone of all UI copy clear and encouraging — this is a tool
  meant to reduce user stress, not add to it.

## 5. Data Rules

- User resume data belongs to that user only — no shared/global data leaks
  between accounts.
- Chat history and resume data should persist per user (saved to the
  database), not lost on refresh or logout.

## 6. Communication Rules (for the AI agent itself)

- If a prompt is ambiguous, ask a clarifying question rather than guessing
  and building the wrong thing.
- If a requested feature conflicts with an earlier rule in this file (e.g.,
  a future prompt accidentally asks for payment logic), flag the conflict
  before proceeding.
- Always summarize what was built and tested at the end of each phase, in
  plain language.
