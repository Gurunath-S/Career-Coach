import 'dotenv/config'
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Seed Admin User
  const adminEmail = 'admin@careercatch.in'
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@2026', 10)
    await prisma.user.create({
      data: {
        name: 'CareerCatch Admin',
        email: adminEmail,
        passwordHash,
        role: Role.SUPER_ADMIN,
      },
    })
    console.log('✓ Admin user seeded (admin@careercatch.in)')
  }

  // 2. Seed Event Categories
  const categories = [
    { id: 'cat_cloud', name: 'Cloud & Architecture', slug: 'cloud-architecture', description: 'Cloud infrastructure & system design' },
    { id: 'cat_web', name: 'Full Stack', slug: 'full-stack', description: 'Frontend, backend, and full-stack web engineering' },
    { id: 'cat_ai', name: 'AI & Data Science', slug: 'ai-data-science', description: 'Machine learning, AI agents, and big data' },
    { id: 'cat_design', name: 'UI/UX Design', slug: 'uiux-design', description: 'Product design, user research, and prototyping' },
  ]

  for (const cat of categories) {
    await prisma.eventCategory.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    })
  }
  console.log('✓ Event categories seeded')

  // 3. Seed Events
  const events = [
    {
      id: 'evt_1',
      title: 'System Design at Scale: Microservices with AWS',
      slug: 'system-design-microservices-aws',
      description: 'Learn how to architect high-throughput distributed systems using AWS ECS, Redis caching, and Kafka streaming.',
      categoryId: 'cat_cloud',
      speakerName: 'Sneha Patel',
      speakerRole: 'Staff Cloud Architect',
      speakerCompany: 'AWS',
      speakerAvatar: '/images/faculty/sneha-patel.jpg',
      bannerUrl: '/images/courses/cloud-aws.jpg',
      eventDate: new Date(Date.now() + 86400000 * 2),
      duration: '90 Minutes',
      location: 'Online (Zoom Room)',
      capacity: 250,
      registeredCount: 184,
      isPublished: true,
      isFeatured: true,
      tags: ['AWS', 'Microservices', 'Distributed Systems'],
    },
    {
      id: 'evt_2',
      title: 'Cracking Modern Full-Stack Interviews in 2026',
      slug: 'cracking-fullstack-interviews-2026',
      description: 'A deep-dive into full-stack coding rounds, Next.js hydration challenges, SQL optimization, and live mock interview breakdowns.',
      categoryId: 'cat_web',
      speakerName: 'Ravi Kumar',
      speakerRole: 'Lead Software Engineer',
      speakerCompany: 'Google Alumni',
      speakerAvatar: '/images/faculty/ravi-kumar.jpg',
      bannerUrl: '/images/courses/fullstack-web.jpg',
      eventDate: new Date(Date.now() + 86400000 * 5),
      duration: '2 Hours',
      location: 'Live Stream & Q&A',
      capacity: 500,
      registeredCount: 312,
      isPublished: true,
      isFeatured: true,
      tags: ['React', 'Next.js', 'System Design', 'Interviews'],
    },
  ]

  for (const evt of events) {
    await prisma.event.upsert({
      where: { id: evt.id },
      update: evt,
      create: evt,
    })
  }
  console.log('✓ Initial events seeded')

  // 4. Seed Courses
  const courses = [
    {
      id: 1,
      title: 'Full Stack Web Development',
      slug: 'full-stack-web-development',
      category: 'Full Stack',
      instructor: 'Ravi Kumar',
      instructorAvatar: '/images/faculty/ravi-kumar.jpg',
      thumbnail: '/images/courses/fullstack-web.jpg',
      rating: 4.8,
      reviews: 312,
      duration: '48 Hours',
      price: 4999,
      originalPrice: 9999,
      isPublished: true,
    },
    {
      id: 2,
      title: 'Data Science & Machine Learning',
      slug: 'data-science-machine-learning',
      category: 'Data Science',
      instructor: 'Priya Sharma',
      instructorAvatar: '/images/faculty/priya-sharma.jpg',
      thumbnail: '/images/courses/datascience-ai.jpg',
      rating: 4.9,
      reviews: 278,
      duration: '52 Hours',
      price: 5999,
      originalPrice: 11999,
      isPublished: true,
    },
    {
      id: 3,
      title: 'Cloud Computing with AWS',
      slug: 'cloud-computing-aws',
      category: 'Cloud Computing',
      instructor: 'Sneha Patel',
      instructorAvatar: '/images/faculty/sneha-patel.jpg',
      thumbnail: '/images/courses/cloud-aws.jpg',
      rating: 4.8,
      reviews: 241,
      duration: '44 Hours',
      price: 5499,
      originalPrice: 10999,
      isPublished: true,
    },
  ]

  for (const c of courses) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    })
  }
  console.log('✓ Courses seeded')

  // 5. Seed Testimonials
  const testimonials = [
    {
      id: 1,
      quote: "CareerCatch didn't just teach me to code; it helped me build real projects and land my first SDE role in 4 months.",
      name: 'Rahul Verma',
      role: 'Software Engineer',
      company: 'Razorpay',
      avatar: 'https://picsum.photos/seed/testimonial-rahul/64/64',
      rating: 5,
      featured: true,
      isApproved: true,
    },
    {
      id: 2,
      quote: "The mentors here genuinely care. My reviewer caught issues in my code I'd never have found on my own. Worth every rupee.",
      name: 'Anjali Desai',
      role: 'Data Analyst',
      company: 'Swiggy',
      avatar: 'https://picsum.photos/seed/testimonial-anjali/64/64',
      rating: 5,
      featured: true,
      isApproved: true,
    },
    {
      id: 3,
      quote: "After two years of self-study going nowhere, CareerCatch's structured path finally got me hired.",
      name: 'Karthik Nair',
      role: 'Frontend Developer',
      company: 'CRED',
      avatar: 'https://picsum.photos/seed/testimonial-karthik/64/64',
      rating: 5,
      featured: false,
      isApproved: true,
    },
  ]

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    })
  }
  console.log('✓ Testimonials seeded')

  // 6. Seed Initial Enquiries
  const countEnquiries = await prisma.enquiry.count()
  if (countEnquiries === 0) {
    await prisma.enquiry.createMany({
      data: [
        {
          fullName: 'Rahul Varma',
          email: 'rahul.varma@example.com',
          phone: '9845123456',
          course: 'Full Stack Web Development',
          message: 'Interested in the upcoming weekend cohort with placement guarantee.',
          source: 'Website Hero Form',
          status: 'NEW',
          notes: 'Called once, requested call back at 6pm.',
        },
        {
          fullName: 'Ananya Sen',
          email: 'ananya.sen@example.com',
          phone: '9731298765',
          course: 'Data Science & Machine Learning',
          message: 'Looking for syllabus details and EMI payment plans.',
          source: 'Floating CTA',
          status: 'CONTACTED',
          notes: 'Counselor demo scheduled.',
        },
      ],
    })
    console.log('✓ Sample enquiries seeded')
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
