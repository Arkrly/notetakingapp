# Requirements: NoteStack

**Defined:** 2026-03-22
**Core Value:** Users can capture and organize their notes with a clean, responsive interface.

## v1 Requirements

Requirements for milestone v1.1. Each maps to roadmap phases.

### Frontend Tests

- [ ] **TEST-01**: User can run Angular frontend tests with Vitest browser runner
- [ ] **TEST-02**: User can run component-level tests for NotesListComponent
- [ ] **TEST-03**: User can run component-level tests for AuthService
- [ ] **TEST-04**: All frontend tests pass in CI/local environments

### Backend Warnings

- [ ] **BACK-01**: User can run backend without spring.jpa.open-in-view warning
- [ ] **BACK-02**: User can run tests without H2Dialect deprecation warning
- [ ] **BACK-03**: User can use paginated endpoints without PageImpl serialization warnings

### Configuration

- [ ] **CFG-01**: SQL logging is disabled in production environment
- [ ] **CFG-02**: User can configure database settings via environment variables
- [ ] **CFG-03**: User can configure JWT settings via environment variables
- [ ] **CFG-04**: Test profile uses isolated configuration without warnings

## Out of Scope

| Feature | Reason |
|---------|--------|
| JWT secret hardening | Security-focused, different milestone |
| New features | v1.0 shipped, scope is fixes only |
| Performance optimization | Not in scope for bug fix milestone |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TEST-01 | Phase 1 | Pending |
| TEST-02 | Phase 1 | Pending |
| TEST-03 | Phase 1 | Pending |
| TEST-04 | Phase 1 | Pending |
| BACK-01 | Phase 2 | Pending |
| BACK-02 | Phase 2 | Pending |
| BACK-03 | Phase 2 | Pending |
| CFG-01 | Phase 2 | Pending |
| CFG-02 | Phase 2 | Pending |
| CFG-03 | Phase 2 | Pending |
| CFG-04 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 0
- Unmapped: 11 ⚠️

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 after initial definition*
