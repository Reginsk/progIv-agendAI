import 'dotenv/config'
import gracefulShutdown from 'http-graceful-shutdown'
import app from './app'
import { AppDataSource } from './database/data-source'
import { logger } from './utils/logger'

logger.info('Starting...')
logger.info(`Environment: ${process.env.NODE_ENV}`)

AppDataSource.initialize()
  .then(async () => {
    logger.info('Database initialized!')
    logger.info('Running migrations...')
    await AppDataSource.runMigrations()
    logger.info('Migrations ran successfully!')

    const server = app.listen(process.env.PORT, async () => {
      logger.info('Starting server...')
    })

    gracefulShutdown(server)
  })
  .catch(err => logger.error(err))
