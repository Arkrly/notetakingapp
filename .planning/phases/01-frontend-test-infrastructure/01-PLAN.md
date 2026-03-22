---
phase: 01-frontend-test-infrastructure
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - notetakingapp-frontend/package.json
  - notetakingapp-frontend/angular.json
  - notetakingapp-frontend/vitest.config.ts
autonomous: true
requirements:
  - TEST-01
  - TEST-02
  - TEST-03
  - TEST-04

must_haves:
  truths:
    - "User can run Angular frontend tests with Vitest browser runner"
    - "NotesListComponent has passing component tests"
    - "AuthService has passing service tests"
    - "All frontend tests pass in CI/local environments"
  artifacts:
    - path: "notetakingapp-frontend/vitest.config.ts"
      provides: "Vitest browser runner configuration"
      contains: "browser.*provider.*playwright"
    - path: "notetakingapp-frontend/src/app/notes/notes-list/notes-list.component.spec.ts"
      provides: "NotesListComponent tests"
      contains: "describe.*NotesListComponent"
    - path: "notetakingapp-frontend/src/app/core/services/auth.service.spec.ts"
      provides: "AuthService tests"
      contains: "describe.*AuthService"
  key_links:
    - from: "notetakingapp-frontend/vitest.config.ts"
      to: "notetakingapp-frontend/package.json"
      via: "npm run test:vitest"
      pattern: "vitest.*run"
    - from: "notetakingapp-frontend/angular.json"
      to: "notetakingapp-frontend/vitest.config.ts"
      via: "ng test"
      pattern: "test.*config.*vitest"
---

<objective>
Configure Vitest browser runner for Angular tests and create component tests for NotesListComponent and AuthService.
</objective>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md

**Project context:**
- Angular 21 frontend in `notetakingapp-frontend/`
- Vitest already in devDependencies (^4.0.8)
- tsconfig.spec.json has vitest/globals configured
- No vitest.config.ts exists yet
- angular.json test builder uses @angular/build:unit-test
- Existing components: NotesListComponent (`src/app/notes/notes-list/`), AuthService (`src/app/core/services/auth.service.ts`)

**Requirements:**
- TEST-01: User can run Angular frontend tests with Vitest browser runner
- TEST-02: User can run component-level tests for NotesListComponent
- TEST-03: User can run component-level tests for AuthService
- TEST-04: All frontend tests pass in CI/local environments
</context>

<tasks>

<task type="auto">
  <name>task 1: Install Vitest browser runner and create configuration</name>
  <files>
    - notetakingapp-frontend/package.json
    - notetakingapp-frontend/vitest.config.ts
  </files>
  <action>
    1. Install Vitest browser runner packages:
       - @vitest/browser
       - playwright (for browser provider)
    
    2. Create vitest.config.ts in notetakingapp-frontend/ with:
       - Browser provider: 'playwright'
       - Browser options: { headless: true, channel: 'chromium' }
       - test.globals: true
       - Include src/**/*.spec.ts files
       - reporters: ['verbose']
    
    3. Add to package.json scripts:
       - "test:vitest": "vitest run"
       - "test:vitest:watch": "vitest --watch"
       - "test:vitest:ui": "vitest --ui" (optional)
  </action>
  <verify>
    <automated>cd notetakingapp-frontend && npm install && npx vitest --version</automated>
  </verify>
  <done>
    Vitest browser runner installed, vitest.config.ts exists with browser provider configured
  </done>
</task>

<task type="auto">
  <name>task 2: Update Angular test configuration for Vitest</name>
  <files>
    - notetakingapp-frontend/angular.json
  </files>
  <action>
    Update angular.json test configuration:
    1. Change builder from "@angular/build:unit-test" to "@angular/build:generic-browser"
    2. Add options section with Vitest configuration:
       - config: "./vitest.config.ts"
       - tsConfig: "./tsconfig.spec.json"
       - polyfills: ["zone.js", "zone.js/testing"]
    3. Add test target options for different browsers if needed
  </action>
  <verify>
    <automated>cd notetakingapp-frontend && npx ng test --run</automated>
  </verify>
  <done>
    Angular test command uses Vitest browser runner, ng test executes Vitest
  </done>
</task>

<task type="auto">
  <name>task 3: Create component tests for NotesListComponent and AuthService</name>
  <files>
    - notetakingapp-frontend/src/app/notes/notes-list/notes-list.component.spec.ts
    - notetakingapp-frontend/src/app/core/services/auth.service.spec.ts
  </files>
  <action>
    Create NotesListComponent tests (notes-list.component.spec.ts):
    1. Import necessary Angular testing utilities
    2. Import Component, signal, computed from @angular/core
    3. Create test harness or simple mount test
    4. Test rendering with mock notes signal
    5. Test empty state display
    
    Create AuthService tests (auth.service.spec.ts):
    1. Import HttpClientTestingModule from @angular/common/http/testing
    2. Import TestBed from @angular/core/testing
    3. Test login() method makes correct HTTP call
    4. Test register() method makes correct HTTP call
    5. Test token storage behavior
    
    Use Vitest globals (describe, it, expect, vi) as configured in tsconfig.spec.json.
  </action>
  <verify>
    <automated>cd notetakingapp-frontend && npx vitest run src/app/notes/notes-list/notes-list.component.spec.ts src/app/core/services/auth.service.spec.ts</automated>
  </verify>
  <done>
    NotesListComponent and AuthService tests exist and pass with Vitest
  </done>
</task>

</tasks>

<verification>
Run full test suite: `cd notetakingapp-frontend && npx vitest run`
Verify:
- All tests pass (no failures)
- Tests execute in browser mode (chromium)
- NotesListComponent tests cover rendering and empty state
- AuthService tests cover login/register HTTP calls
</verification>

<success_criteria>
1. Vitest browser runner installed and configured with Playwright chromium provider
2. `ng test` or `npx vitest run` executes tests successfully
3. NotesListComponent has passing component tests
4. AuthService has passing service tests
5. All frontend tests pass in CI/local environments
</success_criteria>

<output>
After completion, create `.planning/phases/01-frontend-test-infrastructure/01-PLAN-SUMMARY.md`
</output>
