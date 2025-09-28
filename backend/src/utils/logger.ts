import { format } from 'date-fns'
import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      levelFirst: true,
      colorize: true,
      translateTime: format(new Date(), 'dd/MM/yyyy HH:mm:ss')
    }
  }
})

export { logger }
