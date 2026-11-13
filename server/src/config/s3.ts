import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
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

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
})

export async function generatePresignedUploadUrl({
  fileName,
  fileType,
  folder = 'uploads',
}: PresignedUrlParams): Promise<PresignedUrlResult> {
  const timestamp = Date.now()
  const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const fileKey = `${folder}/${timestamp}-${sanitized}`

  const command = new PutObjectCommand({
    Bucket: config.aws.bucketName,
    Key: fileKey,
    ContentType: fileType,
  })

  // Generates real cryptographic presigned URL valid for 15 minutes
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 })
  const fileUrl = `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${fileKey}`

  return { uploadUrl, fileKey, fileUrl }
}
