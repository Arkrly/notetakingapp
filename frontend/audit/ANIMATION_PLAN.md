# ANIMATION_PLAN.md

## Overview
This document outlines the animation revamp plan for the Angular 21 note-taking app. Framer Motion 12.38 is already installed and a MotionService exists.

## Component Inventory

### 1. AppComponent
- **Type:** Root app component with route transitions
- **Elements:** Router outlet only
- **Current Animation:** Angular animations `@routeFade` trigger
- **Missing:** None - already has route transitions

---

### 2. SidebarComponent
- **Type:** Navigation sidebar (desktop + mobile bottom nav)
- **Elements:**
  - Logo section
  - Nav items (All Notes, Pinned, Archived)
  - User profile section
  - Mobile FAB button
- **Current Animation:** None (CSS transitions only)
- **Missing:**
  - Staggered nav item entrance
  - Hover micro-interactions
  - Mobile sidebar slide animation

---

### 3. NotesListComponent
- **Type:** Main page with note grid/list
- **Elements:**
  - Search bar (top)
  - "New Note" button (desktop)
  - Pinned notes section with cards
  - Other notes section with cards
  - Empty state (icon + CTA button)
  - Loading spinner
- **Current Animation:** CSS `animate-slide-up`, `animate-fade-in` (Tailwind)
- **Missing:**
  - Replace CSS animations with Framer Motion staggered entrance
  - Note card entrance animation with stagger
  - Search results animation
  - Empty state icon bounce + CTA pulse

---

### 4. NoteCardComponent
- **Type:** Individual note card (reusable)
- **Elements:**
  - Pinned indicator badge
  - Title
  - Content preview (line-clamp)
  - Tags
  - Action buttons (edit, archive, delete)
  - Hover glow effect
- **Current Animation:** CSS hover transitions (`hover:translate-y-[-4px]`, `hover:shadow-lg`)
- **Missing:**
  - Enhanced hover shadow with Framer Motion
  - Card entrance animation (for dynamic add)
  - Card exit animation (before delete)

---

### 5. NoteFormComponent
- **Type:** Modal dialog for create/edit note
- **Elements:**
  - Header with title + close button
  - Title input
  - Content textarea
  - Color swatches
  - Tags input (chips)
  - Cancel + Save buttons
- **Current Animation:** None
- **Missing:**
  - Modal open/close animations
  - Form field focus animations

---

### 6. ConfirmDialogComponent
- **Type:** Confirmation modal (delete, etc.)
- **Elements:**
  - Icon (danger/info)
  - Title
  - Message
  - Cancel + Confirm buttons
- **Current Animation:** None
- **Missing:**
  - Modal open/close animations

---

### 7. LoginComponent
- **Type:** Authentication page
- **Elements:**
  - Left column (hero heading, decorative elements)
  - Right column (form panel)
  - Username input
  - Password input with visibility toggle
  - Remember me checkbox
  - Submit button
  - Sign up link
- **Current Animation:** CSS `page-fade-in`, `left-column-anim`, `right-column-anim`
- **Missing:**
  - Replace CSS with Framer Motion hero reveal
  - Form entrance animation

---

### 8. RegisterComponent
- **Type:** Authentication page
- **Elements:**
  - Left column (hero heading, features list)
  - Right column (form panel)
  - Username, email, password, confirm password inputs
  - Password visibility toggles
  - Submit button
  - OAuth buttons (Google, GitHub)
  - Login link
- **Current Animation:** CSS `page-fade-in`, `left-column-anim`, `right-column-anim`
- **Missing:**
  - Replace CSS with Framer Motion hero reveal
  - Form entrance animation

---

### 9. ProfileComponent
- **Type:** User settings page
- **Elements:**
  - Avatar/initials section
  - Edit profile form (username, email)
  - Change password form (current, new, confirm)
  - Password strength indicator
  - Delete account section (danger zone)
- **Current Animation:** CSS transitions only
- **Missing:**
  - Page entrance with staggered sections
  - Section hover animations

---

## Animation Plan by Priority

### P1 - Visible on Load (Page/Route Entry)

| Component | Elements | Animation Type | Method |
|-----------|----------|----------------|--------|
| NotesListComponent | Page content, note cards | Staggered entrance | `staggerSpring` |
| SidebarComponent | Nav items | Slide-in left | `slideInLeft` with stagger |
| ProfileComponent | Header, sections | Staggered entrance | `staggerSpring` |
| LoginComponent | Hero heading, form | Hero reveal + fade | `heroReveal`, `fadeIn` |
| RegisterComponent | Hero heading, form | Hero reveal + fade | `heroReveal`, `fadeIn` |

### P2 - On Interaction (Modals, Lists, Search)

| Component | Elements | Animation Type | Method |
|-----------|----------|----------------|--------|
| NoteFormComponent | Modal overlay/panel | Open/close animation | Custom spring animation |
| ConfirmDialogComponent | Modal overlay/panel | Open/close animation | Custom spring animation |
| NotesListComponent | Search results | Fade + slide up | `stagger` on results |
| NoteCardComponent | New card added | Scale + fade in | Custom spring |
| NoteCardComponent | Card deleted | Fade + scale out | Custom animation |

### P3 - Delight/Polish (Micro-interactions)

| Component | Elements | Animation Type | Method |
|-----------|----------|----------------|--------|
| NotesListComponent | Empty state icon | Bounce on mount | Custom keyframes |
| NotesListComponent | Empty state CTA | Pulse attention | `pulseAttention` |
| SidebarComponent | Nav items | Hover translate + color | Tailwind + CSS |
| NoteCardComponent | Hover state | Enhanced shadow | Framer Motion |
| Search bar | Input focus | Expand width | Tailwind CSS |

---

## Implementation Order

1. **Extend MotionService** - Add missing methods (Phase 2)
2. **Global Styles** - Add motion tokens (Phase 4)
3. **Modal Components** - NoteForm, ConfirmDialog (P2)
4. **Notes List** - Page entrance + cards (P1)
5. **Sidebar** - Nav item animations (P1)
6. **Auth Pages** - Login/Register animations (P1)
7. **Profile Page** - Section animations (P1)
8. **Empty States** - Icon bounce + CTA pulse (P3)
9. **Toast Notifications** - Slide-in animation (P3)
10. **QA & Audit** - Test all animations (Phase 5)