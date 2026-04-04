---
phase: quick-audit-fixes
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - backend/src/main/resources/application.properties
  - backend/src/main/java/com/backend/config/CorsConfig.java
  - frontend/src/app/app.ts
  - frontend/src/app/app.html
  - frontend/src/app/app.css
  - frontend/src/main.ts
  - frontend/src/app/core/services/note.service.ts
  - frontend/src/environments/environment.prod.ts
  - frontend/src/app/notes/note-form/note-form.component.ts
  - frontend/src/app/notes/note-card/note-card.component.ts
  - frontend/src/app/user/profile/profile.component.ts
  - frontend/src/app/core/services/user.service.ts
  - frontend/src/app/notes/notes-list/notes-list.component.ts
  - frontend/src/app/core/interceptors/error.interceptor.ts
  - frontend/src/app/auth/login/login.component.html
autonomous: false
requirements: []
must_haves:
  truths:
    - "JWT secret is no longer hardcoded in source"
    - "CORS is properly configured without wildcard"
    - "Duplicate root component cleaned up"
    - "bulkDelete sends correct request format"
    - "Production environment points to correct API URL"
    - "Profile component doesn't crash on load"
    - "Error interceptor handles auth 401 correctly"
artifacts:
  - path: "backend/src/main/resources/application.properties"
    provides: "JWT secret config (no hardcoded fallback)"
  - path: "backend/src/main/java/com/backend/config/CorsConfig.java"
    provides: "Removed duplicate CORS config"
  - path: "frontend/src/main.ts"
    provides: "Updated to bootstrap correct component"
  - path: "frontend/src/app/core/services/note.service.ts"
    provides: "Fixed bulkDelete body format"
  - path: "frontend/src/environments/environment.prod.ts"
    provides: "Production API URL"
key_links:
  - from: "application.properties"
    to: "JWT secret"
    via: "environment variable only"
    pattern: "app.jwt.secret=\\$\\{JWT_SECRET:"
---

<objective>
Fix all remaining HIGH, MEDIUM, and LOW priority issues from the audit report. Quick task 1 already fixed CRIT-001, CRIT-002, CRIT-003. This task addresses the remaining 25 issues.
</objective>

<tasks>

<task type="auto">
  <name>task 1: Fix HIGH-001 — Remove hardcoded JWT secret</name>
  <files>backend/src/main/resources/application.properties</files>
  <action>
    Remove the hardcoded JWT secret fallback from application.properties. Change:
    `app.jwt.secret=${JWT_SECRET:cGWQhI6rLabkMlfHacubRsK80aBqdoxJDy+nOU0haSk=}`
    To:
    `app.jwt.secret=${JWT_SECRET}`
    This requires JWT_SECRET to be set as an environment variable, otherwise the app will fail to start (secure by default).
  </action>
  <verify>grep -n "JWT_SECRET" backend/src/main/resources/application.properties</verify>
  <done>application.properties no longer contains hardcoded JWT secret fallback value</done>
</task>

<task type="auto">
  <name>task 2: Fix HIGH-002 — Remove duplicate CORS configuration</name>
  <files>backend/src/main/java/com/backend/config/CorsConfig.java</files>
  <action>
    Delete CorsConfig.java entirely. The CORS configuration should only be in SecurityConfig.java which restricts origins to http://localhost:4200.
  </action>
  <verify>ls backend/src/main/java/com/backend/config/CorsConfig.java 2>&1 | grep -q "No such file" && echo "DELETED" || echo "EXISTS"</verify>
  <done>CorsConfig.java is deleted, CORS only configured in SecurityConfig</done>
</task>

<task type="auto">
  <name>task 3: Fix HIGH-003 — Clean up duplicate root component</name>
  <files>frontend/src/app/app.ts, frontend/src/app/app.html, frontend/src/app/app.css, frontend/src/main.ts</files>
  <action>
    1. Delete app.ts, app.html, and app.css files
    2. Update main.ts to bootstrap AppComponent from './app/app.component' instead of 'App' from './app/app'
  </action>
  <verify>ls frontend/src/app/app.ts frontend/src/app/app.html 2>&1 | grep -q "No such file" && echo "DELETED" || echo "EXISTS"</verify>
  <done>Dead code files deleted, main.ts bootstraps the correct component</done>
</task>

<task type="auto">
  <name>task 4: Fix HIGH-004 — Fix bulkDelete request body format</name>
  <files>frontend/src/app/core/services/note.service.ts</files>
  <action>
    In note.service.ts bulkDelete() method, change from wrapping ids in an object to sending the array directly:
    Change: `this.http.delete<...>(`${this.apiUrl}/bulk`, { body: { ids } })`
    To: `this.http.delete<...>(`${this.apiUrl}/bulk`, { body: ids })`
  </action>
  <verify>grep -n "bulkDelete" frontend/src/app/core/services/note.service.ts</verify>
  <done>bulkDelete sends array directly, not wrapped in {ids}</done>
</task>

<task type="auto">
  <name>task 5: Fix HIGH-006 — Fix production environment URL</name>
  <files>frontend/src/environments/environment.prod.ts</files>
  <action>
    Update environment.prod.ts to use relative URL instead of localhost:
    Change: `apiUrl: 'http://localhost:8080/api/v1'`
    To: `apiUrl: '/api/v1'`
    This allows the production build to make API calls relative to the deployed domain.
  </action>
  <verify>grep "apiUrl" frontend/src/environments/environment.prod.ts</verify>
  <done>Production environment uses relative API URL</done>
</task>

<task type="auto">
  <name>task 6: Fix MEDIUM-001 and MEDIUM-002 — Align color models between form and card</name>
  <files>frontend/src/app/notes/note-form/note-form.component.ts, frontend/src/app/notes/note-card/note-card.component.ts</files>
  <action>
    1. Add 'orange' to NoteFormComponent.colors array and colorMap if missing
    2. Change NoteFormComponent.onSubmit() to send the color NAME instead of hex value. The form should submit 'yellow', 'blue', etc., not '#fef9c3'
    This aligns with NoteCardComponent which expects color names for CSS classes like 'bg-note-yellow'.
  </action>
  <verify>grep -n "orange\|colorMap\|colors" frontend/src/app/notes/note-form/note-form.component.ts | head -20</verify>
  <done>Form sends color names, both components use same color model</done>
</task>

<task type="auto">
  <name>task 7: Fix MEDIUM-006 — Add password change validation</name>
  <files>frontend/src/app/core/services/user.service.ts</files>
  <action>
    In user.service.ts changePassword(), add validation: ensure newPassword is at least 8 characters before sending to backend. The backend should also validate but frontend validation provides better UX.
  </action>
  <verify>grep -n "changePassword" frontend/src/app/core/services/user.service.ts</verify>
  <done>changePassword validates password length before API call</done>
</task>

<task type="auto">
  <name>task 8: Fix MEDIUM-007 — Fix orphan subscription in NotesListComponent</name>
  <files>frontend/src/app/notes/notes-list/notes-list.component.ts</files>
  <action>
    In notes-list.component.ts around line 126 where fetchFromApi().subscribe() is called inside switchMap, refactor to return the Observable instead of subscribing inside:
    Change from:
    `this.fetchFromApi().subscribe(...)`
    To:
    `return this.fetchFromApi()`
    Use switchMap's ability to handle Observables directly rather than subscribing in the chain.
  </action>
  <verify>grep -n "fetchFromApi\|\.subscribe" frontend/src/app/notes/notes-list/notes-list.component.ts</verify>
  <done>No orphan subscriptions, Observables properly chained</done>
</task>

<task type="auto">
  <name>task 9: Fix MEDIUM-009 — Fix takeUntilDestroyed injection context</name>
  <files>frontend/src/app/user/profile/profile.component.ts</files>
  <action>
    In profile.component.ts, move the subscription that uses takeUntilDestroyed() into the constructor, OR inject DestroyRef and pass it:
    Option 1: Inject DestroyRef in constructor and use takeUntilDestroyed(this.destroyRef)
    Option 2: Move the subscription logic into constructor where it's in injection context
  </action>
  <verify>grep -n "takeUntilDestroyed\|DestroyRef" frontend/src/app/user/profile/profile.component.ts</verify>
  <done>Profile component loads without injection context error</done>
</task>

<task type="auto">
  <name>task 10: Fix LOW-007 — Error interceptor auto-logout on auth 401</name>
  <files>frontend/src/app/core/interceptors/error.interceptor.ts</files>
  <action>
    Update error.interceptor.ts to skip auto-logout for authentication endpoints. Before calling logout(), check if the request URL contains '/auth/'. If it's an auth endpoint (login/register), let the component handle the error instead of auto-logging out.
  </action>
  <verify>grep -n "401\|logout\|/auth/" frontend/src/app/core/interceptors/error.interceptor.ts</verify>
  <done>Error interceptor doesn't auto-logout on auth endpoint 401s</done>
</task>

<task type="auto">
  <name>task 11: Fix LOW-001, LOW-002, MEDIUM-004, MEDIUM-005 — Clean up login page dead UI</name>
  <files>frontend/src/app/auth/login/login.component.html</files>
  <action>
    1. LOW-001: Change Terms/Privacy href="#" to actual routes or remove the links
    2. LOW-002: Remove decorative carousel dots that have no content
    3. MEDIUM-004: Remove OAuth (Google/GitHub) buttons that don't work, or add disabled state with tooltip explaining not implemented
    4. MEDIUM-005: Remove 'Forgot password?' link that doesn't work, or add disabled state
  </action>
  <verify>grep -n "href=\"#\"\|OAuth\|Forgot\|carousel" frontend/src/app/auth/login/login.component.html</verify>
  <done>Login page cleaned up - no dead/non-functional UI elements</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>task 12: Verify runtime fixes</name>
  <what-built>Fixed profile component (MEDIUM-009), bulk delete (HIGH-004), color model (MEDIUM-001/002), error interceptor (LOW-007)</what-built>
  <how-to-verify>
    1. Start backend: cd notetakingapp && mvn spring-boot:run
    2. Start frontend: cd frontend && ng serve
    3. Register a new user at /register
    4. Login at /login with correct username/password
    5. Navigate to /notes - verify notes load
    6. Navigate to /profile - verify page loads without crashing
    7. Create a note and verify color selection works (form sends color name)
    8. Try bulk delete if multiple notes exist
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues found</resume-signal>
</task>

</tasks>

<verification>
- [ ] All HIGH priority issues fixed (JWT secret, CORS, duplicate root, bulkDelete, prod URL)
- [ ] All MEDIUM priority issues addressed (colors, subscriptions, profile crash, etc.)
- [ ] LOW priority issues cleaned up (login page dead UI, error interceptor)
- [ ] Runtime verification passed
</verification>

<success_criteria>
- All files listed in frontmatter are modified as specified
- Application starts and login/auth flow works
- No runtime errors on profile page
- bulkDelete works correctly with backend
</success_criteria>

<output>
After completion, create `.planning/quick/2-read-the-audit-folder-and-fix-each-probl/{phase}-{plan}-SUMMARY.md`
</output>
