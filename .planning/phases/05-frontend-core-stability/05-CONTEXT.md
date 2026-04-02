# Phase 5: Frontend Core Stability - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Frontend components properly manage subscriptions and handle auth errors. No change detection errors or memory leaks.

</domain>

<decisions>
## Implementation Decisions

### OnPush Change Detection
- Add `changeDetection: ChangeDetectionStrategy.OnPush` to all components
- Applies to: NotesListComponent, NoteCardComponent, NoteFormComponent, LoginComponent, RegisterComponent, etc.

### RxJS Subscription Cleanup
- Verify all components for manual `.subscribe()` calls
- Add `takeUntilDestroyed()` or use `async` pipe patterns where applicable
- Focus on NotesListComponent (complex BehaviorSubject patterns)

### Token Storage
- **Defer to future milestone** - HttpOnly cookies require backend changes
- Leave localStorage token storage as-is for now

### 401 Handling
- Already implemented in error.interceptor.ts - calls authService.logout()
- No changes needed

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- errorInterceptor: already handles 401 with logout() + toast notification
- AuthService: getToken(), isLoggedIn(), logout() methods exist
- NoteCardComponent: pure presentational component - good candidate for OnPush

### Integration Points
- Router navigation after logout: this.router.navigate(['/login'])
- Cache operations: localStorage notes_cache for offline support

</code_context>

<specifics>
## Specific Ideas

- Add OnPush to ALL components in the app
- Verify manual subscriptions in components - add takeUntilDestroyed where needed

</specifics>

<deferred>
## Deferred Ideas

- HttpOnly cookie token storage - requires backend changes, defer to security-focused milestone

</deferred>

---

*Phase: 05-frontend-core-stability*
*Context gathered: 2026-04-02*