# Stack Debugging Research

**Domain:** Bug Finding & Debugging for Spring Boot + Angular Applications
**Researched:** 2026-04-02
**Confidence:** HIGH
**Project:** NoteStack (v1.2 Bug Fixes Milestone)

---

## Debugging Tools & Strategies

### Backend Debugging (Spring Boot 3.3.6 + Java 21)

| Tool/Sequence | Purpose | Command/Usage |
|---------------|---------|---------------|
| `--debug` flag | Enable auto-configuration debug output | `java -jar app.jar --debug` |
| ` spring.main.log-startup-info=false` | Reduce noise, focus on errors | `application.properties` |
| JUnit + `@SpringBootTest` | Integration testing with context | `@ExtendWith(SpringExtension.class)` |
| PostgreSQL logging | SQL query visibility | `logging.level.org.hibernate.SQL=DEBUG` |
| H2 Test Console | Inspect in-memory DB state during tests | `spring.h2.console.enabled=true` |

### Frontend Debugging (Angular 21 + Vitest)

| Tool/Sequence | Purpose | Command/Usage |
|---------------|---------|---------------|
| Angular DevTools | Component tree, change detection inspection | Chrome/Firefox extension |
| RxJS DevTools | Observable stream visualization | Browser extension |
| Vitest browser runner | Test debugging in browser context | `npx vitest --browser` |
| `ng serve --open` | Live reload with error overlay | Standard Angular dev |

---

## Common Bug Patterns: Spring Boot Backend

### 1. Transaction Rollback Failures

**Code Pattern That Causes Bug:**
```java
@Transactional
public void processNote(Note note) {
    try {
        noteRepository.save(note);
        someService.callExternalAPI(note.getId()); // unchecked exception here
    } catch (IOException e) {
        log.error("API failed", e); // NPE or data inconsistency after this
    }
}
```

**Bug:** Checked exceptions in try-catch do NOT trigger rollback. The transaction commits with partial/invalid state because `IOException` is checked.

**Fix:**
```java
// Either declare rollbackFor
@Transactional(rollbackFor = Exception.class)
public void processNote(Note note) { ... }

// Or rethrow as unchecked
try {
    noteRepository.save(note);
    someService.callExternalAPI(note.getId());
} catch (IOException e) {
    throw new RuntimeException("API failed", e); // triggers rollback
}
```

**Detection:** Check logs for `UnexpectedRollbackException` or inspect database after "failed" operations.

---

### 2. N+1 Query Problems

**Code Pattern That Causes Bug:**
```java
// Lazy loading causes separate query per note
List<Note> notes = noteRepository.findAll();
for (Note note : notes) {
    System.out.println(note.getTags().size()); // Triggers N+1!
}
```

**Bug:** Each `.getTags()` triggers a new SQL query. With 100 notes = 101 queries.

**Fix:**
```java
// Use JOIN FETCH or@EntityGraph
@EntityGraph(attributePaths = {"tags"})
List<Note> findAllWithTags();

@Query("SELECT n FROM Note n JOIN FETCH n.tags")
List<Note> findAllWithTags();
```

**Detection:** Enable SQL logging (`logging.level.org.hibernate.SQL=DEBUG`), look for repeated similar SELECTs.

---

### 3. CORS Misconfiguration with Spring Security

**Code Pattern That Causes Bug:**
```java
// SecurityConfig missing CORS for JWT endpoints
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> {}); // CORS enabled but no configuration
    // Requests from Angular fail with 403
}
```

**Bug:** Browser blocks requests from Angular (port 4200) to backend (port 8080) due to missing CORS headers.

**Fix:**
```java
// Add CORS configuration
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:4200"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

**Detection:** Check browser console for `Access-Control-Allow-Origin` errors. Preflight OPTIONS requests returning 403.

---

### 4. Jackson Serialization with JPA Entities

**Code Pattern That Causes Bug:**
```java
@Entity
public class Note {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User user; // Lazy-loaded
    
    @OneToMany(mappedBy = "note")
    private List<Tag> tags;
}
```
When returning `Note` from REST controller → `LazyInitializationException` outside transaction.

**Bug:** Entity contains proxy objects (Hibernate proxies) that cannot serialize to JSON after session closes.

**Fix:**
```java
// Use DTOs instead of entities
public class NoteResponseDTO {
    private Long id;
    private String title;
    private String content;
    private List<TagDTO> tags;
    private Long userId;
}

// Or configure Jackson modules
@Configuration
public class JacksonConfig {
    @Bean
    public MappingJackson2HttpMessageConverter messageConverter() {
        // Configure to handle Hibernate proxies
    }
}
```

**Detection:** Logs show `LazyInitializationException: could not initialize proxy - no Session`.

---

### 5. Open-In-View Anti-Pattern (Already Fixed in NoteStack)

**Bug:** `spring.jpa.open-in-view=true` (default) triggers queries during view rendering → N+1 issues, performance degradation, hidden database locks.

**Note:** Per PROJECT.md, this was already resolved in v1.1.

---

## Common Bug Patterns: Angular Frontend

### 1. ExpressionChangedAfterItHasBeenCheckedError

**Code Pattern That Causes Bug:**
```typescript
@Component({...})
export class NoteEditorComponent implements OnInit {
    note: Note;
    
    ngOnInit() {
        this.noteService.getNote(this.route.snapshot.paramMap.get('id'))
            .subscribe(note => {
                this.note = note; // Change detected after check
            });
    }
}
```

**Bug:** Angular's change detection runs, then async operation completes modifying data after check phase.

**Fix:**
```typescript
// Option 1: Use async pipe
note$ = this.noteService.getNote(id);

// Option 2: Use ChangeDetectorRef
constructor(private cdr: ChangeDetectorRef) {}

ngOnInit() {
    this.noteService.getNote(id).subscribe(note => {
        this.note = note;
        this.cdr.detectChanges();
    });
}

// Option 3: Wrap in setTimeout (last resort)
setTimeout(() => this.note = note);
```

**Detection:** Error in console: `ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked`.

---

### 2. RxJS Memory Leaks

**Code Pattern That Causes Bug:**
```typescript
@Component({...})
export class NoteListComponent implements OnInit {
    notes: Note[] = [];
    searchTerm = new BehaviorSubject<string>('');
    
    ngOnInit() {
        // Subscription never cleaned up
        this.searchTerm
            .pipe(debounceTime(300))
            .subscribe(term => this.searchNotes(term));
    }
}
```

**Bug:** Each navigation creates new component instance with unchecked subscription → memory leak.

**Fix:**
```typescript
// Option 1: TakeUntil pattern (most common)
private destroy$ = new Subject<void>();

ngOnInit() {
    this.searchTerm.pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
    ).subscribe(term => this.searchNotes(term));
}

ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
}

// Option 2: Use async pipe (preferred for view-only)
notes$ = this.searchTerm.pipe(
    debounceTime(300),
    switchMap(term => this.noteService.search(term))
);
```

**Detection:** Open browser memory profiler, check for growing heap after repeated navigation.

---

### 3. JWT Token Refresh Race Conditions

**Code Pattern That Causes Bug:**
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if (error.status === 401) {
                    // Multiple 401s trigger multiple refresh calls
                    return this.authService.refreshToken().pipe(
                        switchMap(token => {
                            // Original request retried with OLD req.clone()
                            // Still has old token!
                            return next.handle(req);
                        })
                    );
                }
                return throwError(() => error);
            })
        );
    }
}
```

**Bug:** Refresh token called multiple times, and failed requests are retried WITHOUT updating their authorization header.

**Fix:**
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('refresh')) {
            return next.handle(req); // Skip interceptor for refresh endpoint
        }

        return next.handle(this.addToken(req, this.tokenService.getToken())).pipe(
            catchError(error => {
                if (error.status === 401 && !req.url.includes('refresh')) {
                    return this.handle401Error(req, next);
                }
                return throwError(() => error);
            })
        );
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandlerHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            
            return this.authService.refreshToken().pipe(
                switchMap(token => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(token);
                    return next.handle(this.addToken(req, token));
                }),
                catchError(err => {
                    this.isRefreshing = false;
                    this.authService.logout();
                    return throwError(() => err);
                })
            );
        }
        
        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => next.handle(this.addToken(req, token!)))
        );
    }

    private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }
}
```

**Detection:** Check network tab for multiple token refresh calls or 401 errors with stale tokens.

---

### 4. Change Detection Performance Issues

**Code Pattern That Causes Bug:**
```typescript
@Component({
    changeDetection: ChangeDetectionStrategy.Default // or missing
})
export class NoteListComponent {
    notes: Note[] = [];
    
    // Heavy computation in template called frequently
    get sortedNotes(): Note[] {
        return [...this.notes].sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }
}
```

**Bug:** `sortedNotes` recomputes on EVERY change detection cycle (every click, hover, etc.).

**Fix:**
```typescript
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    changeDetection: OnPush // deprecated in Angular 16+
})
export class NoteListComponent implements OnChanges {
    @Input() notes: Note[] = [];
    sortedNotes: Note[] = [];
    
    ngOnChanges() {
        // Recompute only when input changes
        this.sortedNotes = [...this.notes].sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }
}
```

**Detection:** Run Angular DevTools, check "Change Detection" tab for long running times.

---

### 5. Angular Zone Issues (setInterval/setTimeout memory leaks)

**Code Pattern That Causes Bug:**
```typescript
@Component({...})
export class NoteReminderComponent {
    ngOnInit() {
        // Browser API not tied to Angular zone
        setInterval(() => this.checkReminders(), 60000);
    }
}
```

**Bug:** `setInterval` runs outside Angular zone → change detection doesn't trigger, memory leak because interval never cleared.

**Fix:**
```typescript
import { NgZone } from '@angular/core';

@Component({...})
export class NoteReminderComponent implements OnDestroy {
    private intervalId: any;
    
    constructor(private zone: NgZone) {}
    
    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.intervalId = setInterval(() => this.checkReminders(), 60000);
        });
    }
    
    ngOnDestroy() {
        clearInterval(this.intervalId);
    }
    
    private checkReminders() {
        // Check logic that may update UI
        this.zone.run(() => {
            // Update UI here
        });
    }
}
```

**Detection:** Check DevTools timeline for unexplained repeated `setInterval` callbacks consuming CPU.

---

## Integrated Stack Issues

### 1. HTTP Status Code Mismatches

| Scenario | Spring Boot Response | Angular Expectation | Bug |
|----------|---------------------|--------------------|-----|
| Invalid input | `400 Bad Request` with error DTO | Expects `200` with success flag | Missing validation display |
| Unauthorized | `401` or redirects to login | Interceptor expects single format | Infinite refresh loop |
| Not Found | `404` (sometimes with HTML) | Expects JSON | TypeError parsing HTML as JSON |

**Fix:** Ensure consistent JSON API errors:
```java
@ExceptionHandler(NoteNotFoundException.class)
@ResponseStatus(HttpStatus.NOT_FOUND)
public ErrorResponse handleNotFound(NoteNotFoundException ex) {
    return new ErrorResponse("NOTE_NOT_FOUND", ex.getMessage());
}
```

---

### 2. Date/Time Zone Mismatches

**Bug:** Note created in PST, stored in UTC, displayed in user's timezone → displays "future" dates.

**Fix:**
```typescript
// Angular: Use date pipe with timezone
{{ note.createdAt | date:'medium':'UTC':'en-US' }}

// Spring Boot: Always store UTC, return offset info
@Data
public class NoteResponseDTO {
    private Instant createdAt;
    private String createdAtOffset; // "2024-01-15T10:30:00-08:00"
}
```

---

### 3. Null Handling Gaps

**Code Pattern That Causes Bug:**
```typescript
// Spring Boot returns null for optional fields
{ "id": 1, "title": "Test", "color": null }

// Angular expects default
<div [style.background-color]="note.color || '#ffffff'"> <!-- Empty string is falsy too! -->
```

**Fix:** Use nullish coalescing:
```typescript
<div [style.background-color]="note.color ?? '#ffffff'">
```

---

## Debugging Workflows

### Backend Debugging Sequence

1. **Enable debug logging:**
   ```properties
   logging.level.org.springframework.web=DEBUG
   logging.level.org.hibernate.SQL=DEBUG
   logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
   ```

2. **Check startup:** Run with `--debug` flag, verify all beans initialize

3. **Test isolation:** 
   - H2 in-memory for unit tests (already configured per PROJECT.md)
   - PostgreSQL integration tests with `@Testcontainers`

4. **Common error patterns:**
   - `BeanCreationException` → Missing dependency, check `@EnableXxx` annotations
   - `LazyInitializationException` → Missing fetch join or DTO mapping
   - `InvalidDataAccessApiUsageException` → Transaction boundary issues

### Frontend Debugging Sequence

1. **Angular DevTools:** Inspect component tree, check change detection cycles

2. **Network tab:** Verify API requests/responses match expectations

3. **Console errors:** Check for uncaught promise rejections

4. **Unit tests with Vitest:**
   ```bash
   npx vitest --browser --coverage
   ```

---

## What NOT to Do

| Anti-Pattern | Why Problematic | Use Instead |
|--------------|----------------|-------------|
| `@Transactional` without `rollbackFor` | Checked exceptions don't rollback | Explicit `rollbackFor=Exception.class` |
| Returning JPA entities directly | Lazy loading + serialization fails | Use DTOs |
| Subscribe without takeUntil | Memory leaks | `takeUntil(this.destroy$)` or async pipe |
| `Default` change detection strategy | Performance issues on large apps | `OnPush` |
| Blindly retry failed requests | Infinite loops with 401 | Check refresh token flow |
| Storing dates as strings | Timezone confusion | Use `Instant`/`OffsetDateTime` |

---

## Sources

- Spring Boot Transactional Issues: DEV Community (2025) — HIGH confidence
- Angular NG0100 Change Detection: RuneBook (2025) — HIGH confidence  
- RxJS Memory Leaks: Angular documentation, Medium (2026) — HIGH confidence
- JWT Token Refresh: Stack Overflow, Medium (2024-2025) — HIGH confidence
- CORS + Spring Security: LinkedIn technical guide — MEDIUM confidence

---

*Debugging stack for NoteStack v1.2 milestone*
*Primary focus: Identifying common Spring Boot + Angular integration issues*