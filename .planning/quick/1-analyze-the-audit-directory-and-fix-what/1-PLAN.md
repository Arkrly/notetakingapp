---
phase: quick
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - frontend/src/app/auth/login/login.component.ts
  - frontend/src/app/auth/login/login.component.html
  - frontend/src/app/auth/register/register.component.ts
  - frontend/src/app/auth/register/register.component.html
autonomous: true
must_haves:
  truths:
    - "Users can login with username/password and be authenticated"
    - "Users can register with a valid username that works with login"
    - "Login form calls the backend API and stores JWT token"
  artifacts:
    - path: "frontend/src/app/auth/login/login.component.ts"
      provides: "Login form with working AuthService.login() call"
      contains: "authService.login"
    - path: "frontend/src/app/auth/login/login.component.html"
      provides: "Login form with username field (not email)"
      contains: "formControlName=\"username\""
    - path: "frontend/src/app/auth/register/register.component.ts"
      provides: "Registration form with username field and validation"
      contains: "username.*Validators.pattern"
    - path: "frontend/src/app/auth/register/register.component.html"
      provides: "Registration form with Username label (not Full Name)"
      contains: "Username"
---

<objective>
Fix critical authentication bugs so users can actually log in.

**CRIT-001:** LoginComponent uses setTimeout instead of calling AuthService.login() — no JWT stored, all API calls fail.
**CRIT-002:** Login form sends 'email' but backend expects 'username'.
**CRIT-003:** Register form has 'Full Name' field but backend rejects spaces in username.
</objective>

<context>
@audit/issues.md (lines 76-140 - Critical issues only)
@audit/issues.json (items CRIT-001, CRIT-002, CRIT-003)

Key backend expectations:
- LoginRequest: { username, password } — NOT email
- RegisterRequest: username must match ^[a-zA-Z0-9_]+$ (no spaces)
</context>

<tasks>
<task type="auto">
<name>Fix login component to call AuthService with correct field names</name>
<files>frontend/src/app/auth/login/login.component.ts, frontend/src/app/auth/login/login.component.html</files>
<action>
1. In login.component.ts:
   - Inject AuthService and Router
   - Replace setTimeout in onSubmit() with: this.authService.login(credentials.username, credentials.password).subscribe({ next: () => this.router.navigate(['/notes']), error: (err) => { this.loginError = 'Invalid credentials'; this.isLoading = false; } })
   - Remove the fake setTimeout navigation

2. In login.component.html:
   - Change formControlName from 'email' to 'username'
   - Update label from "Email" to "Username"
   - Remove email validator, keep required validator

3. Ensure AuthService.login() sends { username, password } to backend (check if it already does)
</action>
<verify>
<automated>grep -n "authService.login" frontend/src/app/auth/login/login.component.ts</automated>
<done>Login form submits to POST /api/v1/auth/login with {username, password}, navigates to /notes on success</done>
</task>

<task type="auto">
<name>Fix register component to use username field with validation</name>
<files>frontend/src/app/auth/register/register.component.ts, frontend/src/app/auth/register/register.component.html</files>
<action>
1. In register.component.ts:
   - Change formControlName from 'fullName' to 'username'
   - Add regex validator: Validators.pattern(/^[a-zA-Z0-9_]{3,50}$/)
   - Add error message for invalid username format

2. In register.component.html:
   - Change label from "Full Name" to "Username"
   - Update placeholder to "Choose a username"
   - Add validation error message: "Username can only contain letters, numbers, and underscores"
</action>
<verify>
<parameter name="automated">grep -n "formControlName=\"username\"" frontend/src/app/auth/register/register.component.html</verify>
<done>Register form accepts username only (no spaces), validates against backend regex</done>
</task>

<task type="checkpoint:human-verify">
<name>Verify authentication flow works end-to-end</name>
<what-built>Fixed login and register components with correct API calls</what-built>
<how-to-verify>
1. Start backend: cd notetakingapp && mvn spring-boot:run
2. Start frontend: cd frontend && ng serve
3. Register: Navigate to /register, enter username "testuser" (no spaces), email, password
4. Login: Navigate to /login, enter username "testuser", password
5. Verify: Should navigate to /notes without 401 errors
</how-to-verify>
<resume-signal>Type "approved" or describe issues</resume-signal>
</task>
</tasks>

<verification>
- [ ] Login form sends POST /api/v1/auth/login with {username, password}
- [ ] No setTimeout fake login in LoginComponent
- [ ] Login form uses username field (not email)
- [ ] Register form uses username field with regex validation
- [ ] Register form label says "Username" not "Full Name"
</verification>

<success_criteria>
Users can register with a valid username and successfully log in to access protected routes.
</success_criteria>

<output>
After completion, create `.planning/quick/1-analyze-the-audit-directory-and-fix-what/1-SUMMARY.md`
</output>