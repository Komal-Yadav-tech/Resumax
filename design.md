# Design Guide
## Project: Resumax

This document defines the visual and interaction design system Antigravity
should follow while building Resumax, so the UI stays consistent across every
phase instead of looking different per feature.

---

## 1. Design Principles

- **Calm and encouraging** — job hunting is stressful; the UI should feel
  clean, simple, and supportive, not cluttered or corporate.
- **Conversational, not form-heavy** — the resume builder should feel like a
  guided chat, not a wall of input boxes.
- **Trustworthy** — since users share personal career data, use clear
  layouts, readable typography, and no dark patterns (no fake urgency, no
  hidden costs — there are none anyway).
- **Consistent across light and dark mode** — every component must be
  designed with both themes in mind from the start, not patched in later.

## 2. Color System

Use CSS variables so both themes share the same variable names with
different values.

**Light mode**
| Token | Value (example) | Use |
|---|---|---|
| `--bg-primary` | `#FFFFFF` | Main background |
| `--bg-secondary` | `#F5F6F8` | Cards, panels |
| `--text-primary` | `#1A1A1A` | Main text |
| `--text-secondary` | `#5A5A5A` | Secondary/help text |
| `--accent` | `#2563EB` (blue) | Buttons, links, highlights |
| `--success` | `#16A34A` | Good ATS scores, confirmations |
| `--warning` | `#D97706` | Medium ATS scores, caution states |
| `--danger` | `#DC2626` | Low ATS scores, errors |
| `--border` | `#E2E4E8` | Dividers, input borders |

**Dark mode**
| Token | Value (example) | Use |
|---|---|---|
| `--bg-primary` | `#121417` | Main background |
| `--bg-secondary` | `#1C1F24` | Cards, panels |
| `--text-primary` | `#F2F2F2` | Main text |
| `--text-secondary` | `#A0A4AB` | Secondary/help text |
| `--accent` | `#3B82F6` (lighter blue) | Buttons, links, highlights |
| `--success` | `#22C55E` | Good ATS scores |
| `--warning` | `#F59E0B` | Medium ATS scores |
| `--danger` | `#EF4444` | Low ATS scores, errors |
| `--border` | `#2A2E35` | Dividers, input borders |

## 3. Typography

- Use a clean, modern sans-serif for the app UI (e.g. Inter, or system font
  stack) — separate from whatever fonts the resume *templates* themselves use.
- Resume templates should use classic, ATS-safe fonts (e.g. Arial, Calibri,
  Georgia) — avoid decorative or script fonts on the resume itself, only the
  app UI can be more stylized.
- Suggested scale: 
  - Headings: 24–32px, semi-bold
  - Body text: 14–16px, regular
  - Small/help text: 12–13px, regular, secondary color

## 4. Components to Design Consistently

- **Buttons**: primary (filled, accent color), secondary (outlined), and
  destructive (red, for things like "delete resume")
- **Cards**: used for the ATS score card, plan-free feature highlights (if
  any), and chat messages — consistent border-radius and padding
  across all cards
- **Inputs**: consistent border, focus state (accent-colored outline), and
  error state (red outline + inline error text)
- **Progress bar**: used for the ATS score — should visually shift color
  (red/yellow/green) based on score range
- **Toggle switch**: used for light/dark mode — should be simple, icon-based
  (sun/moon), placed in the top header, always accessible

## 5. Resume Templates — Visual Direction

- **Modern**: subtle color accent (e.g. a colored sidebar or header bar),
  slightly more visual hierarchy — good for creative/non-traditional roles
- **Classic**: black-and-white, single column, traditional section order —
  the ATS-safe option, no visual flourishes at all
- **Minimal**: lots of white space, light use of dividers, understated —
  good for technical/corporate roles

All templates must remain print/PDF-friendly: no fixed-position elements that
break when exported, no colors that look bad in grayscale printing.

## 6. Layout Guidelines

- **Dashboard**: central hub after login — quick access to "Start new resume,"
  "My resumes," "ATS Checker," and the chatbot
- **Builder page**: two-column on desktop (form left, live preview right);
  stacks to single column on mobile (form first, preview below or in a
  toggleable tab)
- **ATS Checker page**: score card at the top, detailed breakdown and
  suggestions below it, job description input clearly separated
- **Chatbot**: can be a persistent side panel (desktop) or a full-screen
  overlay (mobile)

## 7. Responsiveness

- Design mobile-first where reasonable — many users will check this on their
  phone even though it's a website, not an app
- Breakpoints (suggested): mobile (<640px), tablet (640–1024px), desktop (>1024px)
- Two-column layouts (builder, ATS checker) should collapse to single-column
  stacks below tablet width

## 8. Accessibility

- Maintain sufficient color contrast in both light and dark themes
  (WCAG AA minimum)
- All interactive elements (buttons, toggle, chat input) must be keyboard
  navigable
- Form inputs must have associated labels, not placeholder-only text
