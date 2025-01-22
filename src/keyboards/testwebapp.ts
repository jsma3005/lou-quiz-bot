import { InlineKeyboard } from 'grammy'
import { config } from '../config'

export const getTestWebAppKeyboard = () => {
  return new InlineKeyboard()
    .webApp('Начни проходить тесты', config.DEVAPP_URL)
}