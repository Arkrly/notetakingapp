# Visual Fix Plan

## Critical Issues to Fix

### 1. Login Page Theme Mismatch (login.component.css)
**File:** `src/app/auth/login/login.component.css`

**Changes needed:**
- Line 120: Change `background: linear-gradient(135deg, #0D9488 0%, #134E4A 100%);` 
  TO: `background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);` (indigo/violet)
- Line 254: Change `.main-heading .line.accent { color: #F97316; }` 
  TO: `.main-heading .line.accent { color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }`
- Line 428: Add `placeholder:text-slate-500` class to input placeholders

### 2. Register Page Theme Mismatch (register.component.css)
**File:** `src/app/auth/register/register.component.css`

**Changes needed:**
- Line 111: Change `background: linear-gradient(135deg, #0D9488 0%, #134E4A 100%);` 
  TO: `background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);`
- Line 245: Change `.main-heading .line.accent { color: #F97316; }` 
  TO: `.main-heading .line.accent { color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }`
- Line 400: Add `placeholder:text-slate-500` to input placeholders

### 3. Note Modal Placeholder Contrast (note-form.component.css)
**File:** `src/app/notes/note-form/note-form.component.css`

**Changes needed:**
- Line 91: Change `.note-title-input::placeholder { color: #cbd5e1; }` 
  TO: `color: #64748b;`
- Line 109: Change `.note-content-input::placeholder { color: #cbd5e1; }` 
  TO: `color: #64748b;`

### 4. Save Note Button Contrast (note-form.component.css)
**File:** `src/app/notes/note-form/note-form.component.css`

**Changes needed:**
- Lines 221-231: Change button background
  FROM: `background: linear-gradient(135deg, #6366f1, #8b5cf6);`
  TO: `background: linear-gradient(135deg, #4f46e5, #7c3aed);` (darker indigo)
- Add: `text-shadow: 0 1px 2px rgba(0,0,0,0.1);` for better text readability

### 5. Profile Page - Add Loading State (profile.component.html)
**File:** `src/app/user/profile/profile.component.html`

**Add after line 4:**
```html
<!-- Loading State -->
<div *ngIf="!user" class="min-h-screen flex flex-col items-center justify-center">
  <div class="relative">
    <div class="w-12 h-12 border-4 border-indigo-100 rounded-full"></div>
    <div class="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
  </div>
  <p class="text-slate-500 text-sm mt-4 font-medium">Loading profile...</p>
</div>
```

### 6. Global Styles Enhancement (styles.css)
**File:** `src/styles.css`

**Add after line 109:**
```css
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Better font rendering */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Remove default focus outline, add custom */
*:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Consistent transitions on interactive elements */
button, a, input, [role="button"] {
  transition: all 150ms ease;
}
```

### 7. Route Animations (app.component.ts)
**File:** `src/app/app.component.ts`

**Replace entire file with:**
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div [@routeFade]="router.url">
      <router-outlet />
    </div>
  `,
  animations: [
    trigger('routeFade', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(12px)' }),
          animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true })
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'notetakingapp-frontend';
  constructor(public router: Router) {}
}
```

### 8. Note Card Hover Effects (note-card.component.css)
**File:** `src/app/notes/note-card/note-card.component.css`

**Add to card container:**
```css
.note-card {
  transition: all 200ms ease;
}

.note-card:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}
```

## Implementation Priority
1. Fix login/register theme (Critical)
2. Fix modal placeholder contrast (Critical)
3. Fix Save Note button contrast (Major)
4. Add profile loading state (Critical)
5. Add global styles (Major)
6. Add route animations (Medium)
7. Add hover effects (Medium)

## Verification Steps
After each fix, verify:
- Colors match between auth and dashboard
- Text contrast passes WCAG AA (4.5:1 ratio)
- Animations work smoothly
- Mobile responsive layout intact
