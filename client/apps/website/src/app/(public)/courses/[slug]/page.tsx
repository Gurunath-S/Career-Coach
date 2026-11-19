import { COURSES } from '@/lib/constants'
import CourseDetailClient from './CourseDetailClient'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return COURSES.map((course) => ({
    slug: course.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = COURSES.find((c) => c.slug === slug)
  return {
    title: course ? `${course.title} — CareerCatch` : 'Course Details — CareerCatch',
    description: course
      ? `Enroll in ${course.title} by ${course.instructor}. Practical learning, capstone projects, and career placement support.`
      : 'Explore industry-led software engineering and data science programs at CareerCatch.',
  }
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const initialCourse = COURSES.find((c) => c.slug === slug) || null
  return <CourseDetailClient slug={slug} initialCourse={initialCourse} />
}
