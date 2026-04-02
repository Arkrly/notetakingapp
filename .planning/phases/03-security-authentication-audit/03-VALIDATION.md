---
phase: 03
slug: security-authentication-audit
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | JUnit 5 (Spring Boot test) |
| **Config file** | Already configured via Maven |
| **Quick run command** | `mvn test -Dtest="*Jwt*,*Security*"` |
| **Full suite command** | `mvn test` |
| **Estimated runtime** | ~120 seconds |

---

## Sampling Rate

- **After every task commit:** Run `mvn test -Dtest="*Jwt*,*NoteService*Test"` 
- **After every plan wave:** Run `mvn test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-task Verification Map

| task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | SEC-01, SEC-05 | unit | `mvn test -Dtest="NoteServiceImplTest#bulkDelete*"` | ✅ | ⬜ pending |
| 03-01-02 | 01 | 1 | SEC-01, SEC-05 | unit | Manual test | N/A | ⬜ pending |
| 03-02-01 | 02 | 1 | SEC-03 | unit | `mvn test -Dtest="JwtUtilsTest#rejectNoneAlgorithm*"` | ✅ | ⬜ pending |
| 03-02-02 | 02 | 1 | SEC-04 | unit | `mvn test -Dtest="JwtUtilsTest#rejectExpired*"` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] NoteServiceImplTest.java — test bulk delete ownership verification
- [ ] JwtUtilsTest.java — test JWT rejection for "none" algorithm and expiration

*Existing: NoteServiceImpl has some tests in test/ directory*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| IDOR via API call manually manipulating note ID | SEC-01 | Needs running server + valid JWT | 1. Login as User A, get token. 2. Create note, capture ID. 3. Login as User B. 4. Try GET /api/notes/{A'sNoteId}. Expect 403. |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending