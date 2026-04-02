# Phase 5: Frontend Core Stability - Research

**Gathered:** 2026-04-02
**Status:** Research complete

---

## Technical Context

### Angular Version

- **Angular:** v21.2.x (latest)
- **RxJS:** v7.8.0
- **TypeScript:** Modern (ES2022+)

### Current State Analysis

#### 401 Handling (FRONT-03) ✓ ALREADY IMPLEMENTED

**File:** `error.interceptor.ts`

- ✅ Handles 401 status code
- ✅ Calls `authService.logout()` on 401
- ✅ Shows toast notification: "Session expired. Please login again."
- ✅ Redirects to login via `authService.logout()` → `router.navigate(['/login'])`
- ✅ Clears token from localStorage

**Status:** Requirement FRONT-03 already satisfied. No changes needed.

---

#### OnPush Change Detection (FRONT-02) ✗ NOT IMPLEMENTED

**Current state:**
- **0 components** use `ChangeDetectionStrategy.OnPush`
- All components use default change detection

**Components requiring OnPush:**

1. `AppComponent` - Root component
2. `NotesListComponent` - Main notes display
3. `NoteCardComponent` - Pure presentational (excellent candidate)
4. `NoteFormComponent` - Dialog form
5. `LoginComponent` - Auth form
6. `RegisterComponent` - Auth form
7. `ProfileComponent` - User profile
8. `SidebarComponent` - Navigation sidebar
9. `ConfirmDialogComponent` - Dialog

**Implementation pattern:**

```typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  // ...
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Impact:**
- Reduces unnecessary change detection cycles
- Improves performance, especially in lists with many notes
- Requires explicit change detection triggers (inputs, events, async pipe)
- NoteCardComponent is already pure presentational → zero refactoring needed

---

#### RxJS Subscription Cleanup (FRONT-01) ✗ PARTIALLY IMPLEMENTED

**Current state:**
- **0 components** use `takeUntilDestroyed()`
- **0 manual subscriptions** use cleanup operators
- Some subscriptions use `.subscribe()` without cleanup

**Manual subscriptions found:**

**NotesListComponent:**
- Line 125: `this.fetchFromApi().subscribe()` - called within pipe, no cleanup needed
- Line 160: `this.noteService.getNotes(0, 50).subscribe()` - in refresh() method, no cleanup
- Lines 182, 185, 187, 194, 198, 214: `.subscribe()` in dialog/event handlers - short-lived, fire-and-forget

**ProfileComponent:**
- Line 59: `this.userService.getProfile().subscribe()` - in ngOnInit, no cleanup
- Line 69: `valueChanges.subscribe()` - in ngOnInit, should use takeUntilDestroyed
- Lines 124, 146, 174: `.subscribe()` in event handlers - short-lived

**RegisterComponent:**
- Line 56: `this.authService.register().subscribe()` - in onSubmit, short-lived

**Analysis:**
- Most subscriptions are fire-and-forget (dialog closers, button clicks)
- **One problematic subscription:** `ProfileComponent` line 69 (valueChanges) - should use `takeUntilDestroyed()`
- NotesListComponent uses BehaviorSubject/Observable patterns correctly with async pipe in template

**Recommended fixes:**
1. ProfileComponent: Add `takeUntilDestroyed()` to `passwordForm.get('newPassword')?.valueChanges`
2. Verify all components for similar patterns during implementation

---

#### ExpressionChangedAfterItHasBeenCheckedError (FRONT-04)

**Potential causes:**
- Parent component updating child inputs in lifecycle hooks
- Synchronous data mutations during change detection
- BehaviorSubject/emitter triggering parent updates

**Current code review:**
- NotesListComponent: Complex BehaviorSubject patterns with combineLatest - may trigger issues
- No explicit error handling for this

**Prevention strategy:**
- Add OnPush to all components (reduces CD cycles)
- Use `detectChanges()` or `markForCheck()` when needed
- Test in development mode with `ng serve` (throws by default)

---

## Validation Architecture

### Testing Strategy

**Unit tests:**
- Existing: `auth.service.spec.ts`, `notes-list.component.spec.ts`
- Need to verify tests pass after OnPush changes

**Integration tests:**
- Manual testing of note operations (create, edit, delete)
- Verify 401 handling works end-to-end
- Check for ExpressionChangedAfterItHasBeenCheckedError in dev mode

**Test commands:**
```bash
cd notetakingapp-frontend
npm test                    # Run unit tests
npm run build              # Production build check
ng serve                   # Dev mode - catches CD errors
```

### Verification Checklist

**FRONT-01 (RxJS cleanup):**
- [ ] All manual subscriptions use `takeUntilDestroyed()` or are fire-and-forget
- [ ] Run `grep -r "\.subscribe(" src --include="*.ts"` to verify
- [ ] Test: Component destruction doesn't leak subscriptions

**FRONT-02 (OnPush):**
- [ ] All 9 components have `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] App compiles and runs
- [ ] Note list updates correctly on changes
- [ ] Forms work (login, register, note form)

**FRONT-03 (401 handling):**
- [ ] Already implemented - verify works end-to-end
- [ ] Test: Expired token → logout + redirect to login

**FRONT-04 (No CD errors):**
- [ ] Run `ng serve` (dev mode)
- [ ] Perform all user flows (login, create note, edit, delete)
- [ ] Check console for ExpressionChangedAfterItHasBeenCheckedError

---

## Implementation Approach

### Phase 1: OnPush Strategy (Low Risk)

**Files to modify:**
1. `app.component.ts`
2. `notes-list/notes-list.component.ts`
3. `note-card/note-card.component.ts`
4. `note-form/note-form.component.ts`
5. `auth/login/login.component.ts`
6. `auth/register/register.component.ts`
7. `user/profile/profile.component.ts`
8. `shared/sidebar/sidebar.component.ts`
9. `shared/confirm-dialog/confirm-dialog.component.ts`

**Each file:**
- Add `ChangeDetectionStrategy` import
- Add `changeDetection: ChangeDetectionStrategy.OnPush` to `@Component` decorator
- Verify inputs are immutable or use async pipe

**Estimated effort:** 15 minutes (simple additions)

---

### Phase 2: RxJS Cleanup (Medium Risk)

**Files to modify:**
1. `user/profile/profile.component.ts` - Add `takeUntilDestroyed()` to valueChanges

**Pattern:**
```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// In ngOnInit or constructor:
this.passwordForm.get('newPassword')?.valueChanges.pipe(
  takeUntilDestroyed()
).subscribe(val => {
  this.calculateStrength(val);
});
```

**Verification:**
- Run `grep -r "\.subscribe(" src --include="*.ts"` to audit remaining subscriptions
- Verify each is either fire-and-forget or uses cleanup

**Estimated effort:** 10 minutes

---

### Phase 3: Testing & Verification (High Value)

**Manual testing flow:**
1. `npm test` - Verify all unit tests pass
2. `ng serve` - Start dev server
3. Login flow - Test authentication
4. Note operations - Create, edit, delete, pin, archive
5. Logout flow - Verify 401 handling
6. Check console - No CD errors

**Automated verification:**
```bash
# Build check
npm run build

# Unit tests
npm test

# Lint (if configured)
npm run lint
```

**Estimated effort:** 20 minutes

---

## Risk Assessment

| Change | Risk | Mitigation |
|--------|------|------------|
| Add OnPush to all components | Low | Most components are simple, NoteCardComponent is pure |
| Add takeUntilDestroyed to ProfileComponent | Very Low | Single subscription, isolated change |
| Verify 401 handling works | None | Already implemented, just testing |
| Check for CD errors | Medium | Requires full manual test flow |

**Overall risk:** **LOW**

- Changes are minimal and localized
- No architectural changes
- Existing code is well-structured
- Angular 21 has mature change detection

---

## Common Pitfalls to Avoid

1. **Forgetting to add import:** `import { ChangeDetectionStrategy } from '@angular/core';`
2. **Breaking input bindings:** OnPush requires immutable inputs or async pipe
3. **Missing takeUntilDestroyed import:** `import { takeUntilDestroyed } from '@angular/core/rxjs-interop';`
4. **Over-engineering cleanup:** Fire-and-forget subscriptions don't need cleanup
5. **Testing only happy path:** Dev mode catches CD errors, always test in dev

---

## Out of Scope

**Deferred to future milestone:**
- HttpOnly cookie token storage (requires backend changes)
- WebSocket/real-time subscriptions (not used)
- Complex state management (NgRx/NGXS) - not needed

**Not applicable:**
- Server-side rendering (SSR) concerns
- Progressive Web App (PWA) considerations
- Internationalization (i18n) integration

---

## References

- Angular Change Detection: https://angular.io/guide/change-detection
- RxJS takeUntilDestroyed: https://angular.io/guide/rx-operators#takeuntildestroyed
- Angular OnPush Strategy: https://angular.io/guide/change-detection-skipping-subtree

---

## Summary

**Phase 5 is straightforward:**
- **FRONT-01:** Minimal work - one subscription needs cleanup
- **FRONT-02:** Mechanical work - add OnPush to 9 components
- **FRONT-03:** Already done - verify works
- **FRONT-04:** Testing - dev mode verification

**Total implementation time:** ~45 minutes (excluding planning/verification)

**Dependencies:** Phase 4 must be complete (backend data layer stable)

**Blocking issues:** None identified

---

*Research completed: 2026-04-02*
