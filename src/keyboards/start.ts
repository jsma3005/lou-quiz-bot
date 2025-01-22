import { InlineKeyboard } from 'grammy'
import { config } from '../config'

export const getStartKeyboard = () => {
  return new InlineKeyboard()
    .webApp('Начни проходить тесты', config.WEBAPP_URL)
    .row()
    .text('💳 Получить доступ к тестам', 'pay_command')
    .row()
    .text('Что я получаю, открыв доступ к тестам?', 'features_command')
    .row()
    .text('Обратиться в службу поддержки', 'support_command')
}