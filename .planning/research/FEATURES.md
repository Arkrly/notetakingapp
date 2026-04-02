# Bug Landscape Research

**Domain:** Note-taking Application with JWT Authentication
**Researched:** 2026-04-02
**Confidence:** MEDIUM-HIGH

> This research identifies common bug patterns in note-taking applications with authentication, specifically targeting NoteStack's feature areas: JWT auth, CRUD operations, tags, colors, and pin/archive functionality.

---

## Critical Bug Areas (Must Check These First)

Bugs that cause security vulnerabilities, data corruption, or complete feature failures.

| Bug Area | Common Issues | Detection Priority | Notes |
|----------|---------------|-------------------|-------|
| **JWT Authentication** | Token stored in localStorage (XSS vulnerable), missing expiration check, algorithm confusion attacks, none algorithm bypass | CRITICAL | Using HttpOnly cookies recommended over localStorage |
| **Broken Object Level Authorization (IDOR)** | Users can access/modify other users' notes by manipulating IDs in API requests | CRITICAL | Every API endpoint must verify ownership |
| **Missing Input Validation** | Empty strings saved, invalid data accepted, SQL injection possible | HIGH | Validate on backend, not just frontend |

---

## Feature-Specific Bug Patterns

### Authentication & Authorization

| Bug Type | Description | When It Happens | Prevention |
|----------|-------------|-----------------|------------|
| **JWT none algorithm bypass** | Attacker modifies token algorithm to "none", bypassing signature verification | Legacy JWT libraries without proper validation | Explicitly verify algorithm, don't accept "none" |
| **Missing signature validation** | Token accepted without checking signature | Using library default settings | Always validate signature against expected algorithm |
| **Token stored in localStorage** | Vulnerable to XSS attacks that steal tokens | Simple implementation for convenience | Use HttpOnly secure cookies instead |
| **No expiration check** | Stolen tokens remain valid indefinitely | Implementation overlooking exp claim | Validate exp claim on every request |
| **Missing ownership check on endpoints** | Users can delete/archive other users' notes | REST endpoints without user context | Add `@PreAuthorize` or manual ownership checks |

### CRUD Operations (Notes, Tags, Colors)

| Bug Type | Description | When It Happens | Prevention |
|----------|-------------|-----------------|------------|
| **IDOR on note operations** | User A can modify/delete User B's note by changing note ID | Endpoints accept note ID without ownership verification | Query must filter by both note ID and user ID |
| **Cascading delete issues** | Deleting a note doesn't clean up related tags properly | Many-to-many relationships without proper handling | Use proper cascade delete in JPA/ORM |
| **Duplicate tags created** | Tagging a note with existing tag creates duplicate | Frontend passes new tag without checking existence | Check for existing tag by name before create |
| **Case sensitivity bugs** | "work" and "Work" treated as different tags | Case-insensitive comparison not implemented | Normalize tag names (lowercase) on save |
| **Color validation missing** | Invalid color values accepted | No enum/validation on color field | Use @Pattern or enum validation |

### Pin/Archive Features

| Bug Type | Description | When It Happens | Prevention |
|----------|-------------|-----------------|------------|
| **Pin/archive state persistence** | Note loses pin/archive status after edit | Update operations overwrite status field | Preserve all note state fields in updates |
| **Archive not properly filtered** | Archived notes appear in main lists | Query filters don't consider archived flag | Always include archived=false in main queries |
| **Pin priority ignored** | Notes not sorted by pinned status properly | Sorting doesn't account for isPinned field | Add ORDER BY isPinned DESC, updatedAt DESC |

### Data Validation

| Bug Type | Description | When It Happens | Prevention |
|----------|-------------|-----------------|------------|
| **Empty title/content accepted** | Notes with empty fields saved | No @NotBlank validation on backend | Add validation annotations to DTOs |
| **Maximum length violated** | Very long titles/content crash or display poorly | No @Size constraints | Add @Size(max=XXX) to prevent |
| **Special characters not escaped** | XSS via note content rendered in other notes | Content output without sanitization | Sanitize HTML before display |

---

## Common Spring Boot Backend Bugs

| Bug Area | Issue | Symptom | Fix |
|----------|-------|---------|-----|
| **N+1 Query Problem** | Loading tags for each note triggers separate query | Slow performance with many notes | Use JOIN FETCH or entity graphs |
| **Session/Entity Manager Issues** | LazyInitializationException | Accessing relations after session closed | Use @Transactional properly |
| **Null Handling** | NullPointerException in responses | Uninitialized fields returned as null | Use Optional or @NullSafe |
| **Serialization** | PageImpl/Proxy not serializable | API returns fail in production | Use custom serializers or DTOs |
| **Open-in-view enabled** | Unexpected queries, performance issues | Extra SQL statements in logs | Set spring.jpa.open-in-view=false |

---

## Common Angular Frontend Bugs

| Bug Area | Issue | Symptom | Fix |
|----------|-------|---------|-----|
| **Token not refreshed** | Expired JWT causes infinite failures | Login required unexpectedly | Implement token refresh interceptor |
| **Memory leaks** | Subscriptions not unsubscribed | Performance degradation over time | Use takeUntilDestroyed() or async pipe |
| **Race conditions** | Concurrent requests return out of order | Wrong data displayed | Use switchMap for latest request only |
| **Form validation bypassed** | Invalid submit reaches API | Backend errors not handled | Add reactive form validation |

---

## Bug Detection Checklist

Use this checklist when auditing NoteStack for bugs:

### Authentication & Security
- [ ] JWT tokens stored in localStorage? (Should use HttpOnly cookies)
- [ ] Token expiration validated on backend?
- [ ] Signature algorithm explicitly verified (not just "default")?
- [ ] All note/tag endpoints check ownership?
- [ ] Expired/invalid tokens properly rejected?

### CRUD Operations  
- [ ] Can User A access User B's notes by changing ID?
- [ ] Can archived notes be modified through API?
- [ ] Tag duplicates created when assigning existing tag?
- [ ] Colors validated against allowed values?
- [ ] Empty titles/content accepted?

### Pin/Archive Features
- [ ] Does editing a note preserve its pinned status?
- [ ] Does editing a note preserve its archived status?
- [ ] Are archived notes excluded from main note list API?
- [ ] Are pinned notes sorted to top?

### General
- [ ] Backend validates all inputs?
- [ ] Frontend catches and displays backend validation errors?
- [ ] N+1 queries present on note/tag operations?
- [ ] Proper error handling for network failures?

---

## Specific to NoteStack (Based on Tech Stack)

Given NoteStack uses Spring Boot 3.3.6 + Java 21 + PostgreSQL + Angular 21:

| Feature Area | Likely Bugs | Specific Checks |
|--------------|-------------|-----------------|
| JWT Auth | Missing signature validation, localStorage storage | Check AuthController, JWT filter |
| Note CRUD | IDOR vulnerability, missing ownership check | Verify NoteRepository queries include userId |
| Tags | Duplicate creation, case sensitivity | Check tag normalization |
| Colors | Invalid values accepted | Verify @Pattern or enum validation |
| Pin/Archive | Status lost on update | Check update PUT endpoint preserves all fields |

---

## Sources

**Primary References (Security Best Practices):**
- Auth0: Critical vulnerabilities in JSON Web Token libraries (2015-2020)
- OWASP API Security Top 10: Broken Object Level Authorization (2024-2025)
- 42Crunch: 7 Ways to Avoid JWT Security Pitfalls (2021-2026)
- Karuna: 7 Spring Boot Security Misconfigurations Hackers Love (Mar 2026)
- CodeSignal: Common JWT Vulnerabilities (2024)

**Real Bug Reports (Note-Taking Apps):**
- Joplin GitHub Issues: #14540 (duplicate tags), #13116 (tag function broken), #12507 (tag exists false positive)
- Blinko GitHub Issue #1112: IDOR in message and tag routers (missing accountId ownership checks - Feb 2026)
- CVE-2026-32815: Improper Authentication in siyuan-note (Mar 2026)

**Common Backend Issues:**
- Java Guides: Top 10 Spring Boot REST API Mistakes (2024-2025)
- Snyk: Guide to Input Validation with Spring Boot (2023)

---

*Bug research for NoteStack application*
*Researched: 2026-04-02*