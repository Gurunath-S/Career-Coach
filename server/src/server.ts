import { createApp } from './app'
import { config } from './config/env'

const app = createApp()

const server = app.listen(config.port, () => {
  console.log(`🚀 CareerCatch Backend API listening on http://localhost:${config.port}`)
  console.log(`📡 Environment: ${config.nodeEnv}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})
