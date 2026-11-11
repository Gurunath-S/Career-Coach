import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../config/db'
import { successResponse } from '../../utils/apiResponse'

const fallbackCategories = [
  { id: 'cat_cloud', name: 'Cloud & Architecture', slug: 'cloud-architecture' },
  { id: 'cat_web', name: 'Full Stack', slug: 'full-stack' },
  { id: 'cat_ai', name: 'AI & Data Science', slug: 'ai-data-science' },
  { id: 'cat_design', name: 'UI/UX Design', slug: 'uiux-design' },
]

export async function listCategories(req: Request, res: Response, next: NextFunction) {
  try {
    try {
      const dbCategories = await prisma.eventCategory.findMany({ orderBy: { name: 'asc' } })
      if (dbCategories.length > 0) return successResponse(res, dbCategories)
    } catch {
      // DB offline fallback
    }
    return successResponse(res, fallbackCategories)
  } catch (error) {
    next(error)
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, slug, description } = req.body
    try {
      const created = await prisma.eventCategory.create({
        data: { name, slug, description },
      })
      return successResponse(res, created, 'Category created', 201)
    } catch {
      const newCat = { id: `cat_${Date.now()}`, name, slug, description }
      fallbackCategories.push(newCat)
      return successResponse(res, newCat, 'Category created', 201)
    }
  } catch (error) {
    next(error)
  }
}
