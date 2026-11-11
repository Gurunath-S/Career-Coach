import { Request, Response, NextFunction } from 'express'
import { generatePresignedUploadUrl } from '../../config/s3'
import { successResponse } from '../../utils/apiResponse'
import { ApiError } from '../../utils/apiError'

export async function requestPresignedUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileName, fileType, folder } = req.body

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(fileType)) {
      throw ApiError.badRequest('Invalid file format. Only JPEG, PNG, WebP, and SVG are supported.')
    }

    const result = await generatePresignedUploadUrl({
      fileName,
      fileType,
      folder: folder || 'events',
    })

    return successResponse(res, result, 'Presigned upload URL generated successfully')
  } catch (error) {
    next(error)
  }
}

/**
 * Local simulation upload handler for dev environments where live AWS S3 credentials are unset.
 */
export async function directUploadSimulation(req: Request, res: Response, next: NextFunction) {
  try {
    const key = req.query.key as string
    if (!key) throw ApiError.badRequest('Missing upload key')

    // Accepts raw image buffer or stream
    return res.status(200).json({
      success: true,
      message: 'File simulated successfully to local asset store',
      fileKey: key,
      url: `/uploads/${key}`,
    })
  } catch (error) {
    next(error)
  }
}
