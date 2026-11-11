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
