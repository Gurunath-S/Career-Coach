# CareerCatch — Centralized Database Schema

Database: **PostgreSQL**  
ORM: **Prisma Client v6.19.3**  
Location: [server/prisma/schema.prisma](file:///home/guru/Documents/IBT-TECH/on-going/Career%20Catch/career-catch/server/prisma/schema.prisma)

---

## 1. Entity Relationship Overview

```mermaid
erDiagram
    User ||--o| StudentProfile : "has profile"
    User {
        string id PK
        string name
        string email UK
        string passwordHash
        Role role
        string avatar
        datetime createdAt
        datetime updatedAt
    }

    StudentProfile ||--o{ EventRegistration : "registers"
    StudentProfile {
        string id PK
        string userId FK
        string phone
        string education
        string college
        int graduationYear
        string currentRole
        string bio
        string resumeUrl
        string[] skills
    }

    EventCategory ||--o{ Event : "categorizes"
    EventCategory {
        string id PK
        string name UK
        string slug UK
        string description
    }

    Event ||--o{ EventRegistration : "has attendees"
    Event {
        string id PK
        string title
        string slug UK
        string description
        string categoryId FK
        string speakerName
        string speakerRole
        string speakerCompany
        string speakerAvatar
        string bannerUrl
        datetime eventDate
        string duration
        string location
        int capacity
        int registeredCount
        boolean isPublished
        boolean isFeatured
        string[] tags
    }

    EventRegistration {
        string id PK
        string eventId FK
        string studentId FK
        string status
        datetime createdAt
    }

    Course ||--o{ Enrollment : "has students"
    Course {
        int id PK
        string title
        string slug UK
        string description
        string category
        string instructor
        string instructorAvatar
        string thumbnail
        float rating
        int reviews
        string duration
        Level level
        float price
        float originalPrice
        boolean isPublished
        json syllabus
    }

    Enquiry {
        int id PK
        string fullName
        string email
        string phone
        string course
        string message
        string source
        EnquiryStatus status
        string notes
        string assignedTo
        datetime followUpDate
        datetime createdAt
        datetime updatedAt
    }
```

---

## 2. Core Tables & Enums

### Role Enum
- `SUPER_ADMIN`: Root operations management.
- `ADMIN`: Content & workshop operations.
- `EDITOR`: Syllabus & workshop contributor.
- `STUDENT`: Public registered student learner.

### EnquiryStatus Enum
- `NEW`: Fresh inquiry from website lead forms.
- `CONTACTED`: Senior advisor made initial outreach.
- `INTERESTED`: Candidate evaluated curriculum.
- `ENROLLED`: Completed registration.
- `FOLLOW_UP`: Re-schedule requested.
- `NOT_INTERESTED`: Disqualified lead.

### Content Models
- `Category`: Domain tracks (Full Stack, Cloud, AI).
- `Technology`: Modern tech stack (React, Next.js, AWS, Kafka).
- `Mentor`: Industry mentors with credentials.
- `Testimonial`: Verified alumni reviews with salary hike percentages.
- `FAQ`: Categorized common questions.
- `Project`: Real-world portfolio capstones.
- `HiringPartner`: Hiring partner logos and partner tiers.
