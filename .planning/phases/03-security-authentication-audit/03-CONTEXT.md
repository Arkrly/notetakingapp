# Phase 3: Security & Authentication Audit - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix IDOR vulnerabilities and JWT validation issues. Users cannot access other users' data through manipulated IDs. JWT tokens are properly validated with algorithm checking and expiration.

</domain>

<decisions>
## Implementation Decisions

### JWT Algorithm & Validation
- Verify implicit rejection of "none" algorithm via `.verifyWith(signingKey)`
- Ensure JwtUtils throws/returns proper error for malformed tokens
- Confirm validateToken handles all JwtException types

### IDOR in Bulk Operations
- Verify ownership in service layer BEFORE calling repository
- Fetch all notes by IDs and userId, verify count matches requested IDs
- Throw UnauthorizedException if any note doesn't belong to user

### Exception Handling
- **Already handled**: GlobalExceptionHandler exists and handles UnauthorizedException (returns 403 FORBIDDEN)
- No changes needed - existing handler returns consistent ApiResponse.error() format

### Additional Security Notes
- No separate TagController - tags embedded in Note entity, covered by Note ownership checks
- NoteServiceImpl.findNoteAndVerifyOwnership already used for single operations

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- NoteServiceImpl.findNoteAndVerifyOwnership() - existing ownership check method
- GlobalExceptionHandler - existing exception handling
- JwtUtils.isTokenValid() and validateToken() - existing validation methods
- NoteController passes user.getId() to all service methods

### Established Patterns
- Ownership verification via findNoteAndVerifyOwnership in service layer
- UnauthorizedException thrown for access violations
- ApiResponse<T> used for all API responses

### Integration Points
- Security requirements flow to Phase 4 (Data Layer) - DTOs depend on clean entity access
- NoteServiceImpl patch/update preserve isPinned, isArchived - relates to Phase 6 feature bugs

</code_context>

<specifics>
## Specific Ideas

- "Verify in service layer for bulk operations" - user wants explicit ownership check before bulk delete
- Existing GlobalExceptionHandler handles auth errors properly - no work needed here

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 03-security-authentication-audit*
*Context gathered: 2026-04-02*