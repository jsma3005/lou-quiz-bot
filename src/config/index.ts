import { BotConfig } from '../types'
import dotenv from 'dotenv'

dotenv.config()

export const config: BotConfig = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  WEBAPP_URL: process.env.WEBAPP_URL || '',
  DEVAPP_URL: process.env.DEVAPP_URL || '',
  ADMIN_GROUP_ID: process.env.ADMIN_GROUP_ID || '',
}

export const validateConfig = () => {
  if (!config.BOT_TOKEN) {
    throw new Error('BOT_TOKEN is required')
  }

  if (!config.WEBAPP_URL) {
    throw new Error('WEBAPP_URL is required')
  }

  if (!config.DEVAPP_URL) {
    throw new Error('DEVAPP is required')
  }

  if (!config.ADMIN_GROUP_ID) {
    throw new Error('ADMIN_GROUP_ID is required')
  }
}