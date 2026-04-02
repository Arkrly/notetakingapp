# Phase 6: Feature-Specific Bug Fixes - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning (mostly done)

<domain>
## Phase Boundary

Tag and note metadata operations work correctly. Mixed status - most fixes already in place, only tag normalization needed.

</domain>

<decisions>
## Implementation Decisions

### Tag Normalization
- Add lowercase normalization when saving tags
- Apply in NoteServiceImpl before setting tags (both create and patch operations)

### Pin Status Preservation
- Already implemented in applyUpdate() - uses ternary to preserve existing value if null
- No changes needed ✓

### Archive Status Preservation
- Already implemented in applyUpdate() - uses ternary to preserve existing value if null
- No changes needed ✓

### Archived Notes Filtering
- Current behavior: findByUserId returns all notes (including archived)
- This is intentional - separate /archived endpoint for archived-only view
- User-facing filtering happens in frontend, not backend
- No changes needed ✓

</decisions>

<specifics>
## Specific Ideas

Only ONE fix needed: tag lowercase normalization on save

</specifics>

<deferred>
## Deferred Ideas

None - single fix (tag normalization) needed for this phase

</deferred>

---

*Phase: 06-feature-specific-bug-fixes*
*Context gathered: 2026-04-02*