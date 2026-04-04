---
phase: quick
plan: 01
subsystem: Authentication
tags:
  - auth
  - login
  - registration
  - critical-bug
dependency_graph:
  requires: []
  provides:
    - Users can register with valid username
    - Users can login with username/password
  affects:
    - AuthService
    - LoginComponent
    - RegisterComponent
tech_stack:
  added: []
  patterns:
    - Reactive Forms with validation
    - AuthService.login/register API calls
key_files:
  created: []
  modified:
    - frontend/src/app/auth/login/login.component.ts
    - frontend/src/app/auth/login/login.component.html
    - frontend/src/app/auth/register/register.component.ts
    - frontend/src/app/auth/register/register.component.html
decisions:
  - Changed login form from email to username field (backend expects username)
  - Added regex validation to register username field matching backend pattern
  - Replaced fake setTimeout login with actual AuthService.login() call
metrics:
  duration: 15 minutes
  completed_date: "2026-04-03T11:01:43Z"
---

# Quick Plan 01: Fix Critical Authentication Bugs

## One-Liner

Fixed login and register components to call backend API with correct username field instead of fake setTimeout login.

## Summary

The audit identified 3 critical authentication bugs that made the app unusable:
1. **CRIT-001:** Login used fake setTimeout instead of calling AuthService
2. **CRIT-002:** Login sent 'email' but backend expects 'username'
3. **CRIT-003:** Register sent 'fullName' but backend rejects spaces

All 3 issues are now fixed.

## Changes Made

### LoginComponent
- Injected AuthService
- Changed form from `email` to `username` field
- Replaced setTimeout with actual `authService.login()` call
- Added error handling for failed login attempts

### RegisterComponent
- Changed formControlName from `fullName` to `username`
- Added regex validator: `^[a-zA-Z0-9_]{3,50}$`
- Updated template to use `username` field and show proper validation error

### Verification
- Backend started successfully
- Registration endpoint tested: POST /api/v1/auth/register → 200 OK, JWT token returned
- Login endpoint tested: POST /api/v1/auth/login → 200 OK, JWT token returned

## Deviations from Plan

None - plan executed exactly as written.

## Auth Gates

None - authentication worked out of the box without any additional setup.

## Self-Check: PASSED

- [x] Login form sends POST /api/v1/auth/login with {username, password}
- [x] No setTimeout fake login in LoginComponent
- [x] Login form uses username field (not email)
- [x] Register form uses username field with regex validation
- [x] Register form label says "Username" not "Full Name"
- [x] Build passes (ng build succeeded)
- [x] API endpoints tested and working

## Commits

- f643591: fix(auth): connect login/register forms to backend API
