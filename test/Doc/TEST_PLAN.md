# Pariksha - Test Plan

**Version:** 1.0
**Date:** 2026-01-02
**Application:** Pariksha - Examination Platform

---

## 1. Introduction
This document prescribes the scope, approach, resources, and schedule of the testing activities for the Pariksha application. The goal is to verify the stability, security, and usability of the platform for both Admins and Students.

## 2. Scope
### 2.1 In-Scope
*   **Authentication**: Login, Request Access, Logout.
*   **Admin Module**: Dashboard analytics, Exam creation/edit, Student/Group management, Access control.
*   **Student Module**: Dashboard, Exam Player (functionality & security), Result viewing.
*   **System**: Database persistence, Role-based access control (RBAC), Audit logging.

### 2.2 Out-of-Scope
*   Load testing (concurrent user stress tests).
*   Third-party payment gateways (none implemented).
*   Native mobile app testing (PWA/Responsive web only).

## 3. Test Strategy
We will conduct **Manual Functional Testing** focusing on:
1.  **Positive Testing**: Verifying happy paths (e.g., successful exam submission).
2.  **Negative Testing**: Verifying error handling (e.g., login with bad password, entering exam after end time).
3.  **UI/UX Testing**: Checking responsiveness and clarity of interface.

## 4. Test Environment
*   **URL**: `http://localhost:3000` (Local Dev) or Staging URL.
*   **Browser**: Chrome (latest), Safari (latest).
*   **Database**: Local Postgres instance.
*   **Test Data**:
    *   Admin User: `admin@example.com`
    *   Student User: `student@example.com`

## 5. Entry & Exit Criteria
### Entry Criteria
*   Build successful (`npm run build`).
*   Database schema migrated (`npx prisma db push`).
*   Test accounts created.

### Exit Criteria
*   All "Critical" and "High" priority test cases passed.
*   No open critical bugs.
*   Exam Player flow verified stable (no crashes).

## 6. Deliverables
*   **Test Cases (CSV)**: `test/test_cases.csv`
*   **Test Results Log**: `test/TEST_REQUEST_LOG.md`
*   **Defect Reports**: Logged in GitHub Issues (or project tracker).

---
*Prepared by QA Team*
