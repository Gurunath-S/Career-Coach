# CareerCatch — Full-Stack Monorepo Architecture

## 1. System Overview

CareerCatch is organized as a high-performance, modular full-stack monorepo managed via **npm workspaces**:

```text
careercatch/
├── apps/
│   ├── website/          # Next.js 15 App Router (Public Website + Student Dashboard)
│   ├── admin/            # React 19 + Vite (Operations & Events Management Console)
│   └── backend/          # Node.js + Express + Prisma (Centralized REST API)
├── packages/
│   └── shared-types/     # Shared TypeScript contracts & Zod validation schemas
├── docs/                 # Architectural specifications, API references, setup guides
└── package.json          # Root monorepo workspace configuration
```

---

## 2. Component Architecture

### A. Public Website + Student Hub (`apps/website`)
- **Framework**: Next.js 15.3.3 (App Router with React 19 Server/Client Components).
- **Design System**: Ice Blue (`#F0F6FF`), Midnight Navy (`#101B3C`), Electric Royal Blue (`#155EEF`), Amber (`#FF9F1C`).
- **Public Website (Port 3000)**: All 18 approved page sections preserved with 100% visual fidelity.
- **Student Dashboard (`/student/*`)**:
  - `/student/login`: Secure student authentication.
  - `/student/register`: Student onboarding & college background capture.
  - `/student/dashboard`: Participation tracker, upcoming workshops, cohort updates.
  - `/student/events`: Masterclasses & workshops directory with 1-click registration.
  - `/student/profile`: Editable profile, graduation year, technical skills tags.

### B. Admin Dashboard (`apps/admin`)
- **Framework**: React 19 + Vite + TypeScript (Port 5173).
- **Theme**: Cohesive with CareerCatch dark slate & electric blue identity.
- **Modules**:
  - **Dashboard Overview**: Active events count, student registrations, pending inquiries, health status.
  - **Events & Workshops**: Complete CRUD operations, publish/unpublish toggle, S3 banner image upload.
  - **Inquiries & Leads**: Real-time student leads table, filter pills, search bar, and counselor remarks.

### C. Centralized Backend (`apps/backend`)
- **Runtime**: Node.js + Express + TypeScript (Port 5000).
- **Database**: PostgreSQL with Prisma ORM v6.19.3.
- **API Version**: `/api/v1/*`.
- **Security**: JWT authentication, bcrypt password hashing, and role-based access control (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `STUDENT`).
- **File Uploads**: AWS S3 presigned URL generator with MIME type and 5MB size validation.

### D. Shared Contracts (`packages/shared-types`)
- **Models**: Unified interfaces for `User`, `Role`, `Event`, `StudentProfile`, `Course`, `Mentor`, `Enquiry`.
- **Validations**: Zod schemas for forms and backend payload verification.
