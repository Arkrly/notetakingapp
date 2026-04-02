# Roadmap: NoteStack

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-22)
- ✅ **v1.1 Build & Test Fixes** — Phases 1-2 (shipped 2026-04-02)
- 🔄 **v1.2 Bug Fixes** — Phases 3-6 (in progress)

## Phases

- [ ] **Phase 3: Security & Authentication Audit** - Fix IDOR vulnerabilities and JWT validation
- [ ] **Phase 4: Backend Data Layer Fixes** - DTOs, fetch joins, exception handling
- [ ] **Phase 5: Frontend Core Stability** - RxJS cleanup, OnPush, 401 handling
- [ ] **Phase 6: Feature-Specific Bug Fixes** - Tag normalization, pin/archive preservation

---

## Phase Details

### Phase 3: Security & Authentication Audit

**Goal**: Users cannot access other users' data; JWT tokens are properly validated

**Depends on**: Nothing (Foundation phase for v1.2)

**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04, SEC-05

**Success Criteria** (what must be TRUE):
  1. User cannot access other users' notes by manipulating note IDs in API requests
  2. User cannot access other users' tags by manipulating tag IDs in API requests
  3. JWT tokens with "none" algorithm are rejected by the backend
  4. Expired JWT tokens are rejected with appropriate error
  5. All note and tag endpoints verify ownership before returning data

**Plans**: 2 plans
- [ ] 03-01-PLAN.md — Fix bulk operations IDOR vulnerability
- [ ] 03-02-PLAN.md — JWT validation tests

---

### Phase 4: Backend Data Layer Fixes

**Goal**: REST endpoints return DTOs; no lazy loading or serialization errors

**Depends on**: Phase 3

**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04

**Success Criteria** (what must be TRUE):
  1. All REST endpoints return DTOs, never JPA entities
  2. Note→Tags relationship uses fetch join to prevent N+1 queries
  3. Global exception handler returns consistent error format for all errors
  4. No LazyInitializationException errors in production logs

**Plans**: TBD

---

### Phase 5: Frontend Core Stability

**Goal**: Frontend components properly manage subscriptions and handle auth errors

**Depends on**: Phase 4

**Requirements**: FRONT-01, FRONT-02, FRONT-03, FRONT-04

**Success Criteria** (what must be TRUE):
1. All RxJS subscriptions use takeUntilDestroyed() or async pipe
2. All components use OnPush change detection strategy
3. HTTP interceptor handles 401 with proper logout flow (redirect to login, clear token)
4. No ExpressionChangedAfterItHasBeenCheckedError in development mode

**Plans**: 2 plans
- [ ] 05-01-PLAN.md — Add OnPush strategy and RxJS cleanup
- [ ] 05-02-PLAN.md — Verify 401 handling and check for CD errors

---

### Phase 6: Feature-Specific Bug Fixes

**Goal**: Tag and note metadata operations work correctly

**Depends on**: Phase 5

**Requirements**: FEAT-01, FEAT-02, FEAT-03, FEAT-04

**Success Criteria** (what must be TRUE):
  1. Tags are normalized to lowercase on save, preventing duplicate tags of different cases
  2. Pin status is preserved when note is updated (not reset to false)
  3. Archive status is preserved when note is updated (not reset to false)
  4. Archived notes are properly filtered out in main queries (show only non-archived by default)

**Plans**: TBD

---

*See archived roadmaps in `.planning/milestones/` for phase details.*