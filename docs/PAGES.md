# Pages & Routes

## Route Overview

| Path | Component | Guard | Description |
|------|-----------|-------|-------------|
| `/` | Redirects to `/notes` | - | Root redirect |
| `/login` | LoginComponent | - | User login page |
| `/register` | RegisterComponent | - | User registration page |
| `/notes` | NotesListComponent | auth | All notes list |
| `/notes/:filter` | NotesListComponent | auth | Filtered notes (pinned, archived) |
| `/profile` | ProfileComponent | auth | User profile page |
| `/**` | Redirects to `/notes` | - | Wildcard redirect |

## Pages

### Login Page (`/login`)

User authentication page with email/password form.

**Route:** `/login`

**Features:**
- Email input field
- Password input field
- Login button
- Link to registration page

### Register Page (`/register`)

New user registration page.

**Route:** `/register`

**Features:**
- Username input field
- Email input field
- Password input field
- Register button
- Link to login page

### Notes Dashboard (`/notes`)

Main notes list view.

**Route:** `/notes`

**Features:**
- List of all notes
- Create new note button
- Search notes
- Note cards with title, content preview, color, tags
- Pin/unpin notes
- Archive/unarchive notes
- Delete notes

### Filtered Notes

Filtered views for pinned and archived notes.

**Routes:**
- `/notes/pinned` - Pinned notes only
- `/notes/archived` - Archived notes only

### Profile Page (`/profile`)

User profile management.

**Route:** `/profile`

**Features:**
- View profile information
- Edit username/email
- Change password
- Delete account

## Component Structure

```
src/app/
├── auth/
│   ├── login/
│   │   └── login.component.ts
│   └── register/
│       └── register.component.ts
├── notes/
│   ├── notes-list/
│   │   └── notes-list.component.ts
│   ├── note-card/
│   │   └── note-card.component.ts
│   └── note-form/
│       └── note-form.component.ts
├── shared/components/
│   ├── sidebar/
│   │   └── sidebar.component.ts
│   └── confirm-dialog/
│       └── confirm-dialog.component.ts
└── user/
    └── profile/
        └── profile.component.ts
```
