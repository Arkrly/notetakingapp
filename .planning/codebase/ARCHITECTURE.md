# Architecture

**Analysis Date:** 2026-03-18

## Pattern Overview

**Overall:** Monolithic Full-Stack Application with REST API

This is a traditional multi-tier architecture with a Java/Spring Boot backend exposing a REST API and an Angular frontend consuming that API. The application follows standard layered architecture patterns on both sides.

**Key Characteristics:**
- **Backend:** Spring Boot REST API with layered architecture (Controller → Service → Repository)
- **Frontend:** Angular 19+ standalone components with service-based state management
- **Communication:** HTTP REST API with JWT authentication
- **Database:** JPA/Hibernate with Spring Data (implied by repository pattern)

## Layers

### Backend (Java/Spring Boot)

**Presentation Layer - Controllers:**
- Location: `notetakingapp/src/main/java/com/notetakingapp/controller/`
- Contains: `AuthController.java`, `NoteController.java`, `UserController.java`
- Depends on: Service layer
- Used by: Frontend HTTP clients

**Service Layer:**
- Location: `notetakingapp/src/main/java/com/notetakingapp/service/`
- Contains: Interfaces (`AuthService.java`, `NoteService.java`, `UserService.java`) and implementations (`impl/`)
- Depends on: Repository layer, Security utilities
- Used by: Controllers

**Repository Layer:**
- Location: `notetakingapp/src/main/java/com/notetakingapp/repository/`
- Contains: `NoteRepository.java`, `UserRepository.java`
- Depends on: Entity layer, Spring Data JPA
- Used by: Service layer

**Entity Layer:**
- Location: `notetakingapp/src/main/java/com/notetakingapp/entity/`
- Contains: `Note.java`, `User.java`
- Used by: Repository, Mapper, Service layers

**Security Layer:**
- Location: `notetakingapp/src/main/java/com/notetakingapp/security/`
- Contains: `JwtFilter.java`, `JwtUtils.java`, `UserDetailsServiceImpl.java`
- Responsibilities: JWT token generation/validation, user authentication

**Configuration Layer:**
- Location: `notetakingapp/src/main/java/com/notetakingapp/config/`
- Contains: `SecurityConfig.java`, `CorsConfig.java`, `OpenApiConfig.java`
- Responsibilities: Security setup, CORS, API documentation

**DTO/Mapping Layer:**
- Location: `notetakingapp/src/main/java/com/notetakingapp/dto/`, `mapper/`
- Contains: Request/Response DTOs, Mapper interfaces (`UserMapper.java`, `NoteMapper.java`)
- Responsibilities: Data transformation between entity and API layers

**Exception Handling:**
- Location: `notetakingapp/src/main/java/com/notetakingapp/exception/`
- Contains: Custom exceptions (`ValidationException.java`, `ResourceNotFoundException.java`, `UnauthorizedException.java`), `GlobalExceptionHandler.java`
- Responsibilities: Centralized error handling with consistent API responses

### Frontend (Angular 19+ Standalone)

**Root Component:**
- Location: `notetakingapp-frontend/src/app/app.ts`
- Responsibilities: Application bootstrap, routing outlet

**Routing Layer:**
- Location: `notetakingapp-frontend/src/app/app.routes.ts`
- Contains: Route definitions with lazy-loading-ready structure
- Guards: `AuthGuard` protects authenticated routes

**Core Services:**
- Location: `notetakingapp-frontend/src/app/core/services/`
- Contains: `AuthService.ts`, `NoteService.ts`, `UserService.ts`
- Responsibilities: HTTP communication, business logic, state management via RxJS observables
- Uses: Angular `HttpClient` with interceptors

**HTTP Interceptors:**
- Location: `notetakingapp-frontend/src/app/core/interceptors/`
- Contains: `auth.interceptor.ts` (adds JWT header), `error.interceptor.ts` (global error handling)
- Responsibilities: Request/response transformation

**Feature Modules (by route):**
- Location: `notetakingapp-frontend/src/app/auth/`, `notes/`, `user/`
- Contains: Page components organized by feature

**Shared Components:**
- Location: `notetakingapp-frontend/src/app/shared/components/`
- Contains: Reusable UI components (`sidebar`, `confirm-dialog`)

**Models:**
- Location: `notetakingapp-frontend/src/app/core/models/`
- Contains: TypeScript interfaces (`Note.ts`, `User.ts`, `ApiResponse.ts`)

## Data Flow

### Note Creation Flow:
1. User fills form in `NoteFormComponent` (`notes/note-form/note-form.component.ts`)
2. Component calls `NoteService.createNote()` 
3. Service sends POST to `http://localhost:8080/api/v1/notes`
4. `AuthInterceptor` adds JWT Bearer token to request
5. Backend `NoteController.createNote()` receives request
6. Service validates and persists via `NoteRepository`
7. Response mapped to `NoteResponse` DTO
8. Angular service returns Observable to component

### Authentication Flow:
1. User submits login in `LoginComponent` (`auth/login/login.component.ts`)
2. `AuthService.login()` sends POST to `/api/v1/auth/login`
3. Backend returns JWT token in `AuthResponse`
4. Frontend stores token (implied - check `AuthService` for storage method)
5. `AuthGuard` checks authentication status for protected routes

## Key Abstractions

**DTO Pattern (Backend):**
- Request DTOs: `CreateNoteRequest`, `UpdateNoteRequest`, `PatchNoteRequest`, `LoginRequest`, `RegisterRequest`
- Response DTOs: `ApiResponse<T>`, `NoteResponse`, `UserResponse`, `AuthResponse`
- Location: `notetakingapp/src/main/java/com/notetakingapp/dto/`

**Mapper Pattern:**
- Uses MapStruct or manual mappers (`UserMapper.java`, `NoteMapper.java`)
- Transforms Entity ↔ DTO

**Service Interface Pattern:**
- Interfaces define contracts (`NoteService.java`)
- Implementations in `impl/` package
- Enables dependency injection and testing

**API Response Wrapper:**
- All responses wrapped in `ApiResponse<T>` with structure: `{ success: boolean, message: string, data: T }`
- Location: `dto/response/ApiResponse.java`

## Entry Points

**Backend Entry Point:**
- Location: `notetakingapp/src/main/java/com/notetakingapp/NotetakingappApplication.java`
- Triggers: Spring Boot main class - `SpringApplication.run(NotetakingappApplication.class, args)`
- Responsibilities: Application bootstrap, component scanning, auto-configuration

**Frontend Entry Point:**
- Location: `notetakingapp-frontend/src/main.ts`
- Triggers: Angular bootstrap - `bootstrapApplication(App, appConfig)`
- Responsibilities: Application bootstrap, provider registration

**Backend API Base:**
- URL: `http://localhost:8080/api/v1`
- All endpoints: `/api/v1/auth/*`, `/api/v1/notes/*`, `/api/v1/users/*`

**Frontend Dev Server:**
- URL: `http://localhost:4200`

## Error Handling

**Backend Strategy:**
- Centralized in `GlobalExceptionHandler.java` using `@ControllerAdvice`
- Custom exceptions for specific error types
- Returns `ApiResponse` with `success: false`

**Frontend Strategy:**
- `ErrorInterceptor` catches HTTP errors globally
- `ngx-toastr` displays error notifications
- Component-level error handling for specific operations

## Cross-Cutting Concerns

**Logging:** Not explicitly configured (add logging framework if needed)

**Validation:**
- Backend: Jakarta Validation (`@Valid` annotations on DTOs)
- Frontend: Angular Reactive Forms (implied by form components)

**Authentication:**
- JWT-based stateless authentication
- Bearer token in Authorization header
- BCrypt password encoding (strength 12)

**CORS:**
- Configured for `http://localhost:4200` (Angular dev server)
- Allows: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- Credentials allowed

**API Documentation:**
- OpenAPI/Swagger configured via `OpenApiConfig.java`
- Available at `/swagger-ui.html` (when enabled)

---

*Architecture analysis: 2026-03-18*
