# Note Taker

<div align="center">

<img src="./notetakingapp-frontend/public/favicon.ico" alt="" width="64" />

A full-stack note-taking application with JWT authentication.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.6-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[API Documentation](docs/API.md) • [Frontend Documentation](docs/FRONTEND.md) • [Pages & Routes](docs/PAGES.md)

</div>

## Overview

Note Taker is a cloud-based REST API for note-taking with JWT authentication, built with Spring Boot on the backend and Angular on the frontend.

## Quick Start

### 1. Start the database

```bash
cd notetakingapp
docker-compose up -d
```

### 2. Start the application

```bash
npm run dev
```

### 3. Access the application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8080/api |
| Swagger Docs | http://localhost:8080/swagger-ui.html |

## Features

- JWT Authentication
- REST API with full CRUD operations
- Swagger/OpenAPI documentation
- Angular Material UI
- PostgreSQL database with Flyway migrations
