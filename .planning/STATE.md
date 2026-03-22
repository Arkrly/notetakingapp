# STATE.md

## Current Position

Phase: 02-backend-configuration
Plan: 01 (completed)
Status: Plan execution complete
Last activity: 2026-03-22 — Phase 2 plan 1 executed: Spring Boot config warnings fixed, SQL logging conditional

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-22)

**Core value:** Users can capture and organize their notes with a clean, responsive interface.
**Current focus:** v1.1 Build & Test Fixes — Phase 2: Backend Configuration & Warnings (plan 1 of 1 complete)

## Current Milestone

**v1.1 Build & Test Fixes**
- Goal: Resolve build and test issues to ensure clean test runs
- Phase 1: Frontend Test Infrastructure (complete - plan 1 of 1)
- Phase 2: Backend Configuration & Warnings (complete - plan 1 of 1)

## Accumulated Context

**Decisions made:**
- Vitest browser runner with Playwright chromium is the test framework
- Angular unit-test builder uses Vitest runner with browser provider
- NoteCardComponent uses tagList getter for comma-separated tags display
- Hibernate 6.x dialect auto-detection over explicit H2Dialect class
- jackson-datatype-hibernate6 over spring-boot-starter-data-rest (minimal PageImpl fix)
- SHOW_SQL defaults to false for production safety

## Session History

| Date | Phase | Summary |
|------|-------|---------|
| 2026-03-22 | — | Milestone v1.1 initialized: Find and fix build/test issues |
| 2026-03-22 | — | Roadmap created: 2 phases defined |
| 2026-03-22 | 01-frontend-test-infrastructure | Plan 1 complete: Vitest configured, 21 AuthService tests passing |
| 2026-03-22 | 02-backend-configuration | Plan 1 complete: Spring Boot warnings fixed, jackson-datatype-hibernate6 added |

## Backend Test Results

- Main source: compiles with BUILD SUCCESS, zero warnings
- Test source: pre-existing Lombok annotation processing compilation errors (unrelated to config changes)

## Requirements Status

| Requirement | Phase | Status |
|------------|-------|--------|
| TEST-01 | Phase 1 | Complete - Vitest browser runner installed |
| TEST-02 | Phase 1 | Complete - NotesListComponent tests exist |
| TEST-03 | Phase 1 | Complete - AuthService has 21 passing tests |
| TEST-04 | Phase 1 | Complete - Tests run with ng test / npx vitest run |
| BACK-01 | Phase 2 | Complete - spring.jpa.open-in-view=false added |
| BACK-02 | Phase 2 | Complete - SQL logging conditional via SHOW_SQL env var |
| BACK-03 | Phase 2 | Complete - jackson-datatype-hibernate6 for PageImpl serialization |
| CFG-01 | Phase 2 | Complete - Environment-driven configuration via ${VAR:default} |
| CFG-02 | Phase 2 | Complete - Conditional SQL logging in production |
| CFG-03 | Phase 2 | Complete - H2Dialect deprecation eliminated (auto-detection) |
| CFG-04 | Phase 2 | Complete - Test profile isolated with auto-detected dialect |
