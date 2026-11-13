import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../config/db'
import { successResponse } from '../../utils/apiResponse'

export async function getCourses(req: Request, res: Response, next: NextFunction) {
  try {
    try {
      const courses = await prisma.course.findMany({ where: { isPublished: true } })
      if (courses.length > 0) return successResponse(res, courses)
    } catch {
      // DB fallback
    }
    return successResponse(res, [
      {
        id: 1,
        title: 'Full Stack Web Development',
        category: 'Full Stack',
        instructor: 'Ravi Kumar',
        instructorAvatar: '/images/faculty/ravi-kumar.jpg',
        thumbnail: '/images/courses/fullstack-web.jpg',
        rating: 4.8,
        reviews: 312,
        duration: '48 Hours',
        level: 'Beginner',
        price: 4999,
        originalPrice: 9999,
      },
      {
        id: 2,
        title: 'Data Science & Machine Learning',
        category: 'Data Science',
        instructor: 'Priya Sharma',
        instructorAvatar: '/images/faculty/priya-sharma.jpg',
        thumbnail: '/images/courses/datascience-ai.jpg',
        rating: 4.9,
        reviews: 278,
        duration: '52 Hours',
        level: 'Intermediate',
        price: 5999,
        originalPrice: 11999,
      },
      {
        id: 3,
        title: 'Cloud Computing with AWS',
        category: 'Cloud Computing',
        instructor: 'Sneha Patel',
        instructorAvatar: '/images/faculty/sneha-patel.jpg',
        thumbnail: '/images/courses/cloud-aws.jpg',
        rating: 4.8,
        reviews: 241,
        duration: '44 Hours',
        level: 'Intermediate',
        price: 5499,
        originalPrice: 10999,
      },
    ])
  } catch (error) {
    next(error)
  }
}

export async function getMentors(req: Request, res: Response, next: NextFunction) {
  try {
    try {
      const mentors = await prisma.mentor.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
      if (mentors.length > 0) return successResponse(res, mentors)
    } catch {
      // fallback
    }
    return successResponse(res, [
      {
        id: 1,
        name: 'Ravi Kumar',
        role: 'Lead Full Stack Engineer',
        company: 'Ex-Google',
        experience: '8+ Years Exp',
        avatar: '/images/faculty/ravi-kumar.jpg',
      },
      {
        id: 2,
        name: 'Priya Sharma',
        role: 'Senior ML Engineer',
        company: 'Microsoft',
        experience: '7+ Years Exp',
        avatar: '/images/faculty/priya-sharma.jpg',
      },
      {
        id: 3,
        name: 'Sneha Patel',
        role: 'Staff Cloud Architect',
        company: 'AWS Alumni',
        experience: '9+ Years Exp',
        avatar: '/images/faculty/sneha-patel.jpg',
      },
    ])
  } catch (error) {
    next(error)
  }
}

export async function getTestimonials(req: Request, res: Response, next: NextFunction) {
  try {
    try {
      const testimonials = await prisma.testimonial.findMany({
        where: { isApproved: true },
        orderBy: { id: 'asc' },
      })
      if (testimonials.length > 0) return successResponse(res, testimonials)
    } catch {
      // DB fallback
    }
    return successResponse(res, [
      {
        id: 1,
        quote: "CareerCatch didn't just teach me to code; it helped me build real projects and land my first SDE role in 4 months.",
        name: "Rahul Verma",
        role: "Software Engineer",
        company: "Razorpay",
        avatar: "https://picsum.photos/seed/testimonial-rahul/64/64",
        rating: 5,
        featured: true,
      },
      {
        id: 2,
        quote: "The mentors here genuinely care. My reviewer caught issues in my code I'd never have found on my own. Worth every rupee.",
        name: "Anjali Desai",
        role: "Data Analyst",
        company: "Swiggy",
        avatar: "https://picsum.photos/seed/testimonial-anjali/64/64",
        rating: 5,
        featured: true,
      },
      {
        id: 3,
        quote: "After two years of self-study going nowhere, CareerCatch's structured path finally got me hired.",
        name: "Karthik Nair",
        role: "Frontend Developer",
        company: "CRED",
        avatar: "https://picsum.photos/seed/testimonial-karthik/64/64",
        rating: 5,
        featured: false,
      },
      {
        id: 4,
        quote: "The mock interviews were brutally honest and exactly what I needed. I felt over-prepared on the actual interview day.",
        name: "Meera Iyer",
        role: "UX Designer",
        company: "Atlassian",
        avatar: "https://picsum.photos/seed/testimonial-meera/64/64",
        rating: 5,
        featured: false,
      },
    ])
  } catch (error) {
    next(error)
  }
}

export async function getFAQs(req: Request, res: Response, next: NextFunction) {
  try {
    try {
      const faqs = await prisma.fAQ.findMany({ orderBy: { sortOrder: 'asc' } })
      if (faqs.length > 0) {
        return successResponse(
          res,
          faqs.map((f) => ({ id: f.id, q: f.question, a: f.answer, category: f.category }))
        )
      }
    } catch {
      // DB fallback
    }
    return successResponse(res, [
      { q: "What courses does CareerCatch offer?", a: "We offer industry-aligned tech courses across Web Development, Data Science, UI/UX Design, Cloud Computing, Mobile Development, Cybersecurity, and AI/ML - all taught by active industry professionals." },
      { q: "Do I need prior coding experience?", a: "No. Most of our courses are designed for beginners. We start from fundamentals and progressively build toward job-ready skills. We also offer advanced courses for experienced learners." },
      { q: "How are the live classes conducted?", a: "All live classes run on Zoom with interactive Q&A, screen sharing, and real-time code reviews. Recordings are available for 90 days after each session." },
      { q: "What is the course duration?", a: "Course durations range from 36 to 60 hours of content spread across 3 to 5 months, depending on the program. Courses are designed to fit alongside full-time study or work." },
      { q: "Is there a placement guarantee?", a: "We offer placement support including resume reviews, mock interviews, and recruiter connections, but do not guarantee a specific salary. Our 95% placement rate reflects students who receive job offers within 6 months of completion." },
    ])
  } catch (error) {
    next(error)
  }
}

export async function getProjects(req: Request, res: Response, next: NextFunction) {
  try {
    try {
      const projects = await prisma.project.findMany({ orderBy: { sortOrder: 'asc' } })
      if (projects.length > 0) {
        return successResponse(
          res,
          projects.map((p) => ({
            id: p.id,
            name: p.name,
            title: p.name,
            description: p.description,
            tags: p.tags,
            img: p.image,
            image: p.image,
            difficulty: p.difficulty,
            metrics: p.metrics,
            githubUrl: p.githubUrl,
            liveUrl: p.liveUrl,
          }))
        )
      }
    } catch {
      // DB fallback
    }
    return successResponse(res, [
      { name: "E-Commerce Platform", tags: ["React", "Node.js", "MongoDB"], img: "/images/projects/ecommerce-platform.jpg" },
      { name: "Data Analytics Dashboard", tags: ["Python", "Pandas", "Plotly"], img: "/images/projects/data-analytics.jpg" },
      { name: "Mobile Banking App", tags: ["Flutter", "Firebase"], img: "/images/projects/mobile-banking.jpg" },
      { name: "ML Recommendation Engine", tags: ["Python", "TensorFlow"], img: "/images/projects/ml-engine.jpg" },
      { name: "DevOps CI/CD Pipeline", tags: ["Docker", "AWS", "GitHub Actions"], img: "/images/projects/devops-pipeline.jpg" },
      { name: "Developer Portfolio Builder", tags: ["Next.js", "Tailwind"], img: "/images/projects/portfolio-builder.jpg" },
    ])
  } catch (error) {
    next(error)
  }
}

