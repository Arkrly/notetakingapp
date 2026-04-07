# Visual Audit Report
**Date:** 2026-04-07
**Project:** Note Taking App — Angular Frontend
**Stack:** Angular 21 + Angular Material + Tailwind CSS + Framer Motion

## Summary
The application has a clean base, but suffers from a severely disjointed visual identity. The authentication pages use a dark green/teal gradient that entirely clashes with the light purple/blue, airy theme of the dashboard. Furthermore, there are several critical contrast issues, and some pages (like the Profile route) appear completely unfinished or blank. 

## Severity Legend
- 🔴 Critical — broken, unusable, or embarrassing
- 🟠 Major — clearly wrong, needs fixing before demo
- 🟡 Minor — polish issue, noticeable but not blocking
- 🟢 Suggestion — enhancement, not a bug

---

## Route: / (Home) / /login
![screenshot](/home/arkrly/Work/notetakingapp/frontend/audit/screenshots/login-desktop.png)

### Issues Found
| Severity | Element | Issue | Suggested Fix |
|----------|---------|-------|---------------|
| 🔴 | Hero Background | Auth page uses a dark green gradient that strictly clashes with the light theme of the rest of the app | Standardize to the "Light Mode Orange" or the light purple dashboard theme using `bg-slate-50` or similar |
| 🟠 | Hero Text ("Ideas &", "Journey") | Orange text on teal/green background fails WCAG contrast requirements | Change text to white or update the background color scheme |
| 🟡 | Input Fields | Placeholder text contrast is somewhat low | Use `placeholder:text-slate-500` for better visibility |

---

## Route: /register
![screenshot](/home/arkrly/Work/notetakingapp/frontend/audit/screenshots/register-desktop.png)

### Issues Found
| Severity | Element | Issue | Suggested Fix |
|----------|---------|-------|---------------|
| 🔴 | Theme Consistency | Patchwork design. Carries over the same green/teal gradient from the login page, mismatching the main app. | Apply the global light theme / dashboard palette |
| 🟠 | Hero Text | The orange "Journey" text on teal has poor readability | Change text color or use a high-contrast background |
| 🟡 | Social Buttons | Google/GitHub buttons look a bit stark | Add a subtle hover state like `hover:bg-slate-50` and refine border |

---

## Route: /notes (Dashboard)
![screenshot](/home/arkrly/Work/notetakingapp/frontend/audit/screenshots/dashboard-desktop.png)

### Issues Found
| Severity | Element | Issue | Suggested Fix |
|----------|---------|-------|---------------|
| 🟠 | Loading State | Spinner is functional, but lacks a fallback empty state if no notes exist | Implement a dedicated empty state illustration and message for users without notes |
| 🟡 | Sidebar Active State | "All Notes" has a subtle active background, but could use a left border accent for clarity | Add `border-l-4 border-indigo-600` to the active nav item |
| 🟡 | Mobile FAB | On mobile view, the floating action button awkwardly drops shadow over the navigation tab bar | Adjust z-index or spacing to integrate it cleanly into a bottom app bar notch |

---

## Route: /profile
![screenshot](/home/arkrly/Work/notetakingapp/frontend/audit/screenshots/profile-desktop.png)

### Issues Found
| Severity | Element | Issue | Suggested Fix |
|----------|---------|-------|---------------|
| 🔴 | Main Content Area | The page is entirely blank aside from the sidebar and background gradient | Implement the user profile settings form, avatar upload, and details |
| 🟠 | Layout | Missing a page header/title, leaving the user with zero context | Add a top header with `<h1>Profile Settings</h1>` |

---

## Route: Modal (New Note)
![screenshot](/home/arkrly/Work/notetakingapp/frontend/audit/screenshots/modal-desktop.png)

### Issues Found
| Severity | Element | Issue | Suggested Fix |
|----------|---------|-------|---------------|
| 🔴 | Inputs | "Title" and body placeholder text are extremely pale, almost invisible against the white background | Darken the placeholder text using `placeholder:text-slate-400` or higher contrast |
| 🟠 | "Save Note" Button | White text on a pale purple button lacks sufficient contrast | Use a deeper primary color like `bg-indigo-600` for the primary button |
| 🟡 | Color Picker | Selected state is indicated by a border, could be more pronounced | Increase border thickness or add a checkmark icon to the selected color circle |

---

## Global Issues (Appear on Multiple Routes)

| Severity | Element | Issue | Suggested Fix |
|----------|---------|-------|---------------|
| 🔴 | Theme Cohesion | App feels like two completely different templates stitched together (Green Auth vs Purple/Light Dashboard) | Completely refactor Auth views to match Dashboard's design tokens and colors |
| 🟠 | Accessibility | Text contrast in modals and forms fails WCAG standards | Audit all text colors against a 4.5:1 ratio |

---

## Animation Gaps

List every place where animation is missing or jarring:

| Location | Current Behavior | Recommended Fix |
|----------|-----------------|-----------------|
| Route change | Hard cut between pages | Implement Angular router animations with fade/slide transitions |
| Modal open | Appears instantly | Use `@angular/animations` or Framer Motion to scale/fade the dialog up smoothly |
| Nav Links | Color change is instant | Add `transition-colors duration-200 ease-in-out` |
| FAB (Mobile) | Instant scale on tap | Add tap highlight and smooth scale bounce |
| Note list | Items appear instantly | `animate('.note-card', {opacity:[0,1], y:[20,0]}, {delay: stagger(0.08)})` |

---

## Priority Fix Order

1. 🔴 Complete overhaul of `/login` and `/register` visual styling to match the light theme of the dashboard — `login.component.html`/`register.component.html`
2. 🔴 Fix critical placeholder text contrast in the New Note Modal so users can see what they type — `note-modal.component.html` (or equivalent)
3. 🔴 Build out the `/profile` page so it is no longer blank — `profile.component.html`
4. 🟠 Update the "Save Note" button in the modal to have a high-contrast background — `note-modal.component.html`
5. 🟠 Add graceful empty states for Note list instead of just a loading spinner — `notes.component.html`

---

## Notes for Developer
The application features a very polished dashboard layout, but the authentication flow feels like legacy code from a previous dark-mode or green-themed design. The contrast issues in the New Note modal are accessibility blockers. Consolidate your CSS variables and Tailwind classes to ensure a single source of truth for colors and typography to prevent this patchwork effect in the future.
