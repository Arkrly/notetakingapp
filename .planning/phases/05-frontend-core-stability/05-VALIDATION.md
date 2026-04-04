---
phase: 05
slug: frontend-core-stability
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (Angular + Playwright browser) |
| **Config file** | `frontend/vitest.config.ts` |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test` in frontend directory
- **After every plan wave:** Run `npm test -- --run` (full suite)
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-task Verification Map

| task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | FRONT-02 | unit | `npm test` | ✅ | ⬜ pending |
| 05-01-02 | 01 | 1 | FRONT-01 | unit | `npm test` | ✅ | ⬜ pending |
| 05-02-01 | 02 | 2 | FRONT-03 | manual | Dev mode verification | N/A | ⬜ pending |
| 05-02-02 | 02 | 2 | FRONT-04 | manual | Console check | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `frontend/vitest.config.ts` — existing test config
- [x] `auth.service.spec.ts` — existing auth tests
- [x] `notes-list.component.spec.ts` — existing component tests

**Existing infrastructure covers all phase requirements.** No Wave 0 needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 401 handling flow | FRONT-03 | Requires auth state manipulation | 1. Set expired token in localStorage<br>2. Navigate to /notes<br>3. Verify redirect to /login<br>4. Verify token cleared |
| No CD errors | FRONT-04 | Dev mode console check | 1. Run `ng serve`<br>2. Login and perform all note operations<br>3. Check console for ExpressionChangedAfterItHasBeenCheckedError |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
