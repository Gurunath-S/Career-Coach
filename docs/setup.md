# CareerCatch — Local Setup & Development Guide

## 1. Prerequisites

- **Node.js**: v20 or v22 LTS (Verified on Node.js v22.22.2)
- **Package Manager**: npm (v10+)
- **Database**: PostgreSQL (Supabase, Neon, or local PostgreSQL instance)

---

## 2. Quickstart Monorepo Commands

From the workspace root (`career-catch/`):

```bash
# 1. Install all dependencies across all apps & packages
npm install

# 2. Start all applications concurrently or independently:
npm run dev:website   # Next.js Public Website & Student Hub (http://localhost:3000)
npm run dev:admin     # Vite Admin Operations Console (http://localhost:5173)
npm run dev:backend   # Express REST API (http://localhost:5000)

# 3. Production builds across all workspaces
npm run build
```

---

## 3. Environment Variables Configuration

Create a `.env` in `apps/backend/`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/careercatch?schema=public"
JWT_SECRET="careercatch_super_secure_jwt_secret_2026"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="*"

# AWS S3 Configuration (Optional for local dev, fallback active)
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET="careercatch-assets"
```

---

## 4. Default Login Credentials (Dev Mode)

### Administrator Portal (`http://localhost:5173`)
- **Email**: `admin@careercatch.in`
- **Password**: `Admin@2026`
- **Permissions**: `SUPER_ADMIN` (Full event creation, publish control, lead tracking)

### Student Portal (`http://localhost:3000/student/login`)
- **Email**: `student@example.com`
- **Password**: Any password (or use `/student/register` to create a new profile)
