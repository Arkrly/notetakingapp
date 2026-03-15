# Frontend Documentation

## Technology Stack

- Angular 21
- Angular Material
- Angular Router
- RxJS
- TypeScript 5.9

## Project Structure

```
notetakingapp-frontend/
├── src/
│   ├── app/
│   │   ├── auth/              # Authentication components
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── core/              # Core services and guards
│   │   │   ├── services/     # API services
│   │   │   ├── guards/        # Route guards
│   │   │   ├── interceptors/  # HTTP interceptors
│   │   │   └── models/        # TypeScript interfaces
│   │   ├── notes/             # Notes feature
│   │   │   ├── notes-list/
│   │   │   ├── note-card/
│   │   │   └── note-form/
│   │   ├── shared/           # Shared components
│   │   │   └── components/
│   │   │       ├── sidebar/
│   │   │       └── confirm-dialog/
│   │   └── user/             # User feature
│   │       └── profile/
│   └── environments/         # Environment configuration
├── proxy.conf.json           # API proxy configuration
└── package.json
```

## Services

### AuthService

Handles authentication operations:

- `login(email, password)` - Authenticate user
- `register(username, email, password)` - Register new user
- `logout()` - Clear tokens and logout
- `getToken()` - Get JWT token from storage

### NoteService

Handles note operations:

- `getNotes(pageable)` - Get paginated notes
- `getNoteById(id)` - Get single note
- `createNote(note)` - Create new note
- `updateNote(id, note)` - Update note
- `patchNote(id, patch)` - Partial update note
- `deleteNote(id)` - Delete note
- `bulkDeleteNotes(ids)` - Delete multiple notes
- `searchNotes(query, pageable)` - Search notes
- `getPinnedNotes(pageable)` - Get pinned notes
- `getArchivedNotes(pageable)` - Get archived notes

### UserService

Handles user profile operations:

- `getProfile()` - Get current user
- `updateProfile(data)` - Update profile
- `changePassword(current, new)` - Change password

## Interceptors

### AuthInterceptor

Attaches JWT token to outgoing requests:

```typescript
Authorization: Bearer <token>
```

### ErrorInterceptor

Handles HTTP error responses globally.

## Guards

### authGuard

Protects routes requiring authentication. Redirects to `/login` if not authenticated.

## Configuration

### Environment

- `environment.ts` - Development configuration
- `environment.prod.ts` - Production configuration

### API Proxy

The frontend proxies API requests to the backend via `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false
  }
}
```

## Running the Frontend

```bash
cd notetakingapp-frontend
npm start
```

The frontend runs on `http://localhost:4200`.
