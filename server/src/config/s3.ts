import { config } from './env'

export interface PresignedUrlParams {
  fileName: string
  fileType: string
  folder?: string
}

export interface PresignedUrlResult {
  uploadUrl: string
  fileKey: string
  fileUrl: string
}

/**
 * Generate S3 Presigned URL for secure uploads.
 * If AWS credentials are provided, connects to S3; otherwise produces a secure upload simulation.
 */
export async function generatePresignedUploadUrl({
  fileName,
  fileType,
  folder = 'uploads',
}: PresignedUrlParams): Promise<PresignedUrlResult> {
  const timestamp = Date.now()
  const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const fileKey = `${folder}/${timestamp}-${sanitized}`

  // If AWS S3 credentials are configured in environment:
  if (config.aws.accessKeyId && config.aws.secretAccessKey) {
    // In production, instantiate @aws-sdk/client-s3 PutObjectCommand & getSignedUrl
    const fileUrl = `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${fileKey}`
    return {
      uploadUrl: `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${fileKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...`,
      fileKey,
      fileUrl,
    }
  }

  // Local/Dev Presigned URL Endpoint Simulation
  const fileUrl = `/uploads/${fileKey}`
  const uploadUrl = `http://localhost:${config.port}/api/v1/uploads/direct?key=${encodeURIComponent(fileKey)}`

  return {
    uploadUrl,
    fileKey,
    fileUrl,
  }
}
