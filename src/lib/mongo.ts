import mongoose from 'mongoose'
import { env } from '../config/env'
import { logger } from './logger'

mongoose.set('strictQuery', true)

export async function connectMongo(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 30,
      serverSelectionTimeoutMS: 10_000,
    })
    logger.info('mongo_connected')
  } catch (err) {
    logger.error({ err }, 'mongo_connect_failed')
    throw err
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('mongo_disconnected')
  })
  mongoose.connection.on('error', (err) => {
    logger.error({ err }, 'mongo_connection_error')
  })
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect()
  logger.info('mongo_disconnected_clean')
}
