# Coding Conventions

**Analysis Date:** 2026-03-18

## Naming Patterns

**Files:**
- Components: `*.component.ts` (e.g., `notes-list.component.ts`)
- Services: `*.service.ts` (e.g., `note.service.ts`)
- Models: `*.model.ts` (e.g., `note.model.ts`)
- Guards: `*.guard.ts` (e.g., `auth.guard.ts`)
- Interceptors: `*.interceptor.ts` (e.g., `error.interceptor.ts`)

**Functions:**
- Methods: camelCase (e.g., `getNotes()`, `createNote()`, `isLoggedIn()`)
- Observables: camelCase with `$` suffix for stream variables (e.g., `notes$`, `currentUser$`)

**Variables:**
- camelCase: `searchControl`, `isLoading$`, `refresh$`
- Private members use underscore prefix: `private http = inject(HttpClient)`

**Types:**
- PascalCase for interfaces and types: `Note`, `NoteColor`, `CreateNoteRequest`, `ApiResponse`
- Type exports use `export type` for unions/aliases (e.g., `export type NoteColor = 'white' | 'yellow' | ...`)

## Code Style

**Formatting:**
- Tool: Prettier
- Config: `.prettierrc`
  - `printWidth: 100`
  - `singleQuote: true`
  - Angular parser for HTML files

**Linting:**
- Not explicitly configured (no .eslintrc found)
- Uses Angular's built-in linting via `@angular/build`

**Indentation:**
- EditorConfig: 2 spaces
- `indent_size: 2` in `.editorconfig`
- `indent_style: space`

**Quotes:**
- TypeScript: Single quotes (`quote_type = single`)
- Prettier enforces `singleQuote: true`

## Import Organization

**Order:**
1. Angular core imports (`@angular/core`, `@angular/common`)
2. Third-party library imports (`rxjs`, `@angular/material`, etc.)
3. Relative imports from local modules

**Example:**
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note, NoteColor } from '../models/note.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
```

**Path Aliases:**
- Relative paths used for local imports
- No tsconfig path aliases configured

## Angular Patterns

**Dependency Injection:**
- Uses `inject()` function (Angular 14+ functional DI): `private http = inject(HttpClient);`
- Constructor injection for services requiring initialization

**Standalone Components:**
- All components use `standalone: true`
- Explicit `imports` array in `@Component` decorator

**Functional Guards:**
- Uses functional guards: `export const authGuard: CanActivateFn = (route, state) => { ... }`

**Functional Interceptors:**
- Uses functional interceptors: `export const errorInterceptor: HttpInterceptorFn = (req, next) => { ... }`

## Error Handling

**HTTP Errors:**
- Centralized in `error.interceptor.ts` using functional interceptor
- Handles status codes: 401, 403, 404, 409, 422, 400, 500
- Displays toast notifications via `ngx-toastr`
- 401 triggers automatic logout

**Service-Level Errors:**
- Try-catch blocks for localStorage operations:
```typescript
private getStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
```

**Component-Level Errors:**
- RxJS `catchError` operator returns safe defaults:
```typescript
catchError(() => of({ success: false, data: null } as unknown as ApiResponse<...>))
```

**Error Messages:**
- User-friendly messages via Toastr
- Technical details logged in error object

## Logging

**Framework:** ngx-toastr (for user notifications)

**Patterns:**
- Error toasts: `toastr.error(message, title)`
- Used in error interceptor for HTTP errors
- No console logging conventions detected

## Comments

**When to Comment:**
- Not extensively documented
- JSDoc-style comments for interfaces/types

**Example:**
```typescript
export interface CreateNoteRequest {
  title: string;
  content?: string;
  color?: string;
  tags?: string;
}
```

## Function Design

**Size:** No strict limit - components can be large (143 lines in `notes-list.component.ts`)

**Parameters:**
- Typed interfaces for request/response objects
- Default parameter values supported: `getNotes(page: number = 0, size: number = 10)`

**Return Values:**
- Services return `Observable<T>` for async operations
- Components expose observable streams

## Module Design

**Exports:**
- Named exports only
- Services use `@Injectable({ providedIn: 'root' })` for singleton pattern
- Components marked as `standalone: true`

**Barrel Files:**
- Not detected - imports use explicit relative paths

## Component Structure

**Component Files:**
```typescript
@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [ /* dependencies */ ],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {
  // inject dependencies
  // declare observable streams
  // implement lifecycle hooks
}
```

**Template References:**
- External: `templateUrl` (not inline)
- External: `styleUrls` (array for multiple stylesheets)

---

*Convention analysis: 2026-03-18*
