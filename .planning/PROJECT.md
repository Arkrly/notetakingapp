# NoteStack

## What This Is

A full-stack note-taking application with JWT authentication, built with Spring Boot (Java 21) on the backend and Angular 21 on the frontend. Users can create, edit, pin, archive, and organize notes with tags and colors.

## Core Value

Users can capture and organize their notes with a clean, responsive interface.

## Requirements

### Validated

- ✓ Frontend tests run successfully with Vitest browser runner — v1.1
- ✓ Backend warnings resolved (open-in-view, H2Dialect, PageImpl serialization) — v1.1
- ✓ SQL logging configured appropriately for environment — v1.1

### Active

## Current Milestone: v1.2 Bug Fixes

**Goal:** Find and fix bugs across frontend and backend

**Target features:**
- Full codebase audit for bugs
- Fix all identified bugs

---

### Out of Scope

- JWT secret hardening — security-focused, different milestone
- New features or functionality changes
- Performance optimization

## Context

**Tech Stack:**
- Backend: Spring Boot 3.3.6, Java 21, PostgreSQL, Flyway migrations
- Frontend: Angular 21, Angular Material, Tailwind CSS
- Testing: JUnit 5 (backend), Vitest (frontend - partially configured)

**Current State:**
- Backend compiles and passes 13 tests
- Frontend builds successfully for production
- Frontend tests fail due to missing browser test runner package

## Constraints

- **Tech Stack**: Must maintain Spring Boot 3.3.6 and Angular 21
- **Database**: PostgreSQL for production, H2 for tests

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vitest for frontend tests | Modern, fast test runner compatible with Angular 21 | — Pending |

---
*Last updated: 2026-04-02 after v1.1 milestone completed*
