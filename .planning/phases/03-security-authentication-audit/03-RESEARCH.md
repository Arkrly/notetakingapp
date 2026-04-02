# Phase 3: Security & Authentication Audit - Research

**Researched:** 2026-04-02
**Phase:** Security & Authentication Audit

---

## Domain Context

Phase 3 addresses IDOR vulnerabilities and JWT validation in the NoteStack application (Spring Boot backend, Angular frontend).

---

## Technical Stack

- **Backend:** Spring Boot 3.x with Spring Security, jjwt 0.12.x
- **Frontend:** Angular
- **Auth:** JWT with HMAC-SHA256 signatures via jjwt library
- **Entity:** Note (with embedded tags) → User relationship

---

## Key Findings

### 1. JWT "none" Algorithm (SEC-03)

**Current Implementation (JwtUtils.java):**
- Uses `Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token)`
- The `.verifyWith(signingKey)` requires a signature - unsigned tokens with "none" algorithm should fail
- jjwt library requires signature verification by default

**Verification Needed:**
- Confirm jjwt 0.12.x explicitly rejects unsigned tokens
- Current code doesn't explicitly set allowed algorithms

### 2. Token Expiration (SEC-04)

**Current Implementation:**
- `isTokenExpired(token)` checks `extractExpiration(token).before(new Date())`
- `validateToken()` checks expiration: `return username.equals(...) && !isTokenExpired(token)`
- `isTokenValid()` checks expiration: `extractAllClaims(token)` then `!isTokenExpired(token)`

**Status:** Already implemented correctly - tokens with expired timestamps will fail validation.

### 3. IDOR in Single Operations (SEC-01, SEC-05)

**Current Implementation:**
- `findNoteAndVerifyOwnership(noteId, userId)` at line 158-166 in NoteServiceImpl
- Checks: `if (!note.getUser().getId().equals(userId)) { throw new UnauthorizedException(...); }`
- Used in: getNoteById, updateNote, patchNote, deleteNote

**Status:** Already protected for single operations.

### 4. IDOR in Bulk Operations (SEC-01, SEC-05)

**Current Implementation:**
- Line 129: `noteRepository.deleteAllByIdInAndUserId(noteIds, userId)`
- Query includes userId in WHERE clause

**Issue:** 
- Doesn't verify that ALL requested IDs were actually deleted
- If user requests [A, B, C] but only A belongs to user, silently deletes only A
- No exception or count verification that requested == deleted

**Per CONTEXT.md (user decision):**
- "Verify ownership in service layer BEFORE calling repository"
- "Fetch all notes by IDs and userId, verify count matches requested IDs"

### 5. Tag Access (SEC-02)

**Current Implementation:**
- No separate TagController - tags embedded in Note entity
- Note ownership checks automatically cover tags
- No direct tag IDOR vector

**Status:** Tags are safe via Note ownership verification.

---

## Validation Architecture

| Requirement | Current Status | Test Approach |
|-------------|----------------|---------------|
| SEC-01 | Single ops protected, bulk needs verification | Manual: Try IDOR with valid token |
| SEC-02 | Protected via Note ownership | Manual: Try tag access via Note |
| SEC-03 | Implicit via signing key verification | Unit: Create token with "none", expect rejection |
| SEC-04 | Already implemented | Unit: Create expired token, expect rejection |
| SEC-05 | Single ops protected, bulk needs verification | Same as SEC-01 |

---

## Gaps Identified

1. **Bulk delete ownership verification (SEC-01, SEC-05):** Need to verify count matches requested
2. **Explicit JWT algorithm allowlist (SEC-03):** Could add explicit algorithm restriction for defense in depth
3. **No explicit test coverage:** Need unit tests for JWT rejection scenarios

---

## Common Pitfalls

- jjwt versions before 0.11.x had some algorithm confusion issues
- Spring Security's auto-configuration can interfere with custom JWT filters
- Bulk operations without count verification are a common IDOR blind spot