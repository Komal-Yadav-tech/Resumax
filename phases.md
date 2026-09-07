Build Phases
## Project: Resumax

Build these in order. Do not start a phase until the previous one is fully
working and tested. Each phase below is meant to be copy-pasted as a prompt
to Antigravity, one at a time.

---

## Phase 0 — Registration + Login

**Goal:** Users can create an account and log in, no verification step.

```
Build a registration and login system for a React website called Resumax,
using Firebase Authentication.

Registration:
- Form fields: full name, email, password (no phone/mobile number field, no
  email OTP or verification step of any kind)
- On submit, create the account and redirect the user straight to the main
  dashboard

Login (for returning users):
- Simple email + password login
- Add a "Forgot password" link using Firebase's password reset email

Session handling:
- Keep the user logged in across page reloads using Firebase's auth state
- Add a logout button in the header
- Redirect unauthenticated users away from the dashboard back to the login page

Test the full flow end-to-end: register a new test account, confirm immediate
redirect to dashboard with no verification step, log out, then log back in.
```

---

## Phase 1 — Core Q&A Resume Generator

**Goal:** Users can answer guided questions and get AI-generated resume content.

```
Build the resume builder for Resumax using React. Create a step-by-step
conversational form that asks the user the following, one at a time: full
name, contact info (email, phone, location), target job title, work
experience (company, role, duration, key achievements), education, and skills.

After all answers are collected, send the data to an AI API (use a placeholder
function called generateResumeContent() that I will connect later) which should
return professional resume bullet points and a summary paragraph based on the
answers.

Display the generated resume content in a preview panel on the right side of
the screen while the form is on the left.

Test the full flow end-to-end in the browser and confirm the form works and
generated content displays correctly.
```

---

## Phase 2 — Resume Templates

**Goal:** Multiple templates, all free, including one ATS-safe layout.

```
Add 3 resume templates as separate React components: "Modern", "Classic", and
"Minimal". All three should accept the same resume data object as props and
render it differently. All three templates are available to every user with
no restrictions.

The "Classic" template must be ATS-friendly: single-column layout only, no
tables, no text boxes, no graphics, and standard section headers (Experience,
Education, Skills, Summary).

Add a template picker UI (visual thumbnails) above the resume preview that lets
the user switch templates instantly.

Add a "Download as PDF" button using html2pdf.js that exports the currently
selected template with the user's data.

Test that switching templates updates the preview and that the PDF download
works for all three templates.
```

---

## Phase 3 — ATS Strength Checker

**Goal:** Full scoring and suggestions, unlimited, for every user.

```
Add an ATS resume strength checker to Resumax, available to every user with no
restrictions. Create a scoring function that takes the resume data object and
an optional job description text field as input.

Run these rule-based format checks and calculate a formatting score out of 100:
- No tables/columns/text boxes in the selected template
- Standard section headers are present
- Contact info is complete
- Resume is not excessively long or short

Then send the resume content and job description (if provided) to the AI API
(use a placeholder function called checkAtsContent()) which should return:
1. A list of important keywords from the job description missing in the resume
2. A rating of bullet point strength (weak/strong action verbs)
3. Bullet points that are missing quantifiable metrics (numbers/percentages)

Combine the format score and AI content score into one overall percentage.

Display results as a score card with a progress bar for the overall score, a
full breakdown by category, and a bullet list of specific actionable fixes
below it — all visible to every user, nothing hidden or locked.

Test that entering different resumes produces different scores and that the
suggestions list updates accordingly.
```

---

## Phase 4 — AI Career Chatbot

**Goal:** Free, unlimited chatbot using resume context.

```
Add an AI career chatbot to Resumax, available to every user with no
restrictions or usage limits. Build it as a chat panel accessible from the
dashboard, connected to a placeholder function called askResumeChatbot() that
takes the user's message and their current resume data as context, so answers
can be personalized (e.g., "how do I explain a job gap?", "improve this bullet
point").

Show a normal chat UI: message bubbles, an input box, and a send button. Keep
the chat history visible during the session.

Test that sending a message displays both the user's message and a placeholder
response in the chat panel.
```

---

## Phase 5 — Light Mode / Dark Mode Toggle

**Goal:** Theme switching across the entire site.

```
Add a light mode / dark mode toggle to Resumax. Add a switch/icon button in
the header (sun/moon icon) that toggles between light and dark themes across
the entire website, including the dashboard, resume builder, templates,
ATS checker, and chatbot panel.

Use CSS variables (or a theme context in React) so colors, backgrounds, and
text update consistently across all components when toggled. Default to the
user's system preference (light or dark) on first visit, and remember their
manual choice using localStorage so it persists across sessions.

Test that toggling the switch changes the theme immediately across every page,
and that refreshing the page keeps the last selected theme.
```

---

## Phase 6 — Connect the Real AI

**Goal:** Replace all placeholder AI functions with real API calls.

```
Replace the placeholder functions generateResumeContent(), checkAtsContent(),
and askResumeChatbot() with real API calls to [Claude API / Gemini API — pick
one]. Store the API key securely using environment variables, not hardcoded in
the frontend. Create a simple backend route (Node.js/Express) that the frontend
calls, so the API key is never exposed to the browser.

Test each feature end-to-end with real AI responses: resume generation, ATS
scoring, and chatbot replies.
```

---

## Phase 7 — Deployment

**Goal:** Get Resumax live and accessible.

```
Prepare Resumax for deployment. Add a README with setup instructions, create
a .env.example file listing required environment variables (without real
keys), and make sure the site builds successfully with no errors. Give me
step-by-step instructions to deploy this to Vercel.
```

---

## If a Phase Fails

1. Describe exactly what's wrong (e.g. "the PDF download button doesn't work,
   clicking it does nothing")
2. Ask the agent to check the browser console for errors and fix based on that
3. Do not move to the next phase until the current one is fully working
