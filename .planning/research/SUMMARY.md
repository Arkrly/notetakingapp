# Project Research Summary

**Project:** NoteStack (Note-Taking Application)
**Domain:** Full-stack Spring Boot + Angular 21 with JWT Authentication
**Researched:** 2026-04-02
**Confidence:** MEDIUM-HIGH

## Executive Summary

This research synthesizes common bug patterns and architectural pitfalls in a Spring Boot 3.3.6 + Angular 21 full-stack application with JWT authentication. The application is a note-taking app supporting CRUD operations, tags, colors, pin/archive features, and user authentication.

**Key Finding:** The most dangerous bug areas are authentication/authorization (IDOR vulnerabilities, JWT handling) and JPA entity serialization (LazyInitializationException). These can cause security vulnerabilities or complete runtime failures.

**Recommended Approach:** For the v1.2 bug fixes milestone, prioritize:
1. Backend security and ownership verification (IDOR prevention + JWT validation)
2. Transaction and lazy-loading fixes in the data layer
3. Frontend subscription cleanup and change detection strategy

**Key Risks:**
- Returning JPA entities directly from REST controllers causes serialization failures
- JWT token race conditions cause infinite loops without proper interceptor design
- CORS misconfiguration blocks authenticated requests

---

## Key Findings

### Recommended Stack

**Backend Debugging Tools:**
- `--debug` flag + `spring.main.log-startup-info=false` for startup debugging
- JUnit + `@SpringBootTest` for integration testing
- `logging.level.org.hibernate.SQL=DEBUG` for query analysis
- H2 Console for test database inspection

**Frontend Debugging Tools:**
- Angular DevTools for component tree/change detection inspection
- RxJS DevTools for observable visualization
- Vitest browser runner for test debugging

**Common Bug Patterns (STACK.md):**

| Backend | Frontend |
|---------|----------|
| Transaction rollback failures (checked exceptions) | ExpressionChangedAfterItHasBeenCheckedError |
| N+1 query problems (lazy loading) | RxJS memory leaks |
| CORS + Spring Security misconfiguration | JWT token refresh race conditions |
| Jackson serialization with JPA entities | Change detection performance issues |

### Expected Features

**Must have (Security & Core Functionality):**
- JWT token validation with proper expiration check
- Object-level authorization (IDOR prevention for all note operations)
- Backend input validation on all DTOs
- Ownership verification on every API endpoint

**Should have (Feature Bugs to Fix):**
- Tag case normalization (avoid duplicates)
- Pin/archive status preservation on note updates
- Proper archived flag filtering in queries

**Defer (v2+):**
- Concurrent edit conflict resolution
- Advanced search capabilities beyond basic filtering
- Note sharing between users

### Architecture Approach

**High-Risk Zones:**
1. **Authentication & Authorization Flow** — CORS config, JWT filter chain, token interceptor
2. **JPA Entity Relationships** — LazyInitializationException, N+1 queries, missing fetch joins
3. **Exception Handling** — Inconsistent error formats, missing global handler

**Medium-Risk Zones:**
4. **Frontend State Management** — RxJS subscription memory leaks
5. **API Contract Mismatch** — Date formats, DTO vs entity field differences
6. **Transaction Management** — Silent rollbacks from caught exceptions

### Critical Pitfalls

1. **LazyInitializationException** — Return entities from REST controllers after transaction closes. Avoid by using DTOs or `@EntityGraph` with fetch joins.

2. **CORS Blocking Authenticated Requests** — Preflight passes but actual requests fail. Must configure `allowCredentials(true)` with explicit origins (not `*`).

3. **JWT Token Race Conditions** — Multiple 401s trigger multiple.refresh calls, retry without updating header. Use `isRefreshing` flag with BehaviorSubject queue.

4. **RxJS Subscription Memory Leaks** — Components never unsubscribe. Use `async` pipe or `takeUntilDestroyed()`.

5. **Angular Change Detection Errors** — Template mutates during check cycle. Use signals or ensure immutability.

---

## Implications for Roadmap

Based on research, suggested phase structure for v1.2 milestone:

### Phase 1: Security & Authentication Audit
**Rationale:** Security vulnerabilities (IDOR, JWT bypass) are critical and must be fixed first. No amount of frontend polish matters if users can access other users' notes.

**Delivers:**
- Ownership verification on all note/tag endpoints
- JWT algorithm validation (reject "none" algorithm)
- Token expiration check on backend

**Avoids:** IDOR vulnerabilities, JWT bypass attacks

**Research Flags:** NONE — security patterns well-documented, no research-phase needed

---

### Phase 2: Backend Data Layer Fixes
**Rationale:** JPA serialization issues cause runtime crashes. Must fix before frontend work to avoid wasted integration effort.

**Delivers:**
- DTO layer for all REST responses
- Entity graphs or fetch joins for Note→Tags relationship
- Global exception handler with consistent error format

**Avoids:** LazyInitializationException, serialization failures in production

---

### Phase 3: Frontend Core Stability
**Rationale:** Must have clean foundation before adding features. Memory leaks and change detection issues degrade UX over time.

**Delivers:**
- RxJS subscription cleanup in all components (use `takeUntilDestroyed()`)
- Change detection strategy set to `OnPush`
- HttpInterceptor for 401 handling with proper logout flow

**Avoids:** Memory leaks, change detection errors, infinite auth loops

---

### Phase 4: Feature-Specific Bug Fixes
**Rationale:** Core infrastructure is now stable. Can safely address pin/archive and tag logic.

**Delivers:**
- Tag case normalization (lowercase on save)
- Pin/archive status preserved on note updates
- Archived notes excluded from main queries with proper WHERE clause

**Addresses:** FEATURES.md bug patterns for CRUD, tags, pin/archive

---

### Phase Ordering Rationale

1. **Security first** — IDOR allows data breach; must verify ownership on backend before any feature work
2. **Data layer second** — Serialization crashes block all API responses; fixing early prevents integration pain
3. **Frontend stability third** — Memory leaks are subtle but accumulate; fix before feature work
4. **Features last** — All infrastructure must be stable; tag duplication and pin persistence depend on clean data layer

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Debugging tools from official docs + verified community patterns |
| Features | MEDIUM-HIGH | Bug patterns from actual note-taking app issues (Joplin, Blinko) + OWASP guidelines |
| Architecture | MEDIUM-HIGH | Common patterns from multiple 2025-2026 articles, verified via CodeSearch |
| Pitfalls | MEDIUM | 6 critical pitfalls from community + official docs; recovery strategies validated |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Token storage method:** Research didn't confirm NoteStack uses localStorage vs HttpOnly cookies. If HttpOnly, JWT refresh race conditions handled differently. **Check auth implementation early.**

- **DTO usage confirmation:** v1.1 "partially addressed" PageImpl serialization. Need to verify full DTO migration status during Phase 2.

- **Angular version specifics:** Research covers Angular 21 trends but some patterns (e.g., signals vs BehaviorSubject) may vary. **Validate during Phase 3.**

---

## Sources

### Primary (HIGH confidence)
- Spring Boot 3.x Documentation — Transaction management, CORS, JPA entity graphs
- Angular 21 HTTP Client Documentation — Interceptors, change detection
- OWASP API Security Top 10 (2024-2025) — IDOR prevention

### Secondary (MEDIUM confidence)
- Dev.to & Medium articles (2025-2026) — Spring Boot @Transactional bugs
- StackOverflow discussions — RxJS memory leak patterns, JWT race conditions
- Joplin/Blinko GitHub Issues — Real-world note app bug reports

### Tertiary (LOW confidence)
- CodeSearch queries — Used for verification, patterns consistent across sources

---

*Research completed: 2026-04-02*
*Ready for roadmap: yes*