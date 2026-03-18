# Technology Stack

**Analysis Date:** 2026-03-18

## Languages

**Primary:**
- **Java** 21 - Backend API (Spring Boot 3.3.6)
- **TypeScript** ~5.9.2 - Frontend (Angular 21)

**Secondary:**
- HTML/SCSS - Frontend templates and styling

## Runtime

**Backend:**
- Java 21 JDK
- Spring Boot 3.3.6 embedded server

**Frontend:**
- Node.js (managed via npm@11.11.0)

**Package Manager:**
- **npm** 11.11.0 (frontend)
- **Maven** (backend build)

## Frameworks

**Backend:**
- **Spring Boot** 3.3.6 - REST API framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database ORM

**Frontend:**
- **Angular** 21.2.0 - Frontend framework
- **Angular Material** 21.2.2 - UI component library
- **Tailwind CSS** 3.4.19 - Utility-first CSS framework

**Testing:**
- **Vitest** 4.0.8 - Frontend unit testing (via Angular build:unit-test)
- **Spring Boot Test** - Backend testing

**Build/Dev:**
- **Angular CLI** 21.2.1 - Frontend build tooling
- **Maven** - Backend build and dependency management
- **Concurrently** 9.1.2 - Run frontend + backend simultaneously
- **PostCSS** 8.5.8 - CSS processing
- **Autoprefixer** 10.4.27 - CSS vendor prefixes

## Key Dependencies

**Backend Critical:**
- **PostgreSQL** driver - Database connectivity
- **Flyway** - Database migrations
- **jjwt** 0.12.6 - JWT token handling
- **MapStruct** 1.6.3 - DTO mapping
- **Lombok** - Code generation
- **SpringDoc OpenAPI** 2.6.0 - Swagger documentation

**Frontend Critical:**
- **@angular/core** 21.2.0 - Core framework
- **@angular/router** 21.2.0 - Routing
- **@angular/forms** 21.2.0 - Form handling
- **@angular/material** 21.2.2 - Material Design components
- **RxJS** ~7.8.0 - Reactive programming
- **ngx-toastr** 20.0.5 - Toast notifications

## Configuration

**Environment:**
- `.env` file for local development (see `.env.example`)
- Environment variables:
  - `DB_PASSWORD` - Database password
  - `JWT_SECRET` - JWT signing secret
  - `SERVER_PORT` - Backend port (default 8080)
  - `CORS_ALLOWED_ORIGINS` - Frontend URL

**Backend Configuration:**
- `application.properties` - Main Spring Boot config
- Flyway migrations in `src/main/resources/db/migration`

**Frontend Configuration:**
- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Platform Requirements

**Development:**
- Node.js (for frontend)
- Java 21 JDK (for backend)
- PostgreSQL database (local or container)
- npm 11.11.0+

**Production:**
- Java 21 runtime
- PostgreSQL database
- Serve static Angular build (nginx, etc.)

---

*Stack analysis: 2026-03-18*
