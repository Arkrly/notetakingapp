# Architecture Research

**Domain:** Bug-Prone Patterns in Spring Boot + Angular Applications  
**Researched:** 2026-04-02  
**Confidence:** MEDIUM-HIGH

Based on analysis of common architectural issues in Spring Boot 3.x + Angular 21 full-stack applications with JWT authentication.

---

## Bug-Prone Architectural Areas

This document maps the architectural zones most likely to contain bugs in a Spring Boot + Angular stack, organized by risk severity and detection difficulty.

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (Angular 21)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Components  │  │  Services    │  │  Interceptor │          │
│  │ (UI State)  │  │ (HTTP Logic) │  │ (Auth-token) │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼─────────────────┼─────────────────┼───────────────────┘
          │                 │                 │
          └─────────────────┴─────────────────┘
                            │
                            ▼ (HTTP + JWT)
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Spring Boot 3.3.6)                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Controllers  │  │  Services    │  │    JPA       │          │
│  │ (API Layer)  │  │ (Business)   │  │  Entities    │          │
│  └──────────────┴──┴──────┬───────┴──┴──────────────┘          │
│                           │                                     │
│                    ┌──────┴──────┐                              │
│                    │ Transaction │                              │
│                    └──────┬───────┘                              │
│                           │                                     │
├───────────────────────────┼─────────────────────────────────────┤
│                      Database (PostgreSQL)                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## High-Risk Bug Areas

These areas commonly contain bugs that are difficult to detect and can cause production issues.

### 1. Authentication & Authorization Flow

**Risk Level:** CRITICAL  
**Common Issues:**

| Bug | Location | Symptom | Root Cause |
|-----|----------|---------|------------|
| Token not attached to requests | Angular HTTP Interceptor | 401 on every request | Missing/null token passed to backend |
| Circular dependency | Auth Interceptor ↔ Router | App won't load | Interceptor injects Router, Router needs auth |
| No token refresh logic | Auth Service | Session expires silently | No handling for 401 responses |
| CORS blocking requests | Spring Boot Controller | Browser blocks API calls | Missing `@CrossOrigin` or misconfigured origins |

**Where to look in NoteStack:**
- Auth interceptor implementation
- Spring Security filter chain
- JWT token validation in backend

**What to Check:**
```java
// Backend: CORS properly configured
@CrossOrigin(origins = "http://localhost:4200")  // Production needs proper origin config
@RestController
public class NoteController { }
```

```typescript
// Frontend: Token interceptor handles null token
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {  // Must check for null before appending
    const modifiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(modifiedReq);
  }
  return next(req);  // Don't crash - but this may hide auth bugs
};
```

### 2. JPA Entity Relationships & Lazy Loading

**Risk Level:** HIGH  
**Common Issues:**

| Bug | Symptom | Root Cause |
|-----|---------|------------|
| `LazyInitializationException` | Entity outside session fails to load collections | `@OneToMany` defaults to LAZY but accessed after session closes |
| N+1 Query Problem | Slow API responses | Missing `@EntityGraph` or fetch joins |
| Missing `@Transactional` | Partial saves, corrupted data | Service method not transactional but calls multiple repos |
| Detached entity merge | Duplicate records or ID conflicts | Saving entity that was already persisted |

**Where to look:**
- Note entity's relationship to Tags, User
- Any service methods fetching entities then accessing collections in controllers
- Repository method calls

**What to Check:**
```java
// Bug: Returns entity with lazy collection - fails outside transaction
@GetMapping("/notes")
public List<Note> getNotes() {
    return noteRepository.findAll();  // Lazy tags will fail here!
}

// Fix: Use fetch join or @EntityGraph
@GetMapping("/notes")
public List<Note> getNotes() {
    return noteRepository.findAllWithTags();  // Custom query with JOIN FETCH
}

// Or use @EntityGraph on repository
@EntityGraph(attributePaths = {"tags", "user"})
Optional<Note> findById(Long id);
```

### 3. Exception Handling & Error Responses

**Risk Level:** HIGH  
**Common Issues:**

| Bug | Symptom | Root Cause |
|-----|---------|------------|
| Inconsistent error format | Frontend can't parse errors | Mixed error response structures |
| Stack trace exposed | Information leakage | No global exception handler |
| Unchecked exceptions not rolling back | Partial data persisted on error | `@Transactional` but wrong exception handling |
| Validation errors lost | User sees generic 500 | Missing `@Valid` on request bodies |

**What to Check:**
```java
// Bug: No global handler - different formats from different sources
@ExceptionHandler // Missing
public ResponseEntity<?> handleError(Exception e) { ... }

// Fix: Consistent error response
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("VALIDATION_ERROR", ex.getMessage()));
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }
}
```

---

## Medium-Risk Bug Areas

### 4. Frontend State Management

**Risk Level:** MEDIUM  
**Common Issues:**

| Bug | Symptom | Root Cause |
|-----|---------|------------|
| Memory leaks | Components not unsubscribed | No takeUntil patterns or AsyncPipe |
| Race conditions | Data shown is stale | Concurrent HTTP calls without proper ordering |
| Change detection issues | UI doesn't update | Mutating objects without change detection |
| Empty state not handled | Null errors on load | Not checking for null/undefined |

**What to Check:**
```typescript
// Bug: Subscription leak
export class NoteListComponent implements OnInit {
  ngOnInit() {
    this.noteService.getNotes().subscribe(notes => {
      this.notes = notes;  // Never unsubscribed!
    });
  }
}

// Fix: Use AsyncPipe or takeUntil
export class NoteListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  notes$ = this.noteService.getNotes();  // Observable with AsyncPipe
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 5. API Contract Mismatch

**Risk Level:** MEDIUM  
**Common Issues:**

| Bug | Symptom | Root Cause |
|-----|---------|------------|
| Frontend expects different field names | Data not displaying | DTO/Entity field mismatch |
| Date format differences | Wrong dates shown | Java Instant vs ISO string |
| Authentication header case sensitivity | Auth works locally but not prod | `authorization` vs `Authorization` |
| Missing pagination handling | Only first page loads | Backend returns `Page` but frontend expects array |

### 6. Transaction Management

**Risk Level:** MEDIUM  
**Common Issues:**

| Bug | Symptom | Root Cause |
|-----|---------|------------|
| Silent rollback | Data appears to save but doesn't | Catching exception in service without rethrowing |
| Partial rollback | Some records saved, others not | Multiple @Transactional methods, one fails |
| Long transactions | Database locks, timeout errors | Transaction spans entire HTTP request |

**What to Check:**
```java
// Bug: Catching exception suppresses rollback
@Transactional
public void updateNotes(List<Note> notes) {
    for (Note note : notes) {
        try {
            noteRepository.save(note);  // If one fails, others may have saved
        } catch (DataIntegrityViolationException e) {
            log.error("Failed to save note", e);  // Silent failure!
        }
    }
}

// Fix: Let exception propagate or use programmatic transaction
@Transactional
public void updateNotes(List<Note> notes) {
    for (Note note : notes) {
        noteRepository.save(note);
    }
    // If any fail, all roll back
}
```

---

## Lower-Risk But Worth Checking

### 7. Angular Change Detection

**Common Issues:**
- Mutating object properties without triggering change detection
- Using `OnPush` strategy with mutable inputs
- Heavy computations in template rather than getters

### 8. HTTP Interceptor Logic

**Common Issues:**
- Double-auth-header on retry (original + new)
- Infinite redirect loops on 401
- Not handling network errors consistently
- interceptor order causing unexpected behavior

---

## Bug Detection Strategy by Priority

### First Priority (Check First)

1. **Auth Flow** — CORS, JWT token handling, interceptor
2. **Lazy Loading Relationships** — Any @OneToMany, @ManyToOne without fetch strategy
3. **@Transactional boundaries** — Are service methods properly transactional?

### Second Priority

4. **Global exception handler** — Consistent error format
5. **Subscription cleanup** — Memory leaks in Angular
6. **DTO vs Entity serialization** — Date formats, field names

### Third Priority

7. **Pagination handling** — Backend returns Page/PageImpl
8. **Change detection in Angular**
9. **Interceptor error handling**

---

## Anti-Patterns Specific to This Stack

### Anti-Pattern 1: Returning JPA Entities Directly from Controllers

**What happens:** LazyInitializationException, Hibernate proxies serialized incorrectly  
**Instead:** Use DTOs (Data Transfer Objects) to break the persistence context

### Anti-Pattern 2: Hardcoded API URLs in Angular Components

**What happens:** Environment mismatches, difficult to test  
**Instead:** Use environment configuration and HttpInterceptor for base URL

### Anti-Pattern 3: No Input Validation on Backend

**What happens:** Invalid data persisted, security issues  
**Instead:** Use `@Valid` on `@RequestBody` and Bean Validation annotations

### Anti-Pattern 4: Catching Exceptions Without Re-throwing

**What happens:** Silent failures, partial data, confusing debugging  
**Instead:** Let exceptions propagate or use specific handling with logging

### Anti-Pattern 5: Storing JWT in LocalStorage (for sensitive apps)

**What happens:** XSS vulnerability  
**Instead:** Use httpOnly cookies for token storage (requires backend support)

---

## Sources

- "17 Common Problems in Angular+Spring Boot Projects" — The Dialectic, March 2026
- "Spring Boot @Transactional: 5 Bugs That Are Probably in Your Production Code" — Dev.to, March 2026
- "Common Pitfalls When Using Spring Data JPA with Spring Boot" — Java Nexus, February 2025
- "Troubleshooting Lazy Loading in Spring Data JPA" — Tech by Pranav, April 2025
- "Angular Auth Bug: Guard and Interceptor" — StackOverflow, November 2024
- Spring Boot 3.x Documentation on Transaction Management
- Angular 21 HTTP Client Documentation

---

*Architecture research for: NoteStack v1.2 Bug Fixes milestone*  
*Researched: 2026-04-02*