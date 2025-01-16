import { InlineKeyboard } from 'grammy'
import { config } from '../config'

export const getWebAppKeyboard = () => {
  return new InlineKeyboard()
    .webApp('Начни проходить тесты', config.WEBAPP_URL)
}