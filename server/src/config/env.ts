import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from server/.env or root .env
dotenv.config()
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/careercatch',
  jwtSecret: process.env.JWT_SECRET || 'careercatch_super_secure_jwt_secret_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigins: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) : []),
  ].filter(Boolean),
  cookieSecret: process.env.COOKIE_SECRET || 'careercatch_cookie_secret_2026',
  aws: {
    region: process.env.AWS_REGION || 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    bucketName: process.env.AWS_S3_BUCKET || 'careercatch-assets',
  },
}

// Ensure process.env.DATABASE_URL is explicitly set for Prisma runtime
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = config.databaseUrl
}

