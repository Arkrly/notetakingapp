# Requirements: NoteStack

**Defined:** 2026-04-02
**Core Value:** Users can capture and organize their notes with a clean, responsive interface.

## v1.2 Requirements

### Security

- [ ] **SEC-01**: User cannot access other users' notes via ID manipulation (IDOR fix)
- [ ] **SEC-02**: User cannot access other users' tags via ID manipulation
- [ ] **SEC-03**: JWT tokens with "none" algorithm are rejected
- [ ] **SEC-04**: JWT token expiration is validated on backend
- [ ] **SEC-05**: All note/tag endpoints verify ownership before returning data

### Data Layer

- [ ] **DATA-01**: All REST endpoints return DTOs, not JPA entities
- [ ] **DATA-02**: Note→Tags relationship uses fetch join to prevent N+1 queries
- [ ] **DATA-03**: Global exception handler returns consistent error format
- [ ] **DATA-04**: No LazyInitializationException errors in production logs

### Frontend Stability

- [ ] **FRONT-01**: All RxJS subscriptions use takeUntilDestroyed() or async pipe
- [ ] **FRONT-02**: Components use OnPush change detection strategy
- [ ] **FRONT-03**: HTTP interceptor handles 401 with proper logout flow
- [ ] **FRONT-04**: No ExpressionChangedAfterItHasBeenCheckedError in dev mode

### Feature Bugs

- [ ] **FEAT-01**: Tags are normalized to lowercase on save (prevents duplicates)
- [ ] **FEAT-02**: Pin status is preserved when note is updated
- [ ] **FEAT-03**: Archive status is preserved when note is updated
- [ ] **FEAT-04**: Archived notes properly filtered in main queries

## Out of Scope

| Feature | Reason |
|---------|--------|
| Concurrent edit conflict resolution | Low priority, v2+ |
| Note sharing between users | Not in core value |
| Advanced search beyond filtering | Deferred to future |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEC-01 | Phase 1 | Pending |
| SEC-02 | Phase 1 | Pending |
| SEC-03 | Phase 1 | Pending |
| SEC-04 | Phase 1 | Pending |
| SEC-05 | Phase 1 | Pending |
| DATA-01 | Phase 2 | Pending |
| DATA-02 | Phase 2 | Pending |
| DATA-03 | Phase 2 | Pending |
| DATA-04 | Phase 2 | Pending |
| FRONT-01 | Phase 3 | Pending |
| FRONT-02 | Phase 3 | Pending |
| FRONT-03 | Phase 3 | Pending |
| FRONT-04 | Phase 3 | Pending |
| FEAT-01 | Phase 4 | Pending |
| FEAT-02 | Phase 4 | Pending |
| FEAT-03 | Phase 4 | Pending |
| FEAT-04 | Phase 4 | Pending |

**Coverage:**
- v1.2 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-02*
*Last updated: 2026-04-02 after research & requirements gathering*