# Testing Patterns

**Analysis Date:** 2026-03-18

## Test Framework

**Runner:**
- Vitest v4.0.8 (Angular's default test builder uses Vitest)
- Configured via `@angular/build:unit-test` in `angular.json`

**Assertion Library:**
- Jasmine (Angular's built-in - used with TestBed)
- Vitest assertions available

**Run Commands:**
```bash
npm test                    # Run all tests (ng test)
npm run watch               # Watch mode (ng build --watch --configuration development)
# Coverage: No explicit coverage command found
```

## Test File Organization

**Location:**
- Co-located with source files
- Naming: `*.spec.ts` suffix

**Examples:**
- `src/app/app.spec.ts` - Main app component test
- No other spec files found in the current codebase

**Directory Pattern:**
```
src/app/
├── app.spec.ts          # Co-located with app.component.ts
├── core/
│   └── services/
│       └── note.service.ts
├── notes/
│   ├── notes-list/
│   │   └── notes-list.component.ts
│   └── note-card/
│       └── note-card.component.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, notetakingapp-frontend');
  });
});
```

**Patterns:**
- `describe()` blocks for test suites
- `beforeEach()` for test setup with async `TestBed.configureTestingModule()`
- `it()` for individual tests
- `async`/`await` for asynchronous operations
- `fixture.whenStable()` for waiting on async operations

## Mocking

**Framework:** Angular TestBed with built-in mocking modules

**Patterns Observed:**
- Component testing uses `TestBed.configureTestingModule({ imports: [...] })`
- Modules to import: Standalone component imports, Angular Material modules

**What to Mock (Best Practices):**
- HTTP requests: Use `HttpClientTestingModule`
- Services: Provide mock implementations
- Dependencies: Use `TestBed.overrideProvider()`

**Example Pattern:**
```typescript
import { HttpClientTestingModule } from '@angular/common/http/testing';

// In TestBed configuration:
imports: [
  HttpClientTestingModule,
  // ... other imports
]
```

## Fixtures and Factories

**Test Data:**
- Not explicitly organized into fixture files
- Inline test data in test cases

**Location:**
- No dedicated fixtures directory found
- Tests define data inline or use hardcoded values

## Coverage

**Requirements:** None enforced

**View Coverage:** No coverage configuration detected in project

## Test Types

**Unit Tests:**
- Component creation tests
- Template rendering tests
- Focus on component structure and basic functionality

**Integration Tests:**
- Not explicitly organized separately

**E2E Tests:** Not used (no Cypress or Protractor configured)

## Common Patterns

**Async Testing:**
```typescript
// Using whenStable() for template rendering
await fixture.whenStable();
const compiled = fixture.nativeElement as HTMLElement;

// Using async/await in beforeEach
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [App],
  }).compileComponents();
});
```

**Error Testing:**
- Not demonstrated in current test files
- Pattern would use `expect(() => {...}).toThrow()` or Jest/Vitest error matchers

## Angular-Specific Testing

**TestBed Configuration:**
- `configureTestingModule()` with imports array
- `compileComponents()` required for external templates
- Returns a `TestBed` fixture

**Component Fixture:**
```typescript
const fixture = TestBed.createComponent(App);
const component = fixture.componentInstance;
fixture.detectChanges();  // Trigger change detection
```

**DOM Testing:**
```typescript
const compiled = fixture.nativeElement as HTMLElement;
compiled.querySelector('selector');  // Query DOM elements
```

## Testing Infrastructure

**Test Configuration Files:**
- `angular.json`: `"test": { "builder": "@angular/build:unit-test" }`
- `tsconfig.spec.json`: TypeScript config for tests

**Test Entry Point:**
- No custom test setup files detected
- Uses Angular's default test runner

## Recommendations for Improvement

1. **Add More Test Coverage:**
   - Service tests for `NoteService`, `AuthService`
   - Test HTTP interceptors
   - Test guards

2. **Add HTTP Mocking:**
   - Use `HttpClientTestingModule` for service tests
   - Use `HttpTestingController` to verify requests

3. **Create Test Fixtures:**
   - Extract test data to shared fixtures
   - Create factory functions for test objects

4. **Add Coverage Reporting:**
   - Configure Vitest coverage
   - Add coverage script to `package.json`

5. **Add Error Handling Tests:**
   - Test HTTP error scenarios
   - Test edge cases in components

---

*Testing analysis: 2026-03-18*
