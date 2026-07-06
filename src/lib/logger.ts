import pino from 'pino'
import { env, isDev } from '../config/env'

const REDACT_PATHS = [
  'req.body.password',
  'req.headers.authorization',
  'req.headers.cookie',
]

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: { paths: REDACT_PATHS, censor: '[REDACTED]' },
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
        },
      }
    : {}),
})
