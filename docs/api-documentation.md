# CareerCatch — Centralized REST API Documentation

Base URL: `http://localhost:5000/api/v1`

All responses follow the standard JSON payload structure:
```json
{
  "success": true,
  "message": "Human readable message",
  "data": { ... }
}
```

---

## 1. Authentication (`/auth`)

### `POST /auth/admin/login`
- **Access**: Public
- **Body**: `{ "email": "admin@careercatch.in", "password": "..." }`
- **Response**: `{ "token": "JWT_TOKEN", "user": { "id": "...", "name": "...", "role": "SUPER_ADMIN" } }`

### `POST /auth/student/login`
- **Access**: Public
- **Body**: `{ "email": "student@example.com", "password": "..." }`
- **Response**: `{ "token": "JWT_TOKEN", "user": { "id": "...", "name": "...", "role": "STUDENT" } }`

### `POST /auth/student/register`
- **Access**: Public
- **Body**: `{ "name": "...", "email": "...", "password": "...", "phone": "...", "college": "..." }`
- **Response**: `{ "token": "JWT_TOKEN", "user": { ... } }`

### `GET /auth/me`
- **Access**: Authenticated (`Authorization: Bearer <token>`)

---

## 2. Events & Workshops (`/events`)

### `GET /events`
- **Access**: Public
- **Query Params**: `category`, `publishedOnly=true|false`
- **Response**: Array of `Event` objects.

### `GET /events/:id`
- **Access**: Public
- **Response**: Single `Event` object.

### `POST /events`
- **Access**: Admin only (`SUPER_ADMIN`, `ADMIN`, `EDITOR`)
- **Body**: Validated against `eventSchema` (Title, Slug, Speaker, Date, Duration, Location, etc.)

### `PUT /events/:id`
- **Access**: Admin only
- **Body**: Updated event fields.

### `DELETE /events/:id`
- **Access**: Admin only (`SUPER_ADMIN`, `ADMIN`)

### `PATCH /events/:id/publish`
- **Access**: Admin only
- **Body**: `{ "isPublished": true | false }`

---

## 3. Inquiries & Admissions Leads (`/enquiries`)

### `POST /enquiries`
- **Access**: Public (Website counseling and lead capture forms)
- **Body**: `{ "fullName": "...", "email": "...", "phone": "...", "course": "...", "message": "..." }`

### `GET /enquiries`
- **Access**: Admin only
- **Query Params**: `status`, `page`, `limit`
- **Response**: Paginated list of student leads.

### `PATCH /enquiries/:id`
- **Access**: Admin only
- **Body**: `{ "status": "CONTACTED", "notes": "Counselor demo booked" }`

---

## 4. File Uploads & S3 Presigned URLs (`/uploads`)

### `POST /uploads/presigned-url`
- **Access**: Admin only
- **Body**: `{ "fileName": "banner.jpg", "fileType": "image/jpeg", "folder": "events", "fileSize": 2048576 }`
- **Response**:
```json
{
  "uploadUrl": "https://...s3.ap-south-1.amazonaws.com/...",
  "fileKey": "events/1794393289-banner.jpg",
  "fileUrl": "https://...s3.ap-south-1.amazonaws.com/events/1794393289-banner.jpg"
}
```

---

## 5. Student Hub (`/students`)

### `GET /students/profile`
- **Access**: Student (`Authorization: Bearer <token>`)
- **Response**: `StudentProfile` with education, skills, and event registrations.

### `PUT /students/profile`
- **Access**: Student
- **Body**: `{ "phone": "...", "college": "...", "skills": ["React", "AWS"] }`

### `POST /students/events/:eventId/register`
- **Access**: Student
- **Response**: Registration confirmation.
