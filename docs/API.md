# API Documentation

## Base URL

```
http://localhost:8080/api/v1
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT token |

#### Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

---

### Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | Get all notes (paginated) |
| GET | `/notes/{id}` | Get note by ID |
| POST | `/notes` | Create a new note |
| PUT | `/notes/{id}` | Full update a note |
| PATCH | `/notes/{id}` | Partial update (pin, archive, color, tags) |
| DELETE | `/notes/{id}` | Delete a note |
| DELETE | `/notes/bulk` | Bulk delete notes |
| GET | `/notes/search?q={query}` | Search notes |
| GET | `/notes/pinned` | Get pinned notes |
| GET | `/notes/archived` | Get archived notes |
| HEAD | `/notes/{id}` | Check note existence |

#### Note Object

```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "color": "string",
  "isPinned": true,
  "isArchived": false,
  "tags": ["string"],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PUT | `/users/me` | Update user profile |
| PATCH | `/users/me/password` | Change password |
| DELETE | `/users/me` | Soft delete account |
| HEAD | `/users/check?email={email}` | Check email existence |

---

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

## Pagination

Notes endpoints support pagination:

```
GET /api/v1/notes?page=0&size=10&sort=createdAt,desc
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| page | 0 | Page number |
| size | 10 | Page size |
| sort | createdAt,desc | Sort field and direction |

## Swagger UI

Interactive API documentation is available at:

```
http://localhost:8080/swagger-ui.html
```
