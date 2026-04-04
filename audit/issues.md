# 🔍 NoteStack — Full-Stack Audit Report

**Date:** 2026-04-03  
**Auditor:** Automated Code & Architecture Audit  
**Application:** NoteStack (Note-Taking Application)  
**Stack:** Angular 21 + Spring Boot 3.3.6 + PostgreSQL 16 (currently H2 in-memory)

---

## Executive Summary

| Metric | Count |
|--------|-------|
| **Total Issues Found** | 22 |
| 🔴 **Critical** | 3 |
| 🟠 **High** | 6 |
| 🟡 **Medium** | 9 |
| 🔵 **Low** | 10 |
| **Pages Scanned** | 6 routes |
| **API Endpoints Audited** | 15 |
| **Source Files Analyzed** | 45+ |

> ⚠️ **The application has critical authentication bugs — login does not work at all.** The login form neither calls the API nor sends the correct field names. Users cannot authenticate.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  FRONTEND (Angular 21 — Port 4200)              │
│  ┌───────┐ ┌──────────┐ ┌────────────────────┐  │
│  │ Login │ │ Register │ │ Notes Dashboard    │  │
│  └───┬───┘ └────┬─────┘ │ ┌──────┐ ┌──────┐ │  │
│      │          │        │ │NCards│ │NForm │ │  │
│      │          │        │ └──────┘ └──────┘ │  │
│      │          │        └────────────────────┘  │
│  ┌───┴──────────┴─────────────┐ ┌────────────┐  │
│  │ AuthService + Interceptors │ │ NoteService│  │
│  └────────────┬───────────────┘ └─────┬──────┘  │
└───────────────┼───────────────────────┼──────────┘
                │ HTTP + JWT            │
┌───────────────┼───────────────────────┼──────────┐
│  BACKEND (Spring Boot 3.3.6 — Port 8080)        │
│  ┌────────────┴───────────────────────┴────────┐ │
│  │ JwtFilter → SecurityFilterChain             │ │
│  └─────────────────────┬───────────────────────┘ │
│  ┌──────────┐ ┌────────┴───┐ ┌──────────────┐   │
│  │AuthCtrl  │ │ NoteCtrl   │ │ UserCtrl     │   │
│  └────┬─────┘ └──────┬─────┘ └──────┬───────┘   │
│  ┌────┴─────┐ ┌──────┴─────┐ ┌──────┴───────┐   │
│  │AuthSvcI  │ │ NoteSvcI   │ │ UserSvcI     │   │
│  └────┬─────┘ └──────┬─────┘ └──────┬───────┘   │
│  ┌────┴──────────────┴───────────────┴───────┐   │
│  │         JPA Repositories (H2 DB)          │   │
│  └───────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

---

## Route → Component → API Mapping

| Route | Component | Guard | API Dependencies |
|-------|-----------|-------|-----------------|
| `/` | Redirect → `/notes` | — | — |
| `/login` | `LoginComponent` | — | ❌ **Does NOT call** `POST /auth/login` |
| `/register` | `RegisterComponent` | — | `POST /auth/register` |
| `/notes` | `NotesListComponent` | `authGuard` | `GET /notes?page=0&size=50` |
| `/notes/:filter` | `NotesListComponent` | `authGuard` | ❌ **:filter param unused** — always calls `GET /notes` |
| `/profile` | `ProfileComponent` | `authGuard` | `GET /users/me`, `PUT /users/me`, `PATCH /users/me/password`, `DELETE /users/me` |
| `/**` | Redirect → `/notes` | — | — |

---

## 🔴 CRITICAL Issues (3)

### CRIT-001: Login does NOT call AuthService — fake authentication

**Files:** [`login.component.ts`](file:///home/arkrly/Work/backend/frontend/src/app/auth/login/login.component.ts#L35-L44)

```typescript
// BROKEN: Uses setTimeout instead of AuthService.login()
onSubmit() {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.loginError = '';
    
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/notes']); // ← Navigates without auth!
    }, 1000);
  }
}
```

**Impact:** The login component never calls `AuthService.login()`. No JWT token is stored in localStorage. All subsequent API calls to protected endpoints fail with 401. **The entire authentication flow is broken.**

**Fix:** Inject `AuthService`, call `this.authService.login(email, password).subscribe(...)`, and navigate only on success.

---

### CRIT-002: Login form field mismatch — frontend sends 'email', backend expects 'username'

**Files:** [`login.component.html`](file:///home/arkrly/Work/backend/frontend/src/app/auth/login/login.component.html#L57-L64), [`LoginRequest.java`](file:///home/arkrly/Work/backend/backend/src/main/java/com/backend/dto/request/LoginRequest.java), [`UserDetailsServiceImpl.java`](file:///home/arkrly/Work/backend/backend/src/main/java/com/backend/security/UserDetailsServiceImpl.java)

The login form collects `email` with email validation. The backend `LoginRequest` has a `username` field. `UserDetailsServiceImpl.loadUserByUsername()` queries by username, NOT email. Even after fixing CRIT-001, login will fail because:

```
Frontend sends: { "email": "john@example.com", "password": "..." }
Backend expects: { "username": "john_doe", "password": "..." }
```

**Fix:** Change the login form to collect `username` instead of `email`, or modify the backend to accept email-based login.

---

### CRIT-003: Register form 'Full Name' field conflicts with backend 'username' validation

**Files:** [`register.component.ts`](file:///home/arkrly/Work/backend/frontend/src/app/auth/register/register.component.ts#L39-L44), [`RegisterRequest.java`](file:///home/arkrly/Work/backend/backend/src/main/java/com/backend/dto/request/RegisterRequest.java#L18-L21)

```typescript
// Frontend: field labeled "Full Name"
registerForm = this.fb.group({
  fullName: ['', Validators.required],  // ← "Full Name" label misleads users
  ...
});
// Sent as: { username: "John Doe", ... }
```

```java
// Backend: rejects spaces in username
@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
private String username;
```

**Impact:** Users entering "John Doe" as their full name get a validation error.

**Fix:** Rename the field to `username` with appropriate labeling, add frontend regex validation matching the backend.

---

## 🟠 HIGH Issues (6)

### HIGH-001: Hardcoded JWT secret in source control

**File:** [`application.properties`](file:///home/arkrly/Work/backend/backend/src/main/resources/application.properties#L23)

```properties
app.jwt.secret=${JWT_SECRET:cGWQhI6rLabkMlfHacubRsK80aBqdoxJDy+nOU0haSk=}
```

The JWT signing key is hardcoded as a fallback default and committed to Git. Any attacker with repo access can forge tokens.

**Fix:** Remove the default value. Require `JWT_SECRET` as a mandatory environment variable.

---

### HIGH-002: CORS wildcard overrides SecurityConfig restrictions

**Files:** [`CorsConfig.java`](file:///home/arkrly/Work/backend/backend/src/main/java/com/backend/config/CorsConfig.java#L18), [`SecurityConfig.java`](file:///home/arkrly/Work/backend/backend/src/main/java/com/backend/config/SecurityConfig.java#L60-L71)

Two CORS configurations exist with conflicting rules:

| Config | Allowed Origins |
|--------|----------------|
| `CorsConfig.java` | `*` (ALL origins) |
| `SecurityConfig.java` | `http://localhost:4200` only |

The `CorsFilter` bean likely takes precedence, effectively allowing all origins with credentials.

**Fix:** Delete `CorsConfig.java`. Use only `SecurityConfig.corsConfigurationSource()`.

---

### HIGH-003: Duplicate root component — dead code confusion

**Files:** [`app.ts`](file:///home/arkrly/Work/backend/frontend/src/app/app.ts) (active), [`app.component.ts`](file:///home/arkrly/Work/backend/frontend/src/app/app.component.ts) (dead), [`app.html`](file:///home/arkrly/Work/backend/frontend/src/app/app.html) (dead — 345 lines of Angular placeholder)

`main.ts` bootstraps `App` from `app.ts`, while `AppComponent` from `app.component.ts` is never used. The 345-line `app.html` is Angular CLI scaffold placeholder content that's never rendered.

**Fix:** Delete `app.ts`, `app.html`, `app.css`. Update `main.ts` to bootstrap `AppComponent`.

---

### HIGH-004: Frontend bulkDelete sends wrong request body format

**File:** [`note.service.ts`](file:///home/arkrly/Work/backend/frontend/src/app/core/services/note.service.ts#L82-L84)

```diff
- return this.http.delete<...>(`${this.apiUrl}/bulk`, { body: { ids } });
+ return this.http.delete<...>(`${this.apiUrl}/bulk`, { body: ids });
```

Backend expects `List<UUID>` directly, frontend wraps it in `{ ids: [...] }`.

---

### HIGH-005: Flyway disabled with Hibernate ddl-auto=update

**File:** [`application.properties`](file:///home/arkrly/Work/backend/backend/src/main/resources/application.properties#L11-L18)

Hibernate auto-manages schema. Dangerous in production — silent schema changes, potential data loss.

---

### HIGH-006: Production environment points to localhost

**File:** [`environment.prod.ts`](file:///home/arkrly/Work/backend/frontend/src/environments/environment.prod.ts)

```typescript
apiUrl: 'http://localhost:8080/api/v1'  // ← Same as dev!
```

---

## 🟡 MEDIUM Issues (9)

| ID | Title | File(s) |
|----|-------|---------|
| MED-001 | NoteForm missing 'orange' color but NoteCard supports it | `note-form.component.ts`, `note-card.component.ts` |
| MED-002 | NoteForm sends hex colors but NoteCard expects color names | `note-form.component.ts`, `note-card.component.ts` |
| MED-003 | API docs show tags as array but implementation uses string | `API.md`, `Note.java` |
| MED-004 | OAuth buttons (Google/GitHub) are non-functional | `login.component.html` |
| MED-005 | "Forgot password?" link is non-functional | `login.component.html` |
| MED-006 | Password change endpoint has no validation (uses raw Map) | `UserController.java` |
| MED-007 | Orphan `.subscribe()` in switchMap causes memory leaks | `notes-list.component.ts:126` |
| MED-008 | Database switched to H2 in-memory — data lost on restart | `application.properties` |
| MED-009 | `takeUntilDestroyed()` used outside injection context — runtime crash | `profile.component.ts:72` |

---

## 🔵 LOW Issues (10)

| ID | Title | File(s) |
|----|-------|---------|
| LOW-001 | Terms/Privacy links are placeholder `href="#"` | `login.component.html` |
| LOW-002 | Carousel dots have no carousel content | `login.component.ts` |
| LOW-003 | No virtual scrolling for 50-note lists | `notes-list.component.ts` |
| LOW-004 | localStorage cache has no TTL and is not user-scoped | `notes-list.component.ts` |
| LOW-005 | IDOR timing attack via 404 vs 403 differentiation | `NoteServiceImpl.java` |
| LOW-006 | JWT parsed 3 times per request (performance) | `JwtFilter.java`, `JwtUtils.java` |
| LOW-007 | Error interceptor auto-logouts on login 401 | `error.interceptor.ts` |
| LOW-008 | Actuator health exposes internal details publicly | `application.properties` |
| LOW-009 | `:filter` route parameter is never consumed | `app.routes.ts`, `notes-list.component.ts` |
| LOW-010 | getPinnedNotes/getArchivedNotes return wrong types | `note.service.ts` |

---

## API Health Assessment

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/v1/auth/register` | POST | ⚠️ Works but mismatched field labels | Frontend sends `fullName` as `username` |
| `/api/v1/auth/login` | POST | ❌ BROKEN | Frontend never calls this endpoint |
| `/api/v1/notes` | GET | ✅ Works | Paginated, properly secured |
| `/api/v1/notes/{id}` | GET | ⚠️ IDOR risk | 404 vs 403 reveals existence |
| `/api/v1/notes` | POST | ⚠️ Color mismatch | Hex vs name inconsistency |
| `/api/v1/notes/{id}` | PUT | ✅ Works | Proper ownership check |
| `/api/v1/notes/{id}` | PATCH | ✅ Works | Proper ownership check |
| `/api/v1/notes/{id}` | DELETE | ✅ Works | Proper ownership check |
| `/api/v1/notes/bulk` | DELETE | ❌ BROKEN | Request body format mismatch |
| `/api/v1/notes/search` | GET | ✅ Works | Input length validated |
| `/api/v1/notes/pinned` | GET | ⚠️ Type mismatch | Frontend expects array, gets Page |
| `/api/v1/notes/archived` | GET | ⚠️ Type mismatch | Frontend expects array, gets Page |
| `/api/v1/users/me` | GET | ✅ Works | |
| `/api/v1/users/me` | PUT | ✅ Works | |
| `/api/v1/users/me/password` | PATCH | ⚠️ No validation | Raw Map, no @Valid |

---

## Performance Notes

| Concern | Impact | Location |
|---------|--------|----------|
| No lazy loading of routes | All components bundled together | `app.routes.ts` |
| Triple JWT parsing per request | CPU overhead on every API call | `JwtFilter.java` |
| 50 notes loaded without pagination | DOM bloat, animation jank | `notes-list.component.ts` |
| No CDK virtual scroll | Full DOM render for all cards | `notes-list.component.html` |
| localStorage sync JSON.stringify comparison | O(n) per refresh | `notes-list.component.ts:85` |
| `framer-motion` imported but seemingly unused | Bundle size bloat | `package.json` |

---

## Prioritized Action Plan

### 🔴 P0 — Fix Immediately (Authentication is completely broken)

1. **Fix login component** (CRIT-001 + CRIT-002)
   - Inject `AuthService` into `LoginComponent`
   - Change form field from `email` to `username` (or update backend to accept email login)
   - Call `this.authService.login(username, password).subscribe(...)` in `onSubmit()`
   - Navigate on success, show error on failure
   - **Files:** `login.component.ts`, `login.component.html`

2. **Fix register form field naming** (CRIT-003)
   - Rename `fullName` → `username`
   - Update label from "Full Name" to "Username"
   - Add regex validation: `^[a-zA-Z0-9_]+$`
   - **File:** `register.component.ts`

### 🟠 P1 — Fix Before Any Deployment

3. **Remove hardcoded JWT secret** (HIGH-001) → `application.properties`
4. **Delete duplicate CORS config** (HIGH-002) → Delete `CorsConfig.java`
5. **Clean up dead app root** (HIGH-003) → Delete `app.ts`, `app.html`, `app.css`; update `main.ts`
6. **Fix bulkDelete body format** (HIGH-004) → `note.service.ts`
7. **Fix production environment URL** (HIGH-006) → `environment.prod.ts`
8. **Fix takeUntilDestroyed crash** (MED-009) → `profile.component.ts`

### 🟡 P2 — Fix Soon (Data integrity & UX)

9. **Fix color model mismatch** (MED-001 + MED-002) → Align form/card color representations
10. **Fix route :filter param** (LOW-009) → Implement filtered views
11. **Fix type mismatches** (LOW-010) → Correct return types in note.service.ts
12. **Fix error interceptor login 401** (LOW-007) → Skip logout for auth endpoints
13. **Add password change validation** (MED-006) → Create proper DTO
14. **Remove or implement OAuth** (MED-004) → Clean up login page
15. **Fix orphan subscriptions** (MED-007) → Add proper cleanup

### 🔵 P3 — Improve Later

16. Add pagination/virtual scroll (LOW-003)
17. Scope localStorage cache per user (LOW-004)
18. Fix IDOR enumeration (LOW-005)
19. Optimize JWT parsing (LOW-006)
20. Secure actuator endpoints (LOW-008)
21. Enable Flyway migrations (HIGH-005)
22. Update API documentation (MED-003)

---

*This audit covers code-level analysis of the full stack. Runtime testing was limited due to environment constraints. All issues are derived from source code analysis and architectural review.*
