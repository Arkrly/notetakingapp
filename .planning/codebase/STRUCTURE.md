# Codebase Structure

**Analysis Date:** 2026-03-18

## Directory Layout

```
notetakingapp/                           # Backend (Java/Spring Boot)
├── src/
│   ├── main/java/com/notetakingapp/
│   │   ├── config/                     # Configuration classes
│   │   ├── controller/                 # REST controllers
│   │   ├── dto/                        # Data Transfer Objects
│   │   │   ├── request/                # Request DTOs
│   │   │   └── response/               # Response DTOs
│   │   ├── entity/                     # JPA entities
│   │   ├── exception/                  # Custom exceptions + handler
│   │   ├── mapper/                     # Entity-DTO mappers
│   │   ├── repository/                 # Spring Data repositories
│   │   ├── security/                   # JWT & authentication
│   │   ├── service/                    # Business logic
│   │   │   └── impl/                   # Service implementations
│   │   └── NotetakingappApplication.java
│   └── main/resources/                 # Application properties
├── pom.xml                              # Maven build config
└── docker-compose.yaml                  # Local dev services

notetakingapp-frontend/                  # Frontend (Angular 19+)
├── src/
│   ├── app/
│   │   ├── auth/                       # Auth feature (login/register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── core/                       # Core services & guards
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── models/
│   │   │   └── services/
│   │   ├── notes/                      # Notes feature
│   │   │   ├── note-card/
│   │   │   ├── note-form/
│   │   │   └── notes-list/
│   │   ├── shared/                     # Shared components
│   │   │   └── components/
│   │   │       ├── confirm-dialog/
│   │   │       └── sidebar/
│   │   ├── user/                       # User feature
│   │   │   └── profile/
│   │   ├── app.component.ts/html/css
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.ts
│   ├── environments/                   # Environment configs
│   ├── index.html
│   ├── main.ts                         # Bootstrap entry
│   ├── styles.css
│   └── material-theme.scss
├── angular.json
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## Directory Purposes

### Backend (notetakingapp/)

**`src/main/java/com/notetakingapp/controller/`:**
- Purpose: REST API endpoints
- Contains: `AuthController.java`, `NoteController.java`, `UserController.java`
- Key files: Each controller handles one resource domain

**`src/main/java/com/notetakingapp/service/`:**
- Purpose: Business logic layer
- Contains: Interface definitions + `impl/` subdirectory with implementations
- Key files: `NoteService.java`, `AuthService.java`, `UserService.java`

**`src/main/java/com/notetakingapp/repository/`:**
- Purpose: Data access layer
- Contains: Spring Data JPA repositories (`NoteRepository.java`, `UserRepository.java`)

**`src/main/java/com/notetakingapp/entity/`:**
- Purpose: Database domain models
- Contains: `Note.java`, `User.java`

**`src/main/java/com/notetakingapp/dto/`:**
- Purpose: API contract objects
- Contains: `request/` (CreateNoteRequest, LoginRequest, etc.) and `response/` (ApiResponse, NoteResponse, etc.)

**`src/main/java/com/notetakingapp/exception/`:**
- Purpose: Error handling
- Contains: Custom exceptions + `GlobalExceptionHandler.java` for centralized handling

**`src/main/java/com/notetakingapp/security/`:**
- Purpose: Authentication & authorization
- Contains: `JwtFilter.java`, `JwtUtils.java`, `UserDetailsServiceImpl.java`

**`src/main/java/com/notetakingapp/config/`:**
- Purpose: Application configuration
- Contains: `SecurityConfig.java`, `CorsConfig.java`, `OpenApiConfig.java`

**`src/main/java/com/notetakingapp/mapper/`:**
- Purpose: Entity ↔ DTO transformations
- Contains: `NoteMapper.java`, `UserMapper.java`

### Frontend (notetakingapp-frontend/)

**`src/app/auth/`:**
- Purpose: Authentication pages
- Contains: `login/`, `register/` subdirectories with components
- Key files: `login.component.ts`, `register.component.ts`

**`src/app/core/`:**
- Purpose: Core application services and guards
- Contains: `services/` (API services), `guards/` (route guards), `interceptors/` (HTTP interceptors), `models/` (TypeScript interfaces)
- Key files: `note.service.ts`, `auth.service.ts`, `auth.guard.ts`, `auth.interceptor.ts`

**`src/app/notes/`:**
- Purpose: Notes feature module
- Contains: `notes-list/`, `note-card/`, `note-form/` subdirectories
- Key files: `notes-list.component.ts`, `note-card.component.ts`, `note-form.component.ts`

**`src/app/shared/`:**
- Purpose: Reusable components
- Contains: `components/` with `sidebar/`, `confirm-dialog/`

**`src/app/user/`:**
- Purpose: User management pages
- Contains: `profile/` subdirectory
- Key files: `profile.component.ts`

**`src/environments/`:**
- Purpose: Environment-specific configuration
- Contains: `environment.ts` (dev), `environment.prod.ts` (prod)
- Key config: API base URL (`http://localhost:8080/api/v1`)

## Key File Locations

### Entry Points

- Backend: `notetakingapp/src/main/java/com/notetakingapp/NotetakingappApplication.java` - Spring Boot main class
- Frontend: `notetakingapp-frontend/src/main.ts` - Angular bootstrap

### Configuration

- Backend: `notetakingapp/src/main/resources/` - Application properties
- Frontend: `notetakingapp-frontend/angular.json` - Angular CLI config
- Environment: `notetakingapp-frontend/src/environments/environment.ts`

### Core Logic

- Backend Controllers: `notetakingapp/src/main/java/com/notetakingapp/controller/`
- Backend Services: `notetakingapp/src/main/java/com/notetakingapp/service/`
- Frontend Services: `notetakingapp-frontend/src/app/core/services/`

### Testing

- Backend Tests: `notetakingapp/src/test/java/com/notetakingapp/controller/`
- Frontend Tests: `notetakingapp-frontend/src/app/` (co-located with `*.spec.ts` files)

## Naming Conventions

### Backend (Java)

**Files:**
- Classes: PascalCase (`NoteController.java`, `NoteServiceImpl.java`)
- Interfaces: PascalCase with optional suffix (`NoteService.java`)

**Packages:**
- Lowercase, dot-separated (`com.notetakingapp.controller`)

**Java Classes:**
- Controllers: `{Entity}Controller.java` (`NoteController.java`)
- Services: `{Entity}Service.java`, `{Entity}ServiceImpl.java`
- Repositories: `{Entity}Repository.java`
- DTOs: `{Entity}{Request|Response}.java`, `{Action}{Request|Response}.java`
- Entities: PascalCase (`Note.java`, `User.java`)

### Frontend (TypeScript/Angular)

**Files:**
- Components: kebab-case (`note-card.component.ts`)
- Services: kebab-case with `.service` suffix (`note.service.ts`)
- Models/Interfaces: kebab-case (`.model.ts`)
- Guards: kebab-case with `.guard` suffix (`auth.guard.ts`)
- Interceptors: kebab-case with `.interceptor` suffix (`auth.interceptor.ts`)

**Directories:**
- Feature modules: lowercase, hyphenated (`auth/`, `notes/`, `user/`)
- Components within features: lowercase, hyphenated (`notes-list/`, `note-card/`)

**TypeScript:**
- Interfaces: PascalCase (`Note`, `User`, `ApiResponse`)
- Types: PascalCase

## Where to Add New Code

### New Backend Feature

1. **Controller:** Add to `notetakingapp/src/main/java/com/notetakingapp/controller/`
2. **Service:** Add interface to `service/` + implementation to `service/impl/`
3. **Repository:** Add to `repository/` (if new entity)
4. **DTOs:** Add request/response DTOs to `dto/request/` and `dto/response/`
5. **Entity:** Add to `entity/` (if new domain object)
6. **Mapper:** Add to `mapper/` (if new entity)
7. **Tests:** Add to `src/test/java/com/notetakingapp/controller/`

### New Frontend Feature

1. **Component:** Create in `src/app/{feature-name}/` (e.g., `notes/`)
2. **Service:** Add to `src/app/core/services/`
3. **Model:** Add to `src/app/core/models/`
4. **Route:** Add to `src/app/app.routes.ts`
5. **Guard:** Add to `src/app/core/guards/` (if route protection needed)
6. **Test:** Add `*.spec.ts` co-located with component

### New Shared Component

1. **Component:** Add to `src/app/shared/components/{component-name}/`
2. **Styles:** Component-specific CSS in same directory

## Special Directories

**`notetakingapp-frontend/src/environments/`:**
- Purpose: Environment configuration (API URLs, feature flags)
- Generated: No (manually maintained)
- Committed: Yes

**`notetakingapp-frontend/public/`:**
- Purpose: Static assets (favicon, etc.)
- Generated: No
- Committed: Yes

**`notetakingapp/.mvn/`:**
- Purpose: Maven wrapper JAR
- Generated: Yes
- Committed: Yes

---

*Structure analysis: 2026-03-18*
