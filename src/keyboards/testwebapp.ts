import { InlineKeyboard } from 'grammy'

export const getTestWebAppKeyboard = () => {
  return new InlineKeyboard()
    .webApp('Начни проходить тесты', 'https://301e-92-245-115-23.ngrok-free.app/')
}