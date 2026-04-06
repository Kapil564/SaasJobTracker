# API Integration Status Report

This document tracks all the endpoints available on the backend server and their integration status with the frontend React application.

**Legend:**
- [x] **Connected**: The endpoint is wired up via Axios/Fetch on the frontend and utilized by components.
- [ ] **Not Connected**: The endpoint exists on the backend but is not yet called by any frontend services.

---

## 🔐 Auth Endpoints (`/api/auth`)
*Base URL handled by AuthContext.*

- [x] `POST /api/auth/register` — Creates a new user account.
- [x] `POST /api/auth/login` — Authenticates user and establishes session.
- [x] `GET /api/auth/me` — Fetches current authenticated user data.
- [ ] `POST /api/auth/google` — Handles Google OAuth / SSO logins.
- [x] `PATCH /api/auth/profile` — Allows the user to update their profile information.

---

## 📁 Application Endpoints (`/api/applications`)
*Base URL handled by `api.js` application services.*

- [x] `GET /api/applications/stats` — Retrieves application pipeline statistics.
- [x] `GET /api/applications` — Fetches all applications for the current user.
- [x] `POST /api/applications` — Creates a new application entry.
- [x] `PATCH /api/applications/:id` — Updates an existing application.
- [x] `DELETE /api/applications/:id` — Removes an application from tracking.
- [ ] `GET /api/applications/:id` — Fetches the details of a single specific application.

---

## 🤖 AI Endpoints (`/api/ai`)
*These endpoints power the AI Assistant features.*

- [ ] `GET /api/ai/:applicationId/cover-letter` — Generates a customized cover letter for a specific application.
- [ ] `GET /api/ai/:applicationId/score` — Analyzes compatibility and generates a match score between the user and the job.
- [ ] `GET /api/ai/:applicationId/prep` — Generates bespoke interview preparation material.
- [ ] `GET /api/ai/:applicationId/red-flags` — Identifies potential red flags inside the parsed job description.
- [ ] `POST /api/ai/:applicationId/email-reply` — Drafts intelligent contextual email replies to recruiters.

---

*Last Updated: April 2026*
