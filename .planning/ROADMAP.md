# Roadmap: NoteStack — v1.1 Build & Test Fixes

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-22)
- 🚧 **v1.1 Build & Test Fixes** — Phases 1-2 (in progress)

## Phase Summary

- [ ] **Phase 1: Frontend Test Infrastructure** — Install Vitest browser runner, configure test bed, create component tests
- [ ] **Phase 2: Backend Configuration & Warnings** — Fix JPA warnings, H2Dialect, PageImpl serialization, environment config

## Phase Details

### Phase 1: Frontend Test Infrastructure

**Goal**: Frontend tests execute successfully with proper test runner configuration

**Depends on**: Nothing (first phase of this milestone)

**Requirements**: TEST-01, TEST-02, TEST-03, TEST-04

**Success Criteria** (what must be TRUE):
1. User can install Vitest browser runner package without errors
2. User can run Angular tests and see tests execute in browser mode
3. User can run component-level tests for NotesListComponent
4. User can run component-level tests for AuthService
5. All frontend tests pass in CI/local environments

**Plans**: 1 plan

Plans:
- [ ] 01-PLAN.md — Configure Vitest browser runner and create component tests

---

### Phase 2: Backend Configuration & Warnings

**Goal**: Backend runs without warnings and has proper environment configuration

**Depends on**: Phase 1

**Requirements**: BACK-01, BACK-02, BACK-03, CFG-01, CFG-02, CFG-03, CFG-04

**Success Criteria** (what must be TRUE):
1. User runs backend without spring.jpa.open-in-view warning in logs
2. User runs tests without H2Dialect deprecation warning
3. User accesses paginated endpoints without PageImpl serialization warnings
4. User sees no SQL queries logged in production environment
5. User can configure database settings via environment variables
6. User can configure JWT settings via environment variables
7. Test profile runs with isolated configuration and no warnings

**Plans**: TBD

---

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Frontend Test Infrastructure | v1.1 | 0/1 | Planned | - |
| 2. Backend Configuration & Warnings | v1.1 | 0/TBD | Not started | - |
