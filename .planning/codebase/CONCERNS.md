# Codebase Concerns

**Analysis Date:** 2026-03-18

## Tech Debt

### JWT Refresh Token Not Implemented
- **Issue:** JWT tokens expire after 15 minutes (configured in `application.properties` with `app.jwt.access-token-expiry-ms=900000`), but refresh token functionality is not implemented
- **Files:** 
  - `notetakingapp/src/main/java/com/notetakingapp/security/JwtUtils.java`
  - `notetakingapp/src/main/java/com/notetakingapp/service/AuthService.java`
- **Impact:** Users are logged out every 15 minutes and must re-authenticate manually
- **Fix approach:** Implement refresh token endpoint and token refresh flow

### Configuration Hardcoded Values
- **Issue:** Sensitive configuration values are hardcoded in source files and docker-compose
- **Files:** 
  - `notetakingapp/src/main/resources/application.properties` (JWT secret, DB credentials)
  - `notetakingapp/docker-compose.yaml` (database password)
- **Impact:** Secrets are committed to version control, making them visible in git history
- **Fix approach:** Use environment variables for all sensitive values, implement proper secrets management

### Database Healthcheck Disabled
- **Issue:** PostgreSQL container healthcheck is commented out in docker-compose
- **Files:** `notetakingapp/docker-compose.yaml` (lines 13-17)
- **Impact:** Container orchestrator cannot detect database unavailability reliably
- **Fix approach:** Uncomment and enable the healthcheck configuration

## Known Bugs

### Swagger UI Exposed in Production
- **Issue:** Swagger UI and OpenAPI documentation endpoints are publicly accessible
- **Files:** 
  - `notetakingapp/src/main/java/com/notetakingapp/config/SecurityConfig.java` (lines 41-48)
- **Impact:** API documentation and structure are exposed to unauthorized users
- **Workaround:** None - requires code change

### Search Query Not Sanitized
- **Issue:** Search query parameter is passed directly to LIKE query without sanitization
- **Files:** `notetakingapp/src/main/java/com/notetakingapp/repository/NoteRepository.java` (lines 26-32)
- **Impact:** Potential for excessive resource usage with very large search terms
- **Workaround:** Limit query length on controller layer

## Security Considerations

### Hardcoded JWT Secret
- **Risk:** JWT signing key is hardcoded in application.properties
- **Files:** `notetakingapp/src/main/resources/application.properties` (line 22)
- **Current mitigation:** None - secret is in plaintext in config file
- **Recommendations:** 
  - Use environment variable: `@Value("${app.jwt.secret}")`
  - Or use a secrets management solution (Vault, AWS Secrets Manager)

### CORS Origins Hardcoded
- **Risk:** CORS configuration is hardcoded to localhost only
- **Files:** 
  - `notetakingapp/src/main/java/com/notetakingapp/config/SecurityConfig.java` (line 58)
  - `notetakingapp/src/main/java/com/notetakingapp/config/CorsConfig.java`
- **Current mitigation:** Only localhost:4200 is allowed
- **Recommendations:** Make allowed origins configurable via environment variable

### Database Credentials in Configuration
- **Risk:** Database username and password are stored in plaintext
- **Files:** 
  - `notetakingapp/src/main/resources/application.properties` (lines 5-7)
  - `notetakingapp/docker-compose.yaml` (lines 7-8)
- **Current mitigation:** None
- **Recommendations:** Use environment variables or Docker secrets

### Password Encoder Strength
- **Current:** BCrypt with work factor 12 is used (line 71 in SecurityConfig)
- **Assessment:** Adequate for current use, but should be reviewed periodically

## Performance Bottlenecks

### Search with Wildcard Prefix
- **Problem:** Search uses `LIKE '%query%'` which cannot use indexes efficiently
- **Files:** `notetakingapp/src/main/java/com/notetakingapp/repository/NoteRepository.java`
- **Cause:** Leading wildcard in LIKE clause prevents index usage
- **Improvement path:** 
  - Consider PostgreSQL full-text search (tsvector/tsquery)
  - Or use Elasticsearch/OpenSearch for search functionality

### Inconsistent Pagination
- **Problem:** Some endpoints return arrays instead of paginated responses
- **Files:** 
  - `notetakingapp/src/main/java/com/notetakingapp/controller/NoteController.java` (lines 93-128)
  - `notetakingapp-frontend/src/app/core/services/note.service.ts` (lines 93-102)
- **Cause:** getPinnedNotes and getArchivedNotes return `Note[]` instead of `Page<Note>`
- **Improvement path:** Standardize all list endpoints to return paginated responses

## Fragile Areas

### Note Ownership Verification
- **Files:** `notetakingapp/src/main/java/com/notetakingapp/service/impl/NoteServiceImpl.java` (lines 158-166)
- **Why fragile:** Ownership check happens after fetching note from database (N+1 potential issue)
- **Safe modification:** Add database-level ownership check in repository layer
- **Test coverage:** No explicit test for ownership bypass scenarios

### Bulk Delete Without Validation
- **Files:** `notetakingapp/src/main/java/com/notetakingapp/service/impl/NoteServiceImpl.java` (lines 127-130)
- **Why fragile:** Bulk delete uses `deleteAllByIdInAndUserId` without validating each ID individually
- **Safe modification:** Add validation to ensure all IDs belong to user before deletion

## Scaling Limits

### Single Database Connection Pool
- **Current capacity:** Default HikariCP pool settings (typically 10 connections)
- **Limit:** Will bottleneck under high concurrent user load
- **Scaling path:** Configure connection pool size based on expected load, consider read replicas

### In-Memory Search
- **Current:** Search uses database LIKE queries
- **Limit:** Performance degrades significantly with large note volumes (>10,000 notes per user)
- **Scaling path:** Implement dedicated search solution (PostgreSQL FTS, Elasticsearch)

## Dependencies at Risk

### Spring Boot DevTools in Runtime
- **Risk:** spring-boot-devtools is included with runtime scope
- **Impact:** Enables remote code execution if application is deployed with devtools
- **Files:** `notetakingapp/pom.xml` (lines 54-58)
- **Migration plan:** Remove devtools dependency for production builds

### Outdated Angular Version
- **Risk:** Using Angular 21.x (cutting edge), may have compatibility issues with libraries
- **Impact:** Potential dependency conflicts, limited community support for edge versions
- **Migration plan:** Consider stabilizing on Angular 17 LTS or 18.x

## Missing Critical Features

### User Email Verification
- **Problem:** No email verification process implemented
- **Blocks:** Cannot trust user email addresses for notifications

### Password Reset Flow
- **Problem:** No password reset or forgot password functionality
- **Blocks:** Users cannot recover accounts if password is forgotten

### User Account Lockout Not Enforced
- **Problem:** isAccountNonLocked() always returns true, isAccountNonExpired() always returns true
- **Files:** `notetakingapp/src/main/java/com/notetakingapp/entity/User.java` (lines 79-91)
- **Blocks:** Cannot implement account suspension or temporary lockout

### Rate Limiting
- **Problem:** No rate limiting on authentication or API endpoints
- **Blocks:** Vulnerable to brute force attacks on login endpoint

## Test Coverage Gaps

### Backend Tests
- **What's not tested:** Service layer logic, repository queries, security filter behavior
- **Files:** `notetakingapp/src/test/java/com/notetakingapp/`
- **Risk:** Business logic changes could break functionality without detection
- **Priority:** High

### Frontend Tests
- **What's not tested:** Components, services, guards, interceptors
- **Files:** Only `notetakingapp-frontend/src/app/app.spec.ts` exists
- **Risk:** UI changes could introduce bugs without detection
- **Priority:** High

### Integration Tests
- **What's not tested:** End-to-end API workflows, authentication flows
- **Risk:** Integration issues between components may go unnoticed
- **Priority:** Medium

## Compilation Issues

### Test Files Have Wrong Constructor Signatures
- **Issue:** AuthControllerTest uses incorrect constructor signatures for DTOs
- **Files:** `notetakingapp/src/test/java/com/notetakingapp/controller/AuthControllerTest.java`
- **Symptoms:** Constructor errors for RegisterRequest and LoginRequest
- **Priority:** High - tests will not compile

### Lombok Annotations Not Processed
- **Issue:** MapStruct mapper shows errors for Note entity properties
- **Files:** `notetakingapp/src/main/java/com/notetakingapp/mapper/NoteMapper.java`
- **Symptoms:** "Unknown property" errors for all Note fields
- **Cause:** Lombok annotations not being processed before MapStruct annotation processor
- **Priority:** High - indicates potential mapper misconfiguration

### Builder Pattern Not Working
- **Issue:** ApiResponse and AuthResponse builders showing errors
- **Files:** 
  - `notetakingapp/src/main/java/com/notetakingapp/dto/response/ApiResponse.java`
  - `notetakingapp/src/main/java/com/notetakingapp/dto/response/AuthResponse.java`
- **Symptoms:** "The method builder() is undefined" errors
- **Priority:** High - code will not compile

### Missing Lombok Log Field
- **Issue:** GlobalExceptionHandler and services missing log field
- **Files:** 
  - `notetakingapp/src/main/java/com/notetakingapp/exception/GlobalExceptionHandler.java`
  - `notetakingapp/src/main/java/com/notetakingapp/service/impl/AuthServiceImpl.java`
- **Symptoms:** "log cannot be resolved" errors
- **Priority:** High - code will not compile

### Missing Getter Methods
- **Issue:** AuthServiceImpl references methods that don't exist
- **Files:** 
  - `notetakingapp/src/main/java/com/notetakingapp/service/impl/AuthServiceImpl.java`
  - `notetakingapp/src/main/java/com/notetakingapp/dto/request/LoginRequest.java`
  - `notetakingapp/src/main/java/com/notetakingapp/dto/request/RegisterRequest.java`
- **Symptoms:** "The method getUsername() is undefined" errors
- **Priority:** High - code will not compile

---

*Concerns audit: 2026-03-18*
