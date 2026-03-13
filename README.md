# Note Taker

A full-stack note-taking application with a Spring Boot backend and Angular frontend.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.6-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## Overview

Note Taker is a cloud-based note-taking REST API with JWT authentication built with Spring Boot on the backend and Angular on the frontend.

## Features

- **JWT Authentication** - Secure user authentication with JSON Web Tokens
- **REST API** - Full CRUD operations for notes
- **Swagger/OpenAPI** - Interactive API documentation
- **Angular Material** - Modern, responsive UI components
- **PostgreSQL Database** - Reliable data persistence with Flyway migrations

## Project Structure

```
note_taker/
├── package.json              # Root package with dev script
├── .gitignore
├── notetakingapp/           # Spring Boot backend
│   ├── pom.xml
│   ├── src/
│   └── docker-compose.yaml
└── notetakingapp-frontend/  # Angular frontend
    ├── package.json
    └── src/
```

## Prerequisites

- **Java 21** or higher
- **Maven** 3.8+
- **Node.js 20+** and npm
- **PostgreSQL 16** (or use Docker)

## Quick Start

### 1. Start the database

```bash
cd notetakingapp
docker-compose up -d
```

This starts PostgreSQL on port `5432` with:
- Database: `notetakingapp`
- User: `notetakingapp_user`
- Password: `notetakingapp_pass`

### 2. Start both frontend and backend

```bash
npm run dev
```

This command concurrently starts:
- **Backend**: Spring Boot application on `http://localhost:8080`
- **Frontend**: Angular dev server on `http://localhost:4200`

### 3. Access the application

- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api
- Swagger API Docs: http://localhost:8080/swagger-ui.html

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run backend` | Start only the Spring Boot backend |
| `npm run frontend` | Start only the Angular frontend |

### Backend (Spring Boot)

```bash
cd notetakingapp
mvn spring-boot:run
```

### Frontend (Angular)

```bash
cd notetakingapp-frontend
npm start
```

## Configuration

### Backend

Configure the database connection in `notetakingapp/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/notetakingapp
spring.datasource.username=notetakingapp_user
spring.datasource.password=notetakingapp_pass
```

### Frontend

The frontend proxies API requests to the backend. See `notetakingapp-frontend/proxy.conf.json` for configuration.

## Technology Stack

### Backend
- Spring Boot 3.3.6
- Spring Security
- Spring Data JPA
- PostgreSQL
- Flyway
- JWT (jjwt)
- MapStruct
- Lombok
- SpringDoc OpenAPI

### Frontend
- Angular 21
- Angular Material
- Angular Router
- RxJS
- TypeScript 5.9

## License

This project is for educational purposes.
