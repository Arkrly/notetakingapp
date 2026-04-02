---
gsd_state_version: 1.0
milestone: v1.2
milestone_name: Bug Fixes
status: in_progress
last_updated: "2026-04-02"
last_activity: "2026-04-02 — Milestone v1.2 started"
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
---

# STATE.md

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-04-02 — Milestone v1.2 started

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-02)

**Core value:** Users can capture and organize their notes with a clean, responsive interface.
**Current focus:** v1.2 Bug Fixes — Defining scope

## Current Milestone

**v1.2 Bug Fixes**
- Goal: Find and fix bugs across frontend and backend
- Full codebase audit for bugs

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
| 2026-04-02 | — | Milestone v1.2 initialized: Full codebase bug audit |
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
