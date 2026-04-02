# Pitfalls Research

**Domain:** Full-stack note-taking app (Spring Boot + Angular 21)
**Researched:** 2026-04-02
**Confidence:** MEDIUM (sources verified via codesearch, multiple community posts, and StackOverflow discussions)

---

## Critical Pitfalls

### Pitfall 1: LazyInitializationException in JPA Relationships

**What goes wrong:**
Attempting to access lazy-loaded entity collections (e.g., notes for a user, tags for a note) outside of an active Hibernate session results in `LazyInitializationException: could not initialize proxy`. The error typically occurs when returning entities from REST controllers after the transaction has closed.

**Why it happens:**
Spring Data JPA defaults to lazy loading for `@OneToMany` and `@ManyToMany` relationships. When the controller returns the entity, the session is already closed, and accessing the collection triggers the exception.

**How to avoid:**
- Use `@Transactional` on controller methods that need lazy collections
- Use fetch joins in JPQL to eagerly load relationships
- Use DTO projections instead of returning entities directly
- Consider `@EntityGraph` for complex relationships

**Warning signs:**
- Entity relationships with default `FetchType.LAZY`
- Controller methods directly returning JPA entities
- No explicit fetching strategy in repository queries

**Phase to address:**
This should be verified during initial backend testing (Phase: Implementation)

---

### Pitfall 2: CORS Blocking API Requests

**What goes wrong:**
Frontend requests to the backend fail with CORS errors, particularly on POST, PUT, DELETE requests or when cookies/auth headers are included. Preflight OPTIONS requests may succeed but actual requests fail.

**Why it happens:**
- CORS not configured for all endpoints (only GET works)
- Credentials require `allowCredentials("true")` which requires specific origin allowlist (not `*`)
- Flyingенти the wrong Content-Type for preflight
- Filter order issues with Spring Security

**How to avoid:**
- Use `@CrossOrigin` at controller level or configure globally
- Ensure CORS configuration accounts for credentials
- Register `CorsConfigurationSource` in SecurityFilterChain with proper methods
- Test with actual authenticated requests, not just GET

**Warning signs:**
- OPTIONS succeeds but POST fails
- Error: "Credentials flag is true, but Access-Control-Allow-Credentials is not 'true'"
- Works in Postman but fails in browser

**Phase to address:**
This is an integration issue — should be caught during initial integration testing

---

### Pitfall 3: JWT Token Expiration Without Graceful Handling

**What goes wrong:**
 expired JWT tokens cause cryptic errors or infinite loops. Users get logged out abruptly or requests fail silently. The backend sends 401 but frontend may not handle logout properly.

**Why it happens:**
- JWT filter catches exception but doesn't distinguish expired from invalid tokens
- Frontend doesn't handle 401 responses globally
- No refresh token mechanism implemented
- Error messages leak token information

**How to avoid:**
- Catch `ExpiredJwtException` separately from other JWT exceptions
- Implement frontend interceptor to handle 401 globally
- Consider refresh token flow for better UX (or inform users of expiration)
- Log appropriate error messages without exposing secrets

**Warning signs:**
- Users reporting being logged out unexpectedly
- No global 401 handling in Angular
- JWT filter throws generic exceptions

**Phase to address:**
Security testing phase - verify auth flows work end-to-end

---

### Pitfall 4: RxJS Subscription Memory Leaks in Angular

**What goes wrong:**
Components leak memory because observables from HTTP calls, router events, or custom streams are not unsubscribed when the component is destroyed. Over time, the app becomes sluggish or crashes.

**Why it happens:**
- Using `.subscribe()` without storing the subscription
- Not implementing `OnDestroy` with `takeUntilDestroyed()` or manual unsubscribe
- Using async pipe inconsistently

**How to avoid:**
- Use `async` pipe wherever possible — it auto-unsubscribes
- For manual subscriptions, use `takeUntilDestroyed()` from RxJS
- Store subscriptions in variables and unsubscribe in ngOnDestroy
- Consider `DestroyRef` from @angular/core for better lifecycle management

**Warning signs:**
- Component instantiated multiple times without cleanup
- Memory usage grows over time
- Console warnings about subscriptions in certain versions

**Phase to address:**
Frontend component review during bug hunt phase

---

### Pitfall 5: Angular Change Detection Errors

**What goes wrong:**
- "ExpressionChangedAfterItHasBeenCheckedError" in development mode
- Data not updating in the view despite the underlying data changing
- Infinite change detection cycles (high CPU usage)

**Why it happens:**
- Mutating object references in template expressions
- Setting values in ngOnInit that are checked in the same cycle
- Not properly initializing signal values
- Zone.js issues with async operations

**How to avoid:**
- Use signals (Angular 17+) for reactive state management
- Ensure immutability — create new objects/arrays instead of mutating
- Use `ChangeDetectorRef.detectChanges()` only when necessary
- Check for subscription-based data that needs manual change detection

**Warning signs:**
- Template uses methods that create new objects each render
- Data changes but UI doesn't update
- Development-only errors that disappear in production

**Phase to address:**
Frontend testing - run in development mode to catch change detection issues

---

### Pitfall 6: JSON Serialization Issues in Spring Boot

**What goes wrong:**
- Controllers return entities and fail with serialization errors
- "Could not find acceptable representation" 
- Circular reference errors between entities
- Hibernate proxies fail to serialize

**Why it happens:**
- Returning JPA entities directly from controllers
- Bidirectional relationships without `@JsonIgnore` or `@JsonManagedReference`
- Jackson can't serialize Hibernate lazy proxies
- Using interfaces or abstract types without proper type info

**How to avoid:**
- Return DTOs instead of entities from REST controllers
- Use `@JsonIgnore` or better yet, `@JsonIdentityInfo` for circular refs
- Use `@EntityGraph` to avoid lazy proxies in responses
- Configure Jackson's Hibernate5Module for Hibernate-specific serialization

**Warning signs:**
- Entities have bidirectional relationships used in REST responses
- Any PageImpl or similar Spring wrapper in responses
- Using H2 in tests but PostgreSQL in production (behavior differences)

**Phase to address:**
This was partially addressed in v1.1 (PageImpl serialization warning), but full DTO usage should be verified

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip DTOs, return entities directly | Faster development | Serialization bugs, circular ref issues, exposure of internal fields | Never for REST APIs |
| Hardcode JWT secret | Simplifies local dev | Security vulnerability in production | Only in local dev with clear warning |
| Disable CORS for all origins | Works for frontend | Security risk in production | Only in dev with explicit flag |
| Use `any` types in TypeScript | Faster TypeScript compilation | Runtime errors, no type safety | Acceptable temporarily, must be fixed before PR |
| Skip error handling on HTTP calls | Less boilerplate | Silent failures, poor UX | Never — at minimum handle in interceptor |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Angular ↔ Spring Boot | Mismatched date formats | Use ISO 8601 strings; configure Jackson globally for Instant/LocalDateTime |
| JWT Auth | Frontend not handling 401 globally | Use HttpInterceptor to redirect to login on 401 |
| FormData/upload requests | Wrong Content-Type header | Let browser set Content-Type for FormData; set specifically for JSON |
| Cookies vs Tokens | Sending JWT in cookies without credentials | If using cookies with credentials, ensure CORS properly configured |
| Environment configs | Frontend using wrong API URL | Use environment.ts vs environment.prod.ts consistently |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| N+1 Query Problem | Slow queries when loading notes with tags | Use fetch joins or @EntityGraph | When displaying list of 50+ notes |
| No pagination | All notes loaded at once | Implement Pageable in repository | At ~100+ notes |
| Frontend no virtualization | Browser hangs with long note lists | Use Angular CDK Virtual Scroll | At ~500+ notes displayed |
| Lazy loading on Frontend | Long initial load time, unused JS bundles | Proper route lazy loading with loadComponent | Large apps with many routes |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| JWT secret in code/weak | Account takeover | Use environment variables, strong secret |
| No rate limiting | Brute force attacks | Implement rate limiting in Spring Security |
| SQL injection via JPA | Data breach | Use parameterized queries (Spring Data JPA safe by default) |
| XSS in note content | Script injection | Angular sanitizes by default; verify content isn't bypassing |
| Storing passwords as plain text | Data breach | Always hash passwords (BCrypt in Spring Security) |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No loading states | User doesn't know if action worked | Show spinner/skeleton during HTTP requests |
| Silent HTTP errors | User sees nothing, thinks it worked | Show toast/notification for errors |
| No optimistic update | UI waits for server response | Update UI immediately, rollback on error |
| Poor error messages | User doesn't know what went wrong | Display user-friendly error messages |
| No empty states | User thinks it's broken when no notes | Show "No notes yet" with call to action |

---

## "Looks Done But Isn't" Checklist

- [ ] **JWT Logout:** Logout endpoint clears token but frontend keeps it in memory — verify complete logout flow
- [ ] **Archive/Pin Persistence:** UI updates but API response not awaited — verify changes persist after refresh
- [ ] **Note Tag Changes:** Tags may appear to save but not persist — verify after page reload
- [ ] **Concurrent Edits:** No conflict resolution — two users editing same note loses data
- [ ] **Error Responses:** Backend errors return correct HTTP status but message not displayed — verify error UX
- [ ] **H2 vs PostgreSQL differences:** Tests pass but production fails — verify configuration parity

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| LazyInitializationException | MEDIUM | Add @Transactional to service/controller methods or convert to DTO |
| CORS blocking requests | LOW | Add proper CORS configuration with credentials support |
| JWT 401 loop | MEDIUM | Distinguish expired token; implement proper logout and redirect |
| Memory leak from RxJS | HIGH | Use Chrome DevTools heap snapshots; add proper unsubscription |
| Change detection errors | MEDIUM | Convert to signals OR ensure immutability patterns |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| LazyInitializationException | Backend Implementation | Test all API responses with relationships |
| CORS blocking API | Integration Testing | Test actual authenticated requests from frontend |
| JWT Token handling | Security Testing | Verify handling of expired tokens |
| RxJS Memory Leaks | Frontend Code Review | Run app for extended period, check memory |
| Change Detection | Development Testing | Run in dev mode, check for errors |
| JSON Serialization | Backend Testing | Test all API endpoints return correct JSON |
| UX issues | QA Testing | Test all error states and loading states |

---

## Sources

- CodeSearch: "LazyInitializationException Spring Boot" (StackOverflow, multiple solutions)
- CodeSearch: "Angular debugging common bugs change detection" (Medium articles 2026)
- CodeSearch: "JWT Authentication Spring Boot common pitfalls" (DEV Community, DevGlan)
- CodeSearch: "Angular memory leaks RxJS subscriptions" (Multiple tutorials)
- Spring Blog: Current articles on Spring Boot common issues
- NoteStack codebase observation: v1.1 already addressed PageImpl serialization

---

*Pitfalls research for: NoteStack Bug Fixes (v1.2)*
*Researched: 2026-04-02*