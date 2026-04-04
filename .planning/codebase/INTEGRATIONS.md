# External Integrations

**Analysis Date:** 2026-03-18

## APIs & External Services

**No external API integrations detected.**

The application is a self-contained note-taking system with no third-party API integrations.

## Data Storage

**Databases:**
- **PostgreSQL** - Primary relational database
  - Connection: `jdbc:postgresql://localhost:5432/notetakingapp`
  - Driver: `org.postgresql.Driver`
  - ORM: Spring Data JPA with Hibernate
  - Username: `notetakingapp_user`

**File Storage:**
- Local filesystem only - No cloud storage integration (S3, Cloudinary, etc.)

**Caching:**
- None - No caching layer detected

## Authentication & Identity

**Auth Provider:**
- **Custom JWT-based authentication** (Spring Security + jjwt)
  - Implementation: Stateless JWT tokens with access/refresh token pattern
  - Token library: `io.jsonwebtoken` (jjwt 0.12.6)
  - Access token expiry: 15 minutes (900000ms)
  - Refresh token expiry: 7 days (604800000ms)
  - Algorithm: HMAC

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, Bugsnag, or similar integration

**Logs:**
- Spring Boot default logging (console output)
- SQL query logging enabled (`spring.jpa.show-sql=true`)

**API Documentation:**
- **SpringDoc OpenAPI** 2.6.0 - Swagger UI
  - UI endpoint: `/swagger-ui.html`
  - API docs: `/api-docs`

**Health Monitoring:**
- **Spring Boot Actuator**
  - Endpoints: `/actuator/health`, `/actuator/info`
  - Health details enabled

## CI/CD & Deployment

**Hosting:**
- Not configured - No deployment configuration detected
- Could deploy to: Render, Railway, Heroku, AWS ECS, etc.

**CI Pipeline:**
- None detected - No GitHub Actions, CircleCI, or similar

## Environment Configuration

**Required env vars:**
- `DB_PASSWORD` - PostgreSQL database password
- `JWT_SECRET` - JWT signing secret (minimum 32 characters)
- `SERVER_PORT` - Backend server port (default: 8080)
- `CORS_ALLOWED_ORIGINS` - Frontend URL for CORS (default: `http://localhost:4200`)

**Configuration Location:**
- `backend/src/main/resources/application.properties` - Backend config
- `.env.example` - Template for environment variables

## Webhooks & Callbacks

**Incoming:**
- None - No webhook endpoints

**Outgoing:**
- None - No outgoing webhooks

## Summary

This is a **monolithic full-stack application** with:
- Self-contained JWT authentication
- PostgreSQL database (local)
- No external API dependencies
- No cloud services (S3, SendGrid, Stripe, etc.)
- No third-party auth providers (no Google, GitHub OAuth)
- No CI/CD pipelines configured
- Development environment only

---

*Integration audit: 2026-03-18*
